"use client";

import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  IconAlertCircle,
  IconChevronRight,
  IconFileText,
  IconFileTypePdf,
  IconFolderFilled,
  IconMapPin,
  IconMicrophone,
  IconPhoto,
  IconPlayerPlayFilled,
  IconX,
} from "@tabler/icons-react";

import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import { getAssistantTriageSource } from "@/lib/assistant-triage";
import {
  ConsentRequiredError,
  type ConsentRequirement,
  consentRequirements,
  getConsentGrantFlags,
  getCurrentConsent,
  grantConsent,
} from "@/lib/consent";
import {
  getConversationFlowSession,
  type ConversationFlowFactExtraction,
  type ConversationFlowMessage,
} from "@/lib/conversation-flow";
import {
  type DashboardCardFlowId,
  getDashboardCardFlow,
} from "@/lib/dashboard-card-flows";
import {
  type EvidenceAuditChainEntry,
  type EvidenceHashVerification,
  type EvidenceMetadata,
  type EvidenceRecord,
  completeEvidenceUpload,
  deleteEvidence,
  getEvidence,
  getEvidenceAuditChain,
  getEvidenceMetadata,
  getEvidenceTranscription,
  listReportEvidence,
  requestEvidenceUploadUrl,
  resolveEvidenceId,
  transcribeEvidence,
  verifyEvidenceHash,
} from "@/lib/evidence-client";
import { getReportFlowDraft, mergeReportFlowDraft } from "@/lib/report-flow";
import {
  getMockReportId,
  REPORT_SUBMISSION_MOCK_MODE,
} from "@/lib/report-submission-mock";
import {
  createOrUpdateReportFromConversation,
  type ReportCreateInput,
  createReport,
  getReport,
  updateReport,
} from "@/lib/reports-client";
import { cn } from "@/lib/utils";

import { ReportSubmissionFrame } from "./report-submission-frame";

type EvidenceKind = "image" | "video" | "audio" | "document";

type EvidenceItem = {
  id: string;
  backendEvidenceId?: string;
  name: string;
  sizeLabel: string;
  kind: EvidenceKind;
  sha256Hash: string;
  uploadedAt: string;
  transcript?: string;
  transcriptionStatus?: "available" | "not_found" | "not_requested";
  metadata?: EvidenceMetadata | null;
  auditChain?: EvidenceAuditChainEntry[];
  verification?: EvidenceHashVerification | null;
  backendStatus?: string;
  storageProvider?: string;
  mimeType?: string;
  sizeBytes?: number;
  previewUrl?: string;
  deletionRequestedAt?: string;
  deletedAt?: string;
  detailError?: string;
  status: "attached" | "restored" | "synced" | "deleted";
};

type EvidenceAuditEntry = {
  id: string;
  action: "attached" | "removed" | "draft-saved" | "restored";
  detail: string;
  timestamp: string;
};

type CapturedConversationReportFields = {
  who?: string;
  what?: string;
  when?: string;
  where?: string;
  how?: string;
  witnesses?: string;
  injuries?: string;
  repeatedIncidents?: boolean;
};

const DRAFT_STORAGE_KEY = "safespeak_report_evidence_draft";

function formatFileSize(bytes: number): string {
  if (bytes < 1024 * 1024) {
    return `${Math.max(1, Math.round(bytes / 1024))} KB`;
  }

  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function formatOptionalFileSize(bytes?: number): string {
  return bytes ? formatFileSize(bytes) : "Unknown size";
}

function inferEvidenceKind(file: File): EvidenceKind {
  if (file.type.startsWith("image/")) {
    return "image";
  }

  if (file.type.startsWith("video/")) {
    return "video";
  }

  if (file.type.startsWith("audio/")) {
    return "audio";
  }

  return "document";
}

function inferIncidentTypeFromNarrative(narrative: string): string | undefined {
  const normalizedNarrative = narrative.toLowerCase();
  const domesticViolenceTerms = [
    "wife",
    "husband",
    "partner",
    "spouse",
    "girlfriend",
    "boyfriend",
    "domestic",
    "family violence",
    "hit me",
    "slapped me",
    "pushed me",
    "unsafe at home",
  ];

  return domesticViolenceTerms.some((term) =>
    normalizedNarrative.includes(term)
  )
    ? "domestic_violence"
    : undefined;
}

function firstNonEmptyString(...values: Array<unknown>): string | undefined {
  for (const value of values) {
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return undefined;
}

function inferRepeatedIncidents(
  factExtraction?: ConversationFlowFactExtraction | null,
  fallbackNarrative?: string
): boolean | undefined {
  const timelineValue = factExtraction?.timeline?.repeatedIncidents;

  if (typeof timelineValue === "boolean") {
    return timelineValue;
  }

  if (typeof timelineValue === "string") {
    const normalized = timelineValue.trim().toLowerCase();

    if (["yes", "true", "ongoing", "repeated"].includes(normalized)) {
      return true;
    }

    if (["no", "false", "once", "single"].includes(normalized)) {
      return false;
    }
  }

  if ((factExtraction?.extractedEvents?.length ?? 0) > 1) {
    return true;
  }

  const combinedText = [fallbackNarrative, factExtraction?.whatHappened]
    .filter((value): value is string => typeof value === "string" && value.trim().length > 0)
    .join(" ")
    .toLowerCase();

  if (!combinedText) {
    return undefined;
  }

  if (/\b(again|ongoing|repeated|multiple times|keeps happening|every day|every night)\b/.test(combinedText)) {
    return true;
  }

  return undefined;
}

function buildNarrativeFromConversationMessages(
  messages: ConversationFlowMessage[]
): string | undefined {
  const userNarrative = messages
    .filter((message) => message.role === "user")
    .map((message) => message.content.trim())
    .filter(Boolean)
    .join("\n\n");

  return userNarrative || undefined;
}

function extractConversationReportFields(input: {
  factExtraction?: ConversationFlowFactExtraction | null;
  messages: ConversationFlowMessage[];
}): {
  fields: CapturedConversationReportFields;
  narrative?: string;
} {
  const factExtraction = input.factExtraction;
  const timeline = factExtraction?.timeline ?? {};
  const narrative = firstNonEmptyString(
    timeline.what,
    factExtraction?.whatHappened,
    buildNarrativeFromConversationMessages(input.messages)
  );

  return {
    narrative,
    fields: {
      who: firstNonEmptyString(timeline.who, factExtraction?.peopleInvolved),
      what: narrative,
      when: firstNonEmptyString(timeline.when, factExtraction?.whenHappened),
      where: firstNonEmptyString(timeline.where, factExtraction?.whereHappened),
      how: firstNonEmptyString(timeline.how),
      witnesses: firstNonEmptyString(timeline.witnesses),
      injuries: firstNonEmptyString(timeline.injuries),
      repeatedIncidents: inferRepeatedIncidents(factExtraction, narrative),
    },
  };
}

async function computeSha256Hash(file: File): Promise<string> {
  if (typeof crypto === "undefined" || !crypto.subtle) {
    return "hash-unavailable";
  }

  const buffer = await file.arrayBuffer();
  const digest = await crypto.subtle.digest("SHA-256", buffer);

  return Array.from(new Uint8Array(digest))
    .map((value) => value.toString(16).padStart(2, "0"))
    .join("");
}

function formatEvidenceTimestamp(timestamp: string): string {
  return new Date(timestamp).toLocaleString([], {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function formatMetadataDate(timestamp?: string): string {
  return timestamp ? formatEvidenceTimestamp(timestamp) : "Not recorded";
}

function formatStatusLabel(value?: string): string {
  if (!value) {
    return "Not available";
  }

  return value.replace(/[_-]+/g, " ");
}

function isAudioOrVideoEvidence(item: EvidenceItem): boolean {
  return item.kind === "audio" || item.kind === "video";
}

function getTranscriptText(
  result: Awaited<ReturnType<typeof getEvidenceTranscription>> | null
): string | undefined {
  return result?.transcription?.text ?? result?.transcript;
}

function inferEvidenceKindFromRecord(evidence: EvidenceRecord): EvidenceKind {
  const mimeType = evidence.mimeType ?? "";
  const type = evidence.type ?? "";

  if (mimeType.startsWith("image/") || type === "image") {
    return "image";
  }

  if (mimeType.startsWith("video/") || type === "video") {
    return "video";
  }

  if (mimeType.startsWith("audio/") || type === "audio") {
    return "audio";
  }

  return "document";
}

function evidenceRecordToItem(evidence: EvidenceRecord): EvidenceItem {
  const evidenceId = resolveEvidenceId(evidence);
  const uploadedAt =
    evidence.createdAt ?? evidence.updatedAt ?? new Date().toISOString();

  return {
    id: evidenceId || `${evidence.fileName ?? "evidence"}-${uploadedAt}`,
    backendEvidenceId: evidenceId,
    name: evidence.fileName ?? "Evidence file",
    sizeLabel: formatOptionalFileSize(evidence.size),
    kind: inferEvidenceKindFromRecord(evidence),
    sha256Hash: evidence.sha256Hash ?? "hash-unavailable",
    uploadedAt,
    backendStatus: evidence.status,
    storageProvider: evidence.storageProvider,
    mimeType: evidence.mimeType,
    sizeBytes: evidence.size,
    deletionRequestedAt: evidence.deletionRequestedAt,
    deletedAt: evidence.deletedAt,
    transcript: getTranscriptText(
      evidence.transcription ? { transcription: evidence.transcription } : null
    ),
    transcriptionStatus: evidence.transcription ? "available" : undefined,
    status: evidence.deletedAt
      ? "deleted"
      : evidence.status === "synced" || evidence.status === "local_only"
        ? "synced"
        : "attached",
  };
}

function createAuditEntry(
  action: EvidenceAuditEntry["action"],
  detail: string,
  timestamp = new Date().toISOString()
): EvidenceAuditEntry {
  return {
    id: `${action}-${timestamp}-${Math.random().toString(36).slice(2, 8)}`,
    action,
    detail,
    timestamp,
  };
}

async function loadEvidenceDetailPatch(
  evidenceId: string,
  item: Pick<EvidenceItem, "kind">
): Promise<Partial<EvidenceItem>> {
  const [evidence, metadata, auditChain] = await Promise.all([
    getEvidence(evidenceId),
    getEvidenceMetadata(evidenceId),
    getEvidenceAuditChain(evidenceId),
  ]);
  let transcriptionResult: Awaited<
    ReturnType<typeof getEvidenceTranscription>
  > | null = null;
  let transcriptionStatus: EvidenceItem["transcriptionStatus"] =
    item.kind === "audio" || item.kind === "video"
      ? "not_requested"
      : undefined;

  if (item.kind === "audio" || item.kind === "video") {
    try {
      transcriptionResult = await getEvidenceTranscription(evidenceId);
      transcriptionStatus = "available";
    } catch {
      transcriptionStatus = "not_found";
    }
  }

  return {
    backendEvidenceId: resolveEvidenceId(evidence) || evidenceId,
    metadata,
    auditChain,
    transcript: getTranscriptText(transcriptionResult),
    transcriptionStatus,
    backendStatus: evidence.status ?? metadata.status,
    storageProvider: evidence.storageProvider ?? metadata.storageProvider,
    mimeType: evidence.mimeType ?? metadata.mimeType,
    sizeBytes: evidence.size ?? metadata.size,
    deletionRequestedAt:
      evidence.deletionRequestedAt ?? metadata.deletionRequestedAt,
    deletedAt: evidence.deletedAt ?? metadata.deletedAt,
    detailError: undefined,
  };
}

function EvidenceVaultCard({
  item,
  onRemove,
  onRefresh,
  onVerify,
  onTranscribe,
  isBusy,
}: {
  item: EvidenceItem;
  onRemove: (item: EvidenceItem) => void;
  onRefresh: (item: EvidenceItem) => void;
  onVerify: (item: EvidenceItem) => void;
  onTranscribe: (item: EvidenceItem) => void;
  isBusy?: boolean;
}) {
  const isDeleted = item.status === "deleted" || Boolean(item.deletedAt);
  const statusText = isDeleted
    ? "Deleted"
    : item.status === "synced"
      ? "Uploaded"
      : item.status === "restored"
          ? "Re-upload needed"
          : "Attached";
  const canUseBackendActions = Boolean(item.backendEvidenceId) && !isDeleted;

  if (item.kind === "image") {
    return (
      <article className="group relative min-h-[148px] overflow-hidden rounded-[20px] bg-[#0f172a] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
        {item.previewUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={item.previewUrl}
            alt={item.name}
            className="absolute inset-0 h-full w-full object-cover opacity-90 transition group-hover:scale-105"
          />
        ) : (
          <>
            <div className="absolute inset-0 opacity-90 [background:linear-gradient(180deg,#7fb5dd_0%,#d8edf8_37%,#263d26_38%,#0e1724_45%,#30343b_100%)]" />
            <div className="absolute inset-x-[43%] bottom-0 top-[46%] bg-[#2b3036]" />
            <div className="absolute bottom-0 left-[49.5%] top-[48%] w-1 bg-[#f7d552]" />
          </>
        )}
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.75)_0%,rgba(0,0,0,0.2)_50%,rgba(0,0,0,0)_100%)]" />
        <button
          type="button"
          onClick={() => onRemove(item)}
          disabled={isBusy}
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
          aria-label={`Remove ${item.name}`}
        >
          <IconX size={12} />
        </button>
        <div className="absolute bottom-2.5 left-2.5 right-2.5 flex items-center justify-between gap-2 text-white">
          <span className="inline-flex min-w-0 items-center gap-1">
            <IconPhoto size={12} className="opacity-80" />
            <span className="truncate text-[11px] font-medium opacity-90">
              {item.name}
            </span>
          </span>
          <span className="shrink-0 text-[10px] opacity-70">{item.sizeLabel}</span>
        </div>
      </article>
    );
  }

  if (item.kind === "video") {
    return (
      <article className="relative min-h-[148px] overflow-hidden rounded-[20px] bg-[#111827] shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)]">
        {item.previewUrl ? (
          <video
            src={item.previewUrl}
            className="absolute inset-0 h-full w-full object-cover opacity-80"
            muted
          />
        ) : (
          <div className="absolute inset-0 opacity-80 blur-[1px] [background:linear-gradient(90deg,#17261b_0%,#3f5935_26%,#0f2416_50%,#65755c_72%,#1a2b1d_100%)]" />
        )}
        <div className="absolute inset-0 grid place-items-center">
          <button
            type="button"
            onClick={() =>
              canUseBackendActions ? onTranscribe(item) : undefined
            }
            disabled={!canUseBackendActions || isBusy}
            className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-white/20 text-white backdrop-blur-sm transition hover:scale-105 hover:bg-white/30"
            aria-label={`Process ${item.name}`}
          >
            <IconPlayerPlayFilled size={16} />
          </button>
        </div>
        <button
          type="button"
          onClick={() => onRemove(item)}
          disabled={isBusy}
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
          aria-label={`Remove ${item.name}`}
        >
          <IconX size={12} />
        </button>
        <div className="absolute bottom-2.5 left-2.5 max-w-[65%] truncate text-[11px] font-medium text-white">
          {item.name}
        </div>
        <span className="absolute bottom-2.5 right-2.5 rounded-full bg-black/60 px-1.5 py-0.5 text-[9px] font-medium text-white">
          {statusText}
        </span>
      </article>
    );
  }

  if (item.kind === "audio") {
    return (
      <article className="relative flex min-h-[148px] flex-col justify-center rounded-[20px] border-2 border-dashed border-[#FDBA74] bg-white px-3 py-4 shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
        <button
          type="button"
          onClick={() => onRemove(item)}
          disabled={isBusy}
          className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center text-[#94A3B8] transition hover:text-[#475569]"
          aria-label={`Remove ${item.name}`}
        >
          <IconX size={14} />
        </button>
        <div className="mx-auto w-full max-w-[220px]">
          <div className="flex items-center gap-2">
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#FFEDD5] text-[#EA580C]">
              <IconMicrophone size={14} />
            </span>
            <span className="min-w-0">
              <span className="block truncate text-xs font-semibold text-[#1E293B]">
                {item.name}
              </span>
              <span className="block text-[10px] font-medium text-[#F97316]">
                {isBusy ? "Processing..." : statusText}
              </span>
            </span>
          </div>
          <div className="mt-2.5 h-1.5 rounded-full bg-[#F1F5F9]">
            <div
              className={cn(
                "h-1.5 rounded-full bg-[#FF8F00]",
                isBusy ? "w-1/2" : "w-full"
              )}
            />
          </div>
          <div className="mt-2 flex items-center justify-between gap-2 text-[10px] text-[#64748B]">
            <span>{item.sizeLabel}</span>
            <button
              type="button"
              onClick={() => onTranscribe(item)}
              disabled={!canUseBackendActions || isBusy}
              className="font-bold text-[#0F5D9F] hover:underline disabled:text-[#94A3B8] disabled:no-underline"
            >
              Transcribe
            </button>
          </div>
        </div>
      </article>
    );
  }

  return (
    <article className="relative grid min-h-[148px] place-items-center rounded-[20px] border border-[#E2E8F0] bg-white p-4 text-center shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
      <button
        type="button"
        onClick={() => onRemove(item)}
        disabled={isBusy}
        className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center text-[#94A3B8] transition hover:text-[#475569]"
        aria-label={`Remove ${item.name}`}
      >
        <IconX size={14} />
      </button>
      <div>
        <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#FFF7ED] text-[#F97316]">
          {item.name.toLowerCase().endsWith(".pdf") ? (
            <IconFileTypePdf size={18} />
          ) : (
            <IconFileText size={18} />
          )}
        </span>
        <p className="mt-1.5 max-w-[150px] truncate text-xs font-semibold text-[#1E293B]">
          {item.name}
        </p>
        <p className="mt-0.5 text-[10px] text-[#94A3B8]">{item.sizeLabel}</p>
        <div className="mt-2.5 flex justify-center gap-2.5 text-[10px]">
          <button
            type="button"
            onClick={() => onRefresh(item)}
            disabled={!canUseBackendActions || isBusy}
            className="font-bold text-[#0F5D9F] hover:underline disabled:text-[#94A3B8] disabled:no-underline"
          >
            Details
          </button>
          <button
            type="button"
            onClick={() => onVerify(item)}
            disabled={!canUseBackendActions || isBusy}
            className="font-bold text-[#0F5D9F] hover:underline disabled:text-[#94A3B8] disabled:no-underline"
          >
            Verify
          </button>
        </div>
      </div>
    </article>
  );
}

function ReportSubmissionEvidencePage({
  initialCategory,
  initialTopic,
  initialMessage,
}: {
  initialCategory?: AssistantIncidentCategory;
  initialTopic?: DashboardCardFlowId;
  initialMessage?: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const fileInputRef = useRef<HTMLInputElement | null>(null);
  const shouldContinueToReviewAfterConsentRef = useRef(false);
  const hydratedConversationSessionIdRef = useRef<string | null>(null);
  const [reportDraft, setReportDraft] = useState(() => getReportFlowDraft());
  const fromTriage = searchParams.get("fromTriage") === "1";
  const conversationSessionId = searchParams.get("conversationSessionId");
  const contextFlow = useMemo(
    () => (initialTopic ? getDashboardCardFlow(initialTopic) : null),
    [initialTopic]
  );
  const assistantSource = useMemo(() => getAssistantTriageSource(), []);
  const backHref = useMemo(() => {
    if (!fromTriage) {
      return undefined;
    }

    return (conversationSessionId
      ? `/dashboard?view=reportsubmissionsupport&conversationSessionId=${conversationSessionId}`
      : "/dashboard?view=reportsubmissionsupport") as Route;
  }, [conversationSessionId, fromTriage]);
  const defaultIncidentTitle =
    reportDraft?.title ||
    (initialCategory && contextFlow
      ? `${contextFlow.title} incident report`
      : "Incident report");
  const defaultIncidentDate =
    reportDraft?.date || new Date().toISOString().slice(0, 10);
  const defaultIncidentLocation =
    reportDraft?.location || assistantSource?.timeline.where || "";
  const defaultNarrative =
    reportDraft?.summary ||
    initialMessage?.trim() ||
    assistantSource?.timeline.what ||
    "";
  const [title, setTitle] = useState(defaultIncidentTitle);
  const [date, setDate] = useState(defaultIncidentDate);
  const [location, setLocation] = useState(defaultIncidentLocation);
  const [description, setDescription] = useState("");
  const [supportMessage, setSupportMessage] = useState("");
  const [attachedFiles, setAttachedFiles] = useState<EvidenceItem[]>([]);
  const [auditTrail, setAuditTrail] = useState<EvidenceAuditEntry[]>([]);
  const [draftSavedAt, setDraftSavedAt] = useState<string | null>(null);
  const [restoredDraftNotice, setRestoredDraftNotice] = useState<string | null>(
    null
  );
  const [isHashingEvidence, setIsHashingEvidence] = useState(false);
  const [isUploadingEvidence, setIsUploadingEvidence] = useState(false);
  const [isPersistingReport, setIsPersistingReport] = useState(false);
  const [evidenceError, setEvidenceError] = useState<string | null>(null);
  const [pendingConsentRequirement, setPendingConsentRequirement] =
    useState<ConsentRequirement | null>(null);
  const [pendingFiles, setPendingFiles] = useState<File[]>([]);
  const [pendingTranscriptionItem, setPendingTranscriptionItem] =
    useState<EvidenceItem | null>(null);
  const [isGrantingConsent, setIsGrantingConsent] = useState(false);
  const [isTranscribingEvidenceId, setIsTranscribingEvidenceId] = useState<
    string | null
  >(null);
  const [loadingEvidenceDetailId, setLoadingEvidenceDetailId] = useState<
    string | null
  >(null);
  const [verifyingEvidenceId, setVerifyingEvidenceId] = useState<string | null>(
    null
  );
  const [deletingEvidenceId, setDeletingEvidenceId] = useState<string | null>(
    null
  );

  const mergeDraft = (
    partialDraft: Parameters<typeof mergeReportFlowDraft>[0]
  ) => {
    const nextDraft = mergeReportFlowDraft(partialDraft);

    setReportDraft(nextDraft);

    return nextDraft;
  };

  useEffect(() => {
    setDescription((currentDescription) => currentDescription || defaultNarrative);
  }, [defaultNarrative]);

  useEffect(() => {
    if (!fromTriage || !conversationSessionId) {
      return;
    }

    if (hydratedConversationSessionIdRef.current === conversationSessionId) {
      return;
    }

    let isActive = true;

    void (async () => {
      try {
        const existingDraft = getReportFlowDraft();
        const reportBootstrap = await createOrUpdateReportFromConversation({
          conversationSessionId,
          reportId: existingDraft?.reportId,
        }).catch(() => null);
        const sessionEnvelope = await getConversationFlowSession(
          conversationSessionId
        );

        if (!isActive) {
          return;
        }

        const captured = extractConversationReportFields({
          factExtraction: sessionEnvelope.factExtraction,
          messages: sessionEnvelope.messages,
        });

        const mergedStructuredFields = {
          ...(reportBootstrap?.prefill.structuredFields ?? {}),
          ...(reportDraft?.structuredFields ?? {}),
          ...(captured.fields.who ? { who: captured.fields.who } : {}),
          ...(captured.fields.what ? { what: captured.fields.what } : {}),
          ...(captured.fields.when ? { when: captured.fields.when } : {}),
          ...(captured.fields.where ? { where: captured.fields.where } : {}),
          ...(captured.fields.how ? { how: captured.fields.how } : {}),
          ...(captured.fields.witnesses
            ? { witnesses: captured.fields.witnesses }
            : {}),
          ...(captured.fields.injuries ? { injuries: captured.fields.injuries } : {}),
          ...(typeof captured.fields.repeatedIncidents === "boolean"
            ? { repeatedIncidents: captured.fields.repeatedIncidents }
            : {}),
        };

        setLocation((currentLocation) => currentLocation || captured.fields.where || "");
        setDescription(
          (currentDescription) => currentDescription || captured.narrative || ""
        );
        setDate((currentDate) => {
          if (!captured.fields.when) {
            return currentDate;
          }

          const isDefaultToday =
            currentDate === new Date().toISOString().slice(0, 10) &&
            !reportDraft?.date;

          return !currentDate || isDefaultToday ? captured.fields.when : currentDate;
        });

        setReportDraft(
          mergeReportFlowDraft({
            reportId:
              reportBootstrap?.report._id ??
              reportDraft?.reportId ??
              existingDraft?.reportId,
            title:
              reportDraft?.title ||
              reportBootstrap?.prefill.title ||
              (initialCategory && contextFlow
                ? `${contextFlow.title} incident report`
                : "Incident report"),
            date:
              reportDraft?.date ||
              reportBootstrap?.prefill.date ||
              captured.fields.when ||
              new Date().toISOString().slice(0, 10),
            location:
              reportDraft?.location ||
              reportBootstrap?.prefill.location ||
              captured.fields.where ||
              "",
            summary:
              reportDraft?.summary ||
              reportBootstrap?.prefill.summary ||
              captured.narrative ||
              initialMessage?.trim() ||
              "",
            structuredFields: mergedStructuredFields,
            incidentCategory: initialCategory ?? reportDraft?.incidentCategory,
            incidentType: reportDraft?.incidentType ?? initialCategory,
            topic: initialTopic ?? reportDraft?.topic,
            starterPrompt: initialMessage?.trim() ?? reportDraft?.starterPrompt,
            evidenceIds: reportDraft?.evidenceIds ?? [],
          })
        );

        hydratedConversationSessionIdRef.current = conversationSessionId;
      } catch {
        // Keep the existing assistant snapshot fallback when the live session cannot be loaded.
      }
    })();

    return () => {
      isActive = false;
    };
  }, [
    contextFlow,
    conversationSessionId,
    fromTriage,
    initialCategory,
    initialMessage,
    initialTopic,
    reportDraft,
  ]);

  useEffect(() => {
    const latestDraft = getReportFlowDraft();

    setReportDraft(
      mergeReportFlowDraft({
        reportId: latestDraft?.reportId,
        title,
        date,
        location,
        summary: description,
        structuredFields: {
          ...(latestDraft?.structuredFields ?? {}),
          who:
            (latestDraft?.structuredFields?.who as string | undefined) ??
            assistantSource?.timeline.who,
          how:
            (latestDraft?.structuredFields?.how as string | undefined) ??
            assistantSource?.timeline.how,
          witnesses:
            (latestDraft?.structuredFields?.witnesses as string | undefined) ??
            assistantSource?.timeline.witnesses,
          injuries:
            (latestDraft?.structuredFields?.injuries as string | undefined) ??
            assistantSource?.timeline.injuries,
          what: description,
          when: date,
          where: location,
        },
        incidentCategory: initialCategory ?? latestDraft?.incidentCategory,
        incidentType: latestDraft?.incidentType ?? initialCategory,
        topic: initialTopic ?? latestDraft?.topic,
        starterPrompt: initialMessage?.trim() ?? latestDraft?.starterPrompt,
        evidenceIds: latestDraft?.evidenceIds ?? [],
      })
    );
  }, [
    assistantSource?.timeline.how,
    assistantSource?.timeline.injuries,
    assistantSource?.timeline.witnesses,
    assistantSource?.timeline.who,
    date,
    description,
    initialCategory,
    initialMessage,
    initialTopic,
    location,
    title,
  ]);

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const savedDraft = window.localStorage.getItem(DRAFT_STORAGE_KEY);

    if (!savedDraft) {
      return;
    }

    try {
      const parsed = JSON.parse(savedDraft) as {
        description?: string;
        supportMessage?: string;
        attachments?: Array<
          Pick<
            EvidenceItem,
            | "backendEvidenceId"
            | "name"
            | "sizeLabel"
            | "kind"
            | "sha256Hash"
            | "uploadedAt"
            | "backendStatus"
            | "storageProvider"
            | "mimeType"
            | "sizeBytes"
            | "deletionRequestedAt"
            | "deletedAt"
          >
        >;
        auditTrail?: EvidenceAuditEntry[];
        savedAt?: string;
      };

      setTitle((currentTitle) => currentTitle || defaultIncidentTitle);
      setDate((currentDate) => currentDate || defaultIncidentDate);
      setLocation((currentLocation) => currentLocation || defaultIncidentLocation);
      setDescription(parsed.description ?? defaultNarrative);
      setSupportMessage(parsed.supportMessage ?? "");
      setDraftSavedAt(
        parsed.savedAt
          ? new Date(parsed.savedAt).toLocaleTimeString([], {
              hour: "numeric",
              minute: "2-digit",
            })
          : null
      );

      if (parsed.attachments?.length) {
        setAttachedFiles([]);
        setAuditTrail(
          parsed.auditTrail?.length
            ? parsed.auditTrail
            : [
                createAuditEntry(
                  "restored",
                  "Draft text was restored. Evidence files must be uploaded again before review."
                ),
              ]
        );
        setRestoredDraftNotice(
          "Draft text was restored from this browser. Re-upload any evidence files before continuing."
        );
      }
    } catch {
      window.localStorage.removeItem(DRAFT_STORAGE_KEY);
    }
  }, [
    defaultIncidentDate,
    defaultIncidentLocation,
    defaultIncidentTitle,
    defaultNarrative,
  ]);

  useEffect(() => {
    const reportId = reportDraft?.reportId;

    if (!reportId || REPORT_SUBMISSION_MOCK_MODE) {
      return;
    }

    let isActive = true;

    void (async () => {
      try {
        const [report, evidenceRecords] = await Promise.all([
          getReport(reportId),
          listReportEvidence(reportId),
        ]);

        if (!isActive) {
          return;
        }

        const structuredFields = report.structuredFields ?? {};
        const nextDescription =
          report.originalNarrative ||
          (typeof structuredFields.what === "string"
            ? structuredFields.what
            : "") ||
          reportDraft.summary ||
          "";
        const nextSupportMessage =
          typeof structuredFields.supportMessage === "string"
            ? structuredFields.supportMessage
            : "";

        setDescription(
          (currentDescription) => currentDescription || nextDescription
        );
        setTitle((currentTitle) => currentTitle || reportDraft?.title || defaultIncidentTitle);
        setDate((currentDate) => currentDate || reportDraft?.date || defaultIncidentDate);
        setLocation(
          (currentLocation) =>
            currentLocation ||
            reportDraft?.location ||
            (typeof structuredFields.where === "string" ? structuredFields.where : "") ||
            defaultIncidentLocation
        );
        setSupportMessage(
          (currentSupportMessage) => currentSupportMessage || nextSupportMessage
        );

        if (evidenceRecords.length) {
          setAttachedFiles((currentItems) => {
            const backendItems = evidenceRecords.map(evidenceRecordToItem);
            const backendById = new Map(
              backendItems
                .filter((item) => Boolean(item.backendEvidenceId))
                .map((item) => [item.backendEvidenceId, item])
            );
            const refreshedCurrentItems = currentItems.map((item) => {
              const backendItem = item.backendEvidenceId
                ? backendById.get(item.backendEvidenceId)
                : undefined;

              if (!backendItem) {
                return item;
              }

              return {
                ...backendItem,
                id: item.id,
                previewUrl: item.previewUrl,
              };
            });
            const currentIds = new Set(
              refreshedCurrentItems
                .map((item) => item.backendEvidenceId)
                .filter((item): item is string => Boolean(item))
            );
            const newBackendItems = backendItems.filter(
              (item) => !currentIds.has(item.backendEvidenceId ?? "")
            );

            return [...refreshedCurrentItems, ...newBackendItems];
          });
          mergeDraft({
            evidenceIds: [
              ...new Set([
                ...(reportDraft.evidenceIds ?? []),
                ...evidenceRecords
                  .map(resolveEvidenceId)
                  .filter((item): item is string => Boolean(item)),
              ]),
            ],
          });
        }
      } catch (error) {
        if (isActive) {
          setEvidenceError(
            error instanceof Error
              ? error.message
              : "Saved evidence could not be loaded."
          );
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [
    defaultIncidentDate,
    defaultIncidentLocation,
    defaultIncidentTitle,
    reportDraft?.date,
    reportDraft?.location,
    reportDraft?.reportId,
    reportDraft?.summary,
    reportDraft?.title,
  ]);

  const buildReportPayload = (
    nextEvidenceItems = attachedFiles
  ): ReportCreateInput => {
    const activeEvidenceItems = nextEvidenceItems.filter(
      (item) => item.status !== "deleted" && !item.deletedAt
    );
    const existingStructuredFields = reportDraft?.structuredFields ?? {};
    const narrative =
      description.trim() ||
      reportDraft?.summary ||
      "Incident report draft";
    const incidentType =
      reportDraft?.incidentType ??
      initialCategory ??
      reportDraft?.incidentCategory ??
      inferIncidentTypeFromNarrative(
        [title, narrative, location, supportMessage].join(" ")
      );

    return {
      language: "en",
      jurisdiction: "NSW",
      context: title.trim() || reportDraft?.title || "SafeSpeak incident report",
      originalNarrative: narrative,
      incidentType,
      structuredFields: {
      ...existingStructuredFields,
      what: narrative,
        when: date || (existingStructuredFields.when as string),
        where:
          location || (existingStructuredFields.where as string),
        supportMessage: supportMessage.trim() || undefined,
        evidenceItems: activeEvidenceItems.map((item) => ({
          evidenceId: item.backendEvidenceId,
          name: item.name,
          kind: item.kind,
          mimeType: item.mimeType,
          sizeBytes: item.sizeBytes,
          sha256Hash:
            item.sha256Hash === "hash-unavailable"
              ? undefined
              : item.sha256Hash,
          status: item.backendStatus ?? item.status,
          storageProvider: item.storageProvider,
          uploadedAt: item.uploadedAt,
        })),
      },
      status: "draft",
    };
  };

  const mergeCurrentReportDraft = (
    nextEvidenceItems = attachedFiles,
    savedReport?: { _id: string; incidentType?: string }
  ) => {
    const payload = buildReportPayload(nextEvidenceItems);
    const activeEvidenceIds = nextEvidenceItems
      .map((item) => item.backendEvidenceId)
      .filter((item): item is string => Boolean(item));
    const nextDraft: Parameters<typeof mergeReportFlowDraft>[0] = {
      title: title.trim() || payload.context || "",
      date,
      location,
      summary: payload.originalNarrative ?? "",
      structuredFields: payload.structuredFields,
      incidentType:
        savedReport?.incidentType ??
        payload.incidentType ??
        reportDraft?.incidentType,
      incidentCategory: reportDraft?.incidentCategory,
      topic: reportDraft?.topic,
      starterPrompt: reportDraft?.starterPrompt,
      evidenceIds: [
        ...new Set([...(reportDraft?.evidenceIds ?? []), ...activeEvidenceIds]),
      ],
    };

    if (savedReport?._id) {
      nextDraft.reportId = savedReport._id;
    }

    return mergeDraft(nextDraft);
  };

  const persistReportDraftToBackend = async (
    nextEvidenceItems = attachedFiles
  ) => {
    setIsPersistingReport(true);
    setEvidenceError(null);

    try {
      if (REPORT_SUBMISSION_MOCK_MODE) {
        return mergeCurrentReportDraft(nextEvidenceItems, {
          _id: getMockReportId(reportDraft),
          incidentType:
            reportDraft?.incidentType ?? initialCategory ?? undefined,
        });
      }

      const payload = buildReportPayload(nextEvidenceItems);
      const savedReport = reportDraft?.reportId
        ? await updateReport(reportDraft.reportId, payload)
        : await createReport(payload);

      return mergeCurrentReportDraft(nextEvidenceItems, savedReport);
    } catch (error) {
      if (error instanceof ConsentRequiredError) {
        setPendingConsentRequirement(error.requirement);
        throw error;
      }

      setEvidenceError(
        error instanceof Error
          ? error.message
          : "Report draft could not be saved."
      );
      throw error;
    } finally {
      setIsPersistingReport(false);
    }
  };

  const attachFiles = async (
    files: FileList | File[],
    options?: { forceCloudSync?: boolean }
  ) => {
    const fileList = Array.isArray(files) ? files : Array.from(files);

    if (!fileList.length) {
      return;
    }

    setEvidenceError(null);
    setIsHashingEvidence(true);
    setIsUploadingEvidence(true);

    try {
      if (REPORT_SUBMISSION_MOCK_MODE) {
        const nextItems: EvidenceItem[] = await Promise.all(
          fileList.map(async (file) => {
            const uploadedAt = new Date().toISOString();

            return {
              id: `${file.name}-${file.lastModified}-${Math.random()
                .toString(36)
                .slice(2, 8)}`,
              backendEvidenceId: undefined,
              name: file.name,
              sizeLabel: formatFileSize(file.size),
              kind: inferEvidenceKind(file),
              sha256Hash: await computeSha256Hash(file),
              uploadedAt,
              mimeType: file.type || "application/octet-stream",
              sizeBytes: file.size,
              previewUrl:
                file.type.startsWith("image/") || file.type.startsWith("video/")
                  ? URL.createObjectURL(file)
                  : undefined,
              status: "attached" as const,
            };
          })
        );

        setAttachedFiles((currentItems) => [...currentItems, ...nextItems]);
        setAuditTrail((currentTrail) => [
          ...currentTrail,
          ...nextItems.map((item) =>
            createAuditEntry(
              "attached",
              `${item.name} attached locally in mock mode.`
            )
          ),
        ]);
        mergeDraft({
          reportId: getMockReportId(reportDraft),
          evidenceIds: [
            ...new Set([
              ...(reportDraft?.evidenceIds ?? []),
              ...nextItems.map((item) => item.id),
            ]),
          ],
        });
        setPendingFiles([]);
        setPendingConsentRequirement(null);
        return;
      }

      const currentConsent = await getCurrentConsent();
      const allowCloudSync =
        options?.forceCloudSync || currentConsent.cloud_sync;

      if (!allowCloudSync && !options) {
        setPendingFiles(fileList);
        setPendingConsentRequirement(consentRequirements.cloudEvidence);
        return;
      }

      if (!allowCloudSync) {
        setPendingFiles([]);
        setEvidenceError(
          "Evidence must be uploaded to the SafeSpeak evidence vault before it can be attached to this report."
        );
        return;
      }

      const syncedReportDraft = allowCloudSync
        ? await persistReportDraftToBackend()
        : reportDraft;
      const syncedReportId = syncedReportDraft?.reportId;

      if (!syncedReportId) {
        throw new Error(
          "A backend SafeSpeak report is required before evidence can be attached."
        );
      }

      const nextItems: EvidenceItem[] = await Promise.all(
        fileList.map(async (file) => {
          const uploadedAt = new Date().toISOString();
          const baseItem = {
            id: `${file.name}-${file.lastModified}-${Math.random().toString(36).slice(2, 8)}`,
            backendEvidenceId: undefined,
            name: file.name,
            sizeLabel: formatFileSize(file.size),
            kind: inferEvidenceKind(file),
            sha256Hash: await computeSha256Hash(file),
            uploadedAt,
            mimeType: file.type || "application/octet-stream",
            sizeBytes: file.size,
            previewUrl:
              file.type.startsWith("image/") || file.type.startsWith("video/")
                ? URL.createObjectURL(file)
                : undefined,
            status: "synced" as const,
          };

          const upload = await requestEvidenceUploadUrl({
            reportId: syncedReportId,
            type: inferEvidenceKind(file),
            fileName: file.name,
            mimeType: file.type || "application/octet-stream",
            size: file.size,
          });
          const reservedEvidenceId = resolveEvidenceId(upload.evidence);
          if (!reservedEvidenceId) {
            throw new Error("Evidence reservation did not return an id.");
          }
          const completedEvidence = await completeEvidenceUpload({
            evidenceId: reservedEvidenceId,
            file,
            sha256Hash: baseItem.sha256Hash,
          });
          const completedEvidenceId =
            resolveEvidenceId(completedEvidence) || reservedEvidenceId;
          const detailPatch = await loadEvidenceDetailPatch(
            completedEvidenceId,
            baseItem
          ).catch((error) => ({
            detailError:
              error instanceof Error
                ? error.message
                : "Evidence details could not be loaded.",
          }));

          return {
            ...baseItem,
            ...detailPatch,
            backendEvidenceId: completedEvidenceId,
            backendStatus: completedEvidence.status,
            storageProvider: completedEvidence.storageProvider,
            mimeType: completedEvidence.mimeType,
            sizeBytes: completedEvidence.size,
            deletionRequestedAt: completedEvidence.deletionRequestedAt,
            deletedAt: completedEvidence.deletedAt,
            status: "synced" as const,
          };
        })
      );

      setAttachedFiles((currentItems) => [...currentItems, ...nextItems]);
      setAuditTrail((currentTrail) => [
        ...currentTrail,
        ...nextItems.map((item) =>
          createAuditEntry(
            "attached",
            `${item.name} uploaded to the evidence vault at ${formatEvidenceTimestamp(item.uploadedAt)}.`
          )
        ),
      ]);
      mergeDraft({
        evidenceIds: [
          ...new Set([
            ...(syncedReportDraft?.evidenceIds ?? []),
            ...nextItems
              .map((item) => item.backendEvidenceId)
              .filter((item): item is string => Boolean(item)),
          ]),
        ],
      });
      if (allowCloudSync) {
        await persistReportDraftToBackend([...attachedFiles, ...nextItems]);
      }
      setPendingFiles([]);
      setPendingConsentRequirement(null);
    } catch (error) {
      if (error instanceof ConsentRequiredError) {
        setPendingTranscriptionItem(null);
        setPendingFiles(fileList);
        setPendingConsentRequirement(error.requirement);
        return;
      }

      setEvidenceError(
        error instanceof Error
          ? error.message
          : "Evidence could not be attached."
      );
    } finally {
      setIsHashingEvidence(false);
      setIsUploadingEvidence(false);
    }
  };

  const handleFilesSelected = async (files: FileList | null) => {
    if (!files?.length) {
      return;
    }

    await attachFiles(files);
  };

  const removeAttachment = (id: string) => {
    setAttachedFiles((currentItems) => {
      const itemToRemove = currentItems.find((item) => item.id === id);

      if (itemToRemove) {
        setAuditTrail((currentTrail) => [
          ...currentTrail,
          createAuditEntry(
            "removed",
            `${itemToRemove.name} removed from draft.`
          ),
        ]);
      }

      return currentItems.filter((item) => item.id !== id);
    });
  };

  const refreshEvidenceDetails = async (item: EvidenceItem) => {
    if (!item.backendEvidenceId) {
      setEvidenceError(
        "Backend metadata is not available for this evidence item."
      );
      return;
    }

    setLoadingEvidenceDetailId(item.id);
    setEvidenceError(null);

    try {
      const patch = await loadEvidenceDetailPatch(item.backendEvidenceId, item);

      setAttachedFiles((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, ...patch }
            : currentItem
        )
      );
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "Evidence metadata could not be loaded.";

      setAttachedFiles((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? { ...currentItem, detailError: message }
            : currentItem
        )
      );
      setEvidenceError(message);
    } finally {
      setLoadingEvidenceDetailId(null);
    }
  };

  const handleVerifyEvidenceHash = async (item: EvidenceItem) => {
    if (!item.backendEvidenceId) {
      setEvidenceError(
        "Upload this evidence before verifying it with the backend."
      );
      return;
    }

    const providedHash = item.sha256Hash.trim();

    if (!/^[a-f\d]{64}$/i.test(providedHash)) {
      setEvidenceError(
        "Enter a valid 64-character SHA-256 hash before verifying."
      );
      return;
    }

    setVerifyingEvidenceId(item.id);
    setEvidenceError(null);

    try {
      const verification = await verifyEvidenceHash(
        item.backendEvidenceId,
        providedHash
      );
      const auditChain = await getEvidenceAuditChain(item.backendEvidenceId);

      setAttachedFiles((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                verification,
                auditChain,
                detailError: undefined,
              }
            : currentItem
        )
      );
    } catch (error) {
      setEvidenceError(
        error instanceof Error
          ? error.message
          : "Evidence hash could not be verified."
      );
    } finally {
      setVerifyingEvidenceId(null);
    }
  };

  const handleDeleteEvidence = async (item: EvidenceItem) => {
    if (!item.backendEvidenceId) {
      removeAttachment(item.id);
      return;
    }

    const confirmed = window.confirm(
      `Delete ${item.name} from the evidence vault? This will keep a local deletion record in the chain view.`
    );

    if (!confirmed) {
      return;
    }

    setDeletingEvidenceId(item.id);
    setEvidenceError(null);

    try {
      await deleteEvidence(item.backendEvidenceId);
      const deletedAt = new Date().toISOString();
      const [metadata, auditChain] = await Promise.all([
        getEvidenceMetadata(item.backendEvidenceId).catch(
          () => item.metadata ?? null
        ),
        getEvidenceAuditChain(item.backendEvidenceId).catch(
          () => item.auditChain ?? []
        ),
      ]);

      setAttachedFiles((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                metadata,
                auditChain,
                status: "deleted",
                backendStatus: metadata?.status ?? "deleted",
                deletionRequestedAt:
                  metadata?.deletionRequestedAt ??
                  currentItem.deletionRequestedAt ??
                  deletedAt,
                deletedAt: metadata?.deletedAt ?? deletedAt,
                detailError: undefined,
              }
            : currentItem
        )
      );
      setAuditTrail((currentTrail) => [
        ...currentTrail,
        createAuditEntry(
          "removed",
          `${item.name} deleted from the evidence vault.`
        ),
      ]);
    } catch (error) {
      setEvidenceError(
        error instanceof Error
          ? error.message
          : "Evidence could not be deleted."
      );
    } finally {
      setDeletingEvidenceId(null);
    }
  };

  const saveDraft = async () => {
    if (typeof window === "undefined") {
      return;
    }

    const savedAt = new Date();
    window.localStorage.setItem(
      DRAFT_STORAGE_KEY,
      JSON.stringify({
        description,
        supportMessage,
        attachments: attachedFiles.map(
          ({
            backendEvidenceId,
            name,
            sizeLabel,
            kind,
            sha256Hash,
            uploadedAt,
            backendStatus,
            storageProvider,
            mimeType,
            sizeBytes,
            deletionRequestedAt,
            deletedAt,
          }) => ({
            backendEvidenceId,
            name,
            sizeLabel,
            kind,
            sha256Hash,
            uploadedAt,
            backendStatus,
            storageProvider,
            mimeType,
            sizeBytes,
            deletionRequestedAt,
            deletedAt,
          })
        ),
        auditTrail: [
          ...auditTrail,
          createAuditEntry("draft-saved", "Draft metadata saved locally."),
        ],
        savedAt: savedAt.toISOString(),
      })
    );

    setDraftSavedAt(
      savedAt.toLocaleTimeString([], {
        hour: "numeric",
        minute: "2-digit",
      })
    );
    setAuditTrail((currentTrail) => [
      ...currentTrail,
      createAuditEntry("draft-saved", "Draft metadata saved locally."),
    ]);
    setRestoredDraftNotice(null);

    try {
      await persistReportDraftToBackend();
    } catch {
      // Local draft is already saved. Consent and API errors are surfaced by the helper.
    }
  };

  const handleContinue = async () => {
    if (isPersistingReport || isUploadingEvidence) {
      return;
    }

    mergeCurrentReportDraft();

    if (
      !REPORT_SUBMISSION_MOCK_MODE &&
      attachedFiles.some((item) => !item.backendEvidenceId)
    ) {
      setEvidenceError(
        "Upload all evidence to the SafeSpeak vault before continuing to review."
      );
      return;
    }

    if (attachedFiles.some((item) => item.status === "restored")) {
      setEvidenceError(
        "Re-upload restored evidence files before continuing to review."
      );
      return;
    }

    if (!REPORT_SUBMISSION_MOCK_MODE) {
      try {
        shouldContinueToReviewAfterConsentRef.current = true;
        await persistReportDraftToBackend();
      } catch (error) {
        if (!(error instanceof ConsentRequiredError)) {
          shouldContinueToReviewAfterConsentRef.current = false;
        }
        return;
      }
    } else {
      await persistReportDraftToBackend();
    }

    shouldContinueToReviewAfterConsentRef.current = false;
    router.push("/dashboard?view=reportsubmissionreview");
  };

  const handleTranscribeEvidence = async (item: EvidenceItem) => {
    if (!item.backendEvidenceId || !reportDraft?.reportId) {
      setEvidenceError(
        "Upload the audio evidence to the vault before transcribing it."
      );
      return;
    }

    setIsTranscribingEvidenceId(item.id);
    setEvidenceError(null);

    try {
      const transcriptResult = await transcribeEvidence(
        item.backendEvidenceId,
        {
          language: "en",
          reportId: reportDraft.reportId,
          saveTranscript: true,
          useAsNarrative: false,
        }
      );

      setAttachedFiles((currentItems) =>
        currentItems.map((currentItem) =>
          currentItem.id === item.id
            ? {
                ...currentItem,
                transcript: transcriptResult.transcript,
                transcriptionStatus: "available",
              }
            : currentItem
        )
      );
      await refreshEvidenceDetails(item);
    } catch (error) {
      if (error instanceof ConsentRequiredError) {
        setPendingTranscriptionItem(item);
        setPendingConsentRequirement(error.requirement);
        return;
      }

      setEvidenceError(
        error instanceof Error
          ? error.message
          : "Evidence transcription could not be completed."
      );
    } finally {
      setIsTranscribingEvidenceId(null);
    }
  };

  const exportMetadata = () => {
    if (typeof window === "undefined") {
      return;
    }

    const payload = {
      exportedAt: new Date().toISOString(),
      description,
      supportMessage,
      attachments: attachedFiles.map((item) => ({
        backendEvidenceId: item.backendEvidenceId,
        name: item.name,
        kind: item.kind,
        sizeLabel: item.sizeLabel,
        mimeType: item.mimeType,
        sizeBytes: item.sizeBytes,
        sha256Hash: item.sha256Hash,
        uploadedAt: item.uploadedAt,
        status: item.status,
        backendStatus: item.backendStatus,
        storageProvider: item.storageProvider,
        deletionRequestedAt: item.deletionRequestedAt,
        deletedAt: item.deletedAt,
        verification: item.verification,
        auditChain: item.auditChain,
      })),
      auditTrail,
    };

    const blob = new Blob([JSON.stringify(payload, null, 2)], {
      type: "application/json",
    });
    const objectUrl = window.URL.createObjectURL(blob);
    const anchor = document.createElement("a");

    anchor.href = objectUrl;
    anchor.download = "safespeak-evidence-metadata.json";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    window.URL.revokeObjectURL(objectUrl);
  };

  const activeAttachedFiles = attachedFiles.filter(
    (item) => item.status !== "deleted" && !item.deletedAt
  );
  const primaryEvidenceItems = activeAttachedFiles.slice(0, 3);
  const secondaryEvidenceItems = activeAttachedFiles.slice(3);
  const readyFileCount = activeAttachedFiles.length;
  const isEvidenceItemBusy = (item: EvidenceItem) =>
    loadingEvidenceDetailId === item.id ||
    verifyingEvidenceId === item.id ||
    deletingEvidenceId === item.id ||
    isTranscribingEvidenceId === item.id;

  return (
    <ReportSubmissionFrame
      title="Incident Details"
      subtitle="Write the story once, add any supporting files, and review everything before you choose where to send it."
      step="details"
      skipSupportStep={!fromTriage}
      backHref={backHref}
      backLabel={fromTriage ? "Support" : "Report Submission"}
    >
      <div className="mt-4 grid gap-4 xl:grid-cols-[1.1fr_0.9fr]">
        <section className="rounded-[20px] border border-[#dbe5f1] bg-[#fbfdff] p-5 space-y-4">
          {evidenceError ? (
            <div className="mb-4 rounded-[14px] border border-[#fde2e2] bg-[#fff5f5] px-4 py-3 text-[12px] text-[#b45353]">
              <span className="flex items-center gap-1.5 font-bold">
                <IconAlertCircle size={14} className="shrink-0" />
                Error
              </span>
              <p className="mt-1 font-medium">{evidenceError}</p>
            </div>
          ) : null}

          {restoredDraftNotice ? (
            <div className="mb-4 rounded-[14px] border border-[#fed7aa] bg-[#fffaf5] px-4 py-3 text-[12px] text-[#c2410c]">
              <span className="flex items-center gap-1.5 font-bold">
                <IconAlertCircle size={14} className="shrink-0" />
                Draft Restored
              </span>
              <p className="mt-1 font-medium">{restoredDraftNotice}</p>
            </div>
          ) : null}

          {contextFlow ? (
            <div className="mb-4 rounded-[16px] border border-[#dbe5f1] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Preselected context
              </p>
              <p className="mt-1 text-sm font-semibold text-[#1f2a3a]">
                {contextFlow.title}
              </p>
            </div>
          ) : null}

          <div className="space-y-4">
            <label htmlFor="incident-title" className="block space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Incident Title
              </span>
              <input
                id="incident-title"
                type="text"
                placeholder="e.g. Online scam attempt"
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-11 w-full rounded-[12px] border border-[#dbe4ef] bg-white px-3.5 text-sm text-[#1f2a3a] shadow-sm transition outline-none focus:border-[#0f5d9f]"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label htmlFor="incident-date" className="block space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  Date
                </span>
                <input
                  id="incident-date"
                  type="date"
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                  className="h-11 w-full rounded-[12px] border border-[#dbe4ef] bg-white px-3 text-sm text-[#1f2a3a] shadow-sm transition outline-none focus:border-[#0f5d9f]"
                />
              </label>

              <label htmlFor="incident-location" className="block space-y-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  Location
                </span>
                <div className="relative">
                  <span className="absolute inset-y-0 left-3 grid place-items-center text-[#94a3b8]">
                    <IconMapPin size={14} />
                  </span>
                  <input
                    id="incident-location"
                    type="text"
                    placeholder="City or post code"
                    value={location}
                    onChange={(event) => setLocation(event.target.value)}
                    className="h-11 w-full rounded-[12px] border border-[#dbe4ef] bg-white pl-8 pr-3 text-sm text-[#1f2a3a] shadow-sm transition outline-none focus:border-[#0f5d9f]"
                  />
                </div>
              </label>
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                What happened
              </span>
              <div className="rounded-[14px] border border-[#dbe4ef] bg-white px-4 py-3 shadow-sm focus-within:border-[#0f5d9f] focus-within:ring-1 focus-within:ring-[#0f5d9f]">
                <textarea
                  id="incident-summary"
                  rows={7}
                  placeholder="Describe what happened in your own words. Include who was involved, where it happened, and anything you want the receiving team to understand."
                  value={description}
                  onChange={(event) => setDescription(event.target.value)}
                  className="min-h-[180px] w-full resize-none bg-transparent text-sm leading-7 text-[#1f2a3a] outline-none placeholder:text-[#94A3B8]"
                />
              </div>
            </div>
          </div>
        </section>

        <section className="rounded-[20px] border border-[#dbe5f1] bg-white p-5 flex flex-col justify-between">
          <div>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  Evidence
                </p>
                <h3 className="mt-1 text-2xl font-bold text-[#0f172a]">
                  Attach supporting files
                </h3>
                <p className="mt-1 text-xs text-[#64748B]">
                  Add screenshots, documents, audio, video, or photos if you want them included with the report.
                </p>
              </div>
              <span className="inline-flex h-8 w-fit shrink-0 whitespace-nowrap items-center rounded-full border border-[#FED7AA] bg-[#FFEDD5] px-3 text-xs font-semibold text-[#C2410C]">
                {readyFileCount} file{readyFileCount === 1 ? "" : "s"} ready
              </span>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
              {primaryEvidenceItems.map((item) => (
                <EvidenceVaultCard
                  key={item.id}
                  item={item}
                  onRemove={handleDeleteEvidence}
                  onRefresh={refreshEvidenceDetails}
                  onVerify={handleVerifyEvidenceHash}
                  onTranscribe={handleTranscribeEvidence}
                  isBusy={isEvidenceItemBusy(item)}
                />
              ))}

              {secondaryEvidenceItems.map((item) => (
                <EvidenceVaultCard
                  key={item.id}
                  item={item}
                  onRemove={handleDeleteEvidence}
                  onRefresh={refreshEvidenceDetails}
                  onVerify={handleVerifyEvidenceHash}
                  onTranscribe={handleTranscribeEvidence}
                  isBusy={isEvidenceItemBusy(item)}
                />
              ))}

              <article
                role="button"
                tabIndex={0}
                onClick={() => fileInputRef.current?.click()}
                onKeyDown={(event) => {
                  if (event.key === "Enter" || event.key === " ") {
                    event.preventDefault();
                    fileInputRef.current?.click();
                  }
                }}
                onDragOver={(event) => {
                  event.preventDefault();
                }}
                onDrop={(event) => {
                  event.preventDefault();
                  void handleFilesSelected(event.dataTransfer.files);
                }}
                className="grid min-h-[148px] cursor-pointer place-items-center rounded-[20px] border-2 border-dashed border-[#CBD5E1] bg-[#F8FAFC] px-4 py-6 text-center transition hover:border-[#FDBA74] hover:bg-white"
              >
                <div>
                  <span className="mx-auto inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-[#FF8F00] shadow-[0_1px_2px_rgba(0,0,0,0.05)]">
                    <IconFolderFilled size={18} />
                  </span>
                  <h3 className="mt-2 text-xs font-semibold text-[#334155]">
                    Drag, drop, or click to upload
                  </h3>
                  <p className="mx-auto mt-0.5 max-w-[180px] text-[10px] leading-4 text-[#64748B]">
                    Images, video, audio, PDF, DOC, DOCX, and TXT are supported.
                  </p>
                </div>
              </article>
            </div>
          </div>
        </section>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-3 border-t border-[#e2e8f0] pt-4">
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              void saveDraft();
            }}
            disabled={isPersistingReport}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#d7e1ee] px-5 text-sm font-semibold text-[#475569]"
          >
            {isPersistingReport ? "Saving..." : "Save draft"}
          </button>
          {draftSavedAt ? (
            <span className="text-xs text-[#94A3B8]">
              Draft saved at {draftSavedAt}
            </span>
          ) : null}
        </div>
        <button
          type="button"
          onClick={() => {
            void handleContinue();
          }}
          disabled={isPersistingReport || isUploadingEvidence}
          className="inline-flex h-11 items-center rounded-full bg-[#0f5d9f] px-6 text-sm font-bold text-white shadow-[0_10px_24px_rgba(15,93,159,0.2)]"
        >
          {isPersistingReport ? "Saving..." : "Continue to Review"}
          <IconChevronRight size={16} className="ml-1" />
        </button>
      </div>

      {pendingConsentRequirement ? (
        <div className="mt-4">
          <ConsentRequiredCard
            requirement={pendingConsentRequirement as ConsentRequirement}
            isSubmitting={isGrantingConsent}
            onAllow={() => {
              void (async () => {
                const requirement = pendingConsentRequirement;

                if (!requirement) {
                  return;
                }

                setIsGrantingConsent(true);

                try {
                  await grantConsent(
                    getConsentGrantFlags(requirement),
                    requirement.source
                  );

                  const shouldContinueToReview =
                    shouldContinueToReviewAfterConsentRef.current &&
                    !pendingFiles.length &&
                    !pendingTranscriptionItem;

                  if (pendingFiles.length) {
                    await attachFiles(pendingFiles, {
                      forceCloudSync: true,
                    });
                  } else if (pendingTranscriptionItem) {
                    await handleTranscribeEvidence(pendingTranscriptionItem);
                  } else {
                    await persistReportDraftToBackend();
                  }

                  setPendingFiles([]);
                  setPendingTranscriptionItem(null);
                  setPendingConsentRequirement(null);

                  if (shouldContinueToReview) {
                    shouldContinueToReviewAfterConsentRef.current = false;
                    router.push("/dashboard?view=reportsubmissionreview");
                  }
                } catch (error) {
                  setEvidenceError(
                    error instanceof Error
                      ? error.message
                      : "Consent could not be saved."
                  );
                } finally {
                  setPendingTranscriptionItem(null);
                  setIsGrantingConsent(false);
                }
              })();
            }}
            onDecline={() => {
              setPendingFiles([]);
              setEvidenceError(
                "Evidence was not attached. SafeSpeak needs cloud-sync consent to upload files to the evidence vault."
              );
              setPendingTranscriptionItem(null);
              setPendingConsentRequirement(null);
            }}
          />
        </div>
      ) : null}

      <input
        ref={fileInputRef}
        type="file"
        multiple
        accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.txt"
        className="hidden"
        onChange={(event) => {
          void handleFilesSelected(event.target.files);
          event.target.value = "";
        }}
      />
    </ReportSubmissionFrame>
  );
}

export { ReportSubmissionEvidencePage };
