"use client";

import { ApiRequestError, apiRequest, type ApiEnvelope } from "@/lib/api";
import {
  clearAnonymousSession,
  getSessionAwareAuthHeaders,
} from "@/lib/frontend-session";

export type PrivacyRequestType =
  | "data_export"
  | "data_deletion"
  | "account_deactivation";

export type PrivacyRequestStatus =
  | "pending"
  | "in_review"
  | "completed"
  | "rejected";

export type PrivacyRequestRecord = {
  _id?: string;
  id?: string;
  userId?: string;
  sessionId?: string;
  requestType: PrivacyRequestType | string;
  status: PrivacyRequestStatus | string;
  notes?: string;
  reviewedAt?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type PrivacyExportPayload = {
  exportVersion: number;
  exportedAt: string;
  owner: {
    type: "user" | "anonymous_session";
    userId?: string;
    sessionId?: string;
  };
  user?: unknown;
  anonymousSession?: unknown;
  profile?: unknown;
  consentHistory?: unknown[];
  reports?: unknown[];
  reportSubmissions?: unknown[];
  evidence?: unknown[];
  evidenceAuditChain?: unknown[];
  aiInteractions?: unknown[];
  conversationFlow?: {
    sessions?: unknown[];
    messages?: unknown[];
    facts?: unknown[];
    triage?: unknown[];
  };
  scamShieldAnalyses?: unknown[];
  support?: {
    warmReferrals?: unknown[];
    advocateRequests?: unknown[];
    safetyPlans?: unknown[];
  };
  privacyRequests?: unknown[];
  limitations?: Record<string, unknown>;
};

type PrivacyRequestResponse = {
  request: PrivacyRequestRecord;
};

type PrivacyRequestsResponse = {
  requests: PrivacyRequestRecord[];
};

type PrivacyExportResponse = {
  export: PrivacyExportPayload;
};

type DeactivateResponse = {
  user: unknown;
};

async function privacyApiRequest<TData>(
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

export async function listPrivacyRequests(): Promise<PrivacyRequestRecord[]> {
  const response =
    await privacyApiRequest<PrivacyRequestsResponse>("/privacy-requests/me");

  return response.data.requests;
}

export async function createPrivacyRequest(input: {
  requestType: PrivacyRequestType;
  notes?: string;
  confirmation: boolean;
}): Promise<PrivacyRequestRecord> {
  const response = await privacyApiRequest<PrivacyRequestResponse>(
    "/privacy-requests",
    {
      method: "POST",
      body: input,
    }
  );

  return response.data.request;
}

export async function requestDataDeletion(input: {
  notes?: string;
  confirmation: boolean;
}): Promise<PrivacyRequestRecord> {
  const response = await privacyApiRequest<PrivacyRequestResponse>(
    "/privacy/delete-request",
    {
      method: "POST",
      body: input,
    }
  );

  return response.data.request;
}

export async function downloadPrivacyExport(): Promise<PrivacyExportPayload> {
  const response =
    await privacyApiRequest<PrivacyExportResponse>("/privacy/export");

  return response.data.export;
}

export async function deactivateAccount(): Promise<unknown> {
  const response = await privacyApiRequest<DeactivateResponse>(
    "/auth/deactivate",
    {
      method: "POST",
      body: {
        confirmation: "DEACTIVATE",
      },
    }
  );

  return response.data.user;
}

export function savePrivacyExportFile(
  payload: PrivacyExportPayload,
  filename = "safespeak-data-export.json"
): void {
  if (typeof window === "undefined" || typeof document === "undefined") {
    return;
  }

  const blob = new Blob([JSON.stringify(payload, null, 2)], {
    type: "application/json",
  });
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");

  anchor.href = url;
  anchor.download = filename;
  anchor.click();
  window.URL.revokeObjectURL(url);
}
