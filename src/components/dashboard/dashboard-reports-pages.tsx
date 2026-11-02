"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";

import {
  IconAlertCircle,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFileText,
  IconFolderFilled,
  IconLoader2,
  IconSearch,
  IconTrash,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import {
  type ReportLifecycleAction,
  type ReportLifecycleActionConfig,
  getReportLifecycleActions,
  getReportStatusLabel,
} from "@/lib/report-lifecycle";
import {
  type ReportRecord,
  type ReportSubmissionRecord,
  deleteReport,
  getReport,
  getReportStatus,
  getReportTimeline,
  listReportSubmissions,
  listReports,
  markReportInfoOnly,
  requestReportDelete,
  withdrawReport,
} from "@/lib/reports-client";
import { cn } from "@/lib/utils";

import { localIntelligenceMapSrc } from "./dashboard-shared";

function formatReportDate(value?: string): string {
  if (!value) {
    return "Date unavailable";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return value;
  }

  return date.toLocaleString("en-AU", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function getReportTitle(report?: ReportRecord | null): string {
  return report?.context || report?.incidentType || "SafeSpeak report";
}

function getReportNarrative(report?: ReportRecord | null): string {
  if (!report) {
    return "Loading report details...";
  }

  return (
    report.originalNarrative ||
    String(report.structuredFields?.what ?? "No narrative captured yet.")
  );
}

function getReportLocation(report?: ReportRecord | null): string {
  return String(
    report?.structuredFields?.where ?? "Location not captured yet."
  );
}

function getReportReference(report?: ReportRecord | null): string {
  return report?.refNo ?? report?._id ?? "Pending";
}

function getReportStatusTone(
  report?: Pick<ReportRecord, "status" | "deletionRequestedAt"> | null
): {
  className: string;
  dotClassName: string;
} {
  const status = report?.status ?? "draft";

  if (status === "deleted" || report?.deletionRequestedAt) {
    return {
      className: "bg-[#fff1f2] text-[#be123c]",
      dotClassName: "bg-[#fb7185]",
    };
  }

  if (status === "submitted" || status === "received" || status === "closed") {
    return {
      className: "bg-[#e8f8ef] text-[#1b8f4b]",
      dotClassName: "bg-[#34d399]",
    };
  }

  if (
    status === "ready_for_review" ||
    status === "pending_submission" ||
    status === "triaged"
  ) {
    return {
      className: "bg-[#e8f1ff] text-[#1d72d8]",
      dotClassName: "bg-[#60a5fa]",
    };
  }

  if (status === "withdrawn" || status === "info_only") {
    return {
      className: "bg-[#eef1f5] text-[#5f6f83]",
      dotClassName: "bg-[#94a3b8]",
    };
  }

  return {
    className: "bg-[#fff3e2] text-[#c97b00]",
    dotClassName: "bg-[#f59e0b]",
  };
}

function ReportStatusChip({
  report,
}: {
  report?: Pick<ReportRecord, "status" | "deletionRequestedAt"> | null;
}) {
  const styles = getReportStatusTone(report);

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
        styles.className
      )}
    >
      <span className={cn("h-1.5 w-1.5 rounded-full", styles.dotClassName)} />
      {getReportStatusLabel(report ?? undefined)}
    </span>
  );
}

async function runReportLifecycleAction(
  reportId: string,
  action: ReportLifecycleAction
): Promise<ReportRecord | null> {
  if (action === "withdraw") {
    return withdrawReport(reportId);
  }

  if (action === "mark-info-only") {
    return markReportInfoOnly(reportId);
  }

  if (action === "request-delete") {
    return requestReportDelete(reportId);
  }

  await deleteReport(reportId);
  return null;
}

function LifecycleActionButtons({
  report,
  activeActionKey,
  onAction,
}: {
  report: ReportRecord;
  activeActionKey: string | null;
  onAction: (report: ReportRecord, action: ReportLifecycleActionConfig) => void;
}) {
  const actions = getReportLifecycleActions(report);

  if (!actions.length) {
    return (
      <p className="text-[10px] font-medium text-[#8a9ab0]">
        No lifecycle actions are available for this status.
      </p>
    );
  }

  return (
    <div className="flex flex-wrap gap-2">
      {actions.map((action) => {
        const actionKey = `${report._id}:${action.action}`;
        const isActive = activeActionKey === actionKey;

        return (
          <button
            key={action.action}
            type="button"
            onClick={() => onAction(report, action)}
            disabled={Boolean(activeActionKey)}
            title={action.description}
            className={cn(
              "inline-flex h-8 items-center gap-1 rounded-full border px-3 text-[10px] font-bold transition disabled:cursor-wait disabled:opacity-60",
              action.destructive
                ? "border-[#f4c7c3] bg-[#fff7f6] text-[#b42318] hover:bg-[#fff1ef]"
                : "border-[#d8e4f2] bg-white text-[#40566f] hover:bg-[#f7fbff]"
            )}
          >
            {isActive ? (
              <IconLoader2 size={11} className="animate-spin" />
            ) : action.destructive ? (
              <IconTrash size={11} />
            ) : (
              <IconFileText size={11} />
            )}
            {action.label}
          </button>
        );
      })}
    </div>
  );
}

function ReportsHistoryPage() {
  const { t } = useTranslation();
  const [reports, setReports] = useState<ReportRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState<"all" | "draft" | "action">(
    "all"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const loadReports = useCallback(async () => {
    setIsLoading(true);

    try {
      const result = await listReports();
      setReports(result);
      setLoadError(null);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Reports could not be loaded."
      );
      setReports([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void loadReports();
  }, [loadReports]);

  const filteredReports = useMemo(() => {
    const normalizedSearch = searchTerm.trim().toLowerCase();

    return reports.filter((report) => {
      const status = report.status ?? "draft";

      if (
        activeFilter === "draft" &&
        status !== "draft" &&
        status !== "local_only"
      ) {
        return false;
      }

      if (
        activeFilter === "action" &&
        !["ready_for_review", "pending_submission", "triaged"].includes(status)
      ) {
        return false;
      }

      if (!normalizedSearch) {
        return true;
      }

      return [
        report._id,
        report.refNo,
        report.context,
        report.incidentType,
        report.status,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(normalizedSearch)
        );
    });
  }, [activeFilter, reports, searchTerm]);

  const handleLifecycleAction = async (
    report: ReportRecord,
    action: ReportLifecycleActionConfig
  ) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(action.confirmMessage)
    ) {
      return;
    }

    const actionKey = `${report._id}:${action.action}`;
    setActiveActionKey(actionKey);
    setLoadError(null);
    setStatusMessage(null);

    try {
      const updatedReport = await runReportLifecycleAction(
        report._id,
        action.action
      );

      if (updatedReport) {
        setReports((currentReports) =>
          currentReports.map((currentReport) =>
            currentReport._id === updatedReport._id
              ? updatedReport
              : currentReport
          )
        );
        setStatusMessage(
          `${action.label} completed for ${getReportReference(updatedReport)}.`
        );
      } else {
        setReports((currentReports) =>
          currentReports.filter(
            (currentReport) => currentReport._id !== report._id
          )
        );
        setStatusMessage("Report deleted from active history.");
      }
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Report action could not be completed."
      );
    } finally {
      setActiveActionKey(null);
    }
  };

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.reports.yourReports")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f8fbff] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#deecff] text-[#1d72d8]">
              <IconFolderFilled size={14} />
            </span>
            <h2 className="mt-2 text-[30px] font-extrabold leading-[1.03] text-[#1f2a3a] sm:text-[36px]">
              {t("dashboard.reports.yourIncidentHistory")}
            </h2>
            <p className="mt-1 text-xs text-[#7b8ca2]">
              Live report records, lifecycle state, and audit-safe actions.
            </p>
          </div>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.reports.totalReports")}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#0f5d9f]">
                {reports.length}
              </p>
            </article>
            <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Submitted or received
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#1b8f4b]">
                {
                  reports.filter((report) =>
                    ["submitted", "received", "closed"].includes(
                      report.status ?? ""
                    )
                  ).length
                }
              </p>
            </article>
            <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Lifecycle actions
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#c97b00]">
                {
                  reports.filter(
                    (report) => getReportLifecycleActions(report).length > 0
                  ).length
                }
              </p>
            </article>
          </div>

          <div className="relative mx-auto mt-4 max-w-[760px]">
            <IconSearch
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9babc0]"
            />
            <input
              type="text"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder={t("dashboard.reports.searchPlaceholder")}
              className="h-10 w-full rounded-full border border-[#dce6f2] bg-white px-9 text-xs text-[#1f2a3a] outline-none placeholder:text-[#96a7bc] focus:border-[#cbd9ea]"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            {[
              { id: "all", label: t("dashboard.reports.allReports") },
              { id: "draft", label: t("dashboard.reports.drafts") },
              { id: "action", label: t("dashboard.reports.inReview") },
            ].map((filter) => (
              <button
                key={filter.id}
                type="button"
                onClick={() =>
                  setActiveFilter(filter.id as typeof activeFilter)
                }
                className={cn(
                  "inline-flex rounded-full px-3 py-1 text-[10px] font-bold",
                  activeFilter === filter.id
                    ? "bg-[#0f5d9f] text-white"
                    : "bg-white text-[#60728a]"
                )}
              >
                {filter.label}
              </button>
            ))}
          </div>

          <div className="mt-3 space-y-2">
            {loadError ? (
              <div className="rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-3 text-[11px] text-[#b45353]">
                <span className="inline-flex items-center gap-1.5">
                  <IconAlertCircle size={12} />
                  {loadError}
                </span>
              </div>
            ) : null}
            {statusMessage ? (
              <div className="rounded-[12px] border border-[#d8e4f2] bg-white px-3 py-3 text-[11px] font-medium text-[#0f5d9f]">
                {statusMessage}
              </div>
            ) : null}
            {isLoading ? (
              <div className="inline-flex items-center gap-2 rounded-[12px] border border-[#dce5f1] bg-white px-4 py-3 text-[11px] text-[#60728a]">
                <IconLoader2 size={14} className="animate-spin" />
                Loading reports...
              </div>
            ) : null}
            {!isLoading && filteredReports.length === 0 ? (
              <div className="rounded-[12px] border border-[#dce5f1] bg-white px-4 py-8 text-center text-[12px] text-[#60728a]">
                No reports matched this view.
              </div>
            ) : null}
            {filteredReports.map((report) => (
              <article
                key={report._id}
                className="rounded-[14px] border border-[#e3ebf5] bg-white p-3 transition hover:border-[#cfddee] hover:shadow-[0_10px_20px_rgba(15,23,42,0.06)]"
              >
                <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <ReportStatusChip report={report} />
                      <span className="text-[10px] font-semibold text-[#8a9ab0]">
                        SafeSpeak ref {getReportReference(report)}
                      </span>
                    </div>
                    <p className="mt-2 truncate text-sm font-bold text-[#1f2a3a]">
                      {getReportTitle(report)}
                    </p>
                    <p className="mt-1 text-[10px] font-medium text-[#74869d]">
                      Updated{" "}
                      {formatReportDate(report.updatedAt ?? report.createdAt)}
                    </p>
                  </div>
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
                    <Link
                      href={`/dashboard/reports/${report._id}`}
                      className="inline-flex h-9 items-center justify-center rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white transition hover:bg-[#0b4f89]"
                    >
                      Open detail
                      <IconChevronRight size={13} className="ml-1" />
                    </Link>
                    <Link
                      href="/dashboard?view=reportsubmissionreview"
                      className="inline-flex h-9 items-center justify-center rounded-full border border-[#d8e4f2] bg-white px-4 text-[11px] font-bold text-[#40566f]"
                    >
                      Review submission
                    </Link>
                  </div>
                </div>
                <div className="mt-3 border-t border-[#edf2f7] pt-3">
                  <LifecycleActionButtons
                    report={report}
                    activeActionKey={activeActionKey}
                    onAction={handleLifecycleAction}
                  />
                </div>
              </article>
            ))}
          </div>
        </article>
      </div>
    </div>
  );
}

function ReportOverviewPage({ reportId }: { reportId?: string }) {
  const { t } = useTranslation();
  const router = useRouter();
  const [report, setReport] = useState<ReportRecord | null>(null);
  const [timeline, setTimeline] = useState<Array<Record<string, unknown>>>([]);
  const [submissions, setSubmissions] = useState<ReportSubmissionRecord[]>([]);
  const [isLoading, setIsLoading] = useState(Boolean(reportId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [activeActionKey, setActiveActionKey] = useState<string | null>(null);

  const loadReportDetail = useCallback(async () => {
    if (!reportId) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);

    try {
      const [nextReport, status, nextTimeline, nextSubmissions] =
        await Promise.all([
          getReport(reportId),
          getReportStatus(reportId),
          getReportTimeline(reportId),
          listReportSubmissions(reportId),
        ]);

      setReport({
        ...nextReport,
        status: status.current ?? status.status ?? nextReport.status,
        deletionRequestedAt:
          status.deletionRequestedAt ?? nextReport.deletionRequestedAt,
        withdrawnAt: status.withdrawnAt ?? nextReport.withdrawnAt,
      });
      setTimeline(nextTimeline);
      setSubmissions(nextSubmissions);
      setLoadError(null);
    } catch (error) {
      setLoadError(
        error instanceof Error ? error.message : "Report could not be loaded."
      );
    } finally {
      setIsLoading(false);
    }
  }, [reportId]);

  useEffect(() => {
    void loadReportDetail();
  }, [loadReportDetail]);

  const handleLifecycleAction = async (
    currentReport: ReportRecord,
    action: ReportLifecycleActionConfig
  ) => {
    if (
      typeof window !== "undefined" &&
      !window.confirm(action.confirmMessage)
    ) {
      return;
    }

    const actionKey = `${currentReport._id}:${action.action}`;
    setActiveActionKey(actionKey);
    setLoadError(null);
    setStatusMessage(null);

    try {
      const updatedReport = await runReportLifecycleAction(
        currentReport._id,
        action.action
      );

      if (!updatedReport) {
        router.push("/dashboard/reports");
        return;
      }

      setReport(updatedReport);
      setStatusMessage(
        `${action.label} completed for ${getReportReference(updatedReport)}.`
      );
      void loadReportDetail();
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Report action could not be completed."
      );
    } finally {
      setActiveActionKey(null);
    }
  };

  const reportTitle = getReportTitle(report);
  const reportNarrative = getReportNarrative(report);
  const reportLocation = getReportLocation(report);
  const reportCreatedAt = formatReportDate(report?.createdAt);
  const reportUpdatedAt = formatReportDate(
    report?.updatedAt ?? report?.createdAt
  );
  const reportSupportKey = report?._id?.slice(-6) ?? "N/A";

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/reports"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.reports.reportOverview")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
          <article className="rounded-[16px] border border-[#dce5f1] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
            {loadError ? (
              <div className="mb-3 rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
                <span className="inline-flex items-center gap-1.5">
                  <IconAlertCircle size={12} />
                  {loadError}
                </span>
              </div>
            ) : null}
            {statusMessage ? (
              <div className="mb-3 rounded-[12px] border border-[#d8e4f2] bg-[#f8fbff] px-3 py-2 text-[11px] font-medium text-[#0f5d9f]">
                {statusMessage}
              </div>
            ) : null}
            {isLoading ? (
              <div className="mb-3 inline-flex items-center gap-2 rounded-[12px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3 text-[11px] text-[#60728a]">
                <IconLoader2 size={14} className="animate-spin" />
                Loading report detail...
              </div>
            ) : null}

            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0f5d9f]">
                  {t("dashboard.reports.incidentNarrative")}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold leading-[1.05] text-[#1f2a3a] sm:text-[30px]">
                  {reportTitle}
                </h2>
              </div>
              <ReportStatusChip report={report} />
            </div>

            <div className="mt-3 rounded-[12px] border border-[#e2eaf4] bg-[#f8fbff] p-3">
              <p className="text-[11px] font-semibold leading-[1.6] text-[#405368]">
                &ldquo;{reportNarrative}&rdquo;
              </p>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <article className="rounded-xl border border-[#e2eaf4] bg-[#f8fbff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {t("dashboard.reports.reportId")}
                </p>
                <p className="mt-1 break-all text-xs font-extrabold text-[#1f2a3a]">
                  {getReportReference(report)}
                </p>
              </article>
              <article className="rounded-xl border border-[#e2eaf4] bg-[#f8fbff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {t("dashboard.reports.created")}
                </p>
                <p className="mt-1 text-xs font-extrabold text-[#1f2a3a]">
                  {reportCreatedAt}
                </p>
              </article>
              <article className="rounded-xl border border-[#e2eaf4] bg-[#f8fbff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {t("dashboard.reports.status")}
                </p>
                <div className="mt-1">
                  <ReportStatusChip report={report} />
                </div>
              </article>
            </div>

            {report ? (
              <div className="mt-4 rounded-[12px] border border-[#e2eaf4] bg-[#f8fbff] p-3">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                      Lifecycle controls
                    </p>
                    <p className="mt-1 text-[11px] text-[#60728a]">
                      Actions are audit logged and refresh this report after
                      completion.
                    </p>
                  </div>
                </div>
                <div className="mt-3">
                  <LifecycleActionButtons
                    report={report}
                    activeActionKey={activeActionKey}
                    onAction={handleLifecycleAction}
                  />
                </div>
              </div>
            ) : null}

            <div className="mt-4 rounded-[12px] border border-[#e2eaf4] bg-[#f8fbff] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Status timeline
              </p>
              <div className="mt-3 space-y-2">
                {timeline.length ? (
                  timeline.map((entry, index) => {
                    const status =
                      typeof entry.status === "string"
                        ? entry.status
                        : "status";
                    const changedAt =
                      typeof entry.changedAt === "string"
                        ? entry.changedAt
                        : undefined;
                    const reason =
                      typeof entry.reason === "string"
                        ? entry.reason
                        : undefined;

                    return (
                      <article
                        key={`${status}-${changedAt ?? index}`}
                        className="rounded-[10px] border border-[#e1e9f3] bg-white px-3 py-2"
                      >
                        <p className="text-[11px] font-bold text-[#1f2a3a]">
                          {getReportStatusLabel({ status })}
                        </p>
                        <p className="mt-1 text-[10px] text-[#74869d]">
                          {formatReportDate(changedAt)}
                          {reason ? ` | ${reason.replace(/_/g, " ")}` : ""}
                        </p>
                      </article>
                    );
                  })
                ) : (
                  <p className="text-[11px] leading-5 text-[#8ea0b8]">
                    No timeline entries are available yet.
                  </p>
                )}
              </div>
            </div>

            <div className="mt-4 rounded-[12px] border border-[#e2eaf4] bg-[#f8fbff] p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Submission records
              </p>
              <div className="mt-3 space-y-2">
                {submissions.length ? (
                  submissions.map((submission) => (
                    <article
                      key={submission._id}
                      className="rounded-[10px] border border-[#e1e9f3] bg-white px-3 py-2"
                    >
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <p className="text-[11px] font-bold text-[#1f2a3a]">
                          {submission.destinationName}
                        </p>
                        <span className="rounded-full bg-[#eef6ff] px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#2f6fca]">
                          {submission.status.replace(/_/g, " ")}
                        </span>
                      </div>
                      <p className="mt-1 text-[10px] text-[#74869d]">
                        {submission.channel.replace(/_/g, " ")} |{" "}
                        {formatReportDate(
                          submission.submittedAt ?? submission.createdAt
                        )}
                      </p>
                    </article>
                  ))
                ) : (
                  <p className="text-[11px] leading-5 text-[#8ea0b8]">
                    No destination submissions have been created for this
                    report.
                  </p>
                )}
              </div>
            </div>
          </article>

          <aside className="rounded-[16px] border border-[#dce5f1] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0f5d9f]">
              {t("dashboard.reports.reportMetadata")}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#f8fbff] p-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b6]">
                  {t("dashboard.reports.lastUpdate")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  {reportUpdatedAt}
                </p>
              </div>
              <div className="rounded-lg bg-[#f8fbff] p-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b6]">
                  {t("dashboard.reports.supportKey")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  {reportSupportKey}
                </p>
              </div>
              <div className="col-span-2 rounded-lg bg-[#f8fbff] p-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b6]">
                  {t("dashboard.reports.location")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  {reportLocation}
                </p>
              </div>
            </div>

            <div className="relative mt-3 h-[170px] overflow-hidden rounded-[12px] border border-[#d7e1ee] bg-[#d9e6d2]">
              {localIntelligenceMapSrc ? (
                <iframe
                  title="Report incident map"
                  src={localIntelligenceMapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(130deg,#cfdebf_0%,#e3edd8_45%,#cedebf_100%)]" />
              )}
              <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-[#334155]">
                {reportLocation}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/dashboard?view=reportsubmissiondetails"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
              >
                {t("dashboard.reports.editReport")}
              </Link>
              <Link
                href="/dashboard?view=reportsubmissionreview"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#f59e0b] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(245,158,11,0.3)]"
              >
                {t("dashboard.reports.proceedToSubmission")}
              </Link>
              <Link
                href="/dashboard?view=reportsubmissionhistory"
                className="inline-flex h-10 items-center justify-center rounded-full border border-[#d8e4f2] px-5 text-xs font-bold text-[#40566f]"
              >
                <IconClock size={13} className="mr-1" />
                Submission history
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export { ReportOverviewPage, ReportsHistoryPage };
