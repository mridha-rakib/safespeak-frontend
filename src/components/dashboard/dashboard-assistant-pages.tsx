"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";
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
  IconArrowRight,
  IconCheck,
  IconChevronLeft,
  IconLoader2,
  IconMicrophone,
  IconMicrophoneOff,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import sendIcon from "@/assets/sendIcon.svg?url";
import { AssistantMessageRenderer } from "@/components/chat/assistant-message-renderer";
import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import { AssistantInteraction } from "@/components/dashboard/assistant-interaction";
import {
  VoiceAvatarAnimation,
  type VoiceAvatarState,
} from "@/components/dashboard/voice-avatar-animation";
import { useConsentGate } from "@/hooks/use-consent-gate";
import { ApiRequestError } from "@/lib/api";
import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import {
  type AssistantConversationMessage,
  type AssistantTimeline,
  type LegalAwareness,
  shouldCallTimelineAssistant,
  sendTimelineAssistantMessage,
} from "@/lib/assistant-conversation";
import {
  clearAssistantConversationDraft,
  getAssistantConversationDraft,
  saveAssistantConversationDraft,
} from "@/lib/assistant-draft";
import { consumeAssistantVoiceHandoff } from "@/lib/assistant-voice-handoff";
import {
  clearAssistantTriageSource,
  saveAssistantTriageSource,
} from "@/lib/assistant-triage";
import {
  ConsentRequiredError,
  consentRequirements,
  ensureConsent,
  getConsentGrantFlags,
  grantConsent,
} from "@/lib/consent";
import {
  type ConversationFlowTriage,
  appendConversationFlowMessage,
  createConversationFlowSession,
} from "@/lib/conversation-flow";
import {
  type DashboardCardFlowId,
  getDashboardActionHref,
  getDashboardAssistantTopicChips,
  getDashboardCardFlow,
} from "@/lib/dashboard-card-flows";
import { LAST_NON_CONVERSATION_DASHBOARD_URL_STORAGE_KEY } from "@/lib/dashboard-navigation";
import { triggerQuickExit } from "@/lib/safety";
import {
  buildConversationRequestBody,
  hasBrokenTextEncoding,
} from "@/lib/text-encoding";
import {
  createAssistantVoiceAudioUrl,
  synthesizeAssistantVoice,
  transcribeAssistantVoice,
} from "@/lib/voice-transcription";

import { interFont } from "./dashboard-shared";

const emptyTimeline: AssistantTimeline = {};

function normalizeAssistantSpeechLanguage(language?: string): string | undefined {
  const normalized = language?.trim().toLowerCase();

  if (!normalized) {
    return undefined;
  }

  const aliases: Record<string, string> = {
    "ar-sa": "ar",
    "bn-bd": "bn",
    "el-gr": "el",
    "en-au": "en",
    "en-us": "en",
    "es-419": "es",
    "es-es": "es",
    "es-mx": "es",
    "hi-in": "hi",
    "ne-np": "ne",
    "pa-in": "pa",
    "vi-vn": "vi",
    yue: "zh-Hant",
    "yue-hk": "zh-Hant",
    zh: "zh-Hans",
    "zh-cn": "zh-Hans",
    "zh-hans": "zh-Hans",
    "zh-hant": "zh-Hant",
    "zh-hk": "zh-Hant",
    "zh-sg": "zh-Hans",
    "zh-tw": "zh-Hant",
  };

  return aliases[normalized] ?? language?.trim();
}

function detectAssistantSpeechLanguage(text: string): string {
  if (/[\u0600-\u06ff]/u.test(text)) return "ar";
  if (/[\u0980-\u09ff]/u.test(text)) return "bn";
  if (/[\u0370-\u03ff]/u.test(text)) return "el";
  if (/[\u0a00-\u0a7f]/u.test(text)) return "pa";
  if (/[\u0900-\u097f]/u.test(text)) return "hi";
  if (/\p{Script=Han}/u.test(text)) return "zh-Hans";
  if (/[ăâđêôơưáàảãạắằẳẵặấầẩẫậéèẻẽẹếềểễệíìỉĩịóòỏõọốồổỗộớờởỡợúùủũụứừửữựýỳỷỹỵ]/iu.test(text)) {
    return "vi";
  }
  if (/[¿¡ñáéíóúü]/iu.test(text)) return "es";
  return "en";
}

const harmfulActivityPatterns = [
  /\b(violence|violent|abuse|assault|attacked|attack|hit|slap|punched|kick|kicked|choke|threat|threatened)\b/i,
  /\b(harass|harassment|bullied|bullying|stalk|stalking|unsafe|scared|fear)\b/i,
  /\b(racist|racism|discrimination|hate|hate crime|racial)\b/i,
  /\b(scam|fraud|phishing|blackmail|extortion|stole|stolen|robbed|theft)\b/i,
  /\b(grabbed|grab|pulled|pull)\b.{0,24}\b(hijab|hijub|headscarf)\b/i,
  /\b(hijab|hijub|headscarf)\b.{0,24}\b(grabbed|grab|pulled|pull)\b/i,
];

type ConversationCitation = {
  sourceId?: string;
  title: string;
  legislationName?: string;
  publisher?: string;
  url?: string;
  jurisdiction?: string;
  sourceCategory?: string;
  sourceType?: string;
  topic?: string;
  sectionRef?: string;
  sectionTitle?: string;
  page?: number;
  pageStart?: number;
  pageEnd?: number;
  versionDate?: string;
  commencementDate?: string;
  amendmentStatus?: "in_force" | "amended" | "repealed";
  lastUpdated?: string;
};

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

function buildAssistantBubbleContent(
  assistantMessage: string,
  nextQuestion: string
): string {
  const trimmedAssistantMessage = assistantMessage.trim();
  const trimmedNextQuestion = nextQuestion.trim();

  if (!trimmedAssistantMessage) {
    return trimmedNextQuestion;
  }

  if (!trimmedNextQuestion) {
    return trimmedAssistantMessage;
  }

  if (
    trimmedAssistantMessage.toLowerCase() === trimmedNextQuestion.toLowerCase()
  ) {
    return trimmedAssistantMessage;
  }

  return `${trimmedAssistantMessage} ${trimmedNextQuestion}`;
}

function detectHarmfulActivity(input: {
  incidentCategory?: AssistantIncidentCategory;
  timeline: AssistantTimeline;
  conversation: AssistantConversationMessage[];
}): boolean {
  if (
    input.incidentCategory === "domestic_violence" ||
    input.incidentCategory === "racial_abuse" ||
    input.incidentCategory === "cyber_scam"
  ) {
    return true;
  }

  const combinedText = [
    ...input.conversation.map((message) => message.content),
    ...Object.values(input.timeline),
  ]
    .join(" ")
    .trim();

  if (!combinedText) {
    return false;
  }

  return harmfulActivityPatterns.some((pattern) => pattern.test(combinedText));
}

function isActionableConversationTriage(response: {
  transition: { offerTriage: boolean };
  triage?: ConversationFlowTriage | null;
  responseMeta?: {
    triageReady?: boolean;
    nextAction?: string;
  };
}): boolean {
  if (
    response.responseMeta?.triageReady ||
    response.responseMeta?.nextAction === "show_triage_button"
  ) {
    return true;
  }

  const triage = response.triage;

  return Boolean(
    response.transition.offerTriage &&
    triage &&
    triage.likelyCategory !== "general_support" &&
    triage.confidenceScore >= 0.45
  );
}

function getAssistantDisplayContent(message: AssistantConversationMessage) {
  if (message.role !== "assistant") {
    return message.content;
  }

  const cleanedContent = [
    /\s*This information is for general awareness(?: only)? and does not constitute legal advice\.?/gi,
    /\s*This information is for general awareness only\.?/gi,
    /\s*This is information only,?\s*not legal advice\.?/gi,
    /\s*This is informational,?\s*not legal advice\.?/gi,
    /\s*It does not constitute legal advice\.?/gi,
  ]
    .reduce((content, pattern) => content.replace(pattern, ""), message.content)
    .replace(/\r\n/g, "\n")
    .split(/\n{2,}/)
    .map((paragraph) =>
      paragraph.replace(/\s+([?.!,])/g, "$1").replace(/[ \t]{2,}/g, " ").trim(),
    )
    .filter(Boolean)
    .join("\n\n");

  return cleanedContent || "I'm here with you.";
}

function formatConversationSectionRef(sectionRef?: string) {
  if (!sectionRef) {
    return "";
  }

  return sectionRef.replace(/^Section\s+/i, "section ");
}

function buildConversationCitationSummary(citation: ConversationCitation) {
  const sectionRef = formatConversationSectionRef(citation.sectionRef);
  const page = citation.pageStart ?? citation.page;
  const pageLabel = page
    ? `p. ${citation.pageEnd && citation.pageEnd !== page ? `${page}-${citation.pageEnd}` : page}`
    : "";
  const versionLabel = citation.versionDate
    ? `version ${formatConversationCitationDate(citation.versionDate)}`
    : citation.lastUpdated
      ? `updated ${formatConversationCitationDate(citation.lastUpdated)}`
      : "";
  const sectionTitle = citation.sectionTitle ? `- ${citation.sectionTitle}` : "";
  const amendmentLabel =
    citation.amendmentStatus && citation.amendmentStatus !== "in_force"
      ? citation.amendmentStatus.replace("_", " ")
      : "";

  return [
    citation.title,
    citation.publisher,
    sectionRef,
    sectionTitle,
    pageLabel,
    versionLabel,
    amendmentLabel,
  ]
    .filter(Boolean)
    .join(", ");
}

function formatConversationCitationDate(value: string) {
  const parsed = new Date(value);

  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });
}

function buildConversationCitationIdentity(citation: ConversationCitation) {
  return buildConversationCitationSummary(citation);
}

function dedupeConversationCitations(citations: ConversationCitation[]) {
  const seen = new Set<string>();

  return citations.filter((citation) => {
    const key = buildConversationCitationIdentity(citation);

    if (seen.has(key)) {
      return false;
    }

    seen.add(key);
    return true;
  });
}

function buildLegalCitationSummary(citation: ConversationCitation) {
  const sectionValue = formatConversationSectionRef(citation.sectionRef);
  const pageValue = citation.pageStart
    ? citation.pageEnd && citation.pageEnd !== citation.pageStart
      ? `${citation.pageStart}-${citation.pageEnd}`
      : `${citation.pageStart}`
    : citation.page
      ? `${citation.page}`
      : "";
  const versionValue = citation.versionDate
    ? formatConversationCitationDate(citation.versionDate)
    : citation.commencementDate
      ? formatConversationCitationDate(citation.commencementDate)
      : "";

  return [
    { label: "Law", value: citation.legislationName || citation.title },
    { label: "Section / number", value: sectionValue || "Not specified" },
    {
      label: "Section title",
      value: citation.sectionTitle || "Not specified"
    },
    { label: "Page", value: pageValue ? `p. ${pageValue}` : "Not specified" },
    {
      label: "Version",
      value: versionValue || "Not specified"
    },
    {
      label: "Status",
      value:
        citation.amendmentStatus && citation.amendmentStatus !== "in_force"
          ? citation.amendmentStatus.replace("_", " ")
          : "in force"
    }
  ];
}

function AssistantLegalCitationDetails({
  citations,
  groundedLegalSource,
  showDetails,
}: {
  citations: ConversationCitation[];
  groundedLegalSource?: {
    sourceId: string;
    title?: string;
    legislationName?: string;
    citationUrl?: string;
  };
  showDetails: boolean;
}) {
  if (!showDetails) {
    return null;
  }

  const legalCitations = dedupeConversationCitations(citations).filter(
    (citation) =>
      citation.sourceCategory === "official_legal_source" ||
      /^(act|regulation|decision)$/i.test(citation.sourceType ?? "")
  );

  if (!legalCitations.length) {
    const fallbackLaw =
      groundedLegalSource?.legislationName ||
      groundedLegalSource?.title ||
      "AIHW";
    const fallbackUrl =
      groundedLegalSource?.citationUrl ||
      "https://www.aihw.gov.au/family-domestic-and-sexual-violence/responses-and-outcomes/legal-systems";

    return (
      <div className="mt-2 rounded-[14px] border border-[#dce6f2] bg-[#f7fbff] px-3 py-2">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72839b]">
          Law details
        </p>
        <div className="mt-2 rounded-[12px] border border-[#e3edf7] bg-white px-3 py-2">
          <p className="text-[11px] font-semibold text-[#1f2a3a]">{fallbackLaw}</p>
          <div className="mt-1 space-y-0.5 text-[11px] leading-[1.45] text-[#4b5d73]">
            <p>
              <span className="font-semibold text-[#334255]">Law:</span> {fallbackLaw}
            </p>
            <p>
              <span className="font-semibold text-[#334255]">Section / number:</span>{" "}
              Not specified in RAG
            </p>
            <p>
              <span className="font-semibold text-[#334255]">Section title:</span>{" "}
              Not specified in RAG
            </p>
            <p>
              <span className="font-semibold text-[#334255]">Page:</span> Not specified in RAG
            </p>
            <p>
              <span className="font-semibold text-[#334255]">Version:</span> Not specified in RAG
            </p>
            <p>
              <span className="font-semibold text-[#334255]">Law URL:</span>{" "}
              <a
                href={fallbackUrl}
                target="_blank"
                rel="noreferrer"
                className="text-[#2f6fca] underline-offset-2 hover:underline"
              >
                Open source
              </a>
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="mt-2 rounded-[14px] border border-[#dce6f2] bg-[#f7fbff] px-3 py-2">
      <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#72839b]">
        Law details
      </p>
      <div className="mt-2 space-y-2">
        {legalCitations.map((citation) => {
          const summaryRows = buildLegalCitationSummary(citation);
          const citationKey =
            citation.sourceId ??
            `${citation.title}-${citation.url ?? ""}-${citation.sectionRef ?? ""}-${citation.pageStart ?? citation.page ?? ""}`;

          return (
            <div
              key={citationKey}
              className="rounded-[12px] border border-[#e3edf7] bg-white px-3 py-2"
            >
              <p className="text-[11px] font-semibold text-[#1f2a3a]">
                {citation.legislationName || citation.title}
              </p>
              <div className="mt-1 space-y-0.5 text-[11px] leading-[1.45] text-[#4b5d73]">
                {summaryRows.map((row) => (
                  <p key={row.label}>
                    <span className="font-semibold text-[#334255]">{row.label}:</span>{" "}
                    {row.value}
                  </p>
                ))}
                {citation.url ? (
                  <p>
                    <span className="font-semibold text-[#334255]">Law URL:</span>{" "}
                    <a
                      href={citation.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[#2f6fca] underline-offset-2 hover:underline"
                    >
                      Open source
                    </a>
                  </p>
                ) : null}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function buildAssistantLawPrefix(message: {
  role: string;
  responseMeta?: {
    citations?: ConversationCitation[];
    groundedLegalSource?: {
      sourceId: string;
      title?: string;
      legislationName?: string;
      citationUrl?: string;
    };
  };
}): string {
  const groundedSource = message.responseMeta?.groundedLegalSource;
  const legalCitation = (message.responseMeta?.citations ?? []).find(
    (citation) =>
      citation.sourceCategory === "official_legal_source" ||
      /^(act|regulation|decision)$/i.test(citation.sourceType ?? "")
  );

  const lawName =
    legalCitation?.legislationName ||
    legalCitation?.title ||
    groundedSource?.legislationName ||
    groundedSource?.title;

  if (!lawName) {
    return "";
  }

  const section = legalCitation?.sectionRef
    ? `, ${formatConversationSectionRef(legalCitation.sectionRef)}`
    : "";

  return `Law: ${lawName}${section}`;
}

function AssistantResponseCitations({
  citations,
  showSources,
  answerText,
}: {
  citations: ConversationCitation[];
  showSources: boolean;
  answerText: string;
}) {
  if (!showSources || !citations.length) {
    return null;
  }

  const dedupedCitations = dedupeConversationCitations(citations);
  const normalizedAnswer = answerText.toLowerCase();
  const directReferenceCount = dedupedCitations.filter((citation) => {
    const sectionRef = formatConversationSectionRef(citation.sectionRef)
      .trim()
      .toLowerCase();

    if (sectionRef) {
      return normalizedAnswer.includes(sectionRef);
    }

    return citation.title.trim().length
      ? normalizedAnswer.includes(citation.title.trim().toLowerCase())
      : false;
  }).length;
  const compactCitations = dedupedCitations.slice(
    0,
    directReferenceCount > 1 ? 2 : 1
  );

  return (
    <div className="mt-2">
      <p className="text-[11px] leading-[1.55] text-[#7d8ea5]">
        <span className="font-semibold text-[#6a7a92]">
          {compactCitations.length > 1 ? "Sources:" : "Source:"}
        </span>{" "}
        {compactCitations.map((citation, index) => {
          const citationKey = buildConversationCitationIdentity(citation);
          const summary = buildConversationCitationSummary(citation);

          return (
            <span key={citationKey}>
              {index > 0 ? "; " : null}
              {citation.url ? (
                <a
                  href={citation.url}
                  target="_blank"
                  rel="noreferrer"
                  className="underline decoration-[#c6d4e6] underline-offset-2 hover:text-[#52657d]"
                >
                  {summary}
                </a>
              ) : (
                <span>{summary}</span>
              )}
            </span>
          );
        })}
      </p>
    </div>
  );
}

type RecordingErrorCode =
  | "audio-capture"
  | "network"
  | "no-speech"
  | "not-allowed"
  | "service-not-allowed";

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

type SpeechRecognitionConstructor = new () => SpeechRecognitionLike;

type SpeechWindow = Window & {
  SpeechRecognition?: SpeechRecognitionConstructor;
  webkitSpeechRecognition?: SpeechRecognitionConstructor;
};

const VOICE_RECORDING_TIMEOUT_MS = 8000;
type VoiceCaptureTarget = "conversation" | "transcription";

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

  if (typeof MediaRecorder.isTypeSupported !== "function") {
    return undefined;
  }

  return supportedTypes.find((mimeType) =>
    MediaRecorder.isTypeSupported(mimeType)
  );
}

function isNoSpeechTranscriptionError(error: unknown): boolean {
  if (!(error instanceof ApiRequestError)) {
    return false;
  }

  const message = error.message.toLowerCase();

  return (
    error.status === 422 ||
    message.includes("no speech") ||
    message.includes("empty") ||
    message.includes("too short")
  );
}

function getContinueReportSubmissionHref(
  incidentCategory?: AssistantIncidentCategory,
  conversationSessionId?: string,
  triageRefresh?: string
) {
  return {
    pathname: "/dashboard",
    query: {
      view: "reportsubmissionsupport",
      category: incidentCategory,
      conversationSessionId,
      triageRefresh,
    },
  } as const;
}

function getContinueReportSubmissionPath(
  incidentCategory?: AssistantIncidentCategory,
  conversationSessionId?: string,
  triageRefresh?: string
) {
  return getDashboardHrefString(
    getContinueReportSubmissionHref(
      incidentCategory,
      conversationSessionId,
      triageRefresh
    )
  );
}

function getAssistantEntryHref(
  initialTopic?: DashboardCardFlowId,
  initialCategory?: AssistantIncidentCategory
) {
  return {
    pathname: "/dashboard",
    query: {
      view: "assistant",
      topic: initialTopic,
      category: initialCategory,
    },
  } as const;
}

function getDashboardHrefString(input: {
  pathname: string;
  query?: Record<string, string | undefined>;
}) {
  const searchParams = new URLSearchParams();

  Object.entries(input.query ?? {}).forEach(([key, value]) => {
    if (typeof value === "string" && value.length > 0) {
      searchParams.set(key, value);
    }
  });

  const queryString = searchParams.toString();
  return queryString ? `${input.pathname}?${queryString}` : input.pathname;
}

function shouldUseNswLegalAwareness(
  topic?: DashboardCardFlowId,
  category?: AssistantIncidentCategory
) {
  return (
    topic === "racial_abuse" ||
    topic === "migrant_challenges" ||
    category === "racial_abuse" ||
    category === "migrant_challenges"
  );
}

const staticNswLegalAwareness: LegalAwareness = {
  jurisdiction: "NSW",
  topic: "racial_abuse",
  informationOnly: true,
  sourceStatus: "insufficient_approved_sources",
  keyPoints: [
    "Keep a dated record of what happened if it is safe.",
    "NSW and Commonwealth pathways can both be relevant for racial abuse or discrimination concerns.",
    "Online abuse may also involve platform reporting, eSafety information, and immediate safety planning.",
  ],
  pathwayCards: [
    {
      title: "NSW discrimination pathway",
      body: "SafeSpeak can help organize details for Anti-Discrimination NSW style complaint information once approved sources are available.",
      sourceRequirement:
        "Detailed legal explanations require approved NSW sources.",
    },
    {
      title: "Commonwealth pathway",
      body: "Some racial discrimination concerns may involve Australian Human Rights Commission information.",
      sourceRequirement:
        "Citations appear only from approved Commonwealth sources.",
    },
    {
      title: "Online abuse pathway",
      body: "For online incidents, evidence collection, platform reports, and eSafety information may be relevant.",
      sourceRequirement: "Use approved eSafety sources before public citation.",
    },
  ],
  citationPolicy:
    "No citations are shown until approved, current, legally reviewed sources are available.",
};

function NswLegalAwarenessPanel({
  legalAwareness,
  compact = false,
}: {
  legalAwareness: LegalAwareness;
  compact?: boolean;
}) {
  return (
    <section
      className={`rounded-[20px] border border-[#d6e2f0] bg-[#fbfdff] ${
        compact ? "p-3" : "p-4"
      }`}
    >
      <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
        <div>
          <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#3f7de0]">
            NSW legal awareness
          </p>
          <p className="mt-1 text-[12px] leading-[1.55] text-[#5f6f86]">
            Information only, not legal advice. SafeSpeak will cite only
            approved, current, legally reviewed sources.
          </p>
        </div>
        <span className="rounded-full border border-[#d6e2f0] bg-white px-3 py-1 text-[10px] font-semibold text-[#51657f]">
          {legalAwareness.sourceStatus === "approved_sources_used"
            ? "Approved sources available"
            : "Sources pending approval"}
        </span>
      </div>

      {legalAwareness.keyPoints.length > 0 ? (
        <ul className="mt-3 space-y-1.5 text-[10px] leading-[1.55] text-[#617289]">
          {legalAwareness.keyPoints.map((point) => (
            <li key={point} className="flex gap-2">
              <span className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-[#82aee8]" />
              <span>{point}</span>
            </li>
          ))}
        </ul>
      ) : null}

      <div className="mt-3 grid gap-2 md:grid-cols-3">
        {legalAwareness.pathwayCards.map((card) => (
          <article
            key={card.title}
            className="rounded-[16px] border border-[#e2e9f3] bg-white p-3"
          >
            <h4 className="text-[12px] font-bold text-[#1f2a3a]">
              {card.title}
            </h4>
            <p className="mt-1 text-[10px] leading-[1.55] text-[#697b92]">
              {card.body}
            </p>
            <p className="mt-2 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#9aa8ba]">
              {card.sourceRequirement}
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}

function hasActiveAssistantDraftForScope(input: {
  topic?: DashboardCardFlowId;
  incidentCategory?: AssistantIncidentCategory;
}) {
  const draft = getAssistantConversationDraft({
    topic: input.topic,
    incidentCategory: input.incidentCategory,
  });

  if (!draft) {
    return false;
  }

  const hasUserMessage = draft.messages.some(
    (message) => message.role === "user"
  );
  const hasTimelineContent = Object.values(draft.timeline).some(
    (value) => value.trim().length > 0
  );

  return hasUserMessage || hasTimelineContent;
}

function SafeSpeakAssistantPage({
  startFresh = false,
  isRecording = false,
  initialCategory,
  initialTopic,
}: {
  startFresh?: boolean;
  isRecording?: boolean;
  initialCategory?: AssistantIncidentCategory;
  initialTopic?: DashboardCardFlowId;
}) {
  const router = useRouter();
  const [isCheckingDraft, setIsCheckingDraft] = useState(true);

  useEffect(() => {
    if (startFresh) {
      setIsCheckingDraft(false);
      return;
    }

    if (initialTopic || initialCategory) {
      if (
        hasActiveAssistantDraftForScope({
          topic: initialTopic,
          incidentCategory: initialCategory,
        })
      ) {
        const query = new URLSearchParams({
          view: "assistantconversation",
        });

        if (initialTopic) {
          query.set("topic", initialTopic);
        }

        if (initialCategory) {
          query.set("category", initialCategory);
        }

        router.replace(`/dashboard?${query.toString()}`);
        return;
      }

      setIsCheckingDraft(false);
      return;
    }

    if (!hasActiveAssistantDraftForScope({})) {
      setIsCheckingDraft(false);
      return;
    }

    router.replace("/dashboard?view=assistantconversation");
  }, [initialCategory, initialTopic, router, startFresh]);
  if (isCheckingDraft) {
    return null;
  }

  const assistantFlow = initialTopic
    ? getDashboardCardFlow(initialTopic)
    : null;
  const assistantTopicChips = getDashboardAssistantTopicChips();
  const startWithTopicHref = assistantFlow?.starterPrompt
    ? getDashboardActionHref(assistantFlow.id, "talk_with_assistant")
    : null;

  return (
    <div className="px-2 pb-28 pt-2 sm:px-4 sm:pb-32 sm:pt-4 lg:pb-24">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <AssistantInteraction
          isRecording={isRecording}
          initialCategory={initialCategory}
          initialTopic={initialTopic}
          headlineClassName={`${interFont.className} mt-6 max-w-[460px] text-center text-[28px] font-semibold leading-[32px] tracking-[0] text-[#24364f] sm:text-[30px] sm:leading-[34px] xl:text-[32px] xl:leading-[36px]`}
        />

        {assistantFlow ? (
          <article className="bg-white/96 mx-auto -mt-[158px] w-full max-w-[1120px] rounded-[24px] border border-[#dce6f2] p-4 shadow-[0_16px_34px_rgba(15,23,42,0.08)] backdrop-blur sm:p-5">
            <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[760px]">
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#3f7de0]">
                  {assistantFlow.title}
                </p>
                <p className="mt-2 text-sm leading-[1.65] text-[#5f6f86]">
                  {assistantFlow.starterPrompt ??
                    "Choose how you want to begin. Nothing is submitted until you decide to continue."}
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  {assistantFlow.disclaimers.map((disclaimer) => (
                    <span
                      key={disclaimer}
                      className="rounded-full border border-[#d6e2f0] bg-[#f8fbff] px-3 py-1.5 text-[10px] font-semibold text-[#51657f]"
                    >
                      {disclaimer}
                    </span>
                  ))}
                </div>
              </div>

              {startWithTopicHref ? (
                <Link
                  href={startWithTopicHref}
                  className="inline-flex h-11 shrink-0 items-center justify-center rounded-full bg-[#0f5d9f] px-5 text-[12px] font-bold text-white shadow-[0_10px_24px_rgba(15,93,159,0.25)] transition hover:bg-[#0b528d]"
                >
                  Start with this topic
                  <IconArrowRight size={14} className="ml-1.5" />
                </Link>
              ) : null}
            </div>

            {assistantFlow.nextActions.length > 0 ? (
              <div className="mt-4 grid grid-cols-1 gap-2.5 md:grid-cols-2 xl:grid-cols-3">
                {assistantFlow.nextActions.map((action) => {
                  if (action.id === "quick_exit") {
                    return (
                      <button
                        key={action.id}
                        type="button"
                        onClick={() => triggerQuickExit()}
                        className="rounded-[18px] border border-[#f1d6d6] bg-[#fff7f7] p-3 text-left transition hover:border-[#eabcbc] hover:bg-[#fff2f2]"
                      >
                        <p className="text-[12px] font-bold text-[#1f2a3a]">
                          {action.label}
                        </p>
                        <p className="mt-1 text-[10px] leading-[1.55] text-[#7688a0]">
                          {action.description}
                        </p>
                      </button>
                    );
                  }

                  const actionHref = getDashboardActionHref(
                    assistantFlow.id,
                    action.id
                  );

                  if (!actionHref) {
                    return null;
                  }

                  return (
                    <Link
                      key={action.id}
                      href={actionHref}
                      className="rounded-[18px] border border-[#dce6f2] bg-[#fbfdff] p-3 text-left transition hover:border-[#c5d8ec] hover:bg-[#f7fbff]"
                    >
                      <p className="text-[12px] font-bold text-[#1f2a3a]">
                        {action.label}
                      </p>
                      <p className="mt-1 text-[10px] leading-[1.55] text-[#7688a0]">
                        {action.description}
                      </p>
                    </Link>
                  );
                })}
              </div>
            ) : null}

            {assistantFlow.id === "general_assistant" ? (
              <div className="mt-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7d8ea5]">
                  Choose a topic
                </p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {assistantTopicChips.map((topicChip) => {
                    const resolvedChipHref = topicChip.starterPrompt
                      ? getDashboardActionHref(
                          topicChip.id,
                          "talk_with_assistant"
                        )
                      : null;

                    if (!resolvedChipHref) {
                      return null;
                    }

                    return (
                      <Link
                        key={topicChip.id}
                        href={resolvedChipHref}
                        className="rounded-full border border-[#d6e2f0] bg-white px-3 py-2 text-[11px] font-semibold text-[#42566f] transition hover:border-[#bfd1e6] hover:bg-[#f8fbff]"
                      >
                        {topicChip.title}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ) : null}

            {shouldUseNswLegalAwareness(initialTopic, initialCategory) ? (
              <div className="mt-4">
                <NswLegalAwarenessPanel
                  legalAwareness={{
                    ...staticNswLegalAwareness,
                    topic:
                      initialTopic === "migrant_challenges" ||
                      initialCategory === "migrant_challenges"
                        ? "migrant_challenges"
                        : "racial_abuse",
                  }}
                />
              </div>
            ) : null}
          </article>
        ) : null}
      </div>
    </div>
  );
}

function SafeSpeakAssistantConversationPage({
  initialMessage,
  initialPrefillMessage,
  initialCategory,
  initialTopic,
  startVoiceMode = false,
}: {
  initialMessage?: string;
  initialPrefillMessage?: string;
  initialCategory?: AssistantIncidentCategory;
  initialTopic?: DashboardCardFlowId;
  startVoiceMode?: boolean;
}) {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  type ConversationUiMessage = AssistantConversationMessage & {
    messageId?: string;
    turnNumber?: number;
    responseMeta?: {
      disclaimer?: string;
      citations?: ConversationCitation[];
      confidence?: string;
      intent?: string;
      triageReady?: boolean;
      nextAction?: string;
      conversationSessionId?: string;
      selectedResponseSource?: string;
      responseSource?: string;
      model?: string;
      ragStatus?: string;
      showSources?: boolean;
      sourceDisplayReason?:
        | "legal_lookup"
        | "explicit_citation_request"
        | "hidden_support_reply"
        | "triage_handoff"
        | "not_directly_grounded";
      reviewStatus?: string;
      ragUnavailable?: boolean;
      assistantLanguage?: string;
      pendingHumanReview?: boolean;
      legalAwareness?: LegalAwareness;
      groundedLegalSource?: {
        sourceId: string;
        title?: string;
        legislationName?: string;
        citationUrl?: string;
      };
      assistantFormatPreference?: "paragraphs" | "bullets" | "mix";
      formatPreferenceUpdated?: boolean;
      subIntent?: string;
      encodingWarning?: boolean;
    };
  };
  const seededMessage = initialMessage?.trim();
  const seededPrefillMessage = initialPrefillMessage?.trim();
  const starterAssistantPrompts = [
    t("dashboard.assistant.conversation.botPromptWho"),
    "I'm helping you structure your report.",
    "Te ayudo a estructurar tu reporte.",
  ];
  const storedDraft = getAssistantConversationDraft({
    topic: initialTopic,
    incidentCategory: initialCategory,
  });
  const shouldIgnoreStoredDraft = Boolean(seededMessage);
  const existingDraft = shouldIgnoreStoredDraft ? null : storedDraft;
  const shouldRestoreVoiceMode = Boolean(
    startVoiceMode && existingDraft?.voiceSessionActive
  );
  const shouldAutoStartVoiceMode =
    shouldRestoreVoiceMode || (!existingDraft && startVoiceMode);
  const initialDraftMessages = existingDraft?.messages.filter(
    (message, index) =>
      !(
        index === 0 &&
        message.role === "assistant" &&
        starterAssistantPrompts.includes(message.content.trim())
      )
  );
  const initialConversationMessages =
    initialDraftMessages && initialDraftMessages.length > 0
      ? initialDraftMessages
      : ([
          seededMessage
            ? {
                role: "user" as const,
                content: seededMessage,
              }
            : null,
        ].filter(Boolean) as AssistantConversationMessage[]);
  const [input, setInput] = useState(seededPrefillMessage ?? "");
  const [conversationSessionId, setConversationSessionId] = useState<
    string | null
  >(existingDraft?.conversationSessionId ?? null);
  const [timeline, setTimeline] = useState<AssistantTimeline>(
    existingDraft?.timeline ?? emptyTimeline
  );
  const [messages, setMessages] = useState<ConversationUiMessage[]>(
    () => initialConversationMessages
  );
  const [isSending, setIsSending] = useState(
    Boolean(seededMessage) && !existingDraft
  );
  const [error, setError] = useState<string | null>(null);
  const [speechError, setSpeechError] = useState<string | null>(null);
  const [isVoiceSessionActive, setIsVoiceSessionActive] = useState(
    shouldRestoreVoiceMode
  );
  const [isVoiceSessionMuted, setIsVoiceSessionMuted] = useState(false);
  const [isRecordingActive, setIsRecordingActive] = useState(false);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [isGeneratingSpeech, setIsGeneratingSpeech] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [speechPlaybackError, setSpeechPlaybackError] = useState<string | null>(
    null
  );
  const [replayVoiceText, setReplayVoiceText] = useState<string | null>(null);
  const [replayVoiceLanguage, setReplayVoiceLanguage] = useState<
    string | undefined
  >(undefined);
  const [liveTranscript, setLiveTranscript] = useState("");
  const [voiceAvatarState, setVoiceAvatarState] =
    useState<VoiceAvatarState>("idle");
  const [activeVoiceCaptureTarget, setActiveVoiceCaptureTarget] =
    useState<VoiceCaptureTarget | null>(null);
  const [pendingVoiceReviewBlob, setPendingVoiceReviewBlob] =
    useState<Blob | null>(null);
  const {
    pendingConsentRequirement,
    isGrantingConsent,
    captureConsentError,
    clearPendingConsent,
    grantPendingConsent,
  } = useConsentGate();
  const hasSentInitialRef = useRef(false);
  const hasStartedInitialVoiceModeRef = useRef(false);
  const latestMessagesRef = useRef(messages);
  const latestRequestIdRef = useRef(0);
  const latestAssistantTurnRef = useRef(
    Math.max(
      0,
      ...messages
        .filter((message) => message.role === "assistant")
        .map((message) => message.turnNumber ?? 0)
    )
  );
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const pendingAssistantRequestRef = useRef<{
    message: string;
    conversation: AssistantConversationMessage[];
    speakResponse?: boolean;
    continueVoiceSession?: boolean;
  } | null>(null);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<BlobPart[]>([]);
  const recordingStreamRef = useRef<MediaStream | null>(null);
  const shouldProcessRecordingRef = useRef(false);
  const voiceSessionActiveRef = useRef(false);
  const shouldContinueAfterPlaybackRef = useRef(false);
  const autoStopRecordingTimerRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const restartListeningTimerRef = useRef<ReturnType<typeof setTimeout> | null>(
    null
  );
  const speechErrorTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const speechPlaybackWatchdogRef = useRef<ReturnType<
    typeof setTimeout
  > | null>(null);
  const startVoiceRecordingRef = useRef<() => Promise<boolean>>(
    async () => false
  );
  const hasHandledPendingVoiceHandoffRef = useRef(false);
  const liveRecognitionRef = useRef<SpeechRecognitionLike | null>(null);
  const liveFinalTranscriptRef = useRef("");
  const speechAudioRef = useRef<HTMLAudioElement | null>(null);
  const speechAudioUrlRef = useRef<string | null>(null);
  const speechPlaybackActiveRef = useRef(false);
  const pendingSpeechRevealRef = useRef<(() => void) | null>(null);
  const recordingDecisionRef = useRef<"confirm" | "cancel" | null>(null);
  const [timelineFieldOrder, setTimelineFieldOrder] = useState<string[]>(
    existingDraft?.timelineFieldOrder ?? []
  );
  const [showTriageCta, setShowTriageCta] = useState(
    Boolean(existingDraft?.triageCtaVisible)
  );
  const assistantEntryHref = getAssistantEntryHref(
    initialTopic,
    initialCategory
  );
  const assistantEntryHrefString = getDashboardHrefString(assistantEntryHref);
  const useNswLegalAwareness = shouldUseNswLegalAwareness(
    initialTopic,
    initialCategory
  );
  const transcriptionLanguage = useMemo(() => {
    return i18n.resolvedLanguage === "es" || i18n.language === "es"
      ? "es"
      : "en";
  }, [i18n.language, i18n.resolvedLanguage]);
  const transcriptionLanguageHint =
    transcriptionLanguage === "en" ? undefined : transcriptionLanguage;
  const livePreviewLanguage =
    transcriptionLanguage === "es" ? "es-ES" : "en-US";

  useEffect(() => {
    if (!storedDraft) {
      return;
    }

    console.info(
      shouldIgnoreStoredDraft
        ? "[SafeSpeak][frontend-draft-ignored]"
        : "[SafeSpeak][frontend-draft-restored]",
      JSON.stringify({
        seededMessage,
        storedConversationSessionId: storedDraft.conversationSessionId,
        storedMessageCount: storedDraft.messages.length,
      })
    );
  }, [seededMessage, shouldIgnoreStoredDraft, storedDraft]);

  useEffect(() => {
    if (!shouldIgnoreStoredDraft) {
      return;
    }

    clearAssistantConversationDraft({
      topic: initialTopic,
      incidentCategory: initialCategory,
    });
  }, [initialCategory, initialTopic, shouldIgnoreStoredDraft]);

  useEffect(() => {
    latestMessagesRef.current = messages;
    latestAssistantTurnRef.current = Math.max(
      latestAssistantTurnRef.current,
      ...messages
        .filter((message) => message.role === "assistant")
        .map((message) => message.turnNumber ?? 0)
    );
  }, [messages]);

  useEffect(() => {
    if (storedDraft) {
      console.info(
        "[SafeSpeak][frontend-draft-restore]",
        JSON.stringify({
          usedDraft: !shouldIgnoreStoredDraft,
          conversationSessionId: storedDraft.conversationSessionId ?? null,
          messageCount: storedDraft.messages.length,
          lastMessagePreview: storedDraft.messages.at(-1)?.content?.slice(0, 120) ?? "",
        })
      );
    }
  }, [shouldIgnoreStoredDraft, storedDraft]);

  useEffect(() => {
    voiceSessionActiveRef.current = isVoiceSessionActive;
  }, [isVoiceSessionActive]);

  const clearAutoStopRecordingTimer = useCallback(() => {
    if (autoStopRecordingTimerRef.current) {
      clearTimeout(autoStopRecordingTimerRef.current);
      autoStopRecordingTimerRef.current = null;
    }
  }, []);

  const clearRestartListeningTimer = useCallback(() => {
    if (restartListeningTimerRef.current) {
      clearTimeout(restartListeningTimerRef.current);
      restartListeningTimerRef.current = null;
    }
  }, []);

  const clearSpeechErrorTimer = useCallback(() => {
    if (speechErrorTimerRef.current) {
      clearTimeout(speechErrorTimerRef.current);
      speechErrorTimerRef.current = null;
    }
  }, []);

  const clearSpeechPlaybackWatchdog = useCallback(() => {
    if (speechPlaybackWatchdogRef.current) {
      clearTimeout(speechPlaybackWatchdogRef.current);
      speechPlaybackWatchdogRef.current = null;
    }
  }, []);

  const dismissSpeechError = useCallback(() => {
    clearSpeechErrorTimer();
    setSpeechError(null);
  }, [clearSpeechErrorTimer]);

  const showTransientSpeechError = useCallback(
    (message: string, durationMs = 3500) => {
      clearSpeechErrorTimer();
      setSpeechError(message);
      speechErrorTimerRef.current = setTimeout(() => {
        setSpeechError(null);
        speechErrorTimerRef.current = null;
      }, durationMs);
    },
    [clearSpeechErrorTimer]
  );

  const cleanupRecording = useCallback(() => {
    clearAutoStopRecordingTimer();
    recordingStreamRef.current?.getTracks().forEach((track) => track.stop());
    recordingStreamRef.current = null;
    mediaRecorderRef.current = null;
  }, [clearAutoStopRecordingTimer]);

  const cleanupSpeechAudio = useCallback(() => {
    clearSpeechPlaybackWatchdog();

    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
    }

    speechAudioRef.current?.pause();
    speechAudioRef.current = null;

    if (speechAudioUrlRef.current) {
      URL.revokeObjectURL(speechAudioUrlRef.current);
      speechAudioUrlRef.current = null;
    }
  }, [clearSpeechPlaybackWatchdog]);

  const revealPendingSpeechResponse = useCallback(() => {
    const reveal = pendingSpeechRevealRef.current;
    pendingSpeechRevealRef.current = null;
    reveal?.();
  }, []);

  const stopAssistantSpeech = useCallback(() => {
    speechPlaybackActiveRef.current = false;
    cleanupSpeechAudio();
    revealPendingSpeechResponse();
    setIsSpeaking(false);
    setIsGeneratingSpeech(false);
    setVoiceAvatarState("idle");
  }, [cleanupSpeechAudio, revealPendingSpeechResponse]);

  const scheduleNextVoiceTurn = useCallback(
    (attempt = 0) => {
      clearRestartListeningTimer();

      if (!voiceSessionActiveRef.current) {
        return;
      }

      if (isVoiceSessionMuted) {
        setVoiceAvatarState("idle");
        return;
      }

      // Voice state: assistant finished and is preparing to listen again.
      setVoiceAvatarState("listening");
      restartListeningTimerRef.current = setTimeout(
        () => {
          if (!voiceSessionActiveRef.current) {
            return;
          }

          void startVoiceRecordingRef.current().then((started) => {
            if (started || !voiceSessionActiveRef.current) {
              return;
            }

            // Keep recovering while the voice session is active. The End
            // button, consent decline, navigation, or component cleanup are
            // the only normal ways to terminate the loop.
            scheduleNextVoiceTurn(attempt + 1);
          });
        },
        attempt === 0 ? 350 : Math.min(500 + attempt * 250, 3000)
      );
    },
    [clearRestartListeningTimer, isVoiceSessionMuted]
  );

  const playAssistantSpeech = useCallback(
    async (
      text: string,
      options: {
        continueVoiceSession?: boolean;
        revealAfterPlayback?: () => void;
        language?: string;
      } = {}
    ) => {
      const speechText = text.trim();

      if (!speechText) {
        options.revealAfterPlayback?.();
        return;
      }

      cleanupSpeechAudio();
      if (options.revealAfterPlayback) {
        pendingSpeechRevealRef.current = options.revealAfterPlayback;
      }
      shouldContinueAfterPlaybackRef.current = Boolean(
        options.continueVoiceSession
      );
      const speechLanguage =
        normalizeAssistantSpeechLanguage(options.language) ??
        detectAssistantSpeechLanguage(speechText);
      setReplayVoiceText(speechText);
      setReplayVoiceLanguage(speechLanguage);
      setSpeechPlaybackError(null);
      setIsGeneratingSpeech(true);
      setIsSpeaking(false);
      speechPlaybackActiveRef.current = true;
      // Voice state: assistant response audio is being prepared or played.
      setVoiceAvatarState("aiSpeaking");

      try {
        const voice = await synthesizeAssistantVoice(
          speechText,
          speechLanguage
        );
        const audioUrl = createAssistantVoiceAudioUrl(voice);
        const audio = new Audio(audioUrl);

        speechAudioUrlRef.current = audioUrl;
        speechAudioRef.current = audio;

        let playbackFinished = false;
        const finishPlayback = (failed = false) => {
          if (playbackFinished) {
            return;
          }

          playbackFinished = true;
          clearSpeechPlaybackWatchdog();
          const shouldContinue = shouldContinueAfterPlaybackRef.current;

          speechPlaybackActiveRef.current = false;
          shouldContinueAfterPlaybackRef.current = false;
          setIsSpeaking(false);
          setIsGeneratingSpeech(false);
          if (failed) {
            setSpeechPlaybackError(t("dashboard.assistant.voicePlaybackFailed"));
          }
          revealPendingSpeechResponse();
          setVoiceAvatarState(shouldContinue ? "listening" : "idle");

          if (shouldContinue) {
            scheduleNextVoiceTurn();
          }
        };
        audio.onended = () => finishPlayback();
        audio.onerror = () => finishPlayback(true);

        setIsGeneratingSpeech(false);
        setIsSpeaking(true);
        const watchdogDelay = Math.min(
          90_000,
          Math.max(15_000, speechText.length * 120 + 8_000)
        );
        speechPlaybackWatchdogRef.current = setTimeout(
          () => finishPlayback(true),
          watchdogDelay
        );
        await audio.play();
      } catch (playbackError) {
        clearSpeechPlaybackWatchdog();
        speechPlaybackActiveRef.current = false;
        shouldContinueAfterPlaybackRef.current = false;
        setIsSpeaking(false);

        if (captureConsentError(playbackError)) {
          revealPendingSpeechResponse();
          setVoiceAvatarState("idle");
          setSpeechPlaybackError(null);
          return;
        }

        const playbackErrorName =
          playbackError instanceof DOMException
            ? playbackError.name
            : playbackError &&
                typeof playbackError === "object" &&
                "name" in playbackError &&
                typeof playbackError.name === "string"
              ? playbackError.name
              : null;
        const autoplayBlocked = playbackErrorName === "NotAllowedError";

        revealPendingSpeechResponse();

        if (!autoplayBlocked) {
          if (voiceSessionActiveRef.current) {
            scheduleNextVoiceTurn();
          } else {
            setVoiceAvatarState("idle");
          }
        } else {
          setVoiceAvatarState("idle");
        }

        setSpeechPlaybackError(
          autoplayBlocked
            ? t("dashboard.assistant.tapToPlayResponse")
            : playbackError instanceof Error
              ? playbackError.message
              : t("dashboard.assistant.voicePlaybackFailed")
        );
      } finally {
        setIsGeneratingSpeech(false);
      }
    },
    [
      captureConsentError,
      clearSpeechPlaybackWatchdog,
      cleanupSpeechAudio,
      revealPendingSpeechResponse,
      scheduleNextVoiceTurn,
      t,
    ]
  );

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

      if (voiceSessionActiveRef.current && (finalChunk || interimChunk)) {
        // Voice state: the live recognizer has detected user speech.
        setVoiceAvatarState("userSpeaking");
        clearAutoStopRecordingTimer();
        autoStopRecordingTimerRef.current = setTimeout(
          () => {
            const mediaRecorder = mediaRecorderRef.current;

            if (
              voiceSessionActiveRef.current &&
              mediaRecorder?.state === "recording"
            ) {
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
      if (voiceSessionActiveRef.current) {
        clearAutoStopRecordingTimer();
        autoStopRecordingTimerRef.current = setTimeout(() => {
          const mediaRecorder = mediaRecorderRef.current;

          if (
            voiceSessionActiveRef.current &&
            mediaRecorder?.state === "recording"
          ) {
            mediaRecorder.stop();
          }
        }, 2500);
      }
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

  const conversationMessages = useMemo<AssistantConversationMessage[]>(
    () => messages.map(({ role, content }) => ({ role, content })),
    [messages]
  );

  useEffect(() => {
    saveAssistantTriageSource({
      conversationSessionId: conversationSessionId ?? undefined,
      conversation: conversationMessages,
      timeline,
      incidentCategory: initialCategory,
    });
    saveAssistantConversationDraft(
      {
        conversationSessionId: conversationSessionId ?? undefined,
        messages: conversationMessages,
        timeline,
        timelineFieldOrder,
        triageCtaVisible: showTriageCta,
        voiceSessionActive: isVoiceSessionActive,
        incidentCategory: initialCategory,
        topic: initialTopic,
      },
      {
        topic: initialTopic,
        incidentCategory: initialCategory,
      }
    );
  }, [
    conversationMessages,
    initialCategory,
    initialTopic,
    conversationSessionId,
    isVoiceSessionActive,
    timeline,
    timelineFieldOrder,
    showTriageCta,
  ]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({
      behavior: "smooth",
      block: "end",
    });
  }, [messages, showTriageCta, isSending, error]);

  useEffect(() => {
    if (typeof document === "undefined") {
      return;
    }

    document.body.classList.add("assistant-conversation-lock");
    document.documentElement.classList.add("assistant-conversation-lock");

    return () => {
      document.body.classList.remove("assistant-conversation-lock");
      document.documentElement.classList.remove("assistant-conversation-lock");
    };
  }, []);

  useEffect(() => {
    return () => {
      if (mediaRecorderRef.current?.state === "recording") {
        shouldProcessRecordingRef.current = false;
        mediaRecorderRef.current.stop();
      }

      voiceSessionActiveRef.current = false;
      clearAutoStopRecordingTimer();
      clearRestartListeningTimer();
      stopLiveTranscriptPreview();
      cleanupRecording();
      cleanupSpeechAudio();
    };
  }, [
    cleanupRecording,
    cleanupSpeechAudio,
    clearAutoStopRecordingTimer,
    clearRestartListeningTimer,
    stopLiveTranscriptPreview,
  ]);

  const requestAssistantTurn = useCallback(
    async (
      message: string,
      conversation: AssistantConversationMessage[],
      options: { speakResponse?: boolean; continueVoiceSession?: boolean } = {}
    ) => {
      const requestId = latestRequestIdRef.current + 1;
      latestRequestIdRef.current = requestId;
      setIsSending(true);
      setError(null);
      let resolvedSessionId = conversationSessionId;

      const processConversationFlowResponse = async (
        response: Awaited<ReturnType<typeof appendConversationFlowMessage>>,
        fallbackSessionId: string
      ): Promise<boolean> => {
        const nextTimeline = response.factExtraction?.timeline ?? {};
        const responseSessionId =
          response.responseMeta?.conversationSessionId ?? fallbackSessionId;

        console.info(
          "[SafeSpeak][frontend-response]",
          JSON.stringify({
            requestId,
            responseSessionId,
            userMessageId: response.userMessage.id,
            userTurnNumber: response.userMessage.turnNumber,
            assistantMessageId: response.assistantMessage.id,
            assistantTurnNumber: response.assistantMessage.turnNumber,
            selectedResponseSource:
              (response.assistantMessage.metadata?.selectedResponseSource as
                | string
                | undefined) ??
              (response.responseMeta as { selectedResponseSource?: string } | undefined)
                ?.selectedResponseSource ??
              "unknown",
            intent:
              (response.assistantMessage.metadata?.intent as string | undefined) ??
              response.responseMeta?.intent ??
              "unknown",
            assistantPreview: response.assistantMessage.content.slice(0, 120),
          })
        );

        if (requestId !== latestRequestIdRef.current) {
          console.info(
            "[SafeSpeak][frontend-response-ignored]",
            JSON.stringify({
              requestId,
              latestRequestId: latestRequestIdRef.current,
              assistantMessageId: response.assistantMessage.id,
            })
          );
          return false;
        }

        if (response.assistantMessage.turnNumber <= latestAssistantTurnRef.current) {
          console.info(
            "[SafeSpeak][frontend-stale-assistant-ignored]",
            JSON.stringify({
              requestId,
              assistantMessageId: response.assistantMessage.id,
              assistantTurnNumber: response.assistantMessage.turnNumber,
              latestAssistantTurnNumber: latestAssistantTurnRef.current,
            })
          );
          return false;
        }

        if (responseSessionId && responseSessionId !== conversationSessionId) {
          setConversationSessionId(responseSessionId);
          resolvedSessionId = responseSessionId;
        }

        setTimeline((currentTimeline) => {
          const nextKeys = Object.entries(nextTimeline)
            .filter(([, value]) => value.trim().length > 0)
            .map(([key]) => key);

          setTimelineFieldOrder((currentOrder) => {
            const mergedOrder = [...currentOrder];

            nextKeys.forEach((key) => {
              const hadValue =
                typeof currentTimeline[key] === "string" &&
                currentTimeline[key].trim().length > 0;

              if (!hadValue && !mergedOrder.includes(key)) {
                mergedOrder.push(key);
              }
            });

            return mergedOrder.filter((key) => nextKeys.includes(key));
          });

          return nextTimeline;
        });

        const assistantMessage: ConversationUiMessage = {
          role: "assistant",
          content: response.assistantMessage.content,
          messageId: response.assistantMessage.id,
          turnNumber: response.assistantMessage.turnNumber,
          responseMeta: {
            citations: response.responseMeta?.citations,
            confidence: response.responseMeta?.confidence,
            intent: response.responseMeta?.intent,
            triageReady: response.responseMeta?.triageReady,
            nextAction: response.responseMeta?.nextAction,
            conversationSessionId: responseSessionId,
            selectedResponseSource: response.responseMeta?.selectedResponseSource,
            responseSource: response.responseMeta?.responseSource,
            model: response.responseMeta?.model,
            ragStatus: response.responseMeta?.ragStatus,
            showSources: response.responseMeta?.showSources,
            sourceDisplayReason: response.responseMeta?.sourceDisplayReason,
            reviewStatus: response.responseMeta?.reviewStatus,
            ragUnavailable: response.responseMeta?.rag?.unavailable,
            assistantLanguage: response.responseMeta?.assistantLanguage,
            pendingHumanReview: Boolean(response.triage?.humanReviewRecommended),
          },
        };
        latestAssistantTurnRef.current = response.assistantMessage.turnNumber;

        if (options.speakResponse) {
          setMessages((currentMessages) => [...currentMessages, assistantMessage]);
          void playAssistantSpeech(response.assistantMessage.content, {
            continueVoiceSession: options.continueVoiceSession,
            language: response.responseMeta?.assistantLanguage,
          });
        } else {
          setMessages((currentMessages) => [...currentMessages, assistantMessage]);
        }

        if (isActionableConversationTriage(response)) {
          setShowTriageCta(true);
        }

        return true;
      };

      console.info(
        "[SafeSpeak][frontend-request]",
        JSON.stringify({
          requestId,
          conversationSessionId: resolvedSessionId,
          latestUserMessage: message,
          latestUserMessagePayload: buildConversationRequestBody({
            content: message,
            language: transcriptionLanguage,
          }),
          conversationLength: conversation.length,
        })
      );

      try {
        if (hasBrokenTextEncoding(message)) {
          setMessages([
            ...conversation,
            {
              role: "assistant",
              content:
                "The message looks like it was received with broken text encoding. Please resend it.",
              responseMeta: {
                intent: "encoding_error",
                selectedResponseSource: "frontend_encoding_guard",
              },
            },
          ]);
          setIsSending(false);
          return;
        }

        await ensureConsent(consentRequirements.aiAssistant);

        if (!resolvedSessionId) {
          const session = await createConversationFlowSession({
            selectedTopic: initialTopic ?? initialCategory,
            jurisdiction: useNswLegalAwareness ? "NSW" : undefined,
          });

          resolvedSessionId = session.id;
          setConversationSessionId(session.id);
        }

        const response = await appendConversationFlowMessage({
          conversationSessionId: resolvedSessionId,
          content: message,
          language: transcriptionLanguage,
        });
        const handled = await processConversationFlowResponse(
          response,
          resolvedSessionId
        );

        if (!handled) {
          return;
        }
      } catch (conversationFlowError) {
        if (captureConsentError(conversationFlowError)) {
          pendingAssistantRequestRef.current = {
            message,
            conversation,
            speakResponse: options.speakResponse,
            continueVoiceSession: options.continueVoiceSession,
          };
          setVoiceAvatarState("idle");
          return;
        }

        if (
          conversationFlowError instanceof ApiRequestError &&
          conversationFlowError.status >= 500 &&
          resolvedSessionId
        ) {
          try {
            const freshSession = await createConversationFlowSession({
              selectedTopic: initialTopic ?? initialCategory,
              jurisdiction: useNswLegalAwareness ? "NSW" : undefined,
            });

            setConversationSessionId(freshSession.id);
            resolvedSessionId = freshSession.id;

            const retryResponse = await appendConversationFlowMessage({
              conversationSessionId: freshSession.id,
              content: message,
              language: transcriptionLanguage,
            });
            const handledRetry = await processConversationFlowResponse(
              retryResponse,
              freshSession.id
            );

            if (handledRetry) {
              return;
            }
          } catch (retryError) {
            console.warn(
              "[SafeSpeak][frontend-conversation-retry-failed]",
              JSON.stringify({
                requestId,
                originalStatus:
                  conversationFlowError instanceof ApiRequestError
                    ? conversationFlowError.status
                    : undefined,
                retryStatus:
                  retryError instanceof ApiRequestError ? retryError.status : undefined,
              })
            );
          }
        }

        try {
          if (
            !shouldCallTimelineAssistant({
              message,
              conversation,
              timeline,
              incidentCategory: initialCategory,
            })
          ) {
            throw conversationFlowError;
          }

          const response = await sendTimelineAssistantMessage({
            message,
            conversation,
            timeline,
            incidentCategory: initialCategory,
            jurisdiction: useNswLegalAwareness ? "NSW" : undefined,
          });
          const assistantContent = buildAssistantBubbleContent(
            response.assistantMessage ?? "",
            response.nextQuestion ?? ""
          );

          setTimeline((currentTimeline) => {
            const nextTimeline = response.timeline;
            const nextKeys = Object.entries(nextTimeline)
              .filter(([, value]) => value.trim().length > 0)
              .map(([key]) => key);

            setTimelineFieldOrder((currentOrder) => {
              const mergedOrder = [...currentOrder];

              nextKeys.forEach((key) => {
                const hadValue =
                  typeof currentTimeline[key] === "string" &&
                  currentTimeline[key].trim().length > 0;

                if (!hadValue && !mergedOrder.includes(key)) {
                  mergedOrder.push(key);
                }
              });

              return mergedOrder.filter((key) => nextKeys.includes(key));
            });

            return nextTimeline;
          });
          const assistantMessage: ConversationUiMessage = {
            role: "assistant",
            content: assistantContent,
            responseMeta: {
              citations: response.citations,
              confidence: response.confidence,
              triageReady: response.triageReady,
              nextAction: response.nextAction,
              conversationSessionId: resolvedSessionId ?? undefined,
              showSources: response.showSources,
              sourceDisplayReason: response.sourceDisplayReason,
              reviewStatus: response.reviewStatus,
              ragUnavailable: response.rag?.unavailable,
              pendingHumanReview:
                response.reviewStatus === "pending_human_review",
              legalAwareness: response.legalAwareness,
              encodingWarning: response.encodingWarning,
            },
          };

          if (options.speakResponse) {
            setMessages((currentMessages) => [
              ...currentMessages,
              assistantMessage,
            ]);
            void playAssistantSpeech(assistantContent, {
              continueVoiceSession: options.continueVoiceSession,
            });
          } else {
            setMessages((currentMessages) => [
              ...currentMessages,
              assistantMessage,
            ]);
          }

          if (
            response.triageReady ||
            response.nextAction === "show_triage_button" ||
            (response.readyForSubmission &&
              detectHarmfulActivity({
                incidentCategory: initialCategory,
                timeline: response.timeline,
                conversation: [
                  ...conversation,
                  { role: "user", content: message },
                ],
              }))
          ) {
            setShowTriageCta(true);
          }
        } catch (requestError) {
          if (captureConsentError(requestError)) {
            pendingAssistantRequestRef.current = {
              message,
              conversation,
              speakResponse: options.speakResponse,
              continueVoiceSession: options.continueVoiceSession,
            };
            setVoiceAvatarState("idle");
            return;
          }

          setVoiceAvatarState("idle");
          setError(
            requestError instanceof Error
              ? requestError.message
              : "Assistant response failed"
          );
          if (
            voiceSessionActiveRef.current &&
            options.continueVoiceSession
          ) {
            scheduleNextVoiceTurn();
          }
        }
      } finally {
        setIsSending(false);
      }
    },
    [
      clearPendingConsent,
      captureConsentError,
      conversationSessionId,
      initialCategory,
      initialTopic,
      playAssistantSpeech,
      scheduleNextVoiceTurn,
      timeline,
      transcriptionLanguage,
      useNswLegalAwareness,
    ]
  );

  useEffect(() => {
    if (!seededMessage || hasSentInitialRef.current || existingDraft) {
      return;
    }

    hasSentInitialRef.current = true;
    if (startVoiceMode) {
      voiceSessionActiveRef.current = true;
      setIsVoiceSessionActive(true);
    }
    void requestAssistantTurn(seededMessage, latestMessagesRef.current, {
      speakResponse: startVoiceMode,
      continueVoiceSession: startVoiceMode,
    });
  }, [existingDraft, requestAssistantTurn, seededMessage, startVoiceMode]);

  const transcribeVoiceBlobToInput = useCallback(
    async (audioBlob: Blob) => {
      const fastTranscript =
        liveFinalTranscriptRef.current.trim() || liveTranscript.trim();
      const transcript = fastTranscript
        ? fastTranscript
        : (
            await transcribeAssistantVoice(audioBlob, transcriptionLanguageHint)
          ).transcript.trim();

      if (!transcript) {
        throw new Error(getRecordingErrorMessage("no-speech", t));
      }

      setInput((currentInput) =>
        [currentInput.trim(), transcript].filter(Boolean).join(" ")
      );
    },
    [liveTranscript, t, transcriptionLanguageHint]
  );

  const processVoiceAudioBlob = useCallback(
    async (
      audioBlob: Blob,
      options: { speakResponse: boolean; continueVoiceSession: boolean }
    ) => {
      if (!audioBlob.size) {
        setIsTranscribing(false);
        showTransientSpeechError(getRecordingErrorMessage("no-speech", t));
        if (voiceSessionActiveRef.current) {
          scheduleNextVoiceTurn();
        } else {
          setVoiceAvatarState("idle");
        }
        return;
      }

      try {
        // Browser speech recognition is only a live preview. It is tied to a
        // configured locale and can turn multilingual speech into incorrect
        // English text, so voice-first turns always use server transcription
        // with language auto-detection.
        const transcript = (
          await transcribeAssistantVoice(audioBlob, transcriptionLanguageHint)
        ).transcript.trim();

        if (!transcript) {
          showTransientSpeechError(getRecordingErrorMessage("no-speech", t));
          if (voiceSessionActiveRef.current) {
            scheduleNextVoiceTurn();
          } else {
            setVoiceAvatarState("idle");
          }
          return;
        }

        const voiceMessage = [input.trim(), transcript]
          .filter(Boolean)
          .join(" ");
        const nextMessages = [
          ...latestMessagesRef.current,
          {
            role: "user" as const,
            content: voiceMessage,
          },
        ];

        setSpeechError(null);
        setInput("");
        setMessages(nextMessages);

        // Voice state: speech was captured and the assistant response is starting.
        setVoiceAvatarState("aiSpeaking");
        void requestAssistantTurn(voiceMessage, nextMessages, options);
      } catch (recordingError) {
        if (captureConsentError(recordingError)) {
          setVoiceAvatarState("idle");
          setSpeechError(null);
          return;
        }

        if (isNoSpeechTranscriptionError(recordingError)) {
          showTransientSpeechError(getRecordingErrorMessage("no-speech", t));
          if (voiceSessionActiveRef.current) {
            scheduleNextVoiceTurn();
          } else {
            setVoiceAvatarState("idle");
          }
          return;
        }

        showTransientSpeechError(
          recordingError instanceof Error
            ? recordingError.message
            : getRecordingErrorMessage("network", t),
          4500
        );
        if (voiceSessionActiveRef.current) {
          scheduleNextVoiceTurn();
        } else {
          setVoiceAvatarState("idle");
        }
      } finally {
        setIsTranscribing(false);
        liveFinalTranscriptRef.current = "";
        setLiveTranscript("");
      }
    },
    [
      captureConsentError,
      input,
      liveTranscript,
      requestAssistantTurn,
      scheduleNextVoiceTurn,
      t,
      transcriptionLanguageHint,
    ]
  );

  useEffect(() => {
    if (
      existingDraft ||
      seededMessage ||
      hasHandledPendingVoiceHandoffRef.current
    ) {
      return;
    }

    const pendingAudio = consumeAssistantVoiceHandoff();

    if (!pendingAudio) {
      return;
    }

    hasHandledPendingVoiceHandoffRef.current = true;

    if (startVoiceMode) {
      voiceSessionActiveRef.current = true;
      setIsVoiceSessionActive(true);
    }

    setIsTranscribing(true);
    setVoiceAvatarState("listening");
    void processVoiceAudioBlob(pendingAudio, {
      speakResponse: startVoiceMode,
      continueVoiceSession: startVoiceMode,
    });
  }, [existingDraft, processVoiceAudioBlob, seededMessage, startVoiceMode]);

  const handleRecordedAudio = useCallback(
    async (mimeType: string, target: VoiceCaptureTarget) => {
      const audioBlob = new Blob(audioChunksRef.current, {
        type: mimeType || "audio/webm",
      });

      shouldProcessRecordingRef.current = false;
      audioChunksRef.current = [];
      cleanupRecording();

      if (target === "transcription") {
        try {
          if (!audioBlob.size) {
            showTransientSpeechError(getRecordingErrorMessage("no-speech", t));
            setVoiceAvatarState("idle");
            return;
          }

          if (recordingDecisionRef.current === "confirm") {
            setIsTranscribing(true);
            setVoiceAvatarState("listening");
            await transcribeVoiceBlobToInput(audioBlob);
          } else if (recordingDecisionRef.current !== "cancel") {
            setPendingVoiceReviewBlob(audioBlob);
            setSpeechError(null);
            setVoiceAvatarState("idle");
          }
        } catch (recordingError) {
          setVoiceAvatarState("idle");
          showTransientSpeechError(
            recordingError instanceof Error
              ? recordingError.message
              : getRecordingErrorMessage("network", t),
            4500
          );
        } finally {
          setIsTranscribing(false);
          setLiveTranscript("");
          setActiveVoiceCaptureTarget(null);
          recordingDecisionRef.current = null;
        }
        return;
      }

      await processVoiceAudioBlob(audioBlob, {
        speakResponse: true,
        continueVoiceSession: voiceSessionActiveRef.current,
      });
    },
    [cleanupRecording, processVoiceAudioBlob, t, transcribeVoiceBlobToInput]
  );

  const startVoiceRecording = useCallback(async (
    target: VoiceCaptureTarget = "conversation"
  ): Promise<boolean> => {
    if (
      (target === "conversation" && isSending) ||
      isTranscribing ||
      ((isGeneratingSpeech || isSpeaking) && speechPlaybackActiveRef.current)
    ) {
      return false;
    }

    if (
      !navigator.mediaDevices?.getUserMedia ||
      typeof MediaRecorder === "undefined"
    ) {
      setVoiceAvatarState("idle");
      showTransientSpeechError(
        t("dashboard.assistant.speechErrors.unsupported"),
        4500
      );
      return false;
    }

    try {
      await ensureConsent(consentRequirements.audioTranscription);
    } catch (consentCheckError) {
      if (captureConsentError(consentCheckError)) {
        setVoiceAvatarState("idle");
        return false;
      }

      showTransientSpeechError(
        consentCheckError instanceof Error
          ? consentCheckError.message
          : "Consent status could not be checked.",
        4500
      );
      setVoiceAvatarState("idle");
      return false;
    }

    setSpeechError(null);
    setLiveTranscript("");
    setIsTranscribing(false);
    setPendingVoiceReviewBlob(null);
    setActiveVoiceCaptureTarget(target);
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
          // Voice state: audio data arrived even if live recognition is unavailable.
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
        showTransientSpeechError(
          getRecordingErrorMessage("audio-capture", t),
          4500
        );
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

        // Voice state: user speech ended, keep the avatar active while transcribing.
        setVoiceAvatarState("listening");
        if (target === "conversation" || recordingDecisionRef.current === "confirm") {
          setIsTranscribing(true);
        }
        void handleRecordedAudio(
          mediaRecorder.mimeType || mimeType || "audio/webm",
          target
        );
      };

      mediaRecorder.start();
      // Voice state: microphone is open and waiting for the user to speak.
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
      return true;
    } catch (recordingError) {
      stopLiveTranscriptPreview();
      cleanupRecording();
      setActiveVoiceCaptureTarget(null);
      setVoiceAvatarState("idle");
      const errorCode =
        recordingError instanceof DOMException &&
        recordingError.name === "NotAllowedError"
          ? "not-allowed"
          : "audio-capture";
      showTransientSpeechError(getRecordingErrorMessage(errorCode, t), 4500);
      return false;
    }
  }, [
    cleanupRecording,
    clearAutoStopRecordingTimer,
    handleRecordedAudio,
    isGeneratingSpeech,
    isSending,
    isSpeaking,
    isTranscribing,
    startLiveTranscriptPreview,
    stopLiveTranscriptPreview,
    showTransientSpeechError,
    t,
  ]);

  startVoiceRecordingRef.current = startVoiceRecording;

  const startVoiceSession = useCallback(async () => {
    if (voiceSessionActiveRef.current) {
      return;
    }

    voiceSessionActiveRef.current = true;
    setIsVoiceSessionActive(true);
    setIsVoiceSessionMuted(false);
    shouldContinueAfterPlaybackRef.current = false;
    setSpeechError(null);
    setSpeechPlaybackError(null);

    const started = await startVoiceRecording("conversation");

    if (!started) {
      scheduleNextVoiceTurn(1);
    }
  }, [scheduleNextVoiceTurn, startVoiceRecording]);

  const stopVoiceSession = useCallback(() => {
    voiceSessionActiveRef.current = false;
    setIsVoiceSessionActive(false);
    setIsVoiceSessionMuted(false);
    shouldContinueAfterPlaybackRef.current = false;
    shouldProcessRecordingRef.current = false;
    clearAutoStopRecordingTimer();
    clearRestartListeningTimer();
    stopLiveTranscriptPreview();
    stopAssistantSpeech();

    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
      cleanupRecording();
    }

    audioChunksRef.current = [];
    setIsRecordingActive(false);
    setIsTranscribing(false);
    setActiveVoiceCaptureTarget(null);
    setPendingVoiceReviewBlob(null);
    setLiveTranscript("");
    setVoiceAvatarState("idle");
  }, [
    cleanupRecording,
    clearAutoStopRecordingTimer,
    clearRestartListeningTimer,
    stopAssistantSpeech,
    stopLiveTranscriptPreview,
  ]);

  const handleCancel = useCallback(() => {
    stopVoiceSession();
    clearAssistantConversationDraft({
      topic: initialTopic,
      incidentCategory: initialCategory,
    });
    clearAssistantTriageSource();

    if (typeof window !== "undefined") {
      const fallbackDashboardUrl = window.sessionStorage.getItem(
        LAST_NON_CONVERSATION_DASHBOARD_URL_STORAGE_KEY
      );
      const currentUrl = `${window.location.pathname}${window.location.search}`;

      if (
        fallbackDashboardUrl &&
        fallbackDashboardUrl !== currentUrl &&
        !fallbackDashboardUrl.includes("view=assistantconversation")
      ) {
        window.location.assign(fallbackDashboardUrl);
        return;
      }

      if (window.history.length > 1) {
        window.history.back();
        window.setTimeout(() => {
          const nextUrl = `${window.location.pathname}${window.location.search}`;

          if (nextUrl === currentUrl) {
            window.location.assign(assistantEntryHrefString);
          }
        }, 150);
        return;
      }

      window.location.assign(assistantEntryHrefString);
      return;
    }

    router.push(assistantEntryHrefString as Parameters<typeof router.push>[0]);
  }, [
    assistantEntryHrefString,
    initialCategory,
    initialTopic,
    router,
    stopVoiceSession,
  ]);

  const toggleVoiceSessionMute = useCallback(() => {
    if (!voiceSessionActiveRef.current) {
      return;
    }

    if (isVoiceSessionMuted) {
      setIsVoiceSessionMuted(false);
      setSpeechError(null);

      if (
        !isRecordingActive &&
        !isTranscribing &&
        !isGeneratingSpeech &&
        !isSpeaking
      ) {
        void startVoiceRecording("conversation");
      } else if (isGeneratingSpeech || isSpeaking) {
        setVoiceAvatarState("aiSpeaking");
      } else {
        setVoiceAvatarState("listening");
      }

      return;
    }

    setIsVoiceSessionMuted(true);
    shouldProcessRecordingRef.current = false;
    shouldContinueAfterPlaybackRef.current = false;
    clearAutoStopRecordingTimer();
    clearRestartListeningTimer();
    stopLiveTranscriptPreview();

    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
      cleanupRecording();
    }

    audioChunksRef.current = [];
    setIsRecordingActive(false);
    setIsTranscribing(false);
    setActiveVoiceCaptureTarget(null);
    setPendingVoiceReviewBlob(null);
    setLiveTranscript("");
    setVoiceAvatarState(isGeneratingSpeech || isSpeaking ? "aiSpeaking" : "idle");
  }, [
    cleanupRecording,
    clearAutoStopRecordingTimer,
    clearRestartListeningTimer,
    isGeneratingSpeech,
    isRecordingActive,
    isSpeaking,
    isTranscribing,
    isVoiceSessionMuted,
    startVoiceRecording,
    stopLiveTranscriptPreview,
  ]);

  const cancelTranscriptionCapture = useCallback(() => {
    recordingDecisionRef.current = "cancel";
    shouldProcessRecordingRef.current = false;
    clearAutoStopRecordingTimer();
    stopLiveTranscriptPreview();

    const mediaRecorder = mediaRecorderRef.current;

    if (mediaRecorder && mediaRecorder.state !== "inactive") {
      mediaRecorder.stop();
    } else {
      cleanupRecording();
    }

    audioChunksRef.current = [];
    setPendingVoiceReviewBlob(null);
    setActiveVoiceCaptureTarget(null);
    setIsRecordingActive(false);
    setIsTranscribing(false);
    setLiveTranscript("");
    setVoiceAvatarState("idle");
  }, [cleanupRecording, clearAutoStopRecordingTimer, stopLiveTranscriptPreview]);

  const confirmTranscriptionCapture = useCallback(async () => {
    if (activeVoiceCaptureTarget === "transcription" && isRecordingActive) {
      recordingDecisionRef.current = "confirm";
      stopLiveTranscriptPreview();
      mediaRecorderRef.current?.stop();
      return;
    }

    if (!pendingVoiceReviewBlob) {
      return;
    }

    setIsTranscribing(true);
    setSpeechError(null);
    setVoiceAvatarState("listening");

    try {
      await transcribeVoiceBlobToInput(pendingVoiceReviewBlob);
      setPendingVoiceReviewBlob(null);
      setVoiceAvatarState("idle");
    } catch (error) {
      setVoiceAvatarState("idle");
      showTransientSpeechError(
        error instanceof Error
          ? error.message
          : getRecordingErrorMessage("network", t),
        4500
      );
    } finally {
      setIsTranscribing(false);
    }
  }, [
    activeVoiceCaptureTarget,
    isRecordingActive,
    pendingVoiceReviewBlob,
    stopLiveTranscriptPreview,
    t,
    transcribeVoiceBlobToInput,
  ]);

  const toggleTranscriptionCapture = useCallback(() => {
    if (isVoiceSessionActive || isGeneratingSpeech || isSpeaking) {
      return;
    }

    if (activeVoiceCaptureTarget === "transcription" && isRecordingActive) {
      recordingDecisionRef.current = null;
      stopLiveTranscriptPreview();
      mediaRecorderRef.current?.stop();
      return;
    }

    if (isRecordingActive) {
      return;
    }

    void startVoiceRecording("transcription");
  }, [
    activeVoiceCaptureTarget,
    isGeneratingSpeech,
    isRecordingActive,
    isSpeaking,
    isVoiceSessionActive,
    startVoiceRecording,
    stopLiveTranscriptPreview,
  ]);

  useEffect(() => {
    if (
      !shouldAutoStartVoiceMode ||
      seededMessage ||
      hasStartedInitialVoiceModeRef.current
    ) {
      return;
    }

    hasStartedInitialVoiceModeRef.current = true;
    voiceSessionActiveRef.current = false;
    void startVoiceSession();
  }, [seededMessage, shouldAutoStartVoiceMode, startVoiceSession]);

  const handleAllowPendingConsent = async () => {
    const requirement = pendingConsentRequirement;

    try {
      await grantPendingConsent();
      setError(null);
      setSpeechError(null);

      if (
        requirement?.source === consentRequirements.audioTranscription.source
      ) {
        if (activeVoiceCaptureTarget === "transcription") {
          void startVoiceRecording("transcription");
        } else {
          void startVoiceSession();
        }
        return;
      }

      const pendingRequest = pendingAssistantRequestRef.current;
      pendingAssistantRequestRef.current = null;

      if (pendingRequest) {
        void requestAssistantTurn(
          pendingRequest.message,
          pendingRequest.conversation,
          {
            speakResponse: pendingRequest.speakResponse,
            continueVoiceSession: pendingRequest.continueVoiceSession,
          }
        );
        return;
      }

      if (isVoiceSessionActive && replayVoiceText) {
        void playAssistantSpeech(replayVoiceText, {
          continueVoiceSession: true,
          language: replayVoiceLanguage,
        });
      }
    } catch (consentError) {
      setVoiceAvatarState("idle");
      setError(
        consentError instanceof Error
          ? consentError.message
          : "Consent could not be saved."
      );
    }
  };

  const handleDeclinePendingConsent = () => {
    pendingAssistantRequestRef.current = null;
    revealPendingSpeechResponse();
    voiceSessionActiveRef.current = false;
    setIsVoiceSessionActive(false);
    setIsVoiceSessionMuted(false);
    shouldContinueAfterPlaybackRef.current = false;
    clearAutoStopRecordingTimer();
    clearRestartListeningTimer();
    setVoiceAvatarState("idle");
    clearPendingConsent();
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const message = input.trim();

    dismissSpeechError();
    setSpeechPlaybackError(null);
    setLiveTranscript("");
    liveFinalTranscriptRef.current = "";

    if (
      !message ||
      isSending ||
      isVoiceSessionActive ||
      isRecordingActive ||
      isTranscribing ||
      isGeneratingSpeech ||
      isSpeaking
    ) {
      return;
    }

    const nextMessages = [
      ...latestMessagesRef.current,
      {
        role: "user" as const,
        content: message,
      },
    ];

    setInput("");
    setMessages(nextMessages);
    void requestAssistantTurn(message, nextMessages);
  };

  const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (speechError) {
      dismissSpeechError();
    }
    setInput(event.target.value);
  };

  const conversationVoiceAvatarState: VoiceAvatarState =
    isSpeaking
      ? "aiSpeaking"
      : isGeneratingSpeech || isSending || isTranscribing
        ? "processing"
      : liveTranscript
        ? "userSpeaking"
        : isRecordingActive
          ? voiceAvatarState === "userSpeaking"
            ? "userSpeaking"
            : "listening"
          : "idle";
  const isTranscriptionCaptureActive =
    activeVoiceCaptureTarget === "transcription" && isRecordingActive;
  const shouldShowSendButton = input.trim().length > 0;
  const shouldShowVoiceAvatar = isVoiceSessionActive;

  return (
    <div
      data-testid="ai-conversation-page"
      className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4 flex flex-1 flex-col overflow-hidden pb-0"
    >
      <div className="mx-auto flex w-full max-w-[1320px] flex-col h-full min-h-0">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <div />
          <button
            type="button"
            onClick={handleCancel}
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </button>
        </div>

        <div className="mt-4 min-h-0 flex-1 flex flex-col">
          <div className="relative flex flex-1 flex-col bg-transparent px-2 pb-2 pt-2 h-full min-h-0 sm:px-3 xl:min-h-[520px]">
            {pendingConsentRequirement ? (
              <div className="relative z-30 mb-3 max-w-[560px]">
                <ConsentRequiredCard
                  requirement={pendingConsentRequirement}
                  isSubmitting={isGrantingConsent}
                  onAllow={() => {
                    void handleAllowPendingConsent();
                  }}
                  onDecline={handleDeclinePendingConsent}
                />
              </div>
            ) : null}
            <div className="relative min-h-0 flex-1 overflow-hidden">
              <div
                data-testid="ai-conversation-chat"
                className="conversation-scrollbar h-full overflow-y-auto"
              >
                <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-4 px-2 pb-4">
                  {messages.map((message, index) => {
                    const displayContent = getAssistantDisplayContent(message);
                    const lawPrefix =
                      message.role === "assistant"
                        ? buildAssistantLawPrefix(message)
                        : "";
                    const displayText = lawPrefix
                      ? `${lawPrefix}\n\n${displayContent}`
                      : displayContent;

                    return (
                      <div
                        key={
                          message.messageId ??
                          `${message.role}-${message.turnNumber ?? index}-${message.content.slice(0, 16)}`
                        }
                        data-testid={`ai-conversation-message-${message.role}`}
                        className={
                          message.role === "user" ? "flex justify-end" : ""
                        }
                      >
                        <div className="max-w-[min(88%,540px)]">
                          <div
                            className={`inline-flex max-w-full rounded-[20px] bg-white px-4 py-3 shadow-[0_8px_22px_rgba(148,163,184,0.12)] ${
                              message.role === "user"
                                ? "rounded-tr-[8px] whitespace-pre-wrap text-[14px] leading-[1.6] text-[#314256]"
                                : "rounded-tl-[8px] text-[#41566f]"
                            }`}
                          >
                            {message.role === "assistant" ? (
                              <AssistantMessageRenderer content={displayText} />
                            ) : (
                              displayText
                            )}
                          </div>
                          {message.role === "assistant" ? (
                            <>
                              <AssistantLegalCitationDetails
                                citations={message.responseMeta?.citations ?? []}
                                groundedLegalSource={message.responseMeta?.groundedLegalSource}
                                showDetails={Boolean(
                                  message.responseMeta?.showSources &&
                                    (message.responseMeta?.sourceDisplayReason === "legal_lookup" ||
                                      message.responseMeta?.sourceDisplayReason ===
                                        "explicit_citation_request")
                                )}
                              />
                              <AssistantResponseCitations
                                citations={message.responseMeta?.citations ?? []}
                                showSources={Boolean(
                                  message.responseMeta?.showSources
                                )}
                                answerText={displayContent}
                              />
                            </>
                          ) : null}
                        </div>
                      </div>
                    );
                  })}

                  {showTriageCta ? (
                    <div className="flex justify-center py-2">
                      <button
                        type="button"
                        onClick={() => {
                          saveAssistantTriageSource({
                            conversationSessionId: conversationSessionId ?? undefined,
                            conversation: conversationMessages,
                            timeline,
                            incidentCategory: initialCategory,
                          });
                          router.push(
                            getContinueReportSubmissionPath(
                              initialCategory,
                              conversationSessionId ?? undefined,
                              String(Date.now())
                            ) as Route
                          );
                        }}
                        data-testid="ai-conversation-triage-button"
                        className="inline-flex h-11 items-center justify-center gap-2 rounded-full bg-[#0f5d9f] px-6 text-[12px] font-bold text-white shadow-[0_12px_28px_rgba(15,93,159,0.26)] transition hover:bg-[#0b528d] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0f5d9f]"
                      >
                        Continue to Triage
                        <IconArrowRight size={14} />
                      </button>
                    </div>
                  ) : null}

                  {isSending ? (
                    <div className="inline-flex w-fit items-center rounded-[18px] rounded-tl-[8px] bg-white px-3 py-2 shadow-[0_8px_22px_rgba(148,163,184,0.12)]">
                      <span className="sr-only">Assistant is typing</span>
                      <div className="flex items-center gap-1" aria-hidden="true">
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#9fb3cb] [animation-delay:0ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#9fb3cb] [animation-delay:150ms]" />
                        <span className="h-2 w-2 animate-bounce rounded-full bg-[#9fb3cb] [animation-delay:300ms]" />
                      </div>
                    </div>
                  ) : null}

                  {error ? (
                    <div className="inline-flex max-w-[540px] items-center gap-2 rounded-[18px] bg-white px-4 py-2.5 text-[11px] text-[#c24141] shadow-[0_8px_22px_rgba(148,163,184,0.12)]">
                      <IconAlertCircle size={12} />
                      {error}
                    </div>
                  ) : null}

                  {speechError ? (
                    <div className="inline-flex max-w-[540px] items-center gap-2 rounded-[18px] bg-white px-4 py-2.5 text-[11px] text-[#c24141] shadow-[0_8px_22px_rgba(148,163,184,0.12)]">
                      <IconAlertCircle size={12} />
                      {speechError}
                    </div>
                  ) : null}

                  {isGeneratingSpeech || isSpeaking ? (
                    <div
                      className="inline-flex max-w-[540px] items-center gap-2 rounded-[18px] bg-white px-4 py-2.5 text-[11px] text-[#5f6f86] shadow-[0_8px_22px_rgba(148,163,184,0.12)]"
                      aria-live="polite"
                    >
                      {isGeneratingSpeech ? (
                        <IconLoader2 size={12} className="animate-spin" />
                      ) : (
                        <IconMicrophone size={12} />
                      )}
                      <span>
                        {isGeneratingSpeech
                          ? t("dashboard.assistant.generatingVoice")
                          : t("dashboard.assistant.speaking")}
                      </span>
                      {isSpeaking ? (
                        <button
                          type="button"
                          onClick={stopAssistantSpeech}
                          className="ml-1 rounded-full border border-[#d6e7f6] px-2 py-1 text-[10px] font-bold text-[#0f5d9f]"
                          aria-label={t("dashboard.assistant.stopVoicePlayback")}
                        >
                          {t("dashboard.assistant.stopVoicePlayback")}
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {speechPlaybackError ? (
                    <div
                      className="inline-flex max-w-[540px] items-center gap-2 rounded-[18px] bg-white px-4 py-2.5 text-[11px] text-[#c24141] shadow-[0_8px_22px_rgba(148,163,184,0.12)]"
                      aria-live="polite"
                    >
                      <IconAlertCircle size={12} />
                      <span>{speechPlaybackError}</span>
                      {replayVoiceText ? (
                        <button
                          type="button"
                          onClick={() => {
                            void playAssistantSpeech(replayVoiceText, {
                              continueVoiceSession: voiceSessionActiveRef.current,
                              language: replayVoiceLanguage,
                            });
                          }}
                          className="ml-1 rounded-full border border-[#d6e7f6] px-2 py-1 text-[10px] font-bold text-[#0f5d9f]"
                          aria-label={t(
                            "dashboard.assistant.replayVoiceResponse"
                          )}
                        >
                          {t("dashboard.assistant.replayVoiceResponse")}
                        </button>
                      ) : null}
                    </div>
                  ) : null}

                  {isRecordingActive || isTranscribing || liveTranscript ? (
                    <div className="inline-flex max-w-[540px] items-center gap-2 rounded-[18px] bg-white px-4 py-2.5 text-[11px] text-[#5f6f86] shadow-[0_8px_22px_rgba(148,163,184,0.12)]">
                      {isTranscribing ? (
                        <IconLoader2 size={12} className="animate-spin" />
                      ) : (
                        <IconMicrophone size={12} />
                      )}
                      {isTranscribing
                        ? t("dashboard.assistant.transcribing")
                        : liveTranscript || t("dashboard.assistant.listening")}
                    </div>
                  ) : null}
                  <div ref={messagesEndRef} aria-hidden="true" />
                </div>
              </div>
            </div>

            <form
              onSubmit={handleSubmit}
              className="w-full px-2 pb-2 pt-3 bg-transparent shrink-0 z-20"
            >
              <div className="mx-auto w-full max-w-[1120px] px-2">
                {shouldShowVoiceAvatar ? (
                  <VoiceAvatarAnimation
                    state={conversationVoiceAvatarState}
                    size="small"
                    alt={t("dashboard.assistant.sphereAlt")}
                    className="mx-auto mb-2"
                  />
                ) : null}
                {isTranscriptionCaptureActive || pendingVoiceReviewBlob ? (
                  <div className="flex items-center gap-2 rounded-[28px] border border-[#dbe6f2] bg-[#f8fbff]/96 px-4 py-2 shadow-[0_10px_30px_rgba(148,163,184,0.18)] backdrop-blur">
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
                    onClick={cancelTranscriptionCapture}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#dbe6f2] bg-white text-[#64748b] transition hover:bg-[#f4f7fb]"
                    aria-label={t("common.cancel")}
                  >
                    <IconX size={16} />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      void confirmTranscriptionCapture();
                    }}
                    className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#0f5d9f] text-white transition hover:bg-[#0c518a]"
                    aria-label="Use voice text"
                  >
                    <IconCheck size={16} />
                  </button>
                  </div>
                ) : (
                  <div className="flex items-center gap-2 rounded-[28px] border border-[#cfe0f1] bg-[#f4f9ff]/96 px-3 py-2 shadow-[0_10px_30px_rgba(148,163,184,0.14)] backdrop-blur">
                    <input
                      type="text"
                      value={input}
                      onChange={handleInputChange}
                      data-testid="ai-conversation-input"
                      placeholder={t("dashboard.assistant.typeYourResponse")}
                      className="h-10 flex-1 rounded-full border border-transparent bg-transparent px-3 text-sm text-[#1f2937] outline-none transition-[background-color,box-shadow,border-color] duration-150 placeholder:text-[#95a3b8] focus-visible:outline-none"
                    />
                    {!isVoiceSessionActive ? (
                      <button
                        type="button"
                        onClick={toggleTranscriptionCapture}
                        disabled={
                          isGeneratingSpeech ||
                          isSpeaking ||
                          isSending ||
                          isTranscribing
                        }
                        aria-label={t("dashboard.assistant.toggleMicrophone")}
                        className={`inline-flex h-10 w-10 items-center justify-center rounded-full text-[#64748b] transition hover:bg-[#f4f7fb] ${
                          isGeneratingSpeech ||
                          isSpeaking ||
                          isSending ||
                          isTranscribing
                            ? "cursor-not-allowed opacity-40"
                            : ""
                        }`}
                      >
                        <IconMicrophone size={18} />
                      </button>
                    ) : null}
                    {shouldShowSendButton ? (
                      <span className="inline-flex shrink-0 items-center rounded-full border border-[#d7e5f3] bg-[#fbfdff] p-1 shadow-[0_6px_18px_rgba(148,163,184,0.12)]">
                        <button
                          type="submit"
                          data-testid="ai-conversation-send"
                          disabled={
                            isSending ||
                            isVoiceSessionActive ||
                            isRecordingActive ||
                            isTranscribing ||
                            isGeneratingSpeech ||
                            isSpeaking ||
                            !input.trim()
                          }
                          aria-label={t("common.send")}
                          className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#0f5d9f] text-white shadow-[0_10px_24px_rgba(15,93,159,0.22)] transition hover:bg-[#0c518a] disabled:cursor-not-allowed disabled:opacity-45"
                        >
                          {isSending ? (
                            <IconLoader2 size={15} className="animate-spin" />
                          ) : (
                            <Image
                              src={sendIcon}
                              alt={t("common.send")}
                              width={11}
                              height={15}
                              className="h-[15px] w-[11px]"
                            />
                          )}
                        </button>
                      </span>
                    ) : isVoiceSessionActive ? (
                      <div className="inline-flex items-center gap-2 rounded-full border border-[#d7e5f3] bg-[#fbfdff] px-1.5 py-1 shadow-[0_6px_18px_rgba(148,163,184,0.12)]">
                        <button
                          type="button"
                          onClick={toggleVoiceSessionMute}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full transition ${
                            isVoiceSessionMuted
                              ? "bg-[#eef2f7] text-[#94a3b8]"
                              : "bg-[#196bb1] text-white"
                          }`}
                          aria-label={
                            isVoiceSessionMuted ? "Unmute voice mode" : "Mute voice mode"
                          }
                        >
                          {isVoiceSessionMuted ? (
                            <IconMicrophoneOff size={16} />
                          ) : (
                            <IconMicrophone size={16} />
                          )}
                        </button>
                        <button
                          type="button"
                          onClick={stopVoiceSession}
                          className="inline-flex h-8 shrink-0 items-center rounded-full bg-[#1f8cff] px-4 text-[11px] font-bold text-white transition hover:bg-[#137cf0]"
                          aria-label={t("dashboard.assistant.stopRecording")}
                        >
                          <span className="mr-2 inline-flex items-center gap-[2px]" aria-hidden="true">
                            <span className="h-[4px] w-[4px] rounded-full bg-white/90" />
                            <span className="h-[4px] w-[4px] rounded-full bg-white/90" />
                            <span className="h-[4px] w-[4px] rounded-full bg-white/90" />
                          </span>
                          End
                        </button>
                      </div>
                    ) : (
                      <span className="inline-flex items-center rounded-full border border-[#d7e5f3] bg-[#fbfdff] p-1 shadow-[0_6px_18px_rgba(148,163,184,0.12)]">
                        <button
                          type="button"
                          onClick={startVoiceSession}
                          disabled={isSending || isTranscribing}
                          className={`inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#196bb1] text-white transition hover:bg-[#196bb1] ${
                            isSending || isTranscribing
                              ? "cursor-not-allowed opacity-40"
                              : ""
                          }`}
                          aria-label="Start avatar voice mode"
                        >
                          <AvatarVoiceControlGlyph />
                        </button>
                      </span>
                    )}
                  </div>
                )}
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}

export { SafeSpeakAssistantConversationPage, SafeSpeakAssistantPage };
