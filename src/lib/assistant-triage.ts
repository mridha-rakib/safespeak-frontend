import { apiRequest, getApiBaseUrl } from "@/lib/api";
import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import { consentRequirements, ensureConsent } from "@/lib/consent";
import {
  getAssistantAuthHeaders,
  type AssistantConversationMessage,
  type AssistantTimeline,
} from "@/lib/assistant-conversation";

const ASSISTANT_TRIAGE_CONTEXT_KEY = "safespeak_assistant_triage_context";
const MAX_TRIAGE_NARRATIVE_LENGTH = 12000;

export type AssistantTriageSource = {
  conversationSessionId?: string;
  conversation: AssistantConversationMessage[];
  timeline: AssistantTimeline;
  narrative: string;
  updatedAt: string;
  incidentCategory?: AssistantIncidentCategory;
};

export type AssistantTriageApiResult = {
  severitySignal?: string;
  primarySupportNeed?: string;
  specialtyTag?: string;
  summary?: string;
  assessmentBody?: string;
  riskFactors?: unknown;
  suggestedSupportCategories?: unknown;
  recommendedActions?: unknown;
  resourceRecommendations?: unknown;
  nonLegalSafetyNotes?: unknown;
  immediateSafetyFlag?: boolean | string;
  confidence?: "low" | "medium" | "high" | string;
  citations?: Array<{
    sourceType?: string;
    sourceId?: string;
    title?: string;
    excerpt?: string;
  }>;
  fallbackReason?: string;
  pendingHumanReview?: boolean;
  safetyFlags?: Record<string, boolean>;
  disclaimer?: string;
  humanReviewNote?: string;
  reviewStatus?: string;
  interactionId?: string;
  templateVersion?: number;
  templateStatus?: string;
};

type TriageReportResponse = {
  result: AssistantTriageApiResult;
};

function trimNarrative(value: string): string {
  const trimmed = value.trim();

  if (trimmed.length <= MAX_TRIAGE_NARRATIVE_LENGTH) {
    return trimmed;
  }

  return trimmed.slice(trimmed.length - MAX_TRIAGE_NARRATIVE_LENGTH);
}

export function buildAssistantTriageNarrative(
  conversation: AssistantConversationMessage[]
): string {
  const transcript = conversation
    .map((entry) => `${entry.role === "assistant" ? "Assistant" : "User"}: ${entry.content}`)
    .join("\n");

  return trimNarrative(transcript);
}

export function saveAssistantTriageSource(input: {
  conversationSessionId?: string;
  conversation: AssistantConversationMessage[];
  timeline: AssistantTimeline;
  incidentCategory?: AssistantIncidentCategory;
}): void {
  if (typeof window === "undefined") {
    return;
  }

  const source: AssistantTriageSource = {
    conversationSessionId: input.conversationSessionId,
    conversation: input.conversation,
    timeline: input.timeline,
    narrative: buildAssistantTriageNarrative(input.conversation),
    updatedAt: new Date().toISOString(),
    incidentCategory: input.incidentCategory,
  };

  window.sessionStorage.setItem(
    ASSISTANT_TRIAGE_CONTEXT_KEY,
    JSON.stringify(source)
  );
}

export function getAssistantTriageSource(): AssistantTriageSource | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(ASSISTANT_TRIAGE_CONTEXT_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AssistantTriageSource;
  } catch {
    window.sessionStorage.removeItem(ASSISTANT_TRIAGE_CONTEXT_KEY);
    return null;
  }
}

export function clearAssistantTriageSource(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ASSISTANT_TRIAGE_CONTEXT_KEY);
}

export async function fetchAssistantTriageReport(
  source: AssistantTriageSource,
  language?: string
): Promise<AssistantTriageApiResult> {
  const headers = await getAssistantAuthHeaders();

  await ensureConsent(consentRequirements.triage, headers);

  const response = await apiRequest<TriageReportResponse>("/ai/triage-report", {
    method: "POST",
    baseUrl: getApiBaseUrl(),
    headers,
    body: {
      narrative: source.narrative,
      structuredFields: source.timeline,
      language,
      incidentCategory: source.incidentCategory,
    },
  });

  return response.data.result;
}
