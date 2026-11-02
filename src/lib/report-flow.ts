"use client";

import type { Route } from "next";

import type { AssistantIncidentCategory } from "@/lib/assistant-categories";
import type { DashboardCardFlowId } from "@/lib/dashboard-card-flows";

const REPORT_FLOW_DRAFT_KEY = "safespeak_report_flow_draft";
const REPORT_FLOW_CURRENT_REPORT_ID_KEY = "safespeak_current_report_id";
const REPORT_FLOW_VIEW_QUERY_KEY = "view";
const REPORT_FLOW_REPORT_ID_QUERY_KEY = "reportId";
const REPORT_FLOW_DESTINATION_ID_QUERY_KEY = "destinationId";
const REPORT_FLOW_SUBMISSION_ID_QUERY_KEY = "submissionId";

export type ReportFlowDraft = {
  reportId?: string;
  selectedDestinationId?: string;
  latestSubmissionId?: string;
  shareAnonymityMode?: "identified" | "anonymous" | "pseudonymous";
  shareNotes?: string;
  preparedSubmission?: {
    destinationId: string;
    destinationName: string;
    destinationType?: string;
    channel: string;
    status:
      | "ready_to_share"
      | "submitted"
      | "acknowledged"
      | "requires_manual_action"
      | "config_missing"
      | "failed";
    missingRequiredInfo?: string[];
    reason?: string;
    message?: string;
    actuallySent?: boolean;
    updatedAt: string;
  };
  title: string;
  date: string;
  location: string;
  summary: string;
  structuredFields?: Record<string, unknown>;
  incidentType?: string;
  incidentCategory?: AssistantIncidentCategory;
  topic?: DashboardCardFlowId;
  starterPrompt?: string;
  evidenceIds: string[];
  updatedAt: string;
};

export type PreparedSubmissionStatus = NonNullable<
  ReportFlowDraft["preparedSubmission"]
>["status"];

export const defaultReportFlowDraft: Omit<ReportFlowDraft, "updatedAt"> = {
  title: "",
  date: "",
  location: "",
  summary: "",
  evidenceIds: [],
};

export function getReportFlowDraft(): ReportFlowDraft | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(REPORT_FLOW_DRAFT_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ReportFlowDraft;
  } catch {
    window.sessionStorage.removeItem(REPORT_FLOW_DRAFT_KEY);
    return null;
  }
}

function getReportFlowStoredReportId(): string | undefined {
  if (typeof window === "undefined") {
    return undefined;
  }

  return (
    window.sessionStorage.getItem(REPORT_FLOW_CURRENT_REPORT_ID_KEY) ??
    undefined
  );
}

export function getReportFlowQueryState(): Partial<
  Pick<
    ReportFlowDraft,
    "reportId" | "selectedDestinationId" | "latestSubmissionId"
  >
> {
  if (typeof window === "undefined") {
    return {};
  }

  const params = new URLSearchParams(window.location.search);
  const reportId = params.get(REPORT_FLOW_REPORT_ID_QUERY_KEY) ?? undefined;
  const selectedDestinationId =
    params.get(REPORT_FLOW_DESTINATION_ID_QUERY_KEY) ?? undefined;
  const latestSubmissionId =
    params.get(REPORT_FLOW_SUBMISSION_ID_QUERY_KEY) ?? undefined;
  const queryState: Partial<
    Pick<
      ReportFlowDraft,
      "reportId" | "selectedDestinationId" | "latestSubmissionId"
    >
  > = {};

  if (reportId) {
    queryState.reportId = reportId;
  }

  if (selectedDestinationId) {
    queryState.selectedDestinationId = selectedDestinationId;
  }

  if (latestSubmissionId) {
    queryState.latestSubmissionId = latestSubmissionId;
  }

  return queryState;
}

export function getResolvedReportFlowDraft(): ReportFlowDraft | null {
  const draft = getReportFlowDraft();
  const queryState = getReportFlowQueryState();
  const storedReportId = getReportFlowStoredReportId();

  if (
    !draft &&
    !queryState.reportId &&
    !storedReportId &&
    !queryState.selectedDestinationId
  ) {
    return null;
  }

  return {
    ...defaultReportFlowDraft,
    ...(storedReportId ? { reportId: storedReportId } : {}),
    ...draft,
    ...queryState,
    evidenceIds: draft?.evidenceIds ?? [],
    updatedAt: draft?.updatedAt ?? new Date(0).toISOString(),
  };
}

export function buildReportFlowHref(
  view: string,
  state: Partial<
    Pick<
      ReportFlowDraft,
      "reportId" | "selectedDestinationId" | "latestSubmissionId"
    >
  > = {}
): Route {
  const params = new URLSearchParams();

  params.set(REPORT_FLOW_VIEW_QUERY_KEY, view);

  if (state.reportId) {
    params.set(REPORT_FLOW_REPORT_ID_QUERY_KEY, state.reportId);
  }

  if (state.selectedDestinationId) {
    params.set(
      REPORT_FLOW_DESTINATION_ID_QUERY_KEY,
      state.selectedDestinationId
    );
  }

  if (state.latestSubmissionId) {
    params.set(REPORT_FLOW_SUBMISSION_ID_QUERY_KEY, state.latestSubmissionId);
  }

  return `/dashboard?${params.toString()}` as Route;
}

export function saveReportFlowDraft(
  draft: Omit<ReportFlowDraft, "updatedAt">
): ReportFlowDraft {
  const nextDraft = {
    ...draft,
    updatedAt: new Date().toISOString(),
  } satisfies ReportFlowDraft;

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      REPORT_FLOW_DRAFT_KEY,
      JSON.stringify(nextDraft)
    );

    if (nextDraft.reportId) {
      window.sessionStorage.setItem(
        REPORT_FLOW_CURRENT_REPORT_ID_KEY,
        nextDraft.reportId
      );
    }
  }

  return nextDraft;
}

export function mergeReportFlowDraft(
  partialDraft: Partial<Omit<ReportFlowDraft, "updatedAt">>
): ReportFlowDraft {
  const currentDraft = getResolvedReportFlowDraft();

  return saveReportFlowDraft({
    ...defaultReportFlowDraft,
    ...currentDraft,
    ...partialDraft,
    evidenceIds: partialDraft.evidenceIds ?? currentDraft?.evidenceIds ?? [],
  });
}

export function clearReportFlowDraft(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(REPORT_FLOW_DRAFT_KEY);
  window.sessionStorage.removeItem(REPORT_FLOW_CURRENT_REPORT_ID_KEY);
}
