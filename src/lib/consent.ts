"use client";

import { apiRequest } from "@/lib/api";
import { getSessionAwareAuthHeaders } from "@/lib/frontend-session";

export type ConsentFlag =
  | "store_local"
  | "cloud_sync"
  | "share_with_agencies"
  | "use_anonymised_analytics"
  | "process_with_ai"
  | "transcribe_audio"
  | "translate_content"
  | "retain_evidence"
  | "warm_referral"
  | "advocate_request";

export type ConsentFlags = Partial<Record<ConsentFlag, boolean>>;

type CurrentConsentResponse = {
  consent: ConsentFlags;
};

type ConsentHistoryEntry = {
  flags?: ConsentFlags;
  source?: string;
  createdAt?: string;
};

type ConsentHistoryResponse = {
  history: ConsentHistoryEntry[];
};

export type ConsentRequirement = {
  title: string;
  description: string;
  flags: ConsentFlag[];
  grantFlags?: ConsentFlags;
  source: string;
  mode?: "all" | "any";
  allowLabel?: string;
  declineLabel?: string;
  settingsHref?: string;
};

export class ConsentRequiredError extends Error {
  requirement: ConsentRequirement;
  currentConsent: ConsentFlags;

  constructor(requirement: ConsentRequirement, currentConsent: ConsentFlags) {
    super("Consent is required before this action can continue.");
    this.name = "ConsentRequiredError";
    this.requirement = requirement;
    this.currentConsent = currentConsent;
  }
}

function hasRequiredConsent(
  currentConsent: ConsentFlags,
  requirement: ConsentRequirement
): boolean {
  const mode = requirement.mode ?? "all";

  if (mode === "any") {
    return requirement.flags.some((flag) => Boolean(currentConsent[flag]));
  }

  return requirement.flags.every((flag) => Boolean(currentConsent[flag]));
}

export async function getCurrentConsent(
  headers?: HeadersInit
): Promise<ConsentFlags> {
  const resolvedHeaders = headers ?? (await getSessionAwareAuthHeaders());
  const response = await apiRequest<CurrentConsentResponse>(
    "/consents/current",
    {
      headers: resolvedHeaders,
    }
  );

  return response.data.consent;
}

export async function ensureConsent(
  requirement: ConsentRequirement,
  headers?: HeadersInit
): Promise<ConsentFlags> {
  const resolvedHeaders = headers ?? (await getSessionAwareAuthHeaders());
  const currentConsent = await getCurrentConsent(resolvedHeaders);

  if (hasRequiredConsent(currentConsent, requirement)) {
    return currentConsent;
  }

  throw new ConsentRequiredError(requirement, currentConsent);
}

export function getConsentGrantFlags(
  requirement: ConsentRequirement
): ConsentFlags {
  if (requirement.grantFlags) {
    return requirement.grantFlags;
  }

  const flagsToGrant =
    requirement.mode === "any"
      ? requirement.flags.slice(0, 1)
      : requirement.flags;

  return flagsToGrant.reduce<ConsentFlags>((flags, flag) => {
    flags[flag] = true;
    return flags;
  }, {});
}

export async function grantConsent(
  flags: ConsentFlags,
  source: string,
  headers?: HeadersInit
): Promise<ConsentFlags> {
  const resolvedHeaders = headers ?? (await getSessionAwareAuthHeaders());
  const response = await apiRequest<CurrentConsentResponse>(
    "/consents/update",
    {
      method: "POST",
      headers: resolvedHeaders,
      body: {
        flags,
        source,
      },
    }
  );

  return response.data.consent;
}

export async function withdrawConsent(
  flags: ConsentFlags,
  source: string,
  headers?: HeadersInit
): Promise<ConsentFlags> {
  const resolvedHeaders = headers ?? (await getSessionAwareAuthHeaders());
  const response = await apiRequest<CurrentConsentResponse>(
    "/consents/withdraw",
    {
      method: "POST",
      headers: resolvedHeaders,
      body: {
        flags,
        source,
      },
    }
  );

  return response.data.consent;
}

export async function getConsentHistory(
  headers?: HeadersInit
): Promise<ConsentHistoryEntry[]> {
  const resolvedHeaders = headers ?? (await getSessionAwareAuthHeaders());
  const response = await apiRequest<ConsentHistoryResponse>(
    "/consents/history",
    {
      headers: resolvedHeaders,
    }
  );

  return response.data.history;
}

export const consentSources = {
  assistantTimelineBuilder: "assistant_timeline_builder",
  assistantRagAnswer: "assistant_rag_answer",
  assistantTriageReport: "assistant_triage_report",
  assistantVoiceRecorder: "assistant_voice_recorder",
  reportEvidenceTranscription: "report_evidence_transcription",
  scamshieldAnalysis: "scamshield_analysis",
  reportEvidenceUpload: "report_evidence_upload",
  reportDraftStorage: "report_draft_storage",
  reportDestinationSubmit: "report_destination_submit",
  supportWarmReferral: "support_warm_referral",
  advocateRequest: "advocate_request",
  safetyPlanStorage: "safety_plan_storage",
  sourceBackedQuestion: "source_backed_question",
  externalSharingAction: "external_sharing_action",
  privacySelfService: "privacy_self_service",
} as const;

export const consentRequirements = {
  aiAssistant: {
    title: "AI consent required",
    description:
      "SafeSpeak needs your permission to process this conversation with AI. This is information-only support and will not submit a report automatically.",
    flags: ["process_with_ai"],
    grantFlags: { process_with_ai: true },
    source: consentSources.assistantTimelineBuilder,
    allowLabel: "Allow AI and continue",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  ragAnswer: {
    title: "AI answer consent required",
    description:
      "SafeSpeak needs your permission to use approved AI and knowledge sources for this answer.",
    flags: ["process_with_ai"],
    grantFlags: { process_with_ai: true },
    source: consentSources.assistantRagAnswer,
    allowLabel: "Allow AI and continue",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  triage: {
    title: "Triage consent required",
    description:
      "SafeSpeak needs permission to analyze the incident details you shared before it can prepare triage guidance.",
    flags: ["process_with_ai"],
    grantFlags: { process_with_ai: true },
    source: consentSources.assistantTriageReport,
    allowLabel: "Allow AI and continue",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  audioTranscription: {
    title: "Audio transcription consent required",
    description:
      "SafeSpeak needs your permission before transcribing voice input. You can allow transcription only, or allow AI processing more broadly.",
    flags: ["transcribe_audio", "process_with_ai"],
    grantFlags: { transcribe_audio: true },
    mode: "any",
    source: consentSources.assistantVoiceRecorder,
    allowLabel: "Allow transcription and continue",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  evidenceTranscription: {
    title: "Evidence transcription consent required",
    description:
      "SafeSpeak needs your permission before transcribing audio evidence. You can allow transcription only, or allow AI processing more broadly.",
    flags: ["transcribe_audio", "process_with_ai"],
    grantFlags: { transcribe_audio: true },
    mode: "any",
    source: consentSources.reportEvidenceTranscription,
    allowLabel: "Allow transcription and continue",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  scamAnalysis: {
    title: "Scam analysis consent required",
    description:
      "SafeSpeak needs your permission before it can analyze suspicious text, screenshots, URLs, or emails with AI.",
    flags: ["process_with_ai"],
    grantFlags: { process_with_ai: true },
    source: consentSources.scamshieldAnalysis,
    allowLabel: "Allow analysis and continue",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  cloudEvidence: {
    title: "Cloud evidence consent required",
    description:
      "Cloud evidence upload is disabled until you allow cloud sync. Without it, SafeSpeak can keep evidence metadata on this device only.",
    flags: ["cloud_sync"],
    grantFlags: { cloud_sync: true },
    source: consentSources.reportEvidenceUpload,
    allowLabel: "Allow cloud sync and continue",
    declineLabel: "Keep local only",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  reportStorage: {
    title: "Report storage consent required",
    description:
      "SafeSpeak needs cloud sync consent before report details can be stored on SafeSpeak servers. Without it, keep the draft on this device only.",
    flags: ["cloud_sync"],
    grantFlags: { cloud_sync: true },
    source: consentSources.reportDraftStorage,
    allowLabel: "Allow cloud sync and continue",
    declineLabel: "Keep local only",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  warmReferral: {
    title: "Warm referral consent required",
    description:
      "SafeSpeak needs your permission before it can share details with a support service for a warm referral.",
    flags: ["warm_referral"],
    grantFlags: { warm_referral: true },
    source: consentSources.supportWarmReferral,
    allowLabel: "Allow warm referral",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  reportDestinationSubmit: {
    title: "Report sharing consent required",
    description:
      "SafeSpeak needs your permission before sharing prepared information with the selected external service. Calls and emails only happen if you choose them.",
    flags: ["share_with_agencies"],
    grantFlags: { share_with_agencies: true },
    source: consentSources.reportDestinationSubmit,
    allowLabel: "Allow sharing and continue",
    declineLabel: "Keep prepared only",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  sourceBackedQuestion: {
    title: "Source-backed AI consent required",
    description:
      "SafeSpeak needs your permission before using AI to search approved knowledge sources and answer your question.",
    flags: ["process_with_ai"],
    grantFlags: { process_with_ai: true },
    source: consentSources.sourceBackedQuestion,
    allowLabel: "Allow source Q&A",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  advocateRequest: {
    title: "Advocate request consent required",
    description:
      "SafeSpeak needs your permission before creating an advocate contact request or sharing request details.",
    flags: ["advocate_request"],
    grantFlags: { advocate_request: true },
    source: consentSources.advocateRequest,
    allowLabel: "Allow advocate request",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  safetyPlanStorage: {
    title: "Safety plan storage consent required",
    description:
      "SafeSpeak needs cloud sync consent before storing a safety plan on SafeSpeak servers.",
    flags: ["cloud_sync"],
    grantFlags: { cloud_sync: true },
    source: consentSources.safetyPlanStorage,
    allowLabel: "Allow safety plan storage",
    declineLabel: "Keep local only",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
  shareWithAgencies: {
    title: "Sharing consent required",
    description:
      "SafeSpeak needs your permission before it can prepare or submit information to an external service or agency.",
    flags: ["share_with_agencies"],
    grantFlags: { share_with_agencies: true },
    source: consentSources.externalSharingAction,
    allowLabel: "Allow sharing",
    declineLabel: "Not now",
    settingsHref: "/dashboard/settings",
  } satisfies ConsentRequirement,
} as const;
