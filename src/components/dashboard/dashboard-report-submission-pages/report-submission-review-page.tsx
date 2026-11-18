"use client";

import type { Route } from "next";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useRef, useState } from "react";

import {
  IconAlertCircle,
  IconBoltFilled,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconLoader2,
  IconMail,
  IconPencil,
  IconPhoneCall,
  IconPlus,
  IconTrash,
} from "@tabler/icons-react";

import { ReportSubmissionFrame } from "./report-submission-frame";
import { resolvePreferredDestinationId } from "@/lib/report-authority-routing";
import {
  buildReportFlowHref,
  getResolvedReportFlowDraft,
  mergeReportFlowDraft,
} from "@/lib/report-flow";
import {
  getMockDestinations,
  REPORT_SUBMISSION_MOCK_MODE,
} from "@/lib/report-submission-mock";
import {
  type ReportDestinationPreview,
  type ReportRecord,
  type ReportSubmissionPayloadPreview,
  createReport,
  getReport,
  getReportDestinations,
  getReportStatus,
  getReportTimeline,
  updateReport,
  previewReportSubmissions,
} from "@/lib/reports-client";

type TimelineEntry = {
  id: string;
  chip:
    | "Who"
    | "What"
    | "Where"
    | "When"
    | "How"
    | "Witnesses"
    | "Repeated"
    | "Injuries"
    | "Evidence";
  value: string;
  label?: string;
  hint?: string;
  action?: string;
  isLocalOnly?: boolean;
};

type StatusHistoryEntry = {
  id: string;
  status: string;
  changedAt?: string;
  reason?: string;
};

type TimelineFieldKey =
  | "who"
  | "what"
  | "where"
  | "when"
  | "how"
  | "witnesses"
  | "repeatedIncidents"
  | "injuries";

const manualEntryTypes: Array<Exclude<TimelineEntry["chip"], "Evidence">> = [
  "Who",
  "What",
  "Where",
  "When",
  "How",
  "Witnesses",
  "Repeated",
  "Injuries",
];

const timelineFieldConfig = [
  { key: "who", chip: "Who" },
  { key: "what", chip: "What" },
  { key: "when", chip: "When" },
  { key: "where", chip: "Where" },
  { key: "how", chip: "How" },
  { key: "witnesses", chip: "Witnesses" },
  { key: "repeatedIncidents", chip: "Repeated" },
  { key: "injuries", chip: "Injuries" },
  { key: "evidenceItems", chip: "Evidence" },
] as const;

const timelineChipToFieldKey: Record<Exclude<TimelineEntry["chip"], "Evidence">, TimelineFieldKey> = {
  Who: "who",
  What: "what",
  Where: "where",
  When: "when",
  How: "how",
  Witnesses: "witnesses",
  Repeated: "repeatedIncidents",
  Injuries: "injuries",
};

const hasTimelineValue = (value: unknown): boolean => {
  if (typeof value === "string") {
    return Boolean(value.trim());
  }

  if (typeof value === "boolean" || typeof value === "number") {
    return true;
  }

  if (Array.isArray(value)) {
    return value.length > 0;
  }

  return false;
};

const safeTimelineValue = (value: unknown): string => {
  if (typeof value === "string" && value.trim()) {
    return value;
  }

  if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }

  if (Array.isArray(value)) {
    return value.length
      ? `${value.length} evidence item${value.length === 1 ? "" : "s"}`
      : "Not provided yet";
  }

  if (typeof value === "number") {
    return String(value);
  }

  return "Not provided yet";
};

const buildStructuredTimelineEntries = (
  backendFields: Record<string, unknown>,
  localFields: Record<string, unknown> = {}
): TimelineEntry[] =>
  timelineFieldConfig.map((field) => {
    const backendValue = backendFields[field.key];
    const localValue = localFields[field.key];
    const useLocalValue =
      !hasTimelineValue(backendValue) && hasTimelineValue(localValue);

    return {
      id: field.key,
      chip: field.chip,
      value: safeTimelineValue(useLocalValue ? localValue : backendValue),
      action: field.chip === "Evidence" ? undefined : "Edit Details",
      isLocalOnly: useLocalValue,
    };
  });

const buildStatusHistoryEntries = (
  timeline: Array<Record<string, unknown>>
): StatusHistoryEntry[] =>
  timeline.reduce<StatusHistoryEntry[]>((entries, item, index) => {
    const status = typeof item.status === "string" ? item.status : null;

    if (!status) {
      return entries;
    }

    const entry: StatusHistoryEntry = {
      id: String(item._id ?? `${status}-${index}`),
      status,
    };

    if (typeof item.changedAt === "string") {
      entry.changedAt = item.changedAt;
    }

    if (typeof item.reason === "string") {
      entry.reason = item.reason;
    }

    entries.push(entry);
    return entries;
  }, []);

const stringifyPreviewPayload = (payload: Record<string, unknown>): string =>
  JSON.stringify(payload, null, 2);

const formatConsentFlag = (flag: string): string => flag.replace(/_/g, " ");

const formatConsentFlags = (flags: string[]): string =>
  flags.map(formatConsentFlag).join(", ");

const areStructuredFieldsEqual = (
  left: Record<string, unknown>,
  right: Record<string, unknown>
): boolean => JSON.stringify(left) === JSON.stringify(right);

const toTelHref = (phone: string): string => {
  const normalized = phone.replace(/[^\d+]/g, "");
  return normalized ? `tel:${normalized}` : `tel:${phone}`;
};

const toMailHref = (email: string, destinationName: string): string => {
  const subject = encodeURIComponent(
    `SafeSpeak contact request for ${destinationName}`
  );
  return `mailto:${email}?subject=${subject}`;
};

const inferIncidentTypeFromStructuredFields = (
  structuredFields: Record<string, unknown>
): string | undefined => {
  const narrative = Object.values(structuredFields)
    .filter((value): value is string => typeof value === "string")
    .join(" ")
    .toLowerCase();
  const domesticViolenceTerms = [
    "wife",
    "husband",
    "partner",
    "spouse",
    "girlfriend",
    "boyfriend",
    "domestic",
    "family violence",
    "hit me",
    "slapped me",
    "pushed me",
    "unsafe at home",
  ];

  return domesticViolenceTerms.some((term) => narrative.includes(term))
    ? "domestic_violence"
    : undefined;
};

const withTriageParam = (href: Route, fromTriage: boolean): Route =>
  (fromTriage ? `${href}&fromTriage=1` : href) as Route;

function ReportSubmissionReviewPage() {
  const searchParams = useSearchParams();
  const fromTriage = searchParams.get("fromTriage") === "1";
  const reportDraft = useMemo(() => getResolvedReportFlowDraft(), []);
  const fallbackCreatePromiseRef = useRef<Promise<{
    savedReport: ReportRecord;
    destinationOptions: ReportDestinationPreview[];
    incidentType?: string;
  }> | null>(null);
  const [timelineEntries, setTimelineEntries] = useState<TimelineEntry[]>([]);
  const [backendStructuredFields, setBackendStructuredFields] = useState<
    Record<string, unknown>
  >({});
  const [currentStructuredFields, setCurrentStructuredFields] = useState<
    Record<string, unknown>
  >(reportDraft?.structuredFields ?? {});
  const [reportLanguage, setReportLanguage] = useState("en");
  const [reportJurisdiction, setReportJurisdiction] = useState("NSW");
  const [destinations, setDestinations] = useState<ReportDestinationPreview[]>(
    []
  );
  const [selectedDestinationId, setSelectedDestinationId] = useState<
    string | null
  >(reportDraft?.selectedDestinationId ?? null);
  const [selectedDestinationIds, setSelectedDestinationIds] = useState<
    string[]
  >(
    reportDraft?.selectedDestinationId
      ? [reportDraft.selectedDestinationId]
      : []
  );
  const [submissionPreviews, setSubmissionPreviews] = useState<
    ReportSubmissionPayloadPreview[]
  >([]);
  const [anonymityMode, setAnonymityMode] = useState<
    "identified" | "anonymous" | "pseudonymous"
  >("identified");
  const [submissionNotes, setSubmissionNotes] = useState("");
  const [statusHistoryEntries, setStatusHistoryEntries] = useState<
    StatusHistoryEntry[]
  >([]);
  const [isLoading, setIsLoading] = useState(Boolean(reportDraft?.reportId));
  const [isLoadingSubmissionPreviews, setIsLoadingSubmissionPreviews] =
    useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [timelineStatusMessage, setTimelineStatusMessage] = useState<
    string | null
  >(null);
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(null);
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualEntryType, setManualEntryType] =
    useState<Exclude<TimelineEntry["chip"], "Evidence">>("What");
  const [manualEntryValue, setManualEntryValue] = useState("");
  const [isSavingTimeline, setIsSavingTimeline] = useState(false);
  const [editingEntryId, setEditingEntryId] = useState<string | null>(null);
  const [editingEntryValue, setEditingEntryValue] = useState("");

  useEffect(() => {
    const reportId = reportDraft?.reportId;

    if (!reportId) {
      if (reportDraft?.structuredFields) {
        setBackendStructuredFields({});
        setCurrentStructuredFields(reportDraft.structuredFields);
        const localEntries = buildStructuredTimelineEntries(
          {},
          reportDraft.structuredFields
        );

        setTimelineEntries(localEntries);
        setExpandedEntryId(localEntries[0]?.id ?? null);
        setIsLoading(false);

        let isActive = true;

        void (async () => {
          try {
            const latestResolvedDraft = getResolvedReportFlowDraft();

            if (latestResolvedDraft?.reportId) {
              const [report, timeline, destinationOptions] = await Promise.all(
                [
                  getReport(latestResolvedDraft.reportId),
                  getReportTimeline(latestResolvedDraft.reportId),
                  getReportDestinations(latestResolvedDraft.reportId),
                ]
              );

              if (!isActive) {
                return;
              }

              const resolvedStructuredFields =
                report.structuredFields ??
                latestResolvedDraft.structuredFields ??
                reportDraft.structuredFields ??
                {};
              const backendEntries = buildStructuredTimelineEntries(
                resolvedStructuredFields,
                resolvedStructuredFields
              );
              const resolvedDestinationId = resolvePreferredDestinationId(
                destinationOptions,
                latestResolvedDraft.selectedDestinationId ??
                  reportDraft.selectedDestinationId
              );
              const fallbackDestinationId =
                resolvedDestinationId ?? destinationOptions[0]?.destinationId;

              setBackendStructuredFields(resolvedStructuredFields);
              setCurrentStructuredFields(resolvedStructuredFields);
              setTimelineEntries(backendEntries);
              setExpandedEntryId(backendEntries[0]?.id ?? null);
              setStatusHistoryEntries(buildStatusHistoryEntries(timeline));
              setReportLanguage(report.language ?? "en");
              setReportJurisdiction(report.jurisdiction ?? "NSW");
              setDestinations(destinationOptions);
              setSelectedDestinationId(fallbackDestinationId ?? null);
              setSelectedDestinationIds(
                fallbackDestinationId ? [fallbackDestinationId] : []
              );
              setLoadError(null);
              mergeReportFlowDraft({
                reportId: report._id,
                selectedDestinationId: fallbackDestinationId,
                structuredFields: resolvedStructuredFields,
                incidentType:
                  report.incidentType ??
                  latestResolvedDraft.incidentType ??
                  reportDraft.incidentType,
              });
              return;
            }

            if (!fallbackCreatePromiseRef.current) {
              fallbackCreatePromiseRef.current = (async () => {
                const incidentType =
                  reportDraft.incidentType ??
                  reportDraft.incidentCategory ??
                  inferIncidentTypeFromStructuredFields(
                    reportDraft.structuredFields ?? {}
                  );
                const savedReport = await createReport({
                  language: "en",
                  jurisdiction: "NSW",
                  context: reportDraft.title || "SafeSpeak incident report",
                  originalNarrative:
                    reportDraft.summary ||
                    String(reportDraft.structuredFields?.what ?? ""),
                  incidentType,
                  structuredFields: reportDraft.structuredFields,
                  status: "draft",
                });
                const destinationOptions = await getReportDestinations(
                  savedReport._id
                );

                return { savedReport, destinationOptions, incidentType };
              })().catch((error) => {
                fallbackCreatePromiseRef.current = null;
                throw error;
              });
            }

            const { savedReport, destinationOptions, incidentType } =
              await fallbackCreatePromiseRef.current;

            if (!isActive) {
              return;
            }

            const resolvedStructuredFields =
              savedReport.structuredFields ?? reportDraft.structuredFields ?? {};
            const backendEntries = buildStructuredTimelineEntries(
              resolvedStructuredFields,
              resolvedStructuredFields
            );
            const resolvedDestinationId = resolvePreferredDestinationId(
              destinationOptions,
              reportDraft.selectedDestinationId
            );
            const fallbackDestinationId =
              resolvedDestinationId ?? destinationOptions[0]?.destinationId;

            setBackendStructuredFields(resolvedStructuredFields);
            setCurrentStructuredFields(resolvedStructuredFields);
            setTimelineEntries(backendEntries);
            setExpandedEntryId(backendEntries[0]?.id ?? null);
            setDestinations(destinationOptions);
            setSelectedDestinationId(fallbackDestinationId ?? null);
            setSelectedDestinationIds(
              fallbackDestinationId ? [fallbackDestinationId] : []
            );
            setLoadError(null);
            mergeReportFlowDraft({
              reportId: savedReport._id,
              selectedDestinationId: fallbackDestinationId,
              structuredFields: resolvedStructuredFields,
              incidentType: savedReport.incidentType ?? incidentType,
            });
          } catch (error) {
            if (!isActive) {
              return;
            }

            setLoadError(
              error instanceof Error
                ? error.message
                : "SafeSpeak could not create a backend report for contact options."
            );
          }
        })();

        return () => {
          isActive = false;
        };
      }

      return;
    }

    let isActive = true;

    void (async () => {
      try {
        const [report, status, timeline] = await Promise.all([
          getReport(reportId),
          getReportStatus(reportId),
          getReportTimeline(reportId),
        ]);

        if (!isActive) {
          return;
        }

        const mergedStructuredFields = {
          ...(reportDraft?.structuredFields ?? {}),
          ...(report.structuredFields ?? {}),
        };

        const backendStructuredFields = report.structuredFields ?? {};
        const resolvedIncidentType =
          reportDraft?.incidentType ??
          reportDraft?.incidentCategory ??
          inferIncidentTypeFromStructuredFields(mergedStructuredFields) ??
          report.incidentType;
        const requiresBackendSync =
          report._id &&
          ((Object.keys(mergedStructuredFields).length > 0 &&
            !areStructuredFieldsEqual(
              backendStructuredFields,
              mergedStructuredFields
            )) ||
            (resolvedIncidentType &&
              resolvedIncidentType !== report.incidentType));

        const syncedReport = requiresBackendSync
          ? await updateReport(report._id, {
              structuredFields: mergedStructuredFields,
              incidentType: resolvedIncidentType,
              ...(typeof mergedStructuredFields.what === "string"
                ? {
                    originalNarrative: String(mergedStructuredFields.what),
                  }
                : {}),
            })
          : report;
        const destinationOptions = await getReportDestinations(syncedReport._id);
        const resolvedStructuredFields =
          syncedReport.structuredFields ?? mergedStructuredFields;
        const resolvedDestinationId = resolvePreferredDestinationId(
          destinationOptions,
          reportDraft?.selectedDestinationId
        );

        setBackendStructuredFields(resolvedStructuredFields);
        setCurrentStructuredFields(resolvedStructuredFields);
        const backendEntries = buildStructuredTimelineEntries(
          resolvedStructuredFields,
          resolvedStructuredFields
        );

        setTimelineEntries(backendEntries);
        setExpandedEntryId(backendEntries[0]?.id ?? null);
        setStatusHistoryEntries(buildStatusHistoryEntries(timeline));
        setReportLanguage(syncedReport.language ?? "en");
        setReportJurisdiction(syncedReport.jurisdiction ?? "NSW");
        setDestinations(destinationOptions);
        setSelectedDestinationId((currentDestinationId) => {
          const resolvedCurrentDestinationId = resolvePreferredDestinationId(
            destinationOptions,
            currentDestinationId ?? undefined
          );

          if (
            resolvedCurrentDestinationId &&
            destinationOptions.some(
              (destination) =>
                destination.destinationId === resolvedCurrentDestinationId
            )
          ) {
            return resolvedCurrentDestinationId;
          }

          const preferredDestinationId =
            resolvedDestinationId &&
            destinationOptions.some(
              (destination) => destination.destinationId === resolvedDestinationId
            )
              ? resolvedDestinationId
              : (destinationOptions[0]?.destinationId ?? null);

          return preferredDestinationId;
        });
        setSelectedDestinationIds((currentDestinationIds) => {
          const validDestinationIds = currentDestinationIds
            .map((destinationId) =>
              resolvePreferredDestinationId(destinationOptions, destinationId)
            )
            .filter((destinationId): destinationId is string =>
              destinationOptions.some(
                (destination) => destination.destinationId === destinationId
              )
            );

          if (validDestinationIds.length) {
            return validDestinationIds;
          }

          const fallbackDestinationId =
            resolvedDestinationId &&
            destinationOptions.some(
              (destination) => destination.destinationId === resolvedDestinationId
            )
              ? resolvedDestinationId
              : destinationOptions[0]?.destinationId;

          return fallbackDestinationId ? [fallbackDestinationId] : [];
        });
        setLoadError(null);
        mergeReportFlowDraft({
          reportId: syncedReport._id,
          selectedDestinationId:
            resolvedDestinationId ?? destinationOptions[0]?.destinationId,
          structuredFields: resolvedStructuredFields,
          incidentType: syncedReport.incidentType ?? resolvedIncidentType,
        });
      } catch (error) {
        if (!isActive) {
          return;
        }

        setBackendStructuredFields({});
        setCurrentStructuredFields({});
        setTimelineEntries([]);
        setExpandedEntryId(null);
        setStatusHistoryEntries([]);
        setDestinations([]);
        setSelectedDestinationId(null);
        setSelectedDestinationIds([]);
        setSubmissionPreviews([]);

        setLoadError(
          error instanceof Error
            ? error.message
            : "SafeSpeak could not load this report review from the backend."
        );
      } finally {
        if (isActive) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, [
    reportDraft?.reportId,
    reportDraft?.selectedDestinationId,
    reportDraft?.structuredFields,
  ]);

  useEffect(() => {
    const reportId = reportDraft?.reportId;

    if (!reportId || !selectedDestinationIds.length) {
      setSubmissionPreviews([]);
      return;
    }

    let isActive = true;
    setIsLoadingSubmissionPreviews(true);

    void previewReportSubmissions(reportId, {
      destinationIds: selectedDestinationIds,
      anonymityMode,
      notes: submissionNotes.trim() || undefined,
    })
      .then((previews) => {
        if (isActive) {
          setSubmissionPreviews(previews);
        }
      })
      .catch((error) => {
        if (isActive) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Submission previews could not be generated."
          );
        }
      })
      .finally(() => {
        if (isActive) {
          setIsLoadingSubmissionPreviews(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [
    anonymityMode,
    reportDraft?.reportId,
    selectedDestinationIds,
    submissionNotes,
  ]);

  const toggleEntry = (entryId: string) => {
    setExpandedEntryId((currentEntryId) =>
      currentEntryId === entryId ? null : entryId
    );
  };

  const openManualEntry = () => {
    setIsManualEntryOpen(true);
  };

  const closeManualEntry = () => {
    setIsManualEntryOpen(false);
    setManualEntryType("What");
    setManualEntryValue("");
  };

  const closeInlineEditor = () => {
    setEditingEntryId(null);
    setEditingEntryValue("");
  };

  const buildDraftFieldPatch = (
    fieldKey: TimelineFieldKey,
    value?: string
  ): Partial<{
    summary: string;
    date: string;
    location: string;
  }> => ({
    ...(fieldKey === "what" ? { summary: value ?? "" } : {}),
    ...(fieldKey === "when" ? { date: value ?? "" } : {}),
    ...(fieldKey === "where" ? { location: value ?? "" } : {}),
  });

  const syncTimelineField = async (
    fieldKey: TimelineFieldKey,
    value?: string
  ) => {
    const trimmedValue = value?.trim();
    const nextStructuredFields = { ...currentStructuredFields };

    if (trimmedValue) {
      nextStructuredFields[fieldKey] = trimmedValue;
    } else {
      delete nextStructuredFields[fieldKey];
    }

    setCurrentStructuredFields(nextStructuredFields);
    setTimelineEntries(
      buildStructuredTimelineEntries(backendStructuredFields, nextStructuredFields)
    );
    setExpandedEntryId(fieldKey);
    setTimelineStatusMessage("Timeline updated in this draft.");
    setLoadError(null);
    mergeReportFlowDraft({
      structuredFields: nextStructuredFields,
      ...buildDraftFieldPatch(fieldKey, trimmedValue),
    });

    if (!reportDraft?.reportId) {
      return;
    }

    setIsSavingTimeline(true);

    try {
      const savedReport = await updateReport(reportDraft.reportId, {
        structuredFields: nextStructuredFields,
        ...(fieldKey === "what"
          ? { originalNarrative: trimmedValue ?? "" }
          : {}),
      });

      const savedStructuredFields =
        savedReport.structuredFields ?? nextStructuredFields;
      setBackendStructuredFields(savedStructuredFields);
      setCurrentStructuredFields(savedStructuredFields);
      setTimelineEntries(
        buildStructuredTimelineEntries(savedStructuredFields, savedStructuredFields)
      );
      setTimelineStatusMessage(
        trimmedValue
          ? "Timeline saved to SafeSpeak."
          : "Timeline field removed from SafeSpeak."
      );
      mergeReportFlowDraft({
        reportId: savedReport._id,
        structuredFields: savedStructuredFields,
        ...buildDraftFieldPatch(fieldKey, trimmedValue),
      });
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Timeline changes could not be synced to SafeSpeak."
      );
      setTimelineStatusMessage(
        "Timeline saved in this browser only. Backend sync did not complete."
      );
    } finally {
      setIsSavingTimeline(false);
    }
  };

  const handleManualEntrySubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    const value = manualEntryValue.trim();
    if (!value) {
      return;
    }

    const fieldKey = timelineChipToFieldKey[manualEntryType];
    closeManualEntry();
    await syncTimelineField(fieldKey, value);
  };

  const startEditingEntry = (entry: TimelineEntry) => {
    if (entry.chip === "Evidence") {
      return;
    }

    setExpandedEntryId(entry.id);
    setEditingEntryId(entry.id);
    setEditingEntryValue(
      typeof currentStructuredFields[entry.id] === "string"
        ? String(currentStructuredFields[entry.id])
        : entry.value === "Not provided yet"
          ? ""
          : entry.value
    );
  };

  const handleInlineEditSubmit = async (
    event: React.FormEvent<HTMLFormElement>,
    entryId: string
  ) => {
    event.preventDefault();
    await syncTimelineField(entryId as TimelineFieldKey, editingEntryValue);
    closeInlineEditor();
  };

  const handleRemoveEntry = async (entryId: string) => {
    await syncTimelineField(entryId as TimelineFieldKey);
    closeInlineEditor();
  };

  const toggleDestinationSelection = (destinationId: string) => {
    setSelectedDestinationIds((currentDestinationIds) => {
      if (currentDestinationIds.includes(destinationId)) {
        const nextDestinationIds = currentDestinationIds.filter(
          (id) => id !== destinationId
        );

        if (selectedDestinationId === destinationId) {
          setSelectedDestinationId(nextDestinationIds[0] ?? null);
        }

        return nextDestinationIds;
      }

      setSelectedDestinationId(destinationId);
      return [...currentDestinationIds, destinationId];
    });
  };

  const selectedDestination =
    destinations.find(
      (destination) => destination.destinationId === selectedDestinationId
    ) ?? null;
  const mockDestinations = REPORT_SUBMISSION_MOCK_MODE
    ? getMockDestinations(reportDraft)
    : [];
  const fallbackDestination =
    selectedDestination ?? destinations[0] ?? mockDestinations[0] ?? null;

  const handleContinueToShare = () => {
    const destination = fallbackDestination;

    if (destination) {
      mergeReportFlowDraft({
        selectedDestinationId: destination.destinationId,
        latestSubmissionId: undefined,
        shareAnonymityMode: anonymityMode,
        shareNotes: submissionNotes,
        structuredFields: currentStructuredFields,
        preparedSubmission: {
          destinationId: destination.destinationId,
          destinationName: destination.destinationName,
          destinationType: destination.destinationType,
          channel: destination.channel,
          status: "ready_to_share",
          missingRequiredInfo: destination.missingRequiredInfo,
          reason: destination.reason,
          message:
            destination.missingRequiredInfo.length > 0
              ? "Review the missing details before final sharing."
              : "Recipient reviewed. Continue to confirm and send.",
          updatedAt: new Date().toISOString(),
        },
      });
    } else {
      mergeReportFlowDraft({
        latestSubmissionId: undefined,
        shareAnonymityMode: anonymityMode,
        shareNotes: submissionNotes,
        structuredFields: currentStructuredFields,
        preparedSubmission: undefined,
      });
    }
  };

  const shareHref = withTriageParam(
    buildReportFlowHref("reportsubmissionshare", {
      reportId: reportDraft?.reportId,
      selectedDestinationId:
        fallbackDestination?.destinationId ??
        selectedDestinationId ??
        reportDraft?.selectedDestinationId,
    }),
    fromTriage
  );
  const canContinueToShare =
    Boolean(fallbackDestination) &&
    !loadError &&
    !isLoading;

  return (
    <ReportSubmissionFrame
      title="Evidence Review"
      subtitle="If AI-assisted structuring was used, verify the timeline below before continuing to the secure sharing step."
      step="review"
      skipSupportStep={!fromTriage}
      backHref={
        fromTriage
          ? ("/dashboard?view=reportsubmissionevidence&fromTriage=1" as Route)
          : ("/dashboard?view=reportsubmissionevidence" as Route)
      }
      backLabel="Details"
    >
      <div className="mt-4">
            {loadError ? (
              <div className="mb-4 rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
                <span className="inline-flex items-center gap-1.5">
                  <IconAlertCircle size={12} />
                  {loadError}
                </span>
              </div>
            ) : null}
            {timelineStatusMessage ? (
              <div className="mb-4 rounded-[12px] border border-[#d8e4f2] bg-white px-3 py-2 text-[11px] font-medium text-[#0f5d9f]">
                {timelineStatusMessage}
              </div>
            ) : null}
            {statusHistoryEntries.length ? (
              <div className="mb-4 rounded-[12px] border border-[#dce5f1] bg-white px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  Status history
                </p>
                <div className="mt-2 space-y-1.5">
                  {statusHistoryEntries.map((entry) => (
                    <p
                      key={entry.id}
                      className="text-[11px] leading-[1.45] text-[#60728a]"
                    >
                      <span className="font-semibold text-[#1f2a3a]">
                        {entry.status}
                      </span>
                      {entry.reason ? <span> - {entry.reason}</span> : null}
                      {entry.changedAt ? (
                        <span>
                          {" "}
                          - {new Date(entry.changedAt).toLocaleString()}
                        </span>
                      ) : null}
                    </p>
                  ))}
                </div>
              </div>
            ) : null}
            <div className="mb-4 rounded-[16px] border border-[#dce5f1] bg-white p-4">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                    Contact option
                  </p>
                  <p className="mt-1 text-[12px] text-[#60728a]">
                    Language `{reportLanguage}` in `{reportJurisdiction}`.
                  </p>
                </div>
                <p className="text-[10px] text-[#8ea0b8]">
                  {destinations.length} option
                  {destinations.length === 1 ? "" : "s"} available
                </p>
              </div>
              <div className="mt-3 space-y-2">
                {destinations.length ? (
                  destinations.map((destination) => {
                    const isSelected =
                      destination.destinationId === selectedDestinationId;
                    const isIncluded = selectedDestinationIds.includes(
                      destination.destinationId
                    );
                    const hasMissingInfo =
                      destination.missingRequiredInfo.length > 0;

                    return (
                      <button
                        key={destination.destinationId}
                        type="button"
                        onClick={() =>
                          toggleDestinationSelection(destination.destinationId)
                        }
                        className={`w-full rounded-[12px] border px-4 py-3 text-left transition ${
                          isSelected
                            ? "border-[#0f52ba] bg-[#f7fbff]"
                            : "border-[#dce5f1] bg-white"
                        }`}
                      >
                        <div className="flex flex-wrap items-center justify-between gap-2">
                          <div>
                            <div className="flex items-center gap-2">
                              <span
                                className={`inline-flex h-4 w-4 items-center justify-center rounded border ${
                                  isIncluded
                                    ? "border-[#0f52ba] bg-[#0f52ba]"
                                    : "border-[#cbd8e8] bg-white"
                                }`}
                              >
                                {isIncluded ? (
                                  <span className="h-1.5 w-1.5 rounded-full bg-white" />
                                ) : null}
                              </span>
                              <p className="text-[12px] font-semibold text-[#1f2a3a]">
                                {destination.destinationName}
                              </p>
                            </div>
                            <p className="mt-1 text-[10px] text-[#6d8199]">
                              {destination.destinationType} via{" "}
                              {destination.channel}
                            </p>
                            {destination.contactPhone ||
                            destination.contactEmail ? (
                              <p className="mt-1 text-[10px] text-[#6d8199]">
                                Contact listed:{" "}
                                {[
                                  destination.contactPhone,
                                  destination.contactEmail,
                                ]
                                  .filter(Boolean)
                                  .join(" / ")}
                              </p>
                            ) : null}
                          </div>
                          <span
                            className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                              hasMissingInfo
                                ? "bg-[#fff2df] text-[#9a6a2e]"
                                : "bg-[#e9f7ef] text-[#0b8b54]"
                            }`}
                          >
                            {hasMissingInfo
                              ? `${destination.missingRequiredInfo.length} fields missing`
                              : "Ready"}
                          </span>
                        </div>
                        <p className="mt-2 text-[10px] leading-[1.55] text-[#60728a]">
                          Why: {destination.reason}
                        </p>
                        <p className="mt-1 text-[10px] leading-[1.55] text-[#60728a]">
                          Required:{" "}
                          {destination.minimumRequiredInfo.join(", ") ||
                            "None listed"}
                        </p>
                        {destination.expectedNextSteps.length ? (
                          <p className="mt-1 text-[10px] leading-[1.55] text-[#60728a]">
                            Next: {destination.expectedNextSteps.join(" / ")}
                          </p>
                        ) : null}
                      </button>
                    );
                  })
                ) : (
                  <div className="rounded-[12px] border border-[#f2d8b0] bg-[#fffaf2] px-3 py-2 text-[11px] text-[#9a5b12]">
                    No active destinations match this report yet. Add or
                    activate them in the admin dashboard.
                  </div>
                )}
              </div>
              {selectedDestination ? (
                <div className="mt-3 grid gap-3 rounded-[12px] border border-[#edf2f8] bg-[#f9fbfe] p-3 sm:grid-cols-2">
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-[#7f90a6]">
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
                      className="h-9 rounded-[8px] border border-[#dce5f1] bg-white px-2.5 text-[12px] font-semibold text-[#1f2a3a] outline-none"
                    >
                      <option value="identified">Identified</option>
                      <option value="anonymous">Anonymous</option>
                      <option value="pseudonymous">Pseudonymous</option>
                    </select>
                  </label>
                  <label className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-[#7f90a6]">
                      Submission notes
                    </span>
                    <input
                      value={submissionNotes}
                      onChange={(event) =>
                        setSubmissionNotes(event.target.value)
                      }
                      placeholder="Optional routing note"
                      className="h-9 rounded-[8px] border border-[#dce5f1] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none placeholder:text-[#9eb0c7]"
                    />
                  </label>
                  {selectedDestination.contactPhone ||
                  selectedDestination.contactEmail ? (
                    <div className="rounded-[10px] border border-[#dce5f1] bg-white px-3 py-3 sm:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-2">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                            Contact directly
                          </p>
                          <p className="mt-1 text-[10px] leading-[1.55] text-[#60728a]">
                            These buttons open your phone or email app only when
                            you choose them.
                          </p>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          {selectedDestination.contactPhone ? (
                            <a
                              href={toTelHref(selectedDestination.contactPhone)}
                              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#cfdceb] bg-[#f8fbff] px-3 text-[10px] font-bold text-[#244961]"
                            >
                              <IconPhoneCall size={12} />
                              Call
                            </a>
                          ) : null}
                          {selectedDestination.contactEmail ? (
                            <a
                              href={toMailHref(
                                selectedDestination.contactEmail,
                                selectedDestination.destinationName
                              )}
                              className="inline-flex h-9 items-center gap-1.5 rounded-[8px] border border-[#cfdceb] bg-[#f8fbff] px-3 text-[10px] font-bold text-[#244961]"
                            >
                              <IconMail size={12} />
                              Email
                            </a>
                          ) : null}
                        </div>
                      </div>
                    </div>
                  ) : null}
                  {selectedDestination.requiredConsentFlags.length ? (
                    <div className="rounded-[10px] border border-[#dce5f1] bg-white px-3 py-2 text-[10px] leading-[1.55] text-[#60728a] sm:col-span-2">
                      Consent required before SafeSpeak shares reviewed
                      information:{" "}
                      {formatConsentFlags(
                        selectedDestination.requiredConsentFlags
                      )}
                    </div>
                  ) : null}
                  <div className="rounded-[10px] border border-[#dce5f1] bg-white px-3 py-2 text-[10px] leading-[1.55] text-[#60728a] sm:col-span-2">
                    Anonymity options:{" "}
                    {selectedDestination.anonymityOptions.join(", ") ||
                      "Not specified by this destination"}
                  </div>
                </div>
              ) : null}
              {selectedDestinationIds.length ? (
                <div className="mt-3 rounded-[12px] border border-[#edf2f8] bg-white p-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                      Recipient payload previews
                    </p>
                    <p className="text-[10px] text-[#8ea0b8]">
                      {selectedDestinationIds.length} selected
                    </p>
                  </div>
                  {isLoadingSubmissionPreviews ? (
                    <div className="mt-3 inline-flex items-center gap-2 text-[10px] text-[#60728a]">
                      <IconLoader2 size={12} className="animate-spin" />
                      Mapping report fields...
                    </div>
                  ) : (
                    <div className="mt-3 space-y-3">
                      {submissionPreviews.map((preview) => (
                        <article
                          key={preview.destination.destinationId}
                          className="rounded-[10px] border border-[#dce5f1] bg-[#f9fbfe] p-3"
                        >
                          <div className="flex flex-wrap items-start justify-between gap-2">
                            <div>
                              <p className="text-[11px] font-semibold text-[#1f2a3a]">
                                {preview.destination.destinationName}
                              </p>
                              <p className="mt-1 text-[10px] text-[#6d8199]">
                                Template:{" "}
                                {preview.template.templateName ??
                                  "Default SafeSpeak payload"}
                              </p>
                            </div>
                            <span
                              className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                                preview.missingRequiredInfo.length ||
                                preview.missingMappedFields.length ||
                                preview.missingConsentFlags.length
                                  ? "bg-[#fff2df] text-[#9a6a2e]"
                                  : "bg-[#e9f7ef] text-[#0b8b54]"
                              }`}
                            >
                              {preview.missingRequiredInfo.length ||
                              preview.missingMappedFields.length ||
                              preview.missingConsentFlags.length
                                ? "Needs review"
                                : "Ready preview"}
                            </span>
                          </div>
                          {preview.missingMappedFields.length ? (
                            <p className="mt-2 text-[10px] leading-[1.55] text-[#9a5b12]">
                              Missing mapped fields:{" "}
                              {preview.missingMappedFields.join(", ")}
                            </p>
                          ) : null}
                          {preview.missingConsentFlags.length ? (
                            <p className="mt-1 text-[10px] leading-[1.55] text-[#9a5b12]">
                              Consent needed before sharing:{" "}
                              {formatConsentFlags(preview.missingConsentFlags)}
                            </p>
                          ) : null}
                          <pre className="mt-3 max-h-[220px] overflow-auto rounded-[8px] bg-[#101827] p-3 text-[10px] leading-[1.5] text-[#dce8f8]">
                            {stringifyPreviewPayload(preview.payload)}
                          </pre>
                        </article>
                      ))}
                    </div>
                  )}
                </div>
              ) : null}
            </div>
            <div className="relative">
              <span className="pointer-events-none absolute bottom-[76px] left-[10px] top-[12px] w-px bg-[#d5deea]" />
              <div className="space-y-3">
                {timelineEntries.map((entry) => {
                  const isExpanded = expandedEntryId === entry.id;
                  const hasLongContent = Boolean(
                    entry.label || entry.hint || entry.action
                  );
                  const panelId = `timeline-panel-${entry.id}`;

                  return (
                    <article key={entry.id} className="relative pl-8">
                      {isExpanded ? (
                        <span className="absolute -left-[2px] top-[8px] inline-flex h-[24px] w-[24px] items-center justify-center rounded-full bg-white shadow-[0_0_0_1px_#d7e1ee]">
                          <span className="h-[16px] w-[16px] rounded-full bg-[#0f52ba]" />
                        </span>
                      ) : (
                        <span className="absolute left-[4px] top-[30px] h-[8px] w-[8px] rounded-full border border-[#cfd9e6] bg-[#dfe7f1]" />
                      )}

                      {isExpanded ? (
                        <div
                          id={panelId}
                          className={`relative flex flex-col justify-between overflow-hidden rounded-[18px] rounded-l-[20px] border border-l-[4px] border-[#dce5f1] border-l-[#0F52BA] bg-white px-6 pb-5 pt-4 shadow-[0_4px_10px_rgba(15,82,186,0.08)] ${hasLongContent ? "min-h-[232px]" : "min-h-[104px]"}`}
                        >
                          <div>
                            <div className="flex items-start justify-between gap-3">
                              <span className="inline-flex h-5 items-center rounded-full bg-[#edf3ff] px-2 text-[9px] font-bold uppercase tracking-[0.08em] text-[#0f52ba]">
                                {entry.chip}
                              </span>
                              <button
                                type="button"
                                aria-expanded={isExpanded}
                                aria-controls={panelId}
                                onClick={() => toggleEntry(entry.id)}
                                className="inline-flex h-4 w-4 items-center justify-center text-[#9eb0c7]"
                              >
                                <IconChevronDown
                                  size={12}
                                  stroke={1.8}
                                  className="rotate-180"
                                />
                              </button>
                            </div>

                            {entry.label ? (
                              <p className="mt-3 text-[9px] font-semibold uppercase tracking-[0.06em] text-[#8fa0b8]">
                                {entry.label}
                              </p>
                            ) : null}
                            {editingEntryId === entry.id ? (
                              <form
                                onSubmit={(event) =>
                                  void handleInlineEditSubmit(event, entry.id)
                                }
                                className="mt-2 space-y-2"
                              >
                                <textarea
                                  value={editingEntryValue}
                                  onChange={(event) =>
                                    setEditingEntryValue(event.target.value)
                                  }
                                  rows={3}
                                  className="w-full resize-none rounded-[10px] border border-[#dce5f1] bg-white px-3 py-2 text-[12px] leading-[1.55] text-[#253447] outline-none"
                                  placeholder={`Update ${entry.chip.toLowerCase()} details`}
                                />
                                <div className="flex flex-wrap justify-end gap-2">
                                  <button
                                    type="button"
                                    onClick={() => void handleRemoveEntry(entry.id)}
                                    disabled={isSavingTimeline}
                                    className="inline-flex h-8 items-center gap-1 rounded-[8px] border border-[#fde2e2] px-3 text-[10px] font-semibold text-[#b45353] disabled:opacity-50"
                                  >
                                    <IconTrash size={10} />
                                    Clear
                                  </button>
                                  <button
                                    type="button"
                                    onClick={closeInlineEditor}
                                    disabled={isSavingTimeline}
                                    className="inline-flex h-8 items-center rounded-[8px] border border-[#dce5f1] px-3 text-[10px] font-semibold text-[#60728a] disabled:opacity-50"
                                  >
                                    Cancel
                                  </button>
                                  <button
                                    type="submit"
                                    disabled={isSavingTimeline}
                                    className="inline-flex h-8 items-center rounded-[8px] bg-[#0f52ba] px-3 text-[10px] font-semibold text-white disabled:opacity-50"
                                  >
                                    {isSavingTimeline ? "Saving..." : "Save"}
                                  </button>
                                </div>
                              </form>
                            ) : (
                              <p className="mt-1 text-[13px] font-semibold leading-[18px] text-[#1f2a3a]">
                                {entry.value}
                              </p>
                            )}
                            {entry.hint ? (
                              <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#16a56a]">
                                <IconBoltFilled size={10} />
                                {entry.hint}
                              </p>
                            ) : null}
                            {entry.isLocalOnly ? (
                              <p className="mt-3 text-[10px] font-semibold text-[#9a5b12]">
                                Stored locally only
                              </p>
                            ) : null}
                          </div>

                          {entry.action ? (
                            <div className="flex justify-end">
                              <button
                                type="button"
                                onClick={() => startEditingEntry(entry)}
                                className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#ff8f00]"
                              >
                                <IconPencil size={10} />
                                {entry.action}
                              </button>
                            </div>
                          ) : null}
                        </div>
                      ) : (
                        <div className="flex min-h-[72px] items-center justify-between rounded-[12px] border border-[#dce5f1] bg-white px-5 py-4 shadow-[0_2px_7px_rgba(15,23,42,0.03)]">
                          <div className="min-w-0">
                            <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#0f52ba]">
                              {entry.chip}
                            </p>
                            <p className="mt-1 truncate text-[13px] font-medium leading-[18px] text-[#253447]">
                              {entry.value}
                            </p>
                          </div>
                          <button
                            type="button"
                            aria-expanded={isExpanded}
                            aria-controls={panelId}
                            onClick={() => toggleEntry(entry.id)}
                            className="inline-flex h-4 w-4 items-center justify-center text-[#9fb0c6]"
                          >
                            <IconChevronDown size={12} stroke={1.8} />
                          </button>
                        </div>
                      )}
                    </article>
                  );
                })}
              </div>

              {isLoading ? (
                <div className="mt-4 inline-flex items-center gap-2 rounded-[12px] border border-[#dce5f1] bg-white px-4 py-3 text-[11px] text-[#60728a]">
                  <IconLoader2 size={14} className="animate-spin" />
                  Loading report draft...
                </div>
              ) : null}

              {isManualEntryOpen ? (
                <form
                  onSubmit={handleManualEntrySubmit}
                  className="mt-4 rounded-[12px] border border-[#dce5f1] bg-white p-4 shadow-[0_4px_10px_rgba(15,23,42,0.05)]"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f52ba]">
                    Manual Entry
                  </p>
                  <div className="mt-3 grid gap-3 sm:grid-cols-[132px_1fr]">
                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-[#7f90a6]">
                        Section
                      </span>
                      <select
                        value={manualEntryType}
                        onChange={(event) =>
                          setManualEntryType(
                            event.target
                              .value as Exclude<TimelineEntry["chip"], "Evidence">
                          )
                        }
                        className="h-9 rounded-[8px] border border-[#dce5f1] bg-white px-2.5 text-[12px] font-semibold text-[#1f2a3a] outline-none"
                      >
                        {manualEntryTypes.map((type) => (
                          <option key={type} value={type}>
                            {type}
                          </option>
                        ))}
                      </select>
                    </label>

                    <label className="flex flex-col gap-1">
                      <span className="text-[10px] font-semibold text-[#7f90a6]">
                        Details
                      </span>
                      <input
                        value={manualEntryValue}
                        onChange={(event) =>
                          setManualEntryValue(event.target.value)
                        }
                        placeholder="Enter manual detail"
                        className="h-9 rounded-[8px] border border-[#dce5f1] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none placeholder:text-[#9eb0c7]"
                      />
                    </label>
                  </div>

                  <div className="mt-3 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={closeManualEntry}
                      className="inline-flex h-8 items-center rounded-[8px] border border-[#dce5f1] px-3 text-[10px] font-semibold text-[#60728a]"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={!manualEntryValue.trim() || isSavingTimeline}
                      className="inline-flex h-8 items-center rounded-[8px] bg-[#0f52ba] px-3 text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      {isSavingTimeline ? "Saving..." : "Add Entry"}
                    </button>
                  </div>
                </form>
              ) : (
                <button
                  type="button"
                  onClick={openManualEntry}
                  className="mt-4 inline-flex h-[42px] w-full items-center justify-center rounded-[9px] border border-dashed border-[#ccd7e6] bg-[#f8fbff] text-[10px] font-semibold text-[#8396ae]"
                >
                  <span className="mr-2 inline-flex h-[16px] w-[16px] items-center justify-center rounded-full bg-[#ffe7c7] text-[#e79b2f]">
                    <IconPlus size={10} stroke={2.4} />
                  </span>
                  Add Manual Entry
                </button>
              )}
              {!isLoading && timelineEntries.length === 0 ? (
                <div className="mt-4 rounded-[12px] border border-[#dce5f1] bg-white px-4 py-6 text-center text-[12px] text-[#60728a]">
                  No backend timeline entries are available yet. Add a manual
                  entry or go back to edit the report details.
                </div>
              ) : null}
            </div>

            <div className="mt-5 flex justify-center">
              <Link
                href={canContinueToShare ? shareHref : "#"}
                onClick={(event) => {
                  if (!canContinueToShare) {
                    event.preventDefault();
                    return;
                  }

                  handleContinueToShare();
                }}
                aria-disabled={!canContinueToShare}
                className="inline-flex h-11 w-full max-w-[392px] items-center justify-center rounded-full bg-[#ff8f00] px-8 text-xs font-bold text-white shadow-[0_10px_24px_rgba(255,143,0,0.2)] transition hover:bg-[#ec8200] disabled:cursor-not-allowed disabled:opacity-50"
              >
                Continue to secure sharing
                <IconChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </div>
        </ReportSubmissionFrame>
      );
}

export { ReportSubmissionReviewPage };
