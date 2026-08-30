import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import type {
  AssistantConversationMessage,
  AssistantTimeline,
} from "@/lib/assistant-conversation";
import type { DashboardCardFlowId } from "@/lib/dashboard-card-flows";

const ASSISTANT_DRAFT_STORAGE_KEY = "safespeak_assistant_conversation_drafts";

type AssistantDraftScopeInput = {
  topic?: DashboardCardFlowId;
  incidentCategory?: AssistantIncidentCategory;
};

export type AssistantConversationDraft = {
  conversationSessionId?: string;
  messages: AssistantConversationMessage[];
  timeline: AssistantTimeline;
  timelineFieldOrder: string[];
  triageCtaVisible?: boolean;
  voiceSessionActive?: boolean;
  incidentCategory?: AssistantIncidentCategory;
  topic?: DashboardCardFlowId;
  updatedAt: string;
};

function getAssistantDraftScopeKey(input?: AssistantDraftScopeInput): string {
  if (input?.topic) {
    return `topic:${input.topic}`;
  }

  if (input?.incidentCategory) {
    return `category:${input.incidentCategory}`;
  }

  return "topic:general_assistant";
}

function getStoredAssistantDraftMap(): Record<string, AssistantConversationDraft> {
  if (typeof window === "undefined") {
    return {};
  }

  const raw = window.sessionStorage.getItem(ASSISTANT_DRAFT_STORAGE_KEY);

  if (!raw) {
    return {};
  }

  try {
    return JSON.parse(raw) as Record<string, AssistantConversationDraft>;
  } catch {
    window.sessionStorage.removeItem(ASSISTANT_DRAFT_STORAGE_KEY);
    return {};
  }
}

function saveStoredAssistantDraftMap(
  draftMap: Record<string, AssistantConversationDraft>
): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    ASSISTANT_DRAFT_STORAGE_KEY,
    JSON.stringify(draftMap)
  );
}

export function getAssistantConversationDraft(
  input?: AssistantDraftScopeInput
): AssistantConversationDraft | null {
  const draftMap = getStoredAssistantDraftMap();
  const scopeKey = getAssistantDraftScopeKey(input);

  return draftMap[scopeKey] ?? null;
}

export function saveAssistantConversationDraft(
  draft: Omit<AssistantConversationDraft, "updatedAt">,
  input?: AssistantDraftScopeInput
): void {
  if (typeof window === "undefined") {
    return;
  }

  const draftMap = getStoredAssistantDraftMap();
  const scopeKey = getAssistantDraftScopeKey({
    topic: draft.topic ?? input?.topic,
    incidentCategory: draft.incidentCategory ?? input?.incidentCategory,
  });

  draftMap[scopeKey] = {
    ...draft,
    updatedAt: new Date().toISOString(),
  } satisfies AssistantConversationDraft;

  saveStoredAssistantDraftMap(draftMap);
}

export function clearAssistantConversationDraft(input?: AssistantDraftScopeInput): void {
  if (typeof window === "undefined") {
    return;
  }

  const draftMap = getStoredAssistantDraftMap();
  const scopeKey = getAssistantDraftScopeKey(input);

  delete draftMap[scopeKey];

  if (Object.keys(draftMap).length === 0) {
    window.sessionStorage.removeItem(ASSISTANT_DRAFT_STORAGE_KEY);
    return;
  }

  saveStoredAssistantDraftMap(draftMap);
}

export function clearAllAssistantConversationDrafts(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ASSISTANT_DRAFT_STORAGE_KEY);
}
