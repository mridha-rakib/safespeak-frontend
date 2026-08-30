"use client";

import type { ReportFlowDraft } from "@/lib/report-flow";
import type {
  ReportDestinationPreview,
  ReportSubmissionPayloadPreview,
  ReportSubmissionRecord,
} from "@/lib/reports-client";

export const REPORT_SUBMISSION_MOCK_MODE = false;

const MOCK_REPORT_ID = "mock-report-local";
const MOCK_REPORT_REF = "SS-MOCK-0001";

export function getMockReportId(draft?: ReportFlowDraft | null): string {
  return draft?.reportId ?? MOCK_REPORT_ID;
}

export function getMockReportRef(): string {
  return MOCK_REPORT_REF;
}

export function getMockReportStatus(
  draft?: ReportFlowDraft | null
): "draft" | "prepared" | "submitted" {
  if (draft?.latestSubmissionId) {
    return "submitted";
  }

  if (draft?.preparedSubmission) {
    return "prepared";
  }

  return "draft";
}

export function getMockDestinations(
  draft?: ReportFlowDraft | null
): ReportDestinationPreview[] {
  const summary = draft?.summary?.trim() || "Mock SafeSpeak report summary";
  const title = draft?.title?.trim() || "Incident report";
  const jurisdiction = draft?.structuredFields?.jurisdiction as string | undefined;
  const resolvedJurisdiction = draft?.structuredFields?.where
    ? "AU"
    : draft?.structuredFields?.jurisdiction
      ? String(jurisdiction)
      : "AU";
  const structuredFields = draft?.structuredFields ?? {};
  const evidence = (draft?.evidenceIds ?? []).map((evidenceId) => ({
    evidenceId,
    status: "attached",
  }));

  return [
    {
      destinationId: "mock-police",
      destinationKey: "mock-police",
      destinationType: "police",
      destinationName: "Local Police Assistance Desk",
      reason: "Recommended because your draft describes a direct incident with identifiable time and location details.",
      channel: "secure_api",
      jurisdiction: resolvedJurisdiction,
      languages: ["en"],
      contactEmail: "mock-police@safespeak.test",
      contactPhone: "+61 2 9000 0001",
      minimumRequiredInfo: ["summary", "date", "location"],
      missingRequiredInfo: [],
      anonymityOptions: ["identified", "anonymous", "pseudonymous"],
      expectedNextSteps: [
        "A receiving officer reviews the summary.",
        "They may contact you for follow-up if you choose identified sharing.",
      ],
      consentRequired: false,
      supportsAcknowledgement: true,
      requiredConsentFlags: [],
      matchedIncidentTypes: ["harassment", "threat", "assault"],
      deliveryReadiness: {
        status: "ready",
        mode: "automated",
        canAutoSend: true,
        actuallySends: false,
        credentialConfigured: true,
        credentialReference: "mock-credential-police",
        configurationIssues: [],
      },
      payloadPreview: {
        refNo: getMockReportRef(),
        title,
        summary,
        language: "en",
        jurisdiction: resolvedJurisdiction,
        incidentType: draft?.incidentType,
        structuredFields,
        evidence,
      },
    },
    {
      destinationId: "mock-esafety",
      destinationKey: "mock-esafety",
      destinationType: "esafety",
      destinationName: "eSafety Mock Intake",
      reason: "Recommended when the report includes online abuse, images, messages, or digital evidence.",
      channel: "structured_email",
      jurisdiction: resolvedJurisdiction,
      languages: ["en"],
      contactEmail: "mock-esafety@safespeak.test",
      minimumRequiredInfo: ["summary"],
      missingRequiredInfo: [],
      anonymityOptions: ["identified", "pseudonymous"],
      expectedNextSteps: [
        "The report package is reviewed for platform-specific evidence.",
        "You may be asked for account or message references.",
      ],
      consentRequired: false,
      supportsAcknowledgement: true,
      requiredConsentFlags: [],
      matchedIncidentTypes: ["cyber_abuse", "online_harassment"],
      deliveryReadiness: {
        status: "manual_action",
        mode: "manual",
        canAutoSend: false,
        actuallySends: false,
        credentialConfigured: true,
        configurationIssues: [],
      },
      payloadPreview: {
        refNo: getMockReportRef(),
        title,
        summary,
        language: "en",
        jurisdiction: resolvedJurisdiction,
        incidentType: draft?.incidentType,
        structuredFields,
        evidence,
      },
    },
    {
      destinationId: "mock-anti-discrimination",
      destinationKey: "mock-anti-discrimination",
      destinationType: "anti_discrimination_agency",
      destinationName: "Anti-Discrimination Mock Pathway",
      reason: "Recommended for reports that mention bias, workplace treatment, or protected-attribute harm.",
      channel: "pdf_email",
      jurisdiction: resolvedJurisdiction,
      languages: ["en"],
      contactEmail: "mock-anti-discrimination@safespeak.test",
      minimumRequiredInfo: ["summary", "location"],
      missingRequiredInfo: [],
      anonymityOptions: ["identified", "anonymous"],
      expectedNextSteps: [
        "A case intake team reviews the summary.",
        "They may request employer or institution context next.",
      ],
      consentRequired: false,
      supportsAcknowledgement: false,
      requiredConsentFlags: [],
      matchedIncidentTypes: ["discrimination", "harassment"],
      deliveryReadiness: {
        status: "config_missing",
        mode: "config_missing",
        canAutoSend: false,
        actuallySends: false,
        credentialConfigured: false,
        configurationIssues: ["Mock mode keeps delivery local only."],
      },
      payloadPreview: {
        refNo: getMockReportRef(),
        title,
        summary,
        language: "en",
        jurisdiction: resolvedJurisdiction,
        incidentType: draft?.incidentType,
        structuredFields,
        evidence,
      },
    },
  ];
}

export function getMockSubmissionPreviews(
  draft: ReportFlowDraft | null,
  destinationIds: string[]
): ReportSubmissionPayloadPreview[] {
  const destinations = getMockDestinations(draft).filter((destination) =>
    destinationIds.includes(destination.destinationId)
  );

  return destinations.map((destination) => ({
    destination: {
      destinationId: destination.destinationId,
      destinationKey: destination.destinationKey,
      destinationType: destination.destinationType,
      destinationName: destination.destinationName,
      reason: destination.reason,
      channel: destination.channel,
      jurisdiction: destination.jurisdiction,
      languages: destination.languages,
      endpoint: destination.endpoint,
      contactEmail: destination.contactEmail,
      contactPhone: destination.contactPhone,
      minimumRequiredInfo: destination.minimumRequiredInfo,
      missingRequiredInfo: destination.missingRequiredInfo,
      anonymityOptions: destination.anonymityOptions,
      expectedNextSteps: destination.expectedNextSteps,
      consentRequired: destination.consentRequired,
      supportsAcknowledgement: destination.supportsAcknowledgement,
      requiredConsentFlags: destination.requiredConsentFlags,
      matchedIncidentTypes: destination.matchedIncidentTypes,
      deliveryReadiness: destination.deliveryReadiness,
    },
    template: {
      templateId: `mock-template-${destination.destinationId}`,
      templateKey: "mock-safe-speak-template",
      templateName: "Mock SafeSpeak Payload",
      fieldMappings: [
        { source: "summary", target: "summary", required: true },
        { source: "when", target: "incident_date", required: false },
        { source: "where", target: "incident_location", required: false },
      ],
    },
    missingRequiredInfo: destination.missingRequiredInfo,
    missingMappedFields: [],
    requiredConsentFlags: destination.requiredConsentFlags,
    missingConsentFlags: [],
    payload: {
      refNo: getMockReportRef(),
      title: draft?.title || destination.payloadPreview.title,
      summary: draft?.summary || destination.payloadPreview.summary,
      structuredFields: draft?.structuredFields ?? {},
      destination: destination.destinationName,
    },
    evidence: destination.payloadPreview.evidence,
  }));
}

export function createMockSubmission(params: {
  draft: ReportFlowDraft | null;
  destination: ReportDestinationPreview;
  anonymityMode: "identified" | "anonymous" | "pseudonymous";
  notes?: string;
}): ReportSubmissionRecord {
  const { draft, destination, anonymityMode, notes } = params;
  const now = new Date().toISOString();

  return {
    _id: `mock-submission-${destination.destinationId}`,
    reportId: getMockReportId(draft),
    destinationId: destination.destinationId,
    destinationKey: destination.destinationKey,
    destinationType: destination.destinationType,
    destinationName: destination.destinationName,
    channel: destination.channel,
    jurisdiction: destination.jurisdiction,
    languages: destination.languages,
    status: "submitted",
    anonymityMode,
    minimumRequiredInfo: destination.minimumRequiredInfo,
    missingRequiredInfo: destination.missingRequiredInfo,
    requiredConsentFlags: destination.requiredConsentFlags,
    expectedNextSteps: destination.expectedNextSteps,
    notes,
    endpoint: destination.endpoint,
    contactEmail: destination.contactEmail,
    contactPhone: destination.contactPhone,
    payloadSnapshot: {
      refNo: getMockReportRef(),
      title: draft?.title || destination.payloadPreview.title,
      summary: draft?.summary || destination.payloadPreview.summary,
      structuredFields: draft?.structuredFields ?? {},
    },
    evidenceSnapshot: destination.payloadPreview.evidence,
    consentSnapshot: {
      mockMode: true,
      anonymityMode,
    },
    deliveryArtifacts: [
      {
        type: "mock_delivery_record",
        createdAt: now,
      },
    ],
    deliveryMessage: "Mock delivery recorded locally. No external destination was contacted.",
    deliveryMode: destination.deliveryReadiness?.mode ?? "manual",
    deliveryConfigurationStatus: destination.deliveryReadiness?.status ?? "manual_action",
    deliveryConfigurationIssues: destination.deliveryReadiness?.configurationIssues ?? [],
    actuallySent: false,
    externalReference: `MOCK-${destination.destinationId.toUpperCase()}`,
    previewGeneratedAt: now,
    submittedAt: now,
    lastAttemptAt: now,
    createdAt: now,
    updatedAt: now,
  };
}
