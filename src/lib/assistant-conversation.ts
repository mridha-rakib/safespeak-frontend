import { apiRequest, getApiBaseUrl } from "./api";
import type { AssistantIncidentCategory } from "./assistant-categories";
import { consentRequirements, ensureConsent } from "./consent";
import { getSessionAwareAuthHeaders } from "./frontend-session";
import { hasBrokenTextEncoding } from "./text-encoding";

const MAX_TIMELINE_CONVERSATION_MESSAGES = 100;

export type AssistantConversationMessage = {
  role: "assistant" | "user";
  content: string;
};

export type AssistantTimeline = {
  [key: string]: string;
};

export type TimelineAssistantTurnKind =
  | "encoding_error"
  | "format_preference_question"
  | "format_preference_set"
  | "meta_feedback"
  | "language_or_translation"
  | "timeline_request"
  | "incident_detail"
  | "general_conversation";

export function classifyTimelineAssistantTurnKind(
  message: string
): TimelineAssistantTurnKind {
  const normalized = message.trim().toLowerCase();

  if (!normalized) {
    return "general_conversation";
  }

  if (hasBrokenTextEncoding(message)) {
    return "encoding_error";
  }

  if (
    /\b(are you (answering|using)|why are you using|do you always answer with|every time)\b/.test(
      normalized
    ) &&
    /\b(bullet point|bullet points|bullets)\b/.test(normalized)
  ) {
    return "format_preference_question";
  }

  if (
    /\b(please answer in paragraphs|answer in paragraphs|please use paragraphs|use paragraphs|not bullet points|don't use bullets|do not use bullets|stop using bullet points|without bullet points|please use bullet points|use bullet points|answer in bullet points|give me bullet points|please use bullets|mix|mixed format)\b/.test(
      normalized
    )
  ) {
    return "format_preference_set";
  }

  if (
    /\b(can you speak|speak in|translate|bangla|bengali|arabic|hindi|spanish)\b/.test(
      normalized
    )
  ) {
    return "language_or_translation";
  }

  if (
    /\b(scripted|same thing every time|repeating|too generic|wrong answer)\b/.test(
      normalized
    )
  ) {
    return "meta_feedback";
  }

  if (/\b(timeline|report|organise this|organize this|build (a )?timeline)\b/.test(normalized)) {
    return "timeline_request";
  }

  if (
    /\b(hit me|assaulted|attacked|threatened|harassed|abused|happened|screenshots|photos|evidence|where|when|who|facebook|boss|work|home)\b/.test(
      normalized
    )
  ) {
    return "incident_detail";
  }

  return "general_conversation";
}

export function shouldCallTimelineAssistant(input: {
  message: string;
  conversation: AssistantConversationMessage[];
  timeline: AssistantTimeline;
  incidentCategory?: AssistantIncidentCategory;
}): boolean {
  const turnKind = classifyTimelineAssistantTurnKind(input.message);

  if (
    turnKind === "encoding_error" ||
    turnKind === "general_conversation" ||
    turnKind === "meta_feedback" ||
    turnKind === "language_or_translation" ||
    turnKind === "format_preference_question" ||
    turnKind === "format_preference_set"
  ) {
    return false;
  }

  const activeIncidentExists =
    Boolean(input.incidentCategory) ||
    Object.values(input.timeline).some((value) => value.trim().length > 0) ||
    input.conversation.some(
      (entry) =>
        entry.role === "user" &&
        classifyTimelineAssistantTurnKind(entry.content) === "incident_detail"
    );

  if (!activeIncidentExists) {
    return false;
  }

  return turnKind === "incident_detail" || turnKind === "timeline_request";
}

export function sanitizeTimelineAssistantInput(input: {
  message: string;
  conversation: AssistantConversationMessage[];
  timeline: AssistantTimeline;
}) {
  const filteredConversation = input.conversation.filter(
    (entry) => !hasBrokenTextEncoding(entry.content)
  );
  const filteredTimeline = Object.fromEntries(
    Object.entries(input.timeline).filter(([, value]) => !hasBrokenTextEncoding(value))
  );

  return {
    message: input.message,
    conversation: trimConversationForTimelineAssistant(filteredConversation),
    timeline: filteredTimeline,
    encodingWarning:
      filteredConversation.length !== input.conversation.length ||
      Object.keys(filteredTimeline).length !== Object.keys(input.timeline).length,
  };
}

export type LegalAwareness = {
  jurisdiction: "NSW";
  topic: "racial_abuse" | "migrant_challenges";
  informationOnly: true;
  sourceStatus: "approved_sources_used" | "insufficient_approved_sources";
  keyPoints: string[];
  pathwayCards: Array<{
    title: string;
    body: string;
    sourceRequirement: string;
  }>;
  citationPolicy: string;
};

function trimConversationForTimelineAssistant(
  conversation: AssistantConversationMessage[]
): AssistantConversationMessage[] {
  if (conversation.length <= MAX_TIMELINE_CONVERSATION_MESSAGES) {
    return conversation;
  }

  return conversation.slice(-MAX_TIMELINE_CONVERSATION_MESSAGES);
}

export type TimelineAssistantResponse = {
  assistantMessage: string;
  nextQuestion?: string;
  timeline: AssistantTimeline;
  readyForSubmission: boolean;
  confidence: "low" | "medium" | "high";
  disclaimer?: string;
  triageReady?: boolean;
  nextAction?: string;
  showSources?: boolean;
  sourceDisplayReason?:
    | "legal_lookup"
    | "explicit_citation_request"
    | "hidden_support_reply"
    | "triage_handoff"
    | "not_directly_grounded";
  citations: Array<{
    sourceId?: string;
    title: string;
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
  }>;
  rag: {
    used: boolean;
    unavailable: boolean;
    resultCount: number;
  };
  legalAwareness?: LegalAwareness;
  reviewStatus?: string;
  interactionId?: string;
  encodingWarning?: boolean;
};

const wait = (milliseconds: number): Promise<void> =>
  new Promise((resolve) => {
    window.setTimeout(resolve, milliseconds);
  });

export async function getAssistantAuthHeaders(): Promise<HeadersInit> {
  return getSessionAwareAuthHeaders();
}

export async function sendTimelineAssistantMessage(input: {
  message: string;
  conversation: AssistantConversationMessage[];
  timeline: AssistantTimeline;
  language?: string;
  jurisdiction?: "NSW";
  incidentCategory?: AssistantIncidentCategory;
}): Promise<TimelineAssistantResponse> {
  if (hasBrokenTextEncoding(input.message)) {
    return {
      assistantMessage:
        "The message looks like it was received with broken text encoding. Please resend it.",
      nextQuestion: "",
      timeline: input.timeline,
      readyForSubmission: false,
      confidence: "low",
      citations: [],
      rag: { used: false, unavailable: false, resultCount: 0 },
      reviewStatus: "encoding_error",
      encodingWarning: true,
    };
  }

  const sanitizedInput = sanitizeTimelineAssistantInput(input);
  const normalizedInput = {
    ...input,
    conversation: sanitizedInput.conversation,
    timeline: sanitizedInput.timeline,
  };
  const headers = await getAssistantAuthHeaders();
  await ensureConsent(consentRequirements.aiAssistant, headers);

  let response;

  try {
    response = await apiRequest<TimelineAssistantResponse>(
      "/rag/timeline-assistant",
      {
        method: "POST",
        baseUrl: getApiBaseUrl(),
        headers,
        body: normalizedInput,
      }
    );
  } catch (error) {
    if (!(error instanceof TypeError)) {
      throw error;
    }

    await wait(300);
    response = await apiRequest<TimelineAssistantResponse>(
      "/rag/timeline-assistant",
      {
        method: "POST",
        baseUrl: getApiBaseUrl(),
        headers,
        body: normalizedInput,
      }
    );
  }

  return response.data;
}
