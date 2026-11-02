"use client";

import { ApiRequestError, apiRequest, type ApiEnvelope } from "@/lib/api";
import { consentRequirements, ensureConsent } from "@/lib/consent";
import {
  clearAnonymousSession,
  getSessionAwareAuthHeaders,
} from "@/lib/frontend-session";

export type ConversationFlowSession = {
  id: string;
  selectedTopic?: string;
  detectedCategory?: string;
  status:
    | "active"
    | "ready_for_triage"
    | "triaged"
    | "recommendation_ready"
    | "completed";
  safetyRiskLevel: "low" | "medium" | "high" | "immediate";
  activeIssueId?: string;
  latestTurnRiskLevel?: string;
  activeIncidentRiskLevel?: string;
  sessionHistoricalMaxRiskLevel?: string;
  assistantFormatPreference?: "paragraphs" | "bullets" | "mix";
  jurisdiction?: string;
  location?: string;
  messageCount: number;
  userTurnCount: number;
  createdAt?: string;
  updatedAt?: string;
};

export type ConversationFlowMessage = {
  id: string;
  role: "user" | "assistant" | "system";
  content: string;
  turnNumber: number;
  metadata?: Record<string, unknown>;
  createdAt?: string;
};

export type ConversationFlowFactExtraction = {
  whatHappened?: string;
  whenHappened?: string;
  whereHappened?: string;
  peopleInvolved?: string;
  safetyConcerns?: string;
  evidenceMentioned?: string;
  emotionalState?: string;
  extractedEvents?: string[];
  missingInformation?: string[];
  timeline?: Record<string, string>;
};

export type ConversationFlowTriage = {
  likelyCategory: string;
  likelyCategoryLabel?: string;
  confidenceScore: number;
  confidenceLabel?: string;
  safetyRiskLevel: "low" | "medium" | "high" | "immediate";
  reasoningSummary: string;
  structuredFacts?: {
    privacyDataBreach?: boolean;
    identityTheftRisk?: boolean;
    scamFraud?: boolean;
    imageBasedAbuse?: boolean;
    onlineThreatBlackmail?: boolean;
    employerHealthPrivacy?: boolean;
    workplaceBullying?: boolean;
    workplaceContext?: boolean;
    racismDiscrimination?: boolean;
    domesticViolence?: boolean;
    domesticFamilyContext?: boolean;
    coerciveControl?: boolean;
    blackmailOrExtortion?: boolean;
    privatePhotosOrMessages?: boolean;
    personalDataLeak?: boolean;
    companyOrOrganisationInvolved?: boolean;
    employerInvolved?: boolean;
    healthInformation?: boolean;
    identityDocumentsExposed?: boolean;
    bankDetailsExposed?: boolean;
    moneyLost?: boolean;
    protectedAttribute?: boolean;
    schoolContext?: boolean;
    workplaceDiscrimination?: boolean;
    housingOrServiceContext?: boolean;
    elderOrVulnerablePerson?: boolean;
    migrationOrVisaThreat?: boolean;
    languageOrInterpreterNeed?: boolean;
    selfHarmOrSuicidal?: boolean;
    childSafetyRisk?: boolean;
    sexualViolenceRisk?: boolean;
    physicalViolence?: boolean;
    threatsPresent?: boolean;
    immediateDanger?: boolean;
    evidenceAvailable?: boolean;
    matchedFacts?: string[];
    organisations?: string[];
    platforms?: string[];
    protectedAttributes?: string[];
    jurisdiction?: string;
  };
  relatedIssueTypes?: string[];
  safetyOverride?: {
    safetyOverride: boolean;
    safetyLevel: "none" | "low" | "medium" | "high" | "urgent";
    safetyReasons: string[];
    recommendedImmediateActions: string[];
  };
  possiblePathways?: Array<{
    pathwayId: string;
    title: string;
    description: string;
    userFacingLabel: string;
    userFacingIntro: string;
    relatedCategory: string;
  }>;
  intakePlan?: ConversationFlowIntakePlan | null;
  intakePlans?: ConversationFlowIntakePlan[];
  consentGovernance?: ConversationFlowConsentGovernance;
  pathwayExplanation?: string;
  presentation?: {
    title: string;
    body: string;
    assessmentNote: string;
    primaryStepTitle: string;
    primaryStepBody: string;
    immediateDangerBody: string;
    secondTitle: string;
    secondBody: string;
    secondActionLabel: string;
    secondActionHref: string;
    thirdTitle: string;
    thirdBody: string;
    thirdActionLabel: string;
    thirdActionHref: string;
    stepReasons?: string[];
    microCardSummary?: string;
  };
  matchedLegislationIds: string[];
  matchedKnowledgeSources: Array<{
    id?: string;
    title?: string;
    jurisdiction?: string;
    sourceCategory?: string;
    sourceType?: string;
    url?: string;
    summary?: string;
  }>;
  humanReviewRecommended: boolean;
  missingInformation: string[];
  canProceedToRecommendations: boolean;
  matchedResourceTypes: string[];
  disclaimer?: string;
};

export type ConversationFlowRecommendation = {
  id: string;
  title: string;
  description: string;
  category: string;
  resourceType: string;
  ctaLabel?: string;
  phone?: string;
  email?: string;
  websiteUrl?: string;
  priority?: number;
  jurisdiction?: string;
  safetyNotes?: string;
  eligibilityNotes?: string;
  languageSupportNotes?: string;
  active?: boolean;
};

export type ConversationFlowSupportAction = {
  slot:
    | "immediateDanger"
    | "primarySupport"
    | "secondarySupport"
    | "additional";
  serviceId?: string;
  resourceType?: string;
  title: string;
  description: string;
  whySuggested: string;
  ctaLabel?: string;
  phone?: string;
  href: string;
  actionKind: "call" | "external_link";
  consentNote: string;
  websiteUrl?: string;
  issueTypes?: string[];
  jurisdiction?: string;
  urgency?: "low" | "medium" | "high" | "urgent";
  contactType?: "phone" | "web";
  sourceUrl?: string;
  enabled?: boolean;
};

export type ConversationFlowIntakePlan = {
  pathwayId: string;
  requiredFields: Array<{ key: string; label: string }>;
  optionalFields: Array<{ key: string; label: string }>;
  safetyWarnings: string[];
  consentRequiredBeforeSharing: true;
  userFriendlyExplanation: string;
};

export type ConversationFlowConsentGovernance = {
  nothingSharedAutomatically: true;
  userChoosesWhatToDoNext: true;
  reviewWithoutSending: true;
  consentRequiredBeforeSharing: true;
  consentRequiredBeforeReferral: true;
  consentRequiredBeforeExport: true;
  consentRequiredBeforeEvidenceUpload: true;
  consentRequiredBeforeCloudSync: true;
  noAutomaticPoliceEscalation: true;
  noBackgroundTracking: true;
  messages: string[];
};

export type ConversationFlowReportPreparation = {
  status: "draft" | "info_only" | "ready_to_review" | "submitted" | "withdrawn";
  informationOnlyDisclaimer: string;
  consentState: "not_granted";
  notSentYet: true;
  userNarrativeSummary: string;
  structuredFactsSummary: string[];
  timeline: Array<{ label: string; value: string }>;
  evidenceList: string[];
  selectedPathwayId?: string;
  missingFields: string[];
};

export type ConversationFlowSupportBundle = {
  suggestedMicroCardIds: string[];
  recommendedActions: ConversationFlowSupportAction[];
  additionalResources: ConversationFlowSupportAction[];
  matchedSupportServices: ConversationFlowRecommendation[];
  fallbackUsed?: boolean;
  possiblePathways?: ConversationFlowTriage["possiblePathways"];
  intakePlan?: ConversationFlowIntakePlan | null;
  intakePlans?: ConversationFlowIntakePlan[];
  consentGovernance?: ConversationFlowConsentGovernance;
  reportPreparation?: ConversationFlowReportPreparation;
};

export type ConversationFlowDetails = {
  category: string;
  categoryLabel: string;
  safetyRiskLevel: "low" | "medium" | "high" | "immediate";
  matchedKnowledgeSources: ConversationFlowTriage["matchedKnowledgeSources"];
  matchedLegislationIds: string[];
  humanReviewRecommended: boolean;
  sections: {
    overview: { title: string; body: string };
    rights: { title: string; items: Array<{ title: string; body: string }> };
    reportingOptions: {
      title: string;
      items: ConversationFlowRecommendation[];
    };
    evidenceGuide: { title: string; items: Array<Record<string, unknown>> };
    supportServices: { title: string; items: ConversationFlowRecommendation[] };
    safetyPlanning: { title: string; items: Array<Record<string, unknown>> };
  };
  disclaimer: string;
};

type CreateSessionResponse = {
  session: ConversationFlowSession;
};

type ConversationTurnResponse = {
  session: ConversationFlowSession;
  userMessage: ConversationFlowMessage;
  assistantMessage: ConversationFlowMessage;
  factExtraction: ConversationFlowFactExtraction | null;
  triage?: ConversationFlowTriage | null;
  transition: {
    offerTriage: boolean;
    prompt?: string | null;
    primaryCta?: string | null;
    secondaryCta?: string | null;
  };
  responseMeta?: {
    confidence?: string;
    disclaimer?: string;
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
    citations?: Array<{
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
    rag?: {
      used: boolean;
      unavailable: boolean;
      resultCount: number;
    };
    reviewStatus?: string;
    assistantLanguage?: string;
    safetyOverride?: boolean;
    safetyLevel?: "none" | "low" | "medium" | "high" | "urgent";
    safetyReasons?: string[];
    recommendedImmediateActions?: string[];
    nonIncidentTurn?: boolean;
    triageUpdated?: boolean;
    latestTurnRiskLevel?: string;
    activeIncidentRiskLevel?: string;
    sessionHistoricalMaxRiskLevel?: string;
    assistantFormatPreference?: "paragraphs" | "bullets" | "mix";
    formatPreferenceUpdated?: boolean;
    subIntent?: string;
    encodingWarning?: boolean;
  };
};

type SessionEnvelope = {
  session: ConversationFlowSession;
  messages: ConversationFlowMessage[];
  factExtraction?: ConversationFlowFactExtraction | null;
  triage?: ConversationFlowTriage | null;
};

type TriageEnvelope = {
  session: ConversationFlowSession;
  triage: ConversationFlowTriage;
};

type RecommendationsEnvelope = {
  session: ConversationFlowSession;
  recommendations: ConversationFlowRecommendation[];
  fallbackUsed?: boolean;
};

type SupportEnvelope = {
  session: ConversationFlowSession;
  triage: ConversationFlowTriage;
  support: ConversationFlowSupportBundle;
};

type DetailsEnvelope = {
  session: ConversationFlowSession;
  details: ConversationFlowDetails;
};

async function getConversationHeaders(): Promise<HeadersInit> {
  const headers = await getSessionAwareAuthHeaders();

  await ensureConsent(consentRequirements.aiAssistant, headers);

  return headers;
}

async function conversationApiRequest<TData>(
  path: string,
  options: Omit<Parameters<typeof apiRequest<TData>>[1], "headers"> = {}
): Promise<ApiEnvelope<TData>> {
  const headers = await getConversationHeaders();

  try {
    return await apiRequest<TData>(path, {
      ...options,
      headers,
    });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      clearAnonymousSession();
      const retryHeaders = await getConversationHeaders();

      return apiRequest<TData>(path, {
        ...options,
        headers: retryHeaders,
      });
    }

    throw error;
  }
}

export async function createConversationFlowSession(input: {
  selectedTopic?: string;
  jurisdiction?: string;
  location?: string;
}): Promise<ConversationFlowSession> {
  const response = await conversationApiRequest<CreateSessionResponse>(
    "/conversation-flow/sessions",
    {
      method: "POST",
      body: input,
    }
  );

  return response.data.session;
}

export async function getConversationFlowSession(
  conversationSessionId: string
): Promise<SessionEnvelope> {
  const response = await conversationApiRequest<SessionEnvelope>(
    `/conversation-flow/sessions/${conversationSessionId}`,
    {}
  );

  return response.data;
}

export async function appendConversationFlowMessage(input: {
  conversationSessionId: string;
  content: string;
  language?: string;
}): Promise<ConversationTurnResponse> {
  const response = await conversationApiRequest<ConversationTurnResponse>(
    `/conversation-flow/sessions/${input.conversationSessionId}/messages`,
    {
      method: "POST",
      body: {
        content: input.content,
        language: input.language ?? "en",
      },
    }
  );

  return response.data;
}

export async function fetchConversationFlowTriage(
  conversationSessionId: string
): Promise<TriageEnvelope> {
  const response = await conversationApiRequest<TriageEnvelope>(
    `/conversation-flow/sessions/${conversationSessionId}/triage`,
    {}
  );

  return response.data;
}

export async function fetchConversationFlowSupport(
  conversationSessionId: string
): Promise<SupportEnvelope> {
  const response = await conversationApiRequest<SupportEnvelope>(
    `/conversation-flow/sessions/${conversationSessionId}/support`,
    {}
  );

  return response.data;
}

export async function fetchConversationFlowRecommendations(
  conversationSessionId: string
): Promise<RecommendationsEnvelope> {
  const response = await conversationApiRequest<RecommendationsEnvelope>(
    `/conversation-flow/sessions/${conversationSessionId}/recommendations`,
    {}
  );

  return response.data;
}

export async function fetchConversationFlowDetails(
  conversationSessionId: string
): Promise<DetailsEnvelope> {
  const response = await conversationApiRequest<DetailsEnvelope>(
    `/conversation-flow/sessions/${conversationSessionId}/details`,
    {}
  );

  return response.data;
}

