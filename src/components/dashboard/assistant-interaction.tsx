"use client";

import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  ChangeEvent,
  FormEvent,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import {
  IconAlertCircle,
  IconCheck,
  IconLoader2,
  IconMapPin,
  IconMicrophone,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import sendIcon from "@/assets/sendIcon.svg?url";
import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import {
  VoiceAvatarAnimation,
  type VoiceAvatarState,
} from "@/components/dashboard/voice-avatar-animation";
import { useConsentGate } from "@/hooks/use-consent-gate";
import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import { getAuthSession, getCurrentUser } from "@/lib/auth";
import {
  ConsentRequiredError,
  consentRequirements,
  ensureConsent,
  getConsentGrantFlags,
  grantConsent,
} from "@/lib/consent";
import type { DashboardCardFlowId } from "@/lib/dashboard-card-flows";
import {
  type CapturedReportMetadata,
  captureReportMetadata,
  clearReportMetadata,
  saveReportMetadata,
} from "@/lib/report-metadata";
import { transcribeAssistantVoice } from "@/lib/voice-transcription";

type RecordingErrorCode =
  | "audio-capture"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed";

type SpeechRecognitionAlternativeLike = {
  transcript: string;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  [index: number]: SpeechRecognitionAlternativeLike;
};

type SpeechRecognitionResultListLike = {
  length: number;
  [index: number]: SpeechRecognitionResultLike;
};

type SpeechRecognitionEventLike = {
  resultIndex: number;
  results: SpeechRecognitionResultListLike;
};

interface SpeechRecognitionLike {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  maxAlternatives: number;
  start: () => void;
  stop: () => void;
  abort: () => void;
  onresult: ((event: SpeechRecognitionEventLike) => void) | null;
  onerror: (() => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const VOICE_RECORDING_TIMEOUT_MS = 8000;

type VoiceCaptureTarget = "recording";

function AvatarVoiceControlGlyph() {
  return (
    <span className="inline-flex items-center gap-[2px]" aria-hidden="true">
      <span className="h-[4px] w-[4px] rounded-full bg-current opacity-95" />
      <span className="h-[10px] w-[2.5px] rounded-full bg-current" />
      <span className="h-[14px] w-[2.5px] rounded-full bg-current" />
      <span className="h-[10px] w-[2.5px] rounded-full bg-current" />
      <span className="h-[4px] w-[4px] rounded-full bg-current opacity-95" />
    </span>
  );
}

function getRecordingErrorMessage(
  errorCode: RecordingErrorCode,
  t: (key: string) => string
): string {
  switch (errorCode) {
    case "not-allowed":
    case "service-not-allowed":
      return t("dashboard.assistant.speechErrors.permissionDenied");
    case "audio-capture":
      return t("dashboard.assistant.speechErrors.noMicrophone");
    case "no-speech":
      return t("dashboard.assistant.speechErrors.noSpeech");
    case "network":
      return t("dashboard.assistant.speechErrors.network");
    default:
      return t("dashboard.assistant.speechErrors.startFailed");
  }
}

function getPreferredRecordingMimeType(): string | undefined {
  const supportedTypes = ["audio/webm;codecs=opus", "audio/webm", "audio/mp4"];

  return supportedTypes.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType)
  );
}

function getFirstName(fullName?: string | null): string | null {
  const trimmedName = fullName?.trim();

  if (!trimmedName) {
    return null;
  }

  return trimmedName.split(/\s+/)[0] ?? null;
}

export function AssistantInteraction({
  isRecording = false,
  headlineClassName,
  initialCategory,
  initialTopic,
}: {
  isRecording?: boolean;
  headlineClassName: string;
  initialCategory?: AssistantIncidentCategory;
  initialTopic?: DashboardCardFlowId;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [message, setMessage] = useState("");
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [voiceAvatarState, setVoiceAvatarState] =
    useState<VoiceAvatarState>("idle");
  const [activeVoiceCaptureTarget, setActiveVoiceCaptureTarget] =
    useState<VoiceCaptureTarget | null>(null);
  const [pendingVoiceReviewBlob, setPendingVoiceReviewBlob] =
    useState<Blob | null>(null);
  const [isMetadataEnabled, setIsMetadataEnabled] = useState(false);
  const [isMetadataCapturing, setIsMetadataCapturing] = useState(false);
  const [assistantFirstName, setAssistantFirstName] = useState<string>(
    t("dashboard.assistant.userName")
  );
  const [metadataError, setMetadataError] = useState<string | null>(null);
  const [reportMetadata, setReportMetadata] =
    useState<CapturedReportMetadata | null>(null);
  const {
    pendingConsentRequirement,
    isGrantingConsent,
    captureConsentError,
    clearPendingConsent,
    grantPendingConsent,
  } = useConsentGate();

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const shouldProcessRecordingRef = useRef(false);
  const hasHandledInitialRecordingRef = useRef(false);
  const autoStopRecordingTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const liveRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const liveFinalTranscriptRef = useRef("");
  const recordingDecisionRef = useRef<"confirm" | "cancel" | null>(null);

  const transcriptionLanguage = useMemo(() => {
    return i18n.resolvedLanguage === "es" || i18n.language === "es"
      ? "es"
      : "en";
  }, [i18n.language, i18n.resolvedLanguage]);
  const livePreviewLanguage =
    transcriptionLanguage === "es" ? "es-ES" : "en-US";

  const continueToConversation = useCallback(
    (startVoiceMode = false) => {
      const params = new URLSearchParams({
        view: "assistantconversation",
      });

      if (startVoiceMode) {
        params.set("voice", "1");
      }

      if (initialCategory) {
        params.set("category", initialCategory);
      }

      if (initialTopic) {
        params.set("topic", initialTopic);
      }

      if (reportMetadata) {
        params.set("metadataCapture", "1");
      }

      router.push(`/dashboard?${params.toString()}`);
    },
    [initialCategory, initialTopic, reportMetadata, router]
  );

  useEffect(() => {
    let isActive = true;
    const sessionFirstName = getFirstName(getAuthSession()?.user.fullName);

    if (sessionFirstName) {
      setAssistantFirstName(sessionFirstName);
    }

    void getCurrentUser()
      .then((user) => {
        const apiFirstName = getFirstName(user.fullName);

        if (isActive && apiFirstName) {
          setAssistantFirstName(apiFirstName);
        }
      })
      .catch(() => {
        if (isActive && !sessionFirstName) {
          setAssistantFirstName(t("dashboard.assistant.userName"));
        }
      });

    return () => {
      isActive = false;
    };
  }, [t]);

  const clearAutoStopRecordingTimer = useCallback(() => {
    if (autoStopRecordingTimerRef.current) {
      clearTimeout(autoStopRecordingTimerRef.current);
      autoStopRecordingTimerRef.current = null;
    }
  }, []);

  const cleanupRecording = useCallback(() => {
    clearAutoStopRecordingTimer();
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
    mediaRecorderRef.current = null;
  }, [clearAutoStopRecordingTimer]);

  const stopLiveTranscriptPreview = useCallback(() => {
    if (!liveRecognitionRef.current) {
      return;
    }

    liveRecognitionRef.current.onend = null;
    liveRecognitionRef.current.onresult = null;
    liveRecognitionRef.current.onerror = null;

    try {
      liveRecognitionRef.current.stop();
    } catch {
      liveRecognitionRef.current.abort();
    }

    liveRecognitionRef.current = null;
  }, []);

  const startLiveTranscriptPreview = useCallback((): boolean => {
    const recognitionCtor =
      (window as SpeechWindow).SpeechRecognition ??
      (window as SpeechWindow).webkitSpeechRecognition;

    if (!recognitionCtor) {
      return false;
    }

    stopLiveTranscriptPreview();

    const recognition = new recognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = livePreviewLanguage;
    recognition.maxAlternatives = 1;
    liveFinalTranscriptRef.current = "";

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";

      for (
        let index = event.resultIndex;
        index < event.results.length;
        index += 1
      ) {
        const result = event.results[index];
        const transcript = result[0]?.transcript?.trim();

        if (!transcript) {
          continue;
        }

        if (result.isFinal) {
          finalChunk = `${finalChunk} ${transcript}`.trim();
        } else {
          interimChunk = `${interimChunk} ${transcript}`.trim();
        }
      }

      if (finalChunk) {
        liveFinalTranscriptRef.current =
          `${liveFinalTranscriptRef.current} ${finalChunk}`.trim();
      }

      setLiveTranscript(
        [liveFinalTranscriptRef.current, interimChunk].filter(Boolean).join(" ")
      );

      if (finalChunk || interimChunk) {
        // Voice state: the browser recognizer has detected user speech.
        setVoiceAvatarState("userSpeaking");
        clearAutoStopRecordingTimer();
        autoStopRecordingTimerRef.current = setTimeout(
          () => {
            const mediaRecorder = mediaRecorderRef.current;

            if (mediaRecorder?.state === "recording") {
              stopLiveTranscriptPreview();
              mediaRecorder.stop();
            }
          },
          finalChunk ? 900 : 1800
        );
      }
    };

    recognition.onerror = () => {
      liveRecognitionRef.current = null;
      clearAutoStopRecordingTimer();
      autoStopRecordingTimerRef.current = setTimeout(() => {
        const mediaRecorder = mediaRecorderRef.current;

        if (mediaRecorder?.state === "recording") {
          mediaRecorder.stop();
        }
      }, 2500);
    };

    recognition.onend = () => {
      if (liveRecognitionRef.current === recognition) {
        liveRecognitionRef.current = null;
      }
    };

    liveRecognitionRef.current = recognition;

    try {
      recognition.start();
      return true;
    } catch {
      liveRecognitionRef.current = null;
      return false;
    }
  }, [
    clearAutoStopRecordingTimer,
    livePreviewLanguage,
    stopLiveTranscriptPreview,
  ]);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        shouldProcessRecordingRef.current = false;
        mediaRecorderRef.current.stop();
      }

      clearAutoStopRecordingTimer();
      stopLiveTranscriptPreview();
      cleanupRecording();
    };
  }, [
    cleanupRecording,
    clearAutoStopRecordingTimer,
    stopLiveTranscriptPreview,
  ]);

  const handleRecordedAudio = useCallback(
    async (mimeType: string) => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mimeType || "audio/webm",
      });

      shouldProcessRecordingRef.current = false;
      audioChunksRef.current = [];
      cleanupRecording();

      if (!audioBlob.size) {
        setIsTranscribing(false);
        setVoiceAvatarState("idle");
        setSpeechError(getRecordingErrorMessage("no-speech", t));
        setActiveVoiceCaptureTarget(null);
        return;
      }

      try {
        setPendingVoiceReviewBlob(audioBlob);
        setSpeechError(null);
        setVoiceAvatarState("idle");
      } catch (error) {
        setVoiceAvatarState("idle");
        setSpeechError(
          error instanceof Error
            ? error.message
            : getRecordingErrorMessage("network", t)
        );
      } finally {
        setIsTranscribing(false);
        setActiveVoiceCaptureTarget(null);
      }
    },
    [cleanupRecording, t]
  );

  const startVoiceRecording = useCallback(
    async (target: VoiceCaptureTarget) => {
      if (
        !navigator.mediaDevices?.getUserMedia ||
        typeof MediaRecorder === "undefined"
      ) {
        setVoiceAvatarState("idle");
        setSpeechError(t("dashboard.assistant.speechErrors.unsupported"));
        return;
      }

      setActiveVoiceCaptureTarget(target);

      try {
        await ensureConsent(consentRequirements.audioTranscription);
      } catch (error) {
        if (captureConsentError(error)) {
          setVoiceAvatarState("idle");
          setActiveVoiceCaptureTarget(null);
          return;
        }

        setSpeechError(
          error instanceof Error
            ? error.message
            : "Consent status could not be checked."
        );
        setVoiceAvatarState("idle");
        setActiveVoiceCaptureTarget(null);
        return;
      }

      setSpeechError(null);
      setLiveTranscript("");
      setIsTranscribing(false);
      audioChunksRef.current = [];
      shouldProcessRecordingRef.current = true;

      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        const mimeType = getPreferredRecordingMimeType();
        const mediaRecorder = new MediaRecorder(
          stream,
          mimeType ? { mimeType } : undefined
        );

        recordingStreamRef.current = stream;
        mediaRecorderRef.current = mediaRecorder;

        mediaRecorder.ondataavailable = (event) => {
          if (event.data.size > 0) {
            audioChunksRef.current.push(event.data);
            setVoiceAvatarState("userSpeaking");
          }
        };

        mediaRecorder.onerror = () => {
          shouldProcessRecordingRef.current = false;
          setIsRecordingActive(false);
          setIsTranscribing(false);
          setActiveVoiceCaptureTarget(null);
          setVoiceAvatarState("idle");
          cleanupRecording();
          setSpeechError(getRecordingErrorMessage("audio-capture", t));
        };

        mediaRecorder.onstop = () => {
          setIsRecordingActive(false);

          if (!shouldProcessRecordingRef.current) {
            audioChunksRef.current = [];
            cleanupRecording();
            setActiveVoiceCaptureTarget(null);
            setVoiceAvatarState("idle");
            return;
          }

          setVoiceAvatarState("listening");
          setIsTranscribing(true);
          void handleRecordedAudio(
            mediaRecorder.mimeType || mimeType || "audio/webm"
          );
        };

        mediaRecorder.start();
        setVoiceAvatarState("listening");
        const hasLiveEndpointing = startLiveTranscriptPreview();

        clearAutoStopRecordingTimer();
        autoStopRecordingTimerRef.current = setTimeout(() => {
          const activeRecorder = mediaRecorderRef.current;

          if (activeRecorder?.state === "recording") {
            if (hasLiveEndpointing) {
              stopLiveTranscriptPreview();
            }

            activeRecorder.stop();
          }
        }, VOICE_RECORDING_TIMEOUT_MS);

        setIsRecordingActive(true);
      } catch (error) {
        stopLiveTranscriptPreview();
        cleanupRecording();
        setActiveVoiceCaptureTarget(null);
        setVoiceAvatarState("idle");
        const errorCode =
          error instanceof DOMException && error.name === "NotAllowedError"
            ? "not-allowed"
            : "audio-capture";
        setSpeechError(getRecordingErrorMessage(errorCode, t));
      }
    },
    [
      cleanupRecording,
      clearAutoStopRecordingTimer,
      handleRecordedAudio,
      startLiveTranscriptPreview,
      stopLiveTranscriptPreview,
      t,
    ]
  );

  const stopVoiceRecording = useCallback(() => {
    clearAutoStopRecordingTimer();
    const mediaRecorder = mediaRecorderRef.current;

    stopLiveTranscriptPreview();

    if (!mediaRecorder || mediaRecorder.state === "inactive") {
      cleanupRecording();
      setIsRecordingActive(false);
      setVoiceAvatarState("idle");
      return;
    }

    mediaRecorder.stop();
  }, [
    cleanupRecording,
    clearAutoStopRecordingTimer,
    stopLiveTranscriptPreview,
  ]);

  const cancelVoiceCapture = useCallback(() => {
    recordingDecisionRef.current = "cancel";
    clearAutoStopRecordingTimer();
    shouldProcessRecordingRef.current = false;
    stopLiveTranscriptPreview();

    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
      cleanupRecording();
    }

    audioChunksRef.current = [];
    setLiveTranscript("");
    setIsRecordingActive(false);
    setIsTranscribing(false);
    setActiveVoiceCaptureTarget(null);
    setPendingVoiceReviewBlob(null);
    setVoiceAvatarState("idle");
  }, [
    cleanupRecording,
    clearAutoStopRecordingTimer,
    stopLiveTranscriptPreview,
  ]);

  const confirmVoiceReview = useCallback(async () => {
    if (!pendingVoiceReviewBlob) {
      return;
    }

    setIsTranscribing(true);
    setSpeechError(null);
    setVoiceAvatarState("listening");

    try {
      const transcription = await transcribeAssistantVoice(
        pendingVoiceReviewBlob,
        transcriptionLanguage
      );
      const transcript = transcription.transcript.trim();

      if (!transcript) {
        setSpeechError(getRecordingErrorMessage("no-speech", t));
        setVoiceAvatarState("idle");
        return;
      }

      setMessage((currentMessage) =>
        [currentMessage.trim(), transcript].filter(Boolean).join(" ")
      );
      setPendingVoiceReviewBlob(null);
      setVoiceAvatarState("idle");
    } catch (error) {
      setVoiceAvatarState("idle");
      setSpeechError(
        error instanceof Error
          ? error.message
          : getRecordingErrorMessage("network", t)
      );
    } finally {
      setIsTranscribing(false);
    }
  }, [pendingVoiceReviewBlob, t, transcriptionLanguage]);

  const cancelVoiceReview = useCallback(() => {
    setPendingVoiceReviewBlob(null);
    setSpeechError(null);
    setVoiceAvatarState("idle");
  }, []);

  const toggleTranscriptionRecording = () => {
    if (activeVoiceCaptureTarget === "recording" && isRecordingActive) {
      stopVoiceRecording();
      return;
    }

    if (isRecordingActive) {
      return;
    }

    void startVoiceRecording("recording");
  };

  const startAvatarVoiceMode = useCallback(() => {
    if (isRecordingActive || isTranscribing || pendingVoiceReviewBlob) {
      return;
    }

    continueToConversation(true);
  }, [
    continueToConversation,
    isRecordingActive,
    isTranscribing,
    pendingVoiceReviewBlob,
  ]);

  useEffect(() => {
    if (!isRecording || hasHandledInitialRecordingRef.current) {
      return;
    }

    hasHandledInitialRecordingRef.current = true;
    void startVoiceRecording("recording");
  }, [isRecording, startVoiceRecording]);

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    if (isRecordingActive || isTranscribing || !message.trim()) {
      event.preventDefault();
    }

    if (activeVoiceCaptureTarget === "recording" && isRecordingActive) {
      stopVoiceRecording();
    }
  };

  const enableMetadataCapture = async () => {
    setIsMetadataCapturing(true);
    setMetadataError(null);

    try {
      const metadata = await captureReportMetadata();
      saveReportMetadata(metadata);
      setReportMetadata(metadata);
      setIsMetadataEnabled(true);
    } catch (error) {
      clearReportMetadata();
      setReportMetadata(null);
      setIsMetadataEnabled(false);
      setMetadataError(
        error instanceof Error
          ? error.message
          : t("dashboard.assistant.metadataCaptureFailed")
      );
    } finally {
      setIsMetadataCapturing(false);
    }
  };

  const disableMetadataCapture = () => {
    clearReportMetadata();
    setReportMetadata(null);
    setIsMetadataEnabled(false);
    setMetadataError(null);
  };

  const toggleMetadataCapture = () => {
    if (isMetadataCapturing) {
      return;
    }

    if (isMetadataEnabled) {
      disableMetadataCapture();
      return;
    }

    void enableMetadataCapture();
  };

  const handleAllowPendingConsent = async () => {
    const requirement = pendingConsentRequirement;

    try {
      await grantPendingConsent();
      setSpeechError(null);

      if (
        requirement?.source === consentRequirements.audioTranscription.source
      ) {
        void startVoiceRecording(activeVoiceCaptureTarget ?? "recording");
      }
    } catch (error) {
      setSpeechError(
        error instanceof Error ? error.message : "Consent could not be saved."
      );
    }
  };

  const recordingSpacingClass = "mt-7";
  const isTranscriptionCaptureActive =
    activeVoiceCaptureTarget === "recording" && isRecordingActive;
  const shouldShowSendButton = message.trim().length > 0;
  const metadataStatusText = isMetadataCapturing
    ? t("dashboard.assistant.metadataCapturing")
    : metadataError
      ? t("dashboard.assistant.metadataUnavailable")
      : reportMetadata
        ? reportMetadata.location
          ? t("dashboard.assistant.metadataReady")
          : t("dashboard.assistant.metadataDeviceOnly")
        : t("dashboard.assistant.metadataDescription");
  const resolvedVoiceAvatarState: VoiceAvatarState = isTranscribing
    ? "processing"
    : liveTranscript
      ? "userSpeaking"
      : isRecordingActive
        ? voiceAvatarState === "userSpeaking"
          ? "userSpeaking"
          : "listening"
        : "idle";

  return (
    <div className="flex flex-1 flex-col items-center px-2 pb-2 pt-4 sm:px-4 sm:pb-4 sm:pt-5">
      <VoiceAvatarAnimation
        state={resolvedVoiceAvatarState}
        size="large"
        alt={t("dashboard.assistant.sphereAlt")}
      />

      <p className={headlineClassName}>
        {t("dashboard.assistant.greetingPrefix")}{" "}
        <span className="text-[#3f7de0]">{assistantFirstName}</span>
        {t("dashboard.assistant.greetingSuffix")}
      </p>

      {pendingConsentRequirement ? (
        <div className="mt-5 w-full max-w-[560px]">
          <ConsentRequiredCard
            requirement={pendingConsentRequirement}
            isSubmitting={isGrantingConsent}
            onAllow={() => {
              void handleAllowPendingConsent();
            }}
            onDecline={clearPendingConsent}
          />
        </div>
      ) : null}

      <span className="sr-only" aria-live="polite">
        {speechError
          ? speechError
          : isTranscribing
            ? t("dashboard.assistant.transcribing")
            : isRecordingActive
              ? t("dashboard.assistant.listening")
              : ""}
      </span>

      <div
        className={`${recordingSpacingClass} mb-[188px] w-full max-w-[1120px] sm:mb-[198px] lg:mb-[188px]`}
      >
        <form
          action="/dashboard"
          method="get"
          onSubmit={handleSubmit}
          className="w-full"
        >
          <input type="hidden" name="view" value="assistantconversation" />
          {initialCategory ? (
            <input type="hidden" name="category" value={initialCategory} />
          ) : null}
          {initialTopic ? (
            <input type="hidden" name="topic" value={initialTopic} />
          ) : null}
          {reportMetadata ? (
            <input type="hidden" name="metadataCapture" value="1" />
          ) : null}
          {isTranscriptionCaptureActive || pendingVoiceReviewBlob ? (
            <div className="flex items-center gap-2 rounded-full border border-[#dbe6f2] bg-[#f8fbff] px-4 py-2">
              <div className="flex flex-1 items-center gap-3 overflow-hidden">
                <span className="text-[11px] font-medium text-[#64748b]">
                  {isTranscriptionCaptureActive ? "Listening..." : "Use transcribed text"}
                </span>
                <div className="flex h-8 flex-1 items-center gap-1 overflow-hidden">
                  {Array.from({ length: 32 }).map((_, index) => (
                    <span
                      key={index}
                      className={`w-1 rounded-full bg-[#7aa4d8] ${
                        isTranscriptionCaptureActive ? "animate-pulse" : ""
                      }`}
                      style={{
                        height: `${10 + ((index * 7) % 18)}px`,
                        animationDelay: `${index * 45}ms`,
                        opacity: 0.38 + ((index % 6) * 0.1),
                      }}
                    />
                  ))}
                </div>
              </div>
              <button
                type="button"
                onClick={isTranscriptionCaptureActive ? cancelVoiceCapture : cancelVoiceReview}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe6f2] bg-white text-[#64748b] transition hover:bg-[#f4f7fb]"
                aria-label={t("common.cancel")}
              >
                <IconX size={16} />
              </button>
              <button
                type="button"
                onClick={() => {
                  if (isTranscriptionCaptureActive) {
                    recordingDecisionRef.current = "confirm";
                    stopVoiceRecording();
                    return;
                  }

                  void confirmVoiceReview();
                }}
                className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f5d9f] text-white transition hover:bg-[#0c518a]"
                aria-label="Use voice text"
              >
                <IconCheck size={16} />
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-2 rounded-full border border-[#dbe6f2] bg-white px-3 py-2 shadow-[inset_0_1px_0_rgba(255,255,255,0.5)]">
              <input
                type="text"
                name="message"
                value={message}
                onChange={handleMessageChange}
                placeholder={t("dashboard.assistant.typeYourResponse")}
                className="h-11 min-w-[180px] flex-1 rounded-full border border-transparent bg-transparent px-3 text-sm text-[#1f2937] outline-none transition-[background-color,box-shadow,border-color] duration-150 placeholder:text-[#95a3b8] focus-visible:outline-none"
              />
              <button
                type="button"
                onClick={toggleTranscriptionRecording}
                disabled={isTranscribing}
                aria-label={t("dashboard.assistant.toggleMicrophone")}
                className={`inline-flex h-11 w-11 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#f4f7fb] ${
                  isTranscribing ? "cursor-not-allowed opacity-40" : ""
                }`}
              >
                <IconMicrophone size={18} />
              </button>
              {shouldShowSendButton ? (
                <span className="inline-flex shrink-0 items-center rounded-full border border-[#dbe6f2] bg-white p-1 shadow-[0_6px_18px_rgba(148,163,184,0.14)]">
                  <button
                    type="submit"
                    aria-label={t("common.send")}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f5d9f] text-white"
                  >
                    <Image
                      src={sendIcon}
                      alt={t("common.send")}
                      width={10}
                      height={14}
                      className="h-[14px] w-[10px]"
                    />
                  </button>
                </span>
              ) : (
                <span className="inline-flex items-center rounded-full border border-[#dbe6f2] bg-white p-1 shadow-[0_6px_18px_rgba(148,163,184,0.14)]">
                  <button
                    type="button"
                    onClick={startAvatarVoiceMode}
                    disabled={isTranscribing}
                    aria-label="Start avatar voice mode"
                    className={`inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#196bb1] text-white transition hover:bg-[#196bb1] ${
                      isTranscribing ? "cursor-not-allowed opacity-40" : ""
                    }`}
                  >
                    <AvatarVoiceControlGlyph />
                  </button>
                </span>
              )}
            </div>
          )}
          {speechError ? (
            <p
              className="px-4 pt-2 text-[11px] leading-[1.45] text-[#c24141]"
              aria-live="polite"
            >
              {speechError}
            </p>
          ) : null}
        </form>

        <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex h-[54px] flex-1 items-center justify-between rounded-full bg-white px-4">
              <div className="inline-flex items-center gap-2.5">
                <span
                  className={`inline-flex h-6 w-6 items-center justify-center rounded-full ${
                    metadataError
                      ? "bg-[#fee2e2] text-[#dc2626]"
                      : reportMetadata
                        ? "bg-[#dcfce7] text-[#16a34a]"
                        : "bg-[#e9f1ff] text-[#3f7de0]"
                  }`}
                >
                  {isMetadataCapturing ? (
                    <IconLoader2 size={12} className="animate-spin" />
                  ) : metadataError ? (
                    <IconAlertCircle size={12} />
                  ) : reportMetadata ? (
                    <IconCheck size={12} />
                  ) : (
                    <IconMapPin size={12} />
                  )}
                </span>
                <div>
                  <p className="text-[11px] font-semibold leading-none text-[#1f2a3a]">
                    {t("dashboard.assistant.metadataCapture")}
                  </p>
                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#8b97a8]">
                    {metadataStatusText}
                  </p>
                </div>
              </div>
              <button
                type="button"
                onClick={toggleMetadataCapture}
                disabled={isMetadataCapturing}
                aria-label={t("dashboard.assistant.toggleMetadataCapture")}
                aria-pressed={isMetadataEnabled}
                className={`inline-flex h-5 w-8 items-center rounded-full p-[2px] transition ${
                  isMetadataEnabled ? "bg-[#16a34a]" : "bg-[#d4dbe4]"
                } ${isMetadataCapturing ? "cursor-wait opacity-80" : ""}`}
              >
                <span
                  className={`h-4 w-4 rounded-full bg-white transition ${
                    isMetadataEnabled ? "translate-x-3" : ""
                  }`}
                />
              </button>
            </div>
        </div>
      </div>
    </div>
  );
}
