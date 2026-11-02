"use client";

import {
  ApiRequestError,
  apiRequest,
  getApiBaseUrl,
  type ApiEnvelope,
} from "@/lib/api";
import {
  consentRequirements,
  ensureConsent,
  type ConsentRequirement,
} from "@/lib/consent";
import {
  clearAnonymousSession,
  getSessionAwareAuthHeaders,
} from "@/lib/frontend-session";

export type AiIncidentCategory =
  | "domestic_violence"
  | "racial_abuse"
  | "migrant_challenges"
  | "cyber_scam";

export type AiCitation = {
  sourceType?: string;
  sourceId?: string;
  title?: string;
  excerpt?: string;
};

export type AiInteractionResult<TOutput extends object> = {
  interactionId?: string;
  output?: TOutput;
  citations?: AiCitation[];
  guardrails?: Record<string, unknown>;
  reviewStatus?: string;
};

export type ExtractIncidentFieldsInput = {
  reportId?: string;
  language?: string;
  incidentCategory?: AiIncidentCategory;
  narrative: string;
  jurisdiction?: string;
};

export type TriageReportInput = {
  reportId?: string;
  language?: string;
  incidentCategory?: AiIncidentCategory;
  narrative?: string;
  structuredFields?: Record<string, unknown>;
};

export type ClarifyingQuestionsInput = {
  reportId?: string;
  language?: string;
  incidentCategory?: AiIncidentCategory;
  narrative: string;
  structuredFields?: Record<string, unknown>;
  maxQuestions?: number;
};

export type GenerateSummaryInput = {
  reportId?: string;
  language?: string;
  incidentCategory?: AiIncidentCategory;
  narrative?: string;
  structuredFields?: Record<string, unknown>;
  audience?: "user" | "support_worker" | "reviewer";
};

export type TranslateInput = {
  text: string;
  sourceLanguage?: string;
  targetLanguage?: string;
};

export type RedactPiiInput = {
  text: string;
  language?: string;
  replacementStyle?: "labels" | "mask";
};

export type ExtractIncidentFieldsOutput = {
  incidentType?: string;
  who?: string;
  what?: string;
  when?: string;
  where?: string;
  how?: string;
  risks?: string[] | string;
  evidenceMentioned?: string[] | string;
  missingInformation?: string[] | string;
  citations?: AiCitation[];
  reviewStatus?: string;
};

export type ClarifyingQuestionsOutput = {
  questions?: string[];
  rationale?: string;
  citations?: AiCitation[];
  reviewStatus?: string;
};

export type GenerateSummaryOutput = {
  summary?: string;
  keyFacts?: string[];
  uncertaintyNotes?: string[];
  citations?: AiCitation[];
  reviewStatus?: string;
};

export type TranslateOutput = {
  translatedText?: string;
  sourceLanguage?: string;
  targetLanguage?: string;
  reviewStatus?: string;
};

export type RedactPiiOutput = {
  redactedText?: string;
  detectedEntities?: Array<Record<string, unknown>> | string[];
  replacementStyle?: string;
  reviewStatus?: string;
};

export type TriageReportResult = {
  severitySignal?: string;
  primarySupportNeed?: string;
  specialtyTag?: string;
  summary?: string;
  assessmentBody?: string;
  riskFactors?: string[];
  suggestedSupportCategories?: string[];
  recommendedActions?: string[];
  resourceRecommendations?: Array<{
    title?: string;
    body?: string;
    type?: string;
  }>;
  nonLegalSafetyNotes?: string[];
  immediateSafetyFlag?: boolean;
  confidence?: string;
  citations?: AiCitation[];
  fallbackReason?: string;
  pendingHumanReview?: boolean;
  safetyFlags?: Record<string, unknown>;
  disclaimer?: string;
  humanReviewNote?: string;
  reviewStatus?: string;
  interactionId?: string;
  templateVersion?: number;
  templateStatus?: string;
};

type AiResultResponse<TResult> = {
  result: TResult;
};

async function aiApiRequest<TData>(
  path: string,
  options: Omit<Parameters<typeof apiRequest<TData>>[1], "headers"> = {}
): Promise<ApiEnvelope<TData>> {
  const headers = await getSessionAwareAuthHeaders();

  try {
    return await apiRequest<TData>(path, {
      ...options,
      baseUrl: getApiBaseUrl(),
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
        baseUrl: getApiBaseUrl(),
        headers: retryHeaders,
      });
    }

    throw error;
  }
}

async function runAiHelper<TResult>(
  path: string,
  body: unknown,
  consentRequirement: ConsentRequirement = consentRequirements.aiAssistant
): Promise<TResult> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirement, headers);
  const response = await aiApiRequest<AiResultResponse<TResult>>(path, {
    method: "POST",
    body,
  });

  return response.data.result;
}

export function extractIncidentFields(
  input: ExtractIncidentFieldsInput
): Promise<AiInteractionResult<ExtractIncidentFieldsOutput>> {
  return runAiHelper("/ai/extract-incident-fields", input);
}

export function triageReport(
  input: TriageReportInput
): Promise<TriageReportResult> {
  return runAiHelper("/ai/triage-report", input, consentRequirements.triage);
}

export function generateClarifyingQuestions(
  input: ClarifyingQuestionsInput
): Promise<AiInteractionResult<ClarifyingQuestionsOutput>> {
  return runAiHelper("/ai/clarifying-questions", input);
}

export function generateSummary(
  input: GenerateSummaryInput
): Promise<AiInteractionResult<GenerateSummaryOutput>> {
  return runAiHelper("/ai/generate-summary", input);
}

export function translateText(
  input: TranslateInput
): Promise<AiInteractionResult<TranslateOutput>> {
  return runAiHelper("/ai/translate", input);
}

export function redactPii(
  input: RedactPiiInput
): Promise<AiInteractionResult<RedactPiiOutput>> {
  return runAiHelper("/ai/redact-pii", input);
}
