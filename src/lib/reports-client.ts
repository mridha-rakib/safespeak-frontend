"use client";

import { apiRequest } from "@/lib/api";
import { ApiRequestError } from "@/lib/api";
import type { ApiEnvelope } from "@/lib/api";
import { consentRequirements, ensureConsent } from "@/lib/consent";
import {
  clearAnonymousSession,
  getSessionAwareAuthHeaders,
} from "@/lib/frontend-session";

export type ReportRecord = {
  _id: string;
  refNo?: string;
  language?: string;
  jurisdiction?: string;
  lga?: string;
  context?: string;
  originalNarrative?: string;
  translatedNarrative?: string;
  incidentType?: string;
  severity?: string;
  status?: string;
  structuredFields?: Record<string, unknown>;
  consentSnapshot?: Record<string, unknown>;
  statusHistory?: Array<Record<string, unknown>>;
  deletionRequestedAt?: string;
  withdrawnAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReportDestinationPreview = {
  destinationId: string;
  destinationKey: string;
  destinationType: string;
  destinationName: string;
  reason: string;
  channel: string;
  jurisdiction: string;
  languages: string[];
  endpoint?: string;
  contactEmail?: string;
  contactPhone?: string;
  minimumRequiredInfo: string[];
  missingRequiredInfo: string[];
  anonymityOptions: string[];
  expectedNextSteps: string[];
  consentRequired: boolean;
  supportsAcknowledgement: boolean;
  requiredConsentFlags: string[];
  matchedIncidentTypes: string[];
  deliveryReadiness?: {
    status: "ready" | "manual_action" | "config_missing";
    mode: "automated" | "manual" | "config_missing";
    canAutoSend: boolean;
    actuallySends: boolean;
    credentialConfigured: boolean;
    credentialReference?: string;
    configurationIssues: string[];
  };
  payloadPreview: {
    refNo: string;
    title: string;
    summary: string;
    language: string;
    jurisdiction: string;
    incidentType?: string;
    severity?: string;
    structuredFields: Record<string, unknown>;
    evidence: Array<Record<string, unknown>>;
  };
};

export type ReportSubmissionRecord = {
  _id: string;
  reportId: string;
  destinationId: string;
  destinationKey: string;
  destinationType: string;
  destinationName: string;
  channel: string;
  jurisdiction: string;
  languages: string[];
  status: string;
  anonymityMode: "identified" | "anonymous" | "pseudonymous";
  minimumRequiredInfo: string[];
  missingRequiredInfo: string[];
  requiredConsentFlags: string[];
  expectedNextSteps: string[];
  notes?: string;
  endpoint?: string;
  contactEmail?: string;
  contactPhone?: string;
  payloadSnapshot: Record<string, unknown>;
  evidenceSnapshot: Array<Record<string, unknown>>;
  consentSnapshot: Record<string, unknown>;
  deliveryArtifacts?: Array<Record<string, unknown>>;
  deliveryMessage?: string;
  deliveryMode?: "automated" | "manual" | "config_missing";
  deliveryConfigurationStatus?: "ready" | "manual_action" | "config_missing";
  deliveryConfigurationIssues?: string[];
  actuallySent?: boolean;
  externalReference?: string;
  acknowledgementMessage?: string;
  acknowledgementPayload?: Record<string, unknown>;
  previewGeneratedAt?: string;
  submittedAt?: string;
  acknowledgementReceivedAt?: string;
  lastAttemptAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type ReportSubmissionPayloadPreview = {
  destination: Omit<ReportDestinationPreview, "payloadPreview">;
  template: {
    templateId?: string;
    templateKey?: string;
    templateName?: string;
    fieldMappings: Array<{
      source: string;
      target: string;
      required: boolean;
      transform?: string;
    }>;
  };
  missingRequiredInfo: string[];
  missingMappedFields: string[];
  requiredConsentFlags: string[];
  missingConsentFlags: string[];
  payload: Record<string, unknown>;
  evidence: Array<Record<string, unknown>>;
};

export type ReportCreateInput = {
  language: string;
  jurisdiction: string;
  lga?: string;
  context?: string;
  originalNarrative?: string;
  translatedNarrative?: string;
  incidentType?: string;
  severity?: string;
  structuredFields?: Record<string, unknown>;
  status?: string;
};

type ReportResponse = {
  report: ReportRecord;
};

type ReportFromConversationResponse = {
  report: ReportRecord;
  prefill: {
    title: string;
    date: string;
    location: string;
    summary: string;
    incidentType?: string;
    language: string;
    jurisdiction: string;
    structuredFields: Record<string, unknown>;
    conversationSessionId: string;
  };
};

type ReportListResponse = {
  reports: ReportRecord[];
};

type ReportStatusResponse = {
  status: {
    id?: string;
    refNo?: string;
    status?: string;
    current: string;
    updatedAt?: string;
    localOnly?: boolean;
    deletionRequestedAt?: string;
    withdrawnAt?: string;
  };
};

type ReportTimelineResponse = {
  timeline: Array<Record<string, unknown>>;
};

type ReportDestinationResponse = {
  destinations: ReportDestinationPreview[];
};

type ReportSubmissionResponse = {
  submission: ReportSubmissionRecord;
};

type ReportSubmissionListResponse = {
  submissions: ReportSubmissionRecord[];
};

type ReportSubmissionPreviewResponse = {
  previews: ReportSubmissionPayloadPreview[];
};

const allowedStructuredFieldKeys = new Set([
  "who",
  "what",
  "when",
  "where",
  "how",
  "witnesses",
  "repeatedIncidents",
  "injuries",
  "supportMessage",
  "evidenceItems",
]);

function sanitizeStructuredFields(
  structuredFields?: Record<string, unknown>
): Record<string, unknown> | undefined {
  if (!structuredFields) {
    return structuredFields;
  }

  return Object.fromEntries(
    Object.entries(structuredFields).filter(([key]) =>
      allowedStructuredFieldKeys.has(key)
    )
  );
}

function sanitizeReportInput<TInput extends Partial<ReportCreateInput>>(
  input: TInput
): TInput {
  if (!input.structuredFields) {
    return input;
  }

  return {
    ...input,
    structuredFields: sanitizeStructuredFields(input.structuredFields),
  };
}

async function reportApiRequest<TData>(
  path: string,
  options: Omit<Parameters<typeof apiRequest<TData>>[1], "headers"> = {}
): Promise<ApiEnvelope<TData>> {
  const headers = await getSessionAwareAuthHeaders();

  try {
    return await apiRequest<TData>(path, {
      ...options,
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
        headers: retryHeaders,
      });
    }

    throw error;
  }
}

export async function createReport(
  input: ReportCreateInput
): Promise<ReportRecord> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.reportStorage, headers);
  const response = await reportApiRequest<ReportResponse>("/reports", {
    method: "POST",
    body: sanitizeReportInput(input),
  });

  return response.data.report;
}

export async function updateReport(
  reportId: string,
  input: Partial<ReportCreateInput>
): Promise<ReportRecord> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.reportStorage, headers);
  const response = await reportApiRequest<ReportResponse>(
    `/reports/${reportId}`,
    {
      method: "PATCH",
      body: sanitizeReportInput(input),
    }
  );

  return response.data.report;
}

export async function createOrUpdateReportFromConversation(input: {
  conversationSessionId: string;
  reportId?: string;
}): Promise<ReportFromConversationResponse> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.reportStorage, headers);
  const response = await reportApiRequest<ReportFromConversationResponse>(
    `/reports/from-conversation/${input.conversationSessionId}`,
    {
      method: "POST",
      body: input.reportId ? { reportId: input.reportId } : {},
    }
  );

  return response.data;
}

export async function listReports(): Promise<ReportRecord[]> {
  const response = await reportApiRequest<ReportListResponse>("/reports");

  return response.data.reports;
}

export async function getReport(reportId: string): Promise<ReportRecord> {
  const response = await reportApiRequest<ReportResponse>(
    `/reports/${reportId}`
  );

  return response.data.report;
}

export async function getReportStatus(
  reportId: string
): Promise<ReportStatusResponse["status"]> {
  const response = await reportApiRequest<ReportStatusResponse>(
    `/reports/${reportId}/status`
  );

  return response.data.status;
}

export async function getReportTimeline(
  reportId: string
): Promise<ReportTimelineResponse["timeline"]> {
  const response = await reportApiRequest<ReportTimelineResponse>(
    `/reports/${reportId}/timeline`
  );

  return response.data.timeline;
}

export async function withdrawReport(reportId: string): Promise<ReportRecord> {
  const response = await reportApiRequest<ReportResponse>(
    `/reports/${reportId}/withdraw`,
    {
      method: "POST",
    }
  );

  return response.data.report;
}

export async function deleteReport(reportId: string): Promise<void> {
  await reportApiRequest<null>(`/reports/${reportId}`, {
    method: "DELETE",
  });
}

export async function requestReportDelete(
  reportId: string
): Promise<ReportRecord> {
  const response = await reportApiRequest<ReportResponse>(
    `/reports/${reportId}/request-delete`,
    {
      method: "POST",
    }
  );

  return response.data.report;
}

export async function markReportInfoOnly(
  reportId: string
): Promise<ReportRecord> {
  const response = await reportApiRequest<ReportResponse>(
    `/reports/${reportId}/mark-info-only`,
    {
      method: "POST",
    }
  );

  return response.data.report;
}

export async function getReportDestinations(
  reportId: string,
  query: {
    destinationType?: string;
    jurisdiction?: string;
  } = {}
): Promise<ReportDestinationPreview[]> {
  const params = new URLSearchParams();

  if (query.destinationType) {
    params.set("destinationType", query.destinationType);
  }

  if (query.jurisdiction) {
    params.set("jurisdiction", query.jurisdiction);
  }

  const suffix = params.toString() ? `?${params.toString()}` : "";
  const response = await reportApiRequest<ReportDestinationResponse>(
    `/reports/${reportId}/destinations${suffix}`
  );

  return response.data.destinations;
}

export async function listReportSubmissions(
  reportId: string
): Promise<ReportSubmissionRecord[]> {
  const response = await reportApiRequest<ReportSubmissionListResponse>(
    `/reports/${reportId}/submissions`
  );

  return response.data.submissions;
}

export async function previewReportSubmissions(
  reportId: string,
  input: {
    destinationIds: string[];
    anonymityMode?: "identified" | "anonymous" | "pseudonymous";
    notes?: string;
  }
): Promise<ReportSubmissionPayloadPreview[]> {
  const response = await reportApiRequest<ReportSubmissionPreviewResponse>(
    `/reports/${reportId}/submission-previews`,
    {
      method: "POST",
      body: {
        destinationIds: input.destinationIds,
        anonymityMode: input.anonymityMode ?? "identified",
        notes: input.notes,
      },
    }
  );

  return response.data.previews;
}

export async function submitReportToDestination(
  reportId: string,
  input: {
    destinationId: string;
    anonymityMode?: "identified" | "anonymous" | "pseudonymous";
    notes?: string;
    confirmConsent?: boolean;
  }
): Promise<ReportSubmissionRecord> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.reportDestinationSubmit, headers);

  const response = await reportApiRequest<ReportSubmissionResponse>(
    `/reports/${reportId}/submissions`,
    {
      method: "POST",
      body: {
        destinationId: input.destinationId,
        anonymityMode: input.anonymityMode ?? "identified",
        notes: input.notes,
        confirmConsent: input.confirmConsent ?? true,
      },
    }
  );

  return response.data.submission;
}
