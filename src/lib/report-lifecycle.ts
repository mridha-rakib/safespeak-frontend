import type { ReportRecord } from "@/lib/reports-client";

export type ReportLifecycleAction =
  | "withdraw"
  | "mark-info-only"
  | "request-delete"
  | "delete";

export type ReportLifecycleActionConfig = {
  action: ReportLifecycleAction;
  label: string;
  description: string;
  confirmMessage: string;
  destructive?: boolean;
};

const withdrawnBlockedStatuses = new Set([
  "submitted",
  "received",
  "closed",
  "deleted",
  "withdrawn",
  "info_only",
]);

export function getReportStatusLabel(report?: Pick<ReportRecord, "status" | "deletionRequestedAt">): string {
  const status = report?.status ?? "draft";

  if (status === "deleted" && report?.deletionRequestedAt) {
    return "Deletion requested";
  }

  switch (status) {
    case "local_only":
      return "Local only";
    case "ready_for_review":
      return "Ready for review";
    case "info_only":
      return "Information only";
    case "pending_submission":
      return "Pending submission";
    case "submitted":
      return "Submitted";
    case "received":
      return "Received";
    case "withdrawn":
      return "Withdrawn";
    case "closed":
      return "Closed";
    case "deleted":
      return "Deleted";
    case "triaged":
      return "Triaged";
    case "draft":
    default:
      return "Draft";
  }
}

export function getReportLifecycleActions(
  report: Pick<ReportRecord, "_id" | "status" | "deletionRequestedAt">
): ReportLifecycleActionConfig[] {
  const status = report.status ?? "draft";
  const actions: ReportLifecycleActionConfig[] = [];

  if (!withdrawnBlockedStatuses.has(status)) {
    actions.push({
      action: "withdraw",
      label: "Withdraw",
      description: "Move this report out of the active submission path.",
      confirmMessage: "Withdraw this report? It will stay in your history as withdrawn.",
    });
  }

  if (!["closed", "deleted", "info_only", "withdrawn"].includes(status)) {
    actions.push({
      action: "mark-info-only",
      label: "Mark info-only",
      description: "Keep this as an information-only record, not a submission.",
      confirmMessage:
        "Mark this report as information-only? It will not be treated as an active submission.",
    });
  }

  if (!["closed", "deleted"].includes(status)) {
    actions.push({
      action: "request-delete",
      label: "Request deletion",
      description: "Record a deletion request for audit and privacy follow-up.",
      confirmMessage:
        "Request deletion for this report? The request will be audit logged.",
      destructive: true,
    });
  }

  if (status !== "deleted") {
    actions.push({
      action: "delete",
      label: "Delete",
      description: "Soft-delete this report from active report history.",
      confirmMessage:
        "Delete this report now? It will be removed from active report history.",
      destructive: true,
    });
  }

  return actions;
}
