"use client";

import { apiRequest } from "@/lib/api";
import { consentRequirements, ensureConsent } from "@/lib/consent";
import { getSessionAwareAuthHeaders } from "@/lib/frontend-session";

export type EvidenceRecord = {
  _id?: string;
  id?: string;
  reportId?: string;
  type?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  sha256Hash?: string;
  status?: string;
  storageStatus?: string;
  storageProvider?: string;
  metadata?: Record<string, unknown>;
  consentSnapshot?: Record<string, unknown>;
  deletionRequestedAt?: string;
  deletedAt?: string;
  transcription?: {
    text?: string;
    transcript?: string;
    language?: string;
    model?: string;
    provider?: string;
    transcribedAt?: string;
    savedAt?: string;
  };
  createdAt?: string;
  updatedAt?: string;
};

export type EvidenceMetadata = {
  id?: string;
  _id?: string;
  reportId?: string;
  type?: string;
  fileName?: string;
  mimeType?: string;
  size?: number;
  storageKey?: string;
  storageRegion?: string;
  sha256Hash?: string;
  encryptionKeyRef?: string;
  metadata?: Record<string, unknown>;
  consentSnapshot?: Record<string, unknown>;
  status?: string;
  storageProvider?: string;
  createdAt?: string;
  updatedAt?: string;
  deletionRequestedAt?: string;
  deletedAt?: string;
};

export type EvidenceHashVerification = {
  verified: boolean;
  expectedSha256Hash?: string;
  providedSha256Hash?: string;
  computedSha256Hash?: string;
};

export type EvidenceAuditChainEntry = {
  _id?: string;
  id?: string;
  evidenceId?: string;
  reportId?: string;
  actorType?: "user" | "anonymous_session" | "system" | string;
  actorId?: string;
  sessionId?: string;
  action: string;
  sequence: number;
  previousHash?: string;
  eventHash?: string;
  signature?: string;
  metadata?: Record<string, unknown>;
  createdAt?: string;
};

export type EvidenceTranscriptionResult = {
  evidenceId?: string;
  reportId?: string;
  transcript?: string;
  language?: string;
  model?: string;
  saved?: boolean;
  transcription?: {
    text?: string;
    language?: string;
    model?: string;
    provider?: string;
    transcribedAt?: string;
  };
};

type UploadUrlInput = {
  reportId: string;
  type: string;
  fileName: string;
  mimeType: string;
  size: number;
  metadata?: Record<string, unknown>;
};

type UploadUrlResponse = {
  evidence: EvidenceRecord;
  upload: {
    uploadUrl?: string;
    method?: string;
    fields?: Record<string, string>;
  };
};

type EvidenceResponse = {
  evidence: EvidenceRecord;
};

type EvidenceListResponse = {
  evidence: EvidenceRecord[];
};

type EvidenceMetadataResponse = {
  metadata: EvidenceMetadata;
};

type EvidenceHashVerificationResponse = {
  verification: EvidenceHashVerification;
};

type EvidenceAuditChainResponse = {
  auditChain: EvidenceAuditChainEntry[];
};

type TranscriptResponse = {
  transcript: string;
  language?: string;
  model?: string;
  saved?: boolean;
};

export function resolveEvidenceId(
  evidence: Pick<EvidenceRecord, "id" | "_id">
): string {
  return evidence.id ?? evidence._id ?? "";
}

export async function requestEvidenceUploadUrl(
  input: UploadUrlInput
): Promise<UploadUrlResponse> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.cloudEvidence, headers);
  const response = await apiRequest<UploadUrlResponse>("/evidence/upload-url", {
    method: "POST",
    headers,
    body: input,
  });

  return response.data;
}

export async function completeEvidenceUpload(input: {
  evidenceId: string;
  sha256Hash: string;
  file: File;
  metadata?: Record<string, unknown>;
}): Promise<EvidenceRecord> {
  const headers = await getSessionAwareAuthHeaders();
  const formData = new FormData();

  formData.set("evidenceId", input.evidenceId);
  formData.set("sha256Hash", input.sha256Hash);
  formData.set("file", input.file, input.file.name);

  if (input.metadata) {
    formData.set("metadata", JSON.stringify(input.metadata));
  }

  const response = await apiRequest<EvidenceResponse>(
    "/evidence/complete-upload",
    {
      method: "POST",
      headers,
      body: formData,
    }
  );

  return response.data.evidence;
}

export async function transcribeEvidence(
  evidenceId: string,
  input: {
    language?: string;
    saveTranscript?: boolean;
    reportId?: string;
    useAsNarrative?: boolean;
  }
): Promise<TranscriptResponse> {
  const headers = await getSessionAwareAuthHeaders();
  await ensureConsent(consentRequirements.evidenceTranscription, headers);
  const response = await apiRequest<TranscriptResponse>(
    `/evidence/${evidenceId}/transcribe`,
    {
      method: "POST",
      headers,
      body: input,
    }
  );

  return response.data;
}

export async function getEvidence(evidenceId: string): Promise<EvidenceRecord> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<EvidenceResponse>(
    `/evidence/${evidenceId}`,
    {
      headers,
    }
  );

  return response.data.evidence;
}

export async function listReportEvidence(
  reportId: string
): Promise<EvidenceRecord[]> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<EvidenceListResponse>(
    `/reports/${reportId}/evidence`,
    {
      headers,
    }
  );

  return response.data.evidence;
}

export async function getEvidenceMetadata(
  evidenceId: string
): Promise<EvidenceMetadata> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<EvidenceMetadataResponse>(
    `/evidence/${evidenceId}/metadata`,
    {
      headers,
    }
  );

  return response.data.metadata;
}

export async function verifyEvidenceHash(
  evidenceId: string,
  sha256Hash: string
): Promise<EvidenceHashVerification> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<EvidenceHashVerificationResponse>(
    `/evidence/${evidenceId}/verify-hash`,
    {
      method: "POST",
      headers,
      body: {
        sha256Hash,
      },
    }
  );

  return response.data.verification;
}

export async function getEvidenceAuditChain(
  evidenceId: string
): Promise<EvidenceAuditChainEntry[]> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<EvidenceAuditChainResponse>(
    `/evidence/${evidenceId}/audit-chain`,
    {
      headers,
    }
  );

  return response.data.auditChain;
}

export async function deleteEvidence(evidenceId: string): Promise<void> {
  const headers = await getSessionAwareAuthHeaders();

  await apiRequest<null>(`/evidence/${evidenceId}`, {
    method: "DELETE",
    headers,
  });
}

export async function getEvidenceTranscription(
  evidenceId: string
): Promise<EvidenceTranscriptionResult> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<EvidenceTranscriptionResult>(
    `/evidence/${evidenceId}/transcription`,
    {
      headers,
    }
  );

  return response.data;
}
