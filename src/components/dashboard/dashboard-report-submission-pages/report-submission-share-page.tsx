"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  IconAlertCircle,
  IconArrowRight,
  IconBoltFilled,
  IconCheck,
  IconFolderFilled,
  IconLoader2,
  IconMail,
  IconPhone,
  IconShare,
  IconShieldCheck,
} from "@tabler/icons-react";

import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import { ReportSubmissionFrame } from "./report-submission-frame";
import { useConsentGate } from "@/hooks/use-consent-gate";
import {
  type AuthorityMatch,
  formatChannel,
  formatDestinationType,
  rankAuthorityMatches,
  resolvePreferredDestinationId,
} from "@/lib/report-authority-routing";
import {
  buildReportFlowHref,
  type PreparedSubmissionStatus,
  getResolvedReportFlowDraft,
  mergeReportFlowDraft,
} from "@/lib/report-flow";
import {
  createMockSubmission,
  getMockDestinations,
  getMockReportId,
  getMockReportRef,
  getMockReportStatus,
  REPORT_SUBMISSION_MOCK_MODE,
} from "@/lib/report-submission-mock";
import {
  type ReportDestinationPreview,
  type ReportSubmissionRecord,
  getReport,
  getReportDestinations,
  getReportStatus,
  listReports,
  listReportSubmissions,
  submitReportToDestination,
} from "@/lib/reports-client";

function getRequiredInfoLabel(match: AuthorityMatch | null): string {
  if (!match) {
    return "No recipient selected";
  }

  return match.missingRequiredInfo.length
    ? match.missingRequiredInfo.join(", ")
    : "Complete";
}

function isActualDeliveryStatus(status?: string): boolean {
  return status === "submitted" || status === "acknowledged";
}

function toPreparedSubmissionStatus(status?: string): PreparedSubmissionStatus {
  if (isActualDeliveryStatus(status)) {
    return status as PreparedSubmissionStatus;
  }

  if (
    status === "requires_manual_action" ||
    status === "config_missing" ||
    status === "failed"
  ) {
    return status;
  }

  return "ready_to_share";
}

function getDeliveryReadinessCopy(match: AuthorityMatch | null): string | null {
  if (!match?.deliveryReadiness) {
    return null;
  }

  if (match.deliveryReadiness.status === "config_missing") {
    const issues = match.deliveryReadiness.configurationIssues.join(" ");

    return `This destination is not fully configured for outbound delivery yet. ${issues} SafeSpeak can record the attempt, but no external report will be sent.`;
  }

  if (match.deliveryReadiness.status === "manual_action") {
    return "This destination requires manual follow-up. SafeSpeak will prepare an auditable handoff record, but it will not send the report externally.";
  }

  return "This destination has an automated delivery channel configured. SafeSpeak will only send after your consent and final confirmation.";
}

function getPreparedStatusLabel(status?: PreparedSubmissionStatus): string {
  if (status === "ready_to_share") {
    return "Ready for secure sharing";
  }

  if (status === "config_missing") {
    return "Not sent - partner setup needed";
  }

  if (status === "requires_manual_action") {
    return "Prepared for manual follow-up";
  }

  if (status === "failed") {
    return "Delivery failed";
  }

  if (status === "submitted" || status === "acknowledged") {
    return "Shared through SafeSpeak";
  }

  return "Prepared";
}

function getShareNotice(submission: ReportSubmissionRecord): string {
  const reference = `SafeSpeak submission reference ${submission._id}.`;

  if (submission.actuallySent || isActualDeliveryStatus(submission.status)) {
    return submission.externalReference
      ? `Report sent and recorded with external reference ${submission.externalReference}. ${reference}`
      : `Report sent through the configured SafeSpeak delivery channel. ${reference}`;
  }

  if (submission.status === "config_missing") {
    return `Sharing was recorded, but no external report was sent because partner delivery is not fully configured. ${reference}`;
  }

  if (submission.status === "requires_manual_action") {
    return `Sharing was recorded for manual follow-up. No external report was sent by SafeSpeak. ${reference}`;
  }

  return `Sharing outcome has been recorded in SafeSpeak. ${reference}`;
}

const withTriageParam = (href: Route, fromTriage: boolean): Route =>
  (fromTriage ? `${href}&fromTriage=1` : href) as Route;

function ReportSubmissionSharePage() {
  const searchParams = useSearchParams();
  const fromTriage = searchParams.get("fromTriage") === "1";
  const reportDraft = useMemo(() => getResolvedReportFlowDraft(), []);
  const {
    pendingConsentRequirement,
    isGrantingConsent,
    captureConsentError,
    clearPendingConsent,
    grantPendingConsent,
  } = useConsentGate();
  const [reportStatus, setReportStatus] = useState<string>("prepared");
  const [reportRef, setReportRef] = useState<string | null>(
    reportDraft?.reportId ?? null
  );
  const [backendReportId, setBackendReportId] = useState<string | null>(
    reportDraft?.reportId ?? null
  );
  const [latestSubmission, setLatestSubmission] =
    useState<ReportSubmissionRecord | null>(null);
  const [reportSubmissions, setReportSubmissions] = useState<
    ReportSubmissionRecord[]
  >([]);
  const [destinationOptions, setDestinationOptions] = useState<
    ReportDestinationPreview[]
  >([]);
  const [isLoadingDestinations, setIsLoadingDestinations] = useState(
    Boolean(reportDraft?.reportId)
  );
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(reportDraft?.selectedDestinationId ?? null);
  const [pendingShareDestinationId, setPendingShareDestinationId] = useState<
    string | null
  >(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [shareError, setShareError] = useState<string | null>(null);
  const [shareNotice, setShareNotice] = useState<string | null>(null);
  const [isSharePreviewVisible, setIsSharePreviewVisible] = useState(false);
  const [anonymityMode, setAnonymityMode] = useState<
    "identified" | "anonymous" | "pseudonymous"
  >(reportDraft?.shareAnonymityMode ?? "identified");
  const [shareNotes, setShareNotes] = useState(reportDraft?.shareNotes ?? "");

  useEffect(() => {
    if (REPORT_SUBMISSION_MOCK_MODE) {
      const mockDestinations = getMockDestinations(reportDraft);
      const selectedMockDestination =
        mockDestinations.find(
          (destination) =>
            destination.destinationId === reportDraft?.selectedDestinationId
        ) ??
        mockDestinations[0] ??
        null;
      const mockSubmission =
        selectedMockDestination && reportDraft?.latestSubmissionId
          ? createMockSubmission({
              draft: reportDraft,
              destination: selectedMockDestination,
              anonymityMode: reportDraft?.shareAnonymityMode ?? "identified",
              notes: reportDraft?.shareNotes,
            })
          : null;

      setReportRef(getMockReportRef());
      setReportStatus(getMockReportStatus(reportDraft));
      setDestinationOptions(mockDestinations);
      setLatestSubmission(mockSubmission);
      setSelectedDestinationId(
        reportDraft?.selectedDestinationId ??
          selectedMockDestination?.destinationId ??
          null
      );
      setShareError(null);
      setIsLoadingDestinations(false);
      mergeReportFlowDraft({
        reportId: getMockReportId(reportDraft),
        selectedDestinationId:
          reportDraft?.selectedDestinationId ??
          selectedMockDestination?.destinationId,
      });
      return;
    }

    if (!reportDraft?.reportId) {
      let isActive = true;
      setIsLoadingDestinations(true);

      void (async () => {
        try {
          const reports = await listReports();
          const candidateReport = reports.find(
            (report) =>
              !["closed", "deleted", "withdrawn"].includes(
                report.status ?? ""
              )
          );

          if (!candidateReport?._id) {
            throw new Error(
              "This report needs to be saved from the details or review step before it can be shared securely."
            );
          }

          const [report, status, submissions, destinations] =
            await Promise.all([
              getReport(candidateReport._id),
              getReportStatus(candidateReport._id),
              listReportSubmissions(candidateReport._id),
              getReportDestinations(candidateReport._id),
            ]);

          if (!isActive) {
            return;
          }

          const resolvedSelectedDestinationId = resolvePreferredDestinationId(
            destinations,
            reportDraft?.selectedDestinationId
          );
          const destinationSubmission =
            submissions.find(
              (submission) =>
                submission.destinationId === resolvedSelectedDestinationId
            ) ?? null;

          setReportRef(report.refNo ?? report._id);
          setBackendReportId(report._id);
          setReportStatus(status.current);
          setDestinationOptions(destinations);
          setReportSubmissions(submissions);
          setLatestSubmission(destinationSubmission);
          setSelectedDestinationId(
            destinationSubmission?.destinationId ??
              resolvedSelectedDestinationId ??
              destinations[0]?.destinationId ??
              null
          );
          setShareError(null);
          mergeReportFlowDraft({
            reportId: report._id,
            selectedDestinationId:
              destinationSubmission?.destinationId ??
              resolvedSelectedDestinationId ??
              destinations[0]?.destinationId,
            latestSubmissionId: destinationSubmission?._id,
            structuredFields: report.structuredFields,
            incidentType: report.incidentType,
          });
        } catch (error) {
          if (!isActive) {
            return;
          }

          setReportSubmissions([]);
          setLatestSubmission(null);
          setDestinationOptions([]);
          setSelectedDestinationId(reportDraft?.selectedDestinationId ?? null);
          setShareError(
            error instanceof Error
              ? error.message
              : "This report needs to be saved from the details or review step before it can be shared securely."
          );
        } finally {
          if (isActive) {
            setIsLoadingDestinations(false);
          }
        }
      })();

      return () => {
        isActive = false;
      };
    }

    let isActive = true;
    setIsLoadingDestinations(true);

    void Promise.all([
      getReport(reportDraft.reportId),
      getReportStatus(reportDraft.reportId),
      listReportSubmissions(reportDraft.reportId),
      getReportDestinations(reportDraft.reportId),
    ])
      .then(([report, status, submissions, destinations]) => {
        if (!isActive) {
          return;
        }

        setReportSubmissions(submissions);

        const resolvedSelectedDestinationId = resolvePreferredDestinationId(
          destinations,
          reportDraft.selectedDestinationId
        );
        const matchedSubmission = reportDraft.latestSubmissionId
          ? (submissions.find(
              (submission) =>
                submission._id === reportDraft.latestSubmissionId &&
                submission.destinationId === resolvedSelectedDestinationId
            ) ?? null)
          : null;
        const destinationSubmission =
          submissions.find(
            (submission) =>
              submission.destinationId === resolvedSelectedDestinationId
          ) ?? null;
        setReportRef(report.refNo ?? report._id);
        setBackendReportId(report._id);
        setReportStatus(status.current);
        setDestinationOptions(destinations);
        const resolvedLatestSubmission =
          matchedSubmission ?? destinationSubmission ?? null;
        setLatestSubmission(resolvedLatestSubmission);
        setSelectedDestinationId(
          resolvedLatestSubmission?.destinationId ??
            resolvedSelectedDestinationId ??
            destinations[0]?.destinationId ??
            null
        );
        mergeReportFlowDraft({
          reportId: report._id,
          selectedDestinationId:
            resolvedLatestSubmission?.destinationId ??
            resolvedSelectedDestinationId ??
            destinations[0]?.destinationId,
          latestSubmissionId: resolvedLatestSubmission?._id,
          preparedSubmission: resolvedLatestSubmission
            ? {
                destinationId: resolvedLatestSubmission.destinationId,
                destinationName: resolvedLatestSubmission.destinationName,
                destinationType: resolvedLatestSubmission.destinationType,
                channel: resolvedLatestSubmission.channel,
                status: toPreparedSubmissionStatus(
                  resolvedLatestSubmission.status
                ),
                missingRequiredInfo:
                  resolvedLatestSubmission.missingRequiredInfo,
                message: resolvedLatestSubmission.deliveryMessage,
                actuallySent:
                  resolvedLatestSubmission.actuallySent ??
                  isActualDeliveryStatus(resolvedLatestSubmission.status),
                updatedAt: new Date().toISOString(),
              }
            : reportDraft.preparedSubmission?.status === "ready_to_share"
              ? reportDraft.preparedSubmission
              : undefined,
        });
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setShareError(
          error instanceof Error
            ? error.message
            : "Admin-managed destinations could not be loaded."
        );
        setReportSubmissions([]);
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingDestinations(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [
    reportDraft?.latestSubmissionId,
    reportDraft?.preparedSubmission,
    reportDraft?.reportId,
    reportDraft?.selectedDestinationId,
  ]);

  useEffect(() => {
    mergeReportFlowDraft({
      selectedDestinationId: selectedDestinationId ?? undefined,
      shareAnonymityMode: anonymityMode,
      shareNotes,
    });
  }, [anonymityMode, selectedDestinationId, shareNotes]);

  const preferredDestinationId =
    resolvePreferredDestinationId(
      destinationOptions,
      selectedDestinationId ??
        latestSubmission?.destinationId ??
        reportDraft?.selectedDestinationId
    ) ??
    selectedDestinationId ??
    latestSubmission?.destinationId ??
    reportDraft?.selectedDestinationId;

  const authorityMatches = useMemo(
    () =>
      rankAuthorityMatches({
        destinations: destinationOptions,
        draft: reportDraft,
        preferredDestinationId,
      }),
    [destinationOptions, preferredDestinationId, reportDraft]
  );

  const primaryMatch = authorityMatches[0] ?? null;

  useEffect(() => {
    if (!authorityMatches.length) {
      return;
    }

    const hasSelectedMatch = authorityMatches.some(
      (match) =>
        match.destinationId ===
        resolvePreferredDestinationId(
          destinationOptions,
          selectedDestinationId ?? undefined
        )
    );

    if (!selectedDestinationId || !hasSelectedMatch) {
      setSelectedDestinationId(authorityMatches[0].destinationId);
    }
  }, [authorityMatches, destinationOptions, selectedDestinationId]);

  const selectedMatch =
    authorityMatches.find(
      (match) =>
        match.destinationId ===
        resolvePreferredDestinationId(
          destinationOptions,
          selectedDestinationId ?? undefined
        )
    ) ??
    primaryMatch ??
    null;
  const selectedDestination = selectedMatch
    ? (destinationOptions.find(
        (destination) =>
          destination.destinationId === selectedMatch.destinationId
      ) ?? null)
    : null;

  useEffect(() => {
    if (!selectedDestinationId || !reportSubmissions.length) {
      return;
    }

    const resolvedDestinationId =
      resolvePreferredDestinationId(
        destinationOptions,
        selectedDestinationId
      ) ?? selectedDestinationId;
    const existingSubmission =
      reportSubmissions.find(
        (submission) => submission.destinationId === resolvedDestinationId
      ) ?? null;

    setLatestSubmission(existingSubmission);
  }, [destinationOptions, reportSubmissions, selectedDestinationId]);

  const missingRequiredInfo =
    selectedDestination?.missingRequiredInfo ??
    selectedMatch?.missingRequiredInfo ??
    [];
  const evidenceCount =
    reportDraft?.evidenceIds?.length ??
    selectedDestination?.payloadPreview?.evidence?.length ??
    0;
  const alternativeMatches = authorityMatches
    .filter((match) => match.destinationId !== selectedMatch?.destinationId)
    .slice(0, 4);
  const canSubmit =
    Boolean(backendReportId || REPORT_SUBMISSION_MOCK_MODE) &&
    Boolean(selectedDestination) &&
    !isLoadingDestinations &&
    !latestSubmission &&
    !missingRequiredInfo.length &&
    !isSubmitting;

  const submitToDestination = async (destinationId: string) => {
    if (REPORT_SUBMISSION_MOCK_MODE) {
      const destination = destinationOptions.find(
        (option) => option.destinationId === destinationId
      );

      if (!destination) {
        setShareError("This mock recipient is not available anymore.");
        return;
      }

      const submission = createMockSubmission({
        draft: reportDraft,
        destination,
        anonymityMode,
        notes:
          shareNotes.trim() ||
          `Mock shared from SafeSpeak: ${destination.destinationName}`,
      });

      mergeReportFlowDraft({
        reportId: getMockReportId(reportDraft),
        selectedDestinationId: destination.destinationId,
        latestSubmissionId: submission._id,
        preparedSubmission: {
          destinationId: destination.destinationId,
          destinationName: destination.destinationName,
          destinationType: destination.destinationType,
          channel: destination.channel,
          status: toPreparedSubmissionStatus(submission.status),
          missingRequiredInfo: destination.missingRequiredInfo,
          reason: destination.reason,
          message: submission.deliveryMessage,
          actuallySent: submission.actuallySent,
          updatedAt: new Date().toISOString(),
        },
      });
      setLatestSubmission(submission);
      setReportStatus(submission.status);
      setShareError(null);
      setShareNotice(getShareNotice(submission));
      setPendingShareDestinationId(null);
      return;
    }

    if (!backendReportId) {
      setShareError(
        "This draft needs a backend SafeSpeak report before it can be shared through the platform."
      );
      return;
    }

    const destination = destinationOptions.find(
      (option) => option.destinationId === destinationId
    );

    if (!destination) {
      setShareError(
        "This recipient is not available from the admin-managed destination list anymore."
      );
      return;
    }

    if (destination.missingRequiredInfo.length) {
      setShareError(
        `Review recipients first. This destination still needs: ${destination.missingRequiredInfo.join(", ")}.`
      );
      return;
    }

    setIsSubmitting(true);
    setShareError(null);
    setShareNotice(null);

    try {
      const submission = await submitReportToDestination(backendReportId, {
        destinationId,
        anonymityMode,
        notes:
          shareNotes.trim() ||
          `Shared from SafeSpeak secure report sharing: ${destination.destinationName}`,
        confirmConsent: true,
      });

      setReportSubmissions((currentSubmissions) => [
        submission,
        ...currentSubmissions.filter((item) => item._id !== submission._id),
      ]);
      mergeReportFlowDraft({
        selectedDestinationId: destination.destinationId,
        latestSubmissionId: submission._id,
        preparedSubmission: {
          destinationId: destination.destinationId,
          destinationName: destination.destinationName,
          destinationType: destination.destinationType,
          channel: destination.channel,
          status: toPreparedSubmissionStatus(submission.status),
          missingRequiredInfo: destination.missingRequiredInfo,
          reason: destination.reason,
          message: submission.deliveryMessage,
          actuallySent:
            submission.actuallySent ?? isActualDeliveryStatus(submission.status),
          updatedAt: new Date().toISOString(),
        },
      });
      setLatestSubmission(submission);
      setReportStatus(submission.status);
      setShareNotice(getShareNotice(submission));
      setPendingShareDestinationId(null);
    } catch (error) {
      if (captureConsentError(error)) {
        setPendingShareDestinationId(destinationId);
        return;
      }

      setShareError(
        error instanceof Error
          ? error.message
          : "Sharing could not be completed."
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleShareSelected = () => {
    if (!selectedDestination) {
      return;
    }

    if (isSubmitting) {
      return;
    }

    void submitToDestination(selectedDestination.destinationId);
  };

  const handleAllowSharingConsent = async () => {
    try {
      const consent = await grantPendingConsent();

      if (!consent || !pendingShareDestinationId) {
        return;
      }

      await submitToDestination(pendingShareDestinationId);
    } catch (error) {
      if (captureConsentError(error)) {
        return;
      }

      setShareError(
        error instanceof Error
          ? error.message
          : "Sharing consent could not be saved."
      );
    }
  };

  const handleDeclineSharingConsent = () => {
    setPendingShareDestinationId(null);
    clearPendingConsent();
    setShareError("No report was sent. The report remains ready for secure sharing.");
  };
  const deliveryReadinessCopy = getDeliveryReadinessCopy(selectedMatch);
  const preparedStatusLabel = getPreparedStatusLabel(
    latestSubmission
      ? toPreparedSubmissionStatus(latestSubmission.status)
      : reportDraft?.preparedSubmission?.status ?? "ready_to_share"
  );
  const selectedRecipientName =
    latestSubmission?.destinationName ??
    selectedDestination?.destinationName ??
    selectedMatch?.destinationName ??
    "No recipient selected";
  const selectedRecipientMessage = latestSubmission
    ? getShareNotice(latestSubmission)
    : missingRequiredInfo.length
      ? `Review recipients first. This authority still needs: ${missingRequiredInfo.join(", ")}.`
      : reportDraft?.preparedSubmission?.message ??
        "Recipient reviewed. Continue to secure sharing to confirm and send.";
  const readinessBadgeLabel = latestSubmission
    ? "Shared through SafeSpeak"
    : selectedDestination
      ? "Ready for secure sharing"
      : "Awaiting recipient selection";
  const reviewHref = withTriageParam(
    buildReportFlowHref("reportsubmissionreview", {
      reportId: reportDraft?.reportId,
      selectedDestinationId:
        selectedDestination?.destinationId ??
        selectedDestinationId ??
        reportDraft?.selectedDestinationId,
      latestSubmissionId:
        latestSubmission?._id ?? reportDraft?.latestSubmissionId,
    }),
    fromTriage
  );

  return (
    <ReportSubmissionFrame
      title="Share report securely"
      subtitle="Confirm the recommended authority, consent, and report package before SafeSpeak sends anything to an external department."
      step={latestSubmission ? "done" : "share"}
      skipSupportStep={!fromTriage}
      backHref={reviewHref}
      backLabel="Review"
    >
      <div className="mt-4">

          <div className="mt-4 grid gap-3 md:grid-cols-3">
            <div className="rounded-[12px] border border-[#dce5f1] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                SafeSpeak reference
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#1f2a3a]">
                {reportRef ?? "No backend report yet"}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#dce5f1] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Current status
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#1f2a3a]">
                {reportStatus}
              </p>
            </div>
            <div className="rounded-[12px] border border-[#dce5f1] bg-white px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Evidence
              </p>
              <p className="mt-1 text-[13px] font-bold text-[#1f2a3a]">
                {evidenceCount} item{evidenceCount === 1 ? "" : "s"}
              </p>
            </div>
          </div>

          {pendingConsentRequirement ? (
            <div className="mt-4">
              <ConsentRequiredCard
                requirement={pendingConsentRequirement}
                isSubmitting={isGrantingConsent || isSubmitting}
                onAllow={() => {
                  void handleAllowSharingConsent();
                }}
                onDecline={handleDeclineSharingConsent}
              />
            </div>
          ) : null}

          {shareError ? (
            <div className="mt-4 rounded-[12px] border border-[#fde2e2] bg-[#fff7f7] px-4 py-3 text-[11px] leading-[16px] text-[#b45353]">
              <span className="inline-flex items-start gap-2">
                <IconAlertCircle size={14} className="mt-0.5 shrink-0" />
                {shareError}
              </span>
            </div>
          ) : null}

          {shareNotice ? (
            <div className="mt-4 rounded-[12px] border border-[#d7f3e4] bg-[#f3fbf7] px-4 py-3 text-[11px] leading-[16px] text-[#0b8b54]">
              <span className="inline-flex items-start gap-2">
                <IconShieldCheck size={14} className="mt-0.5 shrink-0" />
                {shareNotice}
              </span>
            </div>
          ) : null}

          <div className="mt-5 grid grid-cols-1 gap-4 xl:grid-cols-[1.1fr_0.9fr]">
            <section className="space-y-4">
              <article className="rounded-[16px] border border-[#dbe7f4] bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                {selectedMatch ? (
                  <>
                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3 rounded-[14px] border border-[#cfe0f3] bg-[#f8fbff] p-4">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                          Primary recommendation
                        </p>
                        <h5 className="mt-1 text-[20px] font-bold text-[#10243d]">
                          {selectedMatch.destinationName}
                        </h5>
                      </div>
                      <span className="inline-flex h-8 items-center rounded-full bg-[#0f5d9f] px-3 text-[10px] font-bold text-white">
                        Best match: {selectedMatch.confidence}%
                      </span>
                    </div>

                    <div className="mt-3 flex flex-wrap gap-2">
                      {selectedMatch.tags.map((tag) => (
                        <span
                          key={tag}
                          className="inline-flex rounded-full border border-[#d6e4f4] bg-[#f8fbff] px-2.5 py-1 text-[10px] font-semibold text-[#526982]"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    <p className="mt-3 text-[12px] leading-[18px] text-[#60728a]">
                      {selectedMatch.reason}
                    </p>

                    <div className="mt-4 grid gap-3 sm:grid-cols-2">
                      <div className="rounded-[12px] border border-[#e4edf7] bg-[#f8fbff] px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                          Department type
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                          {formatDestinationType(selectedMatch.destinationType)}
                        </p>
                      </div>
                      <div className="rounded-[12px] border border-[#e4edf7] bg-[#f8fbff] px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                          Secure channel
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                          {formatChannel(selectedMatch.channel)}
                        </p>
                      </div>
                      <div className="rounded-[12px] border border-[#e4edf7] bg-[#f8fbff] px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                          Jurisdiction
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                          {selectedMatch.jurisdiction}
                        </p>
                      </div>
                      <div className="rounded-[12px] border border-[#e4edf7] bg-[#f8fbff] px-3 py-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                          Required info
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                          {getRequiredInfoLabel(selectedMatch)}
                        </p>
                      </div>
                      <div className="rounded-[12px] border border-[#e4edf7] bg-[#f8fbff] px-3 py-2 sm:col-span-2">
                        <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                          Delivery readiness
                        </p>
                        <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                          {selectedMatch.deliveryReadiness?.status ===
                          "config_missing"
                            ? "Needs partner setup"
                            : selectedMatch.deliveryReadiness?.status ===
                                "manual_action"
                              ? "Manual follow-up required"
                              : "Automated channel ready"}
                        </p>
                      </div>
                    </div>

                    {selectedMatch.contactPhone || selectedMatch.contactEmail ? (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {selectedMatch.contactPhone ? (
                          <a
                            href={`tel:${selectedMatch.contactPhone.replace(/[^\d+]/g, "")}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dbe7f4] bg-white px-3 text-[10px] font-semibold text-[#526982]"
                          >
                            <IconPhone size={12} />
                            Call contact
                          </a>
                        ) : null}
                        {selectedMatch.contactEmail ? (
                          <a
                            href={`mailto:${selectedMatch.contactEmail}`}
                            className="inline-flex h-9 items-center gap-1.5 rounded-full border border-[#dbe7f4] bg-white px-3 text-[10px] font-semibold text-[#526982]"
                          >
                            <IconMail size={12} />
                            Email contact
                          </a>
                        ) : null}
                      </div>
                    ) : null}
                  </>
                ) : (
                  <p className="mt-3 text-[12px] leading-[18px] text-[#60728a]">
                    No active admin-managed destination is available for this
                    report yet.
                  </p>
                )}
              </article>

              <article className="rounded-[16px] border border-[#dbe7f4] bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                <div className="flex items-center justify-between gap-3">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                    Other available matches
                  </p>
                  <Link
                    href="/dashboard?view=reportsubmissionreview"
                    className="text-[10px] font-semibold text-[#0f5d9f]"
                  >
                    Review recipients
                  </Link>
                </div>
                <div className="mt-3 grid gap-2 md:grid-cols-2">
                  {alternativeMatches.length ? (
                    alternativeMatches.map((match) => {
                      const isSelected =
                        match.destinationId === selectedMatch?.destinationId;

                      return (
                        <button
                          key={match.destinationId}
                          type="button"
                          onClick={() => {
                            setSelectedDestinationId(match.destinationId);
                            setShareError(null);
                          }}
                          className={`rounded-[12px] border p-3 text-left transition ${
                            isSelected
                              ? "border-[#0f5d9f] bg-[#eef6ff]"
                              : "border-[#e2ebf5] bg-white hover:bg-[#f8fbff]"
                          }`}
                        >
                          <span className="flex items-start justify-between gap-2">
                            <span className="text-[11px] font-bold leading-[15px] text-[#1f2a3a]">
                              {match.destinationName}
                            </span>
                            {isSelected ? (
                              <span className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#0f5d9f] text-white">
                                <IconCheck size={12} />
                              </span>
                            ) : null}
                          </span>
                          <span className="mt-1 block text-[9px] font-semibold uppercase tracking-[0.08em] text-[#7c8da3]">
                            {formatDestinationType(match.destinationType)} -{" "}
                            {match.confidence}%
                          </span>
                        </button>
                      );
                    })
                  ) : (
                    <div className="rounded-[12px] border border-[#e2ebf5] bg-white p-3 text-[10px] leading-[16px] text-[#60728a] md:col-span-2">
                      Admin-managed police, legal, eSafety, and support
                      destinations will appear here when available.
                    </div>
                  )}
                </div>
              </article>
            </section>

            <section className="space-y-4">
              <article className="rounded-[16px] border border-[#dbe7f4] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  Selected recipient
                </p>
                <h5 className="mt-2 text-lg font-bold text-[#1f2a3a]">
                  {selectedRecipientName}
                </h5>
                <p className="mt-1.5 text-xs text-[#60728a]">
                  Status: <span className="font-semibold text-[#0f5d9f]">{preparedStatusLabel}</span>
                </p>
                <p className="mt-2 text-xs leading-[1.6] text-[#60728a]">
                  {selectedRecipientMessage}
                </p>
                {!latestSubmission && deliveryReadinessCopy ? (
                  <p className="mt-3 rounded-[10px] border border-[#dbe7f4] bg-[#f8fbff] px-3 py-2 text-xs leading-[1.5] text-[#526982]">
                    {deliveryReadinessCopy}
                  </p>
                ) : null}
              </article>

              {!latestSubmission ? (
                <article className="rounded-[16px] border border-[#dbe7f4] bg-white p-5 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3] mb-3">
                    Sharing options
                  </p>
                  <div className="space-y-4">
                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-[#526982]">
                        Identity mode
                      </span>
                      <select
                        value={anonymityMode}
                        onChange={(event) =>
                          setAnonymityMode(
                            event.target.value as
                              | "identified"
                              | "anonymous"
                              | "pseudonymous"
                          )
                        }
                        className="h-10 w-full rounded-[10px] border border-[#dce5f1] bg-white px-3 text-xs font-medium text-[#1f2a3a] outline-none transition focus:border-[#0f5d9f] focus:ring-1 focus:ring-[#0f5d9f]"
                      >
                        <option value="identified">Identified (Name & contact info shared)</option>
                        <option value="anonymous">Anonymous (No identity details shared)</option>
                        <option value="pseudonymous">Pseudonymous (Use SafeSpeak alias)</option>
                      </select>
                    </label>

                    <label className="flex flex-col gap-1.5">
                      <span className="text-xs font-semibold text-[#526982]">
                        Submission notes (Optional)
                      </span>
                      <textarea
                        value={shareNotes}
                        onChange={(event) => setShareNotes(event.target.value)}
                        placeholder="Add a routing note or specific request..."
                        rows={3}
                        className="w-full resize-none rounded-[10px] border border-[#dce5f1] bg-white px-3 py-2 text-xs text-[#1f2a3a] outline-none transition focus:border-[#0f5d9f] focus:ring-1 focus:ring-[#0f5d9f] placeholder:text-[#9eb0c7]"
                      />
                    </label>
                  </div>
                </article>
              ) : null}

              <article className="overflow-hidden rounded-[16px] border border-[#dbe7f4] bg-white shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
                <div className="flex flex-col divide-y divide-[#edf2f8]">
                  <div className="flex flex-col gap-3 p-5">
                    <button
                      type="button"
                      onClick={handleShareSelected}
                      disabled={!canSubmit}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full bg-[#ff8f00] px-5 text-xs font-bold text-white shadow-[0_10px_22px_rgba(255,143,0,0.28)] transition hover:bg-[#ec8200] disabled:cursor-not-allowed disabled:bg-[#ffd39b] disabled:text-white/80"
                    >
                      {isSubmitting ? (
                        <IconLoader2 size={14} className="animate-spin" />
                      ) : (
                        <IconShare size={13} />
                      )}
                      Share report securely
                    </button>
                    
                    <Link
                      href={reviewHref}
                      className="inline-flex h-11 w-full items-center justify-center gap-2 rounded-full border border-[#dbe7f4] bg-white px-5 text-xs font-bold text-[#526982] transition hover:bg-[#f8fbff]"
                    >
                      Review recipients
                      <IconArrowRight size={13} />
                    </Link>
                  </div>
                  
                  <div className="flex items-center justify-between bg-[#f8fbff] px-5 py-3 text-xs">
                    <Link
                      href="/dashboard?view=reportsubmissionhistory"
                      className="inline-flex items-center gap-1.5 font-semibold text-[#ff8f00] hover:underline"
                    >
                      <IconFolderFilled size={13} />
                      Save to History
                    </Link>
                    
                    <span className="inline-flex items-center gap-1 font-semibold text-[#9a5b12]">
                      <IconBoltFilled size={12} />
                      {readinessBadgeLabel}
                    </span>
                  </div>
                </div>
              </article>
            </section>
          </div>

          {isSharePreviewVisible ? (
            <div className="fixed inset-0 z-[120] flex items-center justify-center bg-[#0f172a]/30 px-4">
              <div className="w-full max-w-[640px] rounded-[20px] border border-[#dbe7f4] bg-white p-6 shadow-[0_24px_60px_rgba(15,23,42,0.24)]">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                  Share preview
                </p>
                <h4 className="mt-2 text-[24px] font-bold text-[#1f2a3a]">
                  Nothing will be sent yet
                </h4>
                <p className="mt-2 text-[12px] leading-[1.6] text-[#60728a]">
                  This popup only previews what would be shared. No external
                  service has been contacted and no submission has been
                  recorded.
                </p>

                <div className="mt-5 grid gap-3 sm:grid-cols-2">
                  <div className="rounded-[12px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                      Recipient
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#1f2a3a]">
                      {selectedRecipientName}
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                      Evidence included
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#1f2a3a]">
                      {evidenceCount} item{evidenceCount === 1 ? "" : "s"}
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                      Identity mode
                    </p>
                    <p className="mt-1 text-[12px] font-semibold text-[#1f2a3a]">
                      {anonymityMode.charAt(0).toUpperCase() +
                        anonymityMode.slice(1)}
                    </p>
                  </div>
                  <div className="rounded-[12px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3">
                    <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                      Submission notes
                    </p>
                    <p className="mt-1 text-[12px] text-[#526982]">
                      {shareNotes.trim() || "No submission notes added."}
                    </p>
                  </div>
                </div>

                <div className="mt-5 flex justify-end">
                  <button
                    type="button"
                    onClick={() => setIsSharePreviewVisible(false)}
                    className="inline-flex h-11 items-center justify-center rounded-full border border-[#dbe7f4] bg-white px-5 text-[12px] font-bold text-[#526982] transition hover:bg-[#f8fbff]"
                  >
                    Close preview
                  </button>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </ReportSubmissionFrame>
  );
}

export { ReportSubmissionSharePage };
