"use client";

import { apiRequest } from "@/lib/api";
import { consentRequirements, ensureConsent } from "@/lib/consent";
import { getSessionAwareAuthHeaders } from "@/lib/frontend-session";

export type ScamAnalysisRecord = {
  _id?: string;
  type?: string;
  inputType?: string;
  riskScore?: number;
  riskLevel?: string;
  confidence?: string;
  indicators?: string[];
  redFlags?: string[];
  recommendations?: string[];
  extractedEntities?: Record<string, unknown>;
  summary?: string;
  draftOptions?: unknown;
  draftReport?: {
    summary?: string;
    draft?: string;
    notes?: string;
    autoRedactPII?: boolean;
    redactionMode?: "mask" | "labels";
    indicators?: string[];
    redFlags?: string[];
    recommendations?: string[];
    confidence?: string;
    scamCategory?: string;
    platform?: string;
    senderName?: string;
    extractedEntities?: Record<string, unknown>;
    senderAnalysis?: Record<string, unknown>;
    urlReputation?: Record<string, unknown>;
    destinations?: Record<string, unknown>;
    riskLevel?: string;
    riskScore?: number;
    [key: string]: unknown;
  };
  metadata?: Record<string, unknown>;
  status?: string;
  submittedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

type ScamAnalysisResponse = {
  analysis: ScamAnalysisRecord;
};

type ScamDraftResponse = {
  analysis: ScamAnalysisRecord;
};

export async function analyzeScamText(input: {
  text: string;
  language?: string;
  reportId?: string;
  metadata?: Record<string, unknown>;
}): Promise<ScamAnalysisRecord> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.scamAnalysis, headers);
  const response = await apiRequest<ScamAnalysisResponse>(
    "/scamshield/analyze-text",
    {
      method: "POST",
      headers,
      body: input,
    }
  );

  return response.data.analysis;
}

export async function analyzeScamEmail(input: {
  body: string;
  subject?: string;
  from?: string;
  headers?: Record<string, string>;
  forwardedWithPermission?: boolean;
  reportId?: string;
  metadata?: Record<string, unknown>;
}): Promise<ScamAnalysisRecord> {
  const requestHeaders = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.scamAnalysis, requestHeaders);
  const response = await apiRequest<ScamAnalysisResponse>(
    "/scamshield/analyze-email",
    {
      method: "POST",
      headers: requestHeaders,
      body: input,
    }
  );

  return response.data.analysis;
}

export async function analyzeScamScreenshot(input: {
  imageText?: string;
  imageFile?: File;
  evidenceFiles?: File[];
  evidenceId?: string;
  reportId?: string;
  metadata?: Record<string, unknown>;
}): Promise<ScamAnalysisRecord> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.scamAnalysis, headers);
  const files = input.evidenceFiles?.length
    ? input.evidenceFiles
    : input.imageFile
      ? [input.imageFile]
      : [];
  const body =
    typeof File !== "undefined" && files.length > 0
      ? (() => {
          const formData = new FormData();

          files.forEach((file) => {
            formData.append("files", file, file.name);
          });
          if (input.imageText) {
            formData.set("imageText", input.imageText);
          }
          if (input.evidenceId) {
            formData.set("evidenceId", input.evidenceId);
          }
          if (input.reportId) {
            formData.set("reportId", input.reportId);
          }
          formData.set(
            "metadata",
            JSON.stringify({
              ...input.metadata,
              files: files.map((file) => ({
                fileName: file.name,
                mimeType: file.type,
                size: file.size,
              })),
            })
          );

          return formData;
        })()
      : {
          imageText: input.imageText,
          evidenceId: input.evidenceId,
          reportId: input.reportId,
          metadata: input.metadata,
        };
  const response = await apiRequest<ScamAnalysisResponse>(
    "/scamshield/analyze-screenshot",
    {
      method: "POST",
      headers,
      body,
    }
  );

  return response.data.analysis;
}

export async function checkScamUrl(input: {
  url: string;
  reportId?: string;
  metadata?: Record<string, unknown>;
}): Promise<ScamAnalysisRecord> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.scamAnalysis, headers);
  const response = await apiRequest<ScamAnalysisResponse>(
    "/scamshield/check-url",
    {
      method: "POST",
      headers,
      body: input,
    }
  );

  return response.data.analysis;
}

export async function generateScamReportDraft(input: {
  analysisId?: string;
  analysisSnapshot?: Record<string, unknown>;
  notes?: string;
  autoRedactPII?: boolean;
  redactionMode?: "mask" | "labels";
}): Promise<ScamAnalysisRecord> {
  const headers = await getSessionAwareAuthHeaders();
  const response = input.analysisId
    ? await apiRequest<ScamDraftResponse>(
        `/scamshield/${input.analysisId}/generate-report-draft`,
        {
          method: "POST",
          headers,
          body: {
            notes: input.notes,
            autoRedactPII: input.autoRedactPII,
            redactionMode: input.redactionMode,
          },
        }
      )
    : await apiRequest<ScamDraftResponse>("/scamshield/generate-report-draft", {
        method: "POST",
        headers,
        body: {
          analysisSnapshot: input.analysisSnapshot,
          notes: input.notes,
          autoRedactPII: input.autoRedactPII,
          redactionMode: input.redactionMode,
        },
      });

  return response.data.analysis;
}

export async function generateScamReportDraftLegacy(input: {
  analysisId?: string;
  analysisSnapshot?: Record<string, unknown>;
  notes?: string;
  autoRedactPII?: boolean;
  redactionMode?: "mask" | "labels";
}): Promise<ScamAnalysisRecord> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<ScamDraftResponse>(
    "/scamshield/generate-report-draft",
    {
      method: "POST",
      headers,
      body: input,
    }
  );

  return response.data.analysis;
}

export async function redactScamContent(input: {
  text: string;
  replacement?: "mask" | "labels";
}): Promise<{ redactedText: string; informationOnly?: boolean }> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.scamAnalysis, headers);
  const response = await apiRequest<{ result: { redactedText: string; informationOnly?: boolean } }>(
    "/scamshield/redact",
    {
      method: "POST",
      headers,
      body: {
        text: input.text,
        replacement: input.replacement,
      },
    }
  );

  return response.data.result;
}

export async function submitScamReport(input: {
  analysisId?: string;
  analysisSnapshot?: Record<string, unknown>;
  destination?: string;
  consentToShare?: boolean;
}): Promise<ScamAnalysisRecord> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.shareWithAgencies, headers);
  const response = input.analysisId
    ? await apiRequest<ScamAnalysisResponse>(`/scamshield/${input.analysisId}/submit`, {
        method: "POST",
        headers,
        body: {
          destination: input.destination,
          consentToShare: input.consentToShare,
        },
      })
    : await apiRequest<ScamAnalysisResponse>("/scamshield/submit", {
        method: "POST",
        headers,
        body: {
          analysisSnapshot: input.analysisSnapshot,
          destination: input.destination,
          consentToShare: input.consentToShare,
        },
      });

  return response.data.analysis;
}

export async function getScamAnalysis(
  analysisId: string
): Promise<ScamAnalysisRecord> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<ScamAnalysisResponse>(
    `/scamshield/${analysisId}`,
    {
      headers,
    }
  );

  return response.data.analysis;
}
