"use client";

import {
  ApiRequestError,
  apiRequest,
  getAiAgentApiBaseUrl,
  getApiBaseUrl,
  type ApiEnvelope,
} from "@/lib/api";
import { consentRequirements, ensureConsent } from "@/lib/consent";
import {
  clearAnonymousSession,
  getSessionAwareAuthHeaders,
} from "@/lib/frontend-session";

export type RagSourceCategory =
  | "internal_product_rule"
  | "official_legal_source"
  | "official_support_source"
  | "admin_content";

export type RagJurisdiction =
  | "Cth"
  | "NSW"
  | "VIC"
  | "QLD"
  | "SA"
  | "WA"
  | "TAS"
  | "NT"
  | "ACT"
  | "AU"
  | "Global"
  | "Internal";

export type RagTopic =
  | "discrimination"
  | "racial_hatred"
  | "online_safety"
  | "scam"
  | "privacy"
  | "workplace"
  | "dv"
  | "evidence"
  | "support"
  | "safespeak_policy"
  | "consent"
  | "crisis"
  | "education"
  | "other";

export type RagSourceType =
  | "Act"
  | "Regulation"
  | "Guideline"
  | "Form"
  | "Decision"
  | "Report"
  | "Policy"
  | "ProductRequirement"
  | "SupportResource"
  | "FAQ"
  | "WebPage";

export type RagSearchInput = {
  query: string;
  topK?: number;
  language?: string;
  jurisdiction?: RagJurisdiction;
  sourceCategory?: RagSourceCategory;
  topic?: RagTopic;
  filters?: Record<string, unknown>;
};

export type RagAnswerInput = RagSearchInput & {
  question: string;
};

export type RagSearchResult = {
  chunkId: string;
  sourceId: string;
  title: string;
  publisher: string;
  sourceCategory: RagSourceCategory;
  sourceType: RagSourceType;
  jurisdiction: RagJurisdiction;
  topic: RagTopic;
  sectionRef?: string;
  lastUpdated?: string;
  citationUrl?: string;
  text: string;
  score?: number;
  metadata: Record<string, unknown>;
};

export type RagAnswerCitation = {
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
  amendingInstrument?: string;
  lastUpdated?: string;
};

export type RagLegalAwarenessCard = {
  title: string;
  body: string;
  sourceRequirement: string;
};

export type RagLegalAwareness = {
  jurisdiction: "NSW";
  topic: "racial_abuse" | "migrant_challenges";
  informationOnly: true;
  sourceStatus: "approved_sources_used" | "insufficient_approved_sources";
  keyPoints: string[];
  pathwayCards: RagLegalAwarenessCard[];
  citationPolicy: string;
};

export type RagAnswerResult = {
  answer?: string;
  disclaimer?: string;
  citations?: RagAnswerCitation[];
  sourceCategoriesUsed?: string[];
  confidence?: string;
  pendingHumanReview?: boolean;
  safetyFlags?: Record<string, unknown>;
  legalAwareness?: RagLegalAwareness;
};

type RagSearchResponse = {
  results: RagSearchResult[];
};

async function ragApiRequest<TData>(
  path: string,
  options: Omit<Parameters<typeof apiRequest<TData>>[1], "headers"> = {},
  baseUrl = getApiBaseUrl(),
): Promise<ApiEnvelope<TData>> {
  const headers = await getSessionAwareAuthHeaders();

  try {
    return await apiRequest<TData>(path, {
      ...options,
      baseUrl,
      headers,
    });
  } catch (error) {
    if (error instanceof ApiRequestError && error.status === 401) {
      clearAnonymousSession();
      const retryHeaders = await getSessionAwareAuthHeaders({
        forceNewAnonymous: true,
      });

      return apiRequest<TData>(path, {
        ...options,
        baseUrl,
        headers: retryHeaders,
      });
    }

    throw error;
  }
}

export async function searchRagSources(
  input: RagSearchInput
): Promise<RagSearchResult[]> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.sourceBackedQuestion, headers);
  const response = await ragApiRequest<RagSearchResponse>("/rag/search", {
    method: "POST",
    body: input,
  }, getAiAgentApiBaseUrl());

  return response.data.results;
}

export async function answerRagQuestion(
  input: RagAnswerInput
): Promise<RagAnswerResult> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.sourceBackedQuestion, headers);
  const response = await ragApiRequest<RagAnswerResult>("/rag/answer", {
    method: "POST",
    body: input,
  }, getAiAgentApiBaseUrl());

  return response.data;
}
