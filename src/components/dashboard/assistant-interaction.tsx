"use client";

import { ChangeEvent, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";

import { IconMapPin, IconMicrophone } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import sendIcon from "@/assets/sendIcon.svg?url";
import AssistantSphereAnimated from "@/components/dashboard/AssistantSphereAnimated";

const TYPING_IDLE_TIMEOUT_MS = 450;

type SpeechRecognitionAlternativeLike = {
  transcript: string;
  confidence: number;
};

type SpeechRecognitionResultLike = {
  isFinal: boolean;
  length: number;
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

type SpeechRecognitionErrorCode =
  | "aborted"
  | "audio-capture"
  | "bad-grammar"
  | "language-not-supported"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed";

type SpeechRecognitionErrorEventLike = {
  error: SpeechRecognitionErrorCode;
  message?: string;
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
  onerror: ((event: SpeechRecognitionErrorEventLike) => void) | null;
  onend: (() => void) | null;
}

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

function getSpeechErrorMessage(
  errorCode: SpeechRecognitionErrorCode,
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

export function AssistantInteraction({
  isRecording = false,
  headlineClassName,
}: {
  isRecording?: boolean;
  headlineClassName: string;
}) {
  const { t, i18n } = useTranslation();
  const [message, setMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isRecordingActive, setIsRecordingActive] = useState(isRecording);
  const [isSpeechSupported, setIsSpeechSupported] = useState(true);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [finalTranscript, setFinalTranscript] = useState("");
  const [interimTranscript, setInterimTranscript] = useState("");

  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const recognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const shouldResumeRecordingRef = useRef(false);

  const transcriptText = useMemo(() => {
    return [finalTranscript, interimTranscript].filter(Boolean).join(" ").trim();
  }, [finalTranscript, interimTranscript]);
  const showTranscriptPanel = isRecordingActive || Boolean(speechError);
  const speechRecognitionLang = useMemo(() => {
    return i18n.resolvedLanguage === "es" || i18n.language === "es"
      ? "es-ES"
      : "en-US";
  }, [i18n.language, i18n.resolvedLanguage]);

  useEffect(() => {
    const recognitionCtor =
      (window as SpeechWindow).SpeechRecognition ??
      (window as SpeechWindow).webkitSpeechRecognition;

    if (!recognitionCtor) {
      setIsSpeechSupported(false);
      setSpeechError(t("dashboard.assistant.speechErrors.unsupported"));
      return;
    }

    const recognition = new recognitionCtor();
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = speechRecognitionLang;
    recognition.maxAlternatives = 1;

    recognition.onresult = (event) => {
      let finalChunk = "";
      let interimChunk = "";

      for (let index = event.resultIndex; index < event.results.length; index += 1) {
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
        setFinalTranscript((previous) => `${previous} ${finalChunk}`.trim());
      }

      setInterimTranscript(interimChunk);
    };

    recognition.onerror = (event) => {
      shouldResumeRecordingRef.current = false;
      setIsRecordingActive(false);
      setInterimTranscript("");
      setSpeechError(getSpeechErrorMessage(event.error, t));
    };

    recognition.onend = () => {
      if (shouldResumeRecordingRef.current) {
        try {
          recognition.start();
          setIsRecordingActive(true);
          return;
        } catch {
          shouldResumeRecordingRef.current = false;
        }
      }

      setIsRecordingActive(false);
      setInterimTranscript("");
    };

    recognitionRef.current = recognition;

    return () => {
      shouldResumeRecordingRef.current = false;
      recognition.abort();
      recognitionRef.current = null;
    };
  }, [speechRecognitionLang, t]);

  useEffect(() => {
    if (!recognitionRef.current) {
      return;
    }

    recognitionRef.current.lang = speechRecognitionLang;
  }, [speechRecognitionLang]);

  useEffect(() => {
    if (!isRecordingActive || isTyping || !transcriptText) {
      return;
    }

    setMessage(transcriptText);
  }, [isRecordingActive, isTyping, transcriptText]);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  const startVoiceRecording = () => {
    const recognition = recognitionRef.current;

    if (!recognition) {
      setSpeechError(t("dashboard.assistant.speechErrors.unsupported"));
      return;
    }

    setSpeechError(null);
    setFinalTranscript("");
    setInterimTranscript("");
    shouldResumeRecordingRef.current = true;

    try {
      recognition.start();
      setIsRecordingActive(true);
    } catch (error) {
      if (error instanceof DOMException && error.name === "InvalidStateError") {
        return;
      }

      shouldResumeRecordingRef.current = false;
      setIsRecordingActive(false);
      setSpeechError(t("dashboard.assistant.speechErrors.startFailed"));
    }
  };

  const stopVoiceRecording = () => {
    shouldResumeRecordingRef.current = false;
    setIsRecordingActive(false);
    setInterimTranscript("");

    if (!recognitionRef.current) {
      return;
    }

    try {
      recognitionRef.current.stop();
    } catch {
      // no-op: recognition might already be stopping
    }
  };

  const toggleVoiceRecording = () => {
    if (isRecordingActive) {
      stopVoiceRecording();
      return;
    }

    startVoiceRecording();
  };

  const handleMessageChange = (event: ChangeEvent<HTMLInputElement>) => {
    setMessage(event.target.value);
    setIsTyping(true);

    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    typingTimeoutRef.current = setTimeout(() => {
      setIsTyping(false);
    }, TYPING_IDLE_TIMEOUT_MS);
  };

  const handleMessageBlur = () => {
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }
    setIsTyping(false);
  };

  const handleSubmit = () => {
    if (isRecordingActive) {
      stopVoiceRecording();
    }
  };

  return (
    <div className="flex flex-1 flex-col items-center px-2 pb-2 pt-6 sm:px-4 sm:pb-4 sm:pt-7">
      <AssistantSphereAnimated alt={t("dashboard.assistant.sphereAlt")} />

      <p className={headlineClassName}>
        {t("dashboard.assistant.greetingPrefix")}{" "}
        <span className="text-[#3f7de0]">{t("dashboard.assistant.userName")}</span>
        {t("dashboard.assistant.greetingSuffix")}
      </p>

      {showTranscriptPanel && (
        <div className="mt-[40px] w-full max-w-[430px] rounded-[14px] border border-[#e0e7f2] bg-white px-4 py-4 text-center shadow-[0_8px_18px_rgba(15,23,42,0.04)] sm:px-5 sm:py-5">
          <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#253f6f]">
            {t("dashboard.assistant.realTimeTranscript")}
          </p>
          {speechError ? (
            <p className="mt-1 text-[11px] leading-[1.45] text-[#c24141]">{speechError}</p>
          ) : (
            <p className="mt-1 text-[11px] leading-[1.45] text-[#60728a]">
              {transcriptText || t("dashboard.assistant.listening")}
            </p>
          )}
        </div>
      )}

      <div className="mt-[40px] w-full max-w-[1120px]">
        <form
          action="/dashboard"
          method="get"
          onSubmit={handleSubmit}
          className="rounded-[20px] border border-[#dbe6f2] bg-white p-2"
        >
          <input type="hidden" name="view" value="assistantconversation" />
          <div className="flex items-center gap-2">
            <input
              type="text"
              name="message"
              value={message}
              onChange={handleMessageChange}
              onBlur={handleMessageBlur}
              placeholder={t("dashboard.assistant.typeYourResponse")}
              className="h-10 flex-1 rounded-full border border-transparent bg-[#f6f9fc] px-4 text-xs text-[#1f2937] outline-none placeholder:text-[#95a3b8] focus:border-[#d3deea]"
            />
            <button
              type="button"
              onClick={toggleVoiceRecording}
              disabled={!isSpeechSupported}
              aria-label={t("dashboard.assistant.toggleMicrophone")}
              aria-pressed={isRecordingActive}
              className={`inline-flex h-8 w-8 items-center justify-center rounded-full ${
                isRecordingActive ? "bg-[#de3838] text-white" : "text-[#8b97a8]"
              } ${!isSpeechSupported ? "cursor-not-allowed opacity-40" : ""}`}
            >
              <IconMicrophone size={14} />
            </button>
            <button
              type="submit"
              aria-label={t("common.send")}
              className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f59e0b] text-white"
            >
              <Image
                src={sendIcon}
                alt={t("common.send")}
                width={10}
                height={14}
                className="h-[14px] w-[10px]"
              />
            </button>
            {isRecordingActive && (
              <button
                type="button"
                onClick={stopVoiceRecording}
                className="inline-flex h-8 items-center rounded-full bg-[#de3838] px-4 text-[10px] font-bold text-white sm:h-9 sm:px-5 sm:text-[11px]"
              >
                <span className="mr-1" aria-hidden>
                  &bull;
                </span>
                {t("dashboard.assistant.stopRecording")}
              </button>
            )}
          </div>
        </form>

        {!isRecordingActive && (
          <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
            <div className="flex h-[54px] flex-1 items-center justify-between rounded-full bg-white px-4">
              <div className="inline-flex items-center gap-2.5">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e9f1ff] text-[#3f7de0]">
                  <IconMapPin size={12} />
                </span>
                <div>
                  <p className="text-[11px] font-semibold leading-none text-[#1f2a3a]">
                    {t("dashboard.assistant.metadataCapture")}
                  </p>
                  <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#8b97a8]">
                    {t("dashboard.assistant.metadataDescription")}
                  </p>
                </div>
              </div>
              <button
                aria-label={t("dashboard.assistant.toggleMetadataCapture")}
                className="inline-flex h-5 w-8 items-center rounded-full bg-[#d4dbe4] p-[2px]"
              >
                <span className="h-4 w-4 rounded-full bg-white" />
              </button>
            </div>

            <button
              type="button"
              onClick={toggleVoiceRecording}
              disabled={!isSpeechSupported}
              className={`inline-flex h-[54px] items-center rounded-full bg-[#f59e0b] px-8 text-[11px] font-bold text-white ${
                !isSpeechSupported ? "cursor-not-allowed opacity-45" : ""
              }`}
            >
              <span className="mr-1" aria-hidden>
                &bull;
              </span>
              {isSpeechSupported
                ? t("dashboard.assistant.tapToStartRecording")
                : t("dashboard.assistant.speechNotSupported")}
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
