"use client";

import Link from "next/link";
import { useState } from "react";

import {
  IconBoltFilled,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconPencil,
  IconPlus,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type TimelineEntry = {
  id: string;
  chip: "Who" | "What" | "Where" | "When";
  value: string;
  label?: string;
  hint?: string;
  action?: string;
};

const initialTimelineEntries: TimelineEntry[] = [
  {
    id: "info",
    chip: "Who",
    label: "Person of Interest",
    value: "Officer John Doe",
    hint: "* AI Suggested - 98% Confidence",
    action: "Edit Details",
  },
  {
    id: "what",
    chip: "What",
    value: "Verbal harassment incident...",
  },
  {
    id: "where",
    chip: "Where",
    value: "1234 Elm Street, Breakroom 4B",
  },
  {
    id: "when",
    chip: "When",
    value: "Oct 14, 2023 - 2:30 PM EST",
  },
] as const;

const manualEntryTypes: Array<TimelineEntry["chip"]> = [
  "Who",
  "What",
  "Where",
  "When",
];

function ReportSubmissionReviewPage() {
  const { t } = useTranslation();
  const [timelineEntries, setTimelineEntries] = useState(
    initialTimelineEntries
  );
  const [expandedEntryId, setExpandedEntryId] = useState<string | null>(
    initialTimelineEntries[0]?.id ?? null
  );
  const [isManualEntryOpen, setIsManualEntryOpen] = useState(false);
  const [manualEntryType, setManualEntryType] =
    useState<TimelineEntry["chip"]>("What");
  const [manualEntryValue, setManualEntryValue] = useState("");

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

  const handleManualEntrySubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const value = manualEntryValue.trim();
    if (!value) {
      return;
    }

    const entryId = `manual-${Date.now()}`;
    const newEntry: TimelineEntry = {
      id: entryId,
      chip: manualEntryType,
      value,
      action: "Edit Details",
    };

    setTimelineEntries((currentEntries) => [...currentEntries, newEntry]);
    setExpandedEntryId(entryId);
    closeManualEntry();
  };

  return (
    <div className="px-6 pb-12 pt-12">
      <div className="mx-auto flex min-h-[1063px] w-full max-w-[1280px] flex-col bg-[#f4f7fb]">
        <div className="flex h-[60px] w-full items-center justify-between border-b border-[#d9e2ee] px-6 py-[10px]">
          <Link
            href="/dashboard?view=reportsubmissionevidence"
            className="inline-flex items-center gap-2 text-[#111827]"
          >
            <IconChevronLeft size={18} stroke={2} />
            <span
              className="inline-block h-7 w-[143px] text-[18px] font-bold leading-[28px] tracking-[0]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Timeline Builder
            </span>
          </Link>
          <span className="inline-flex h-6 w-6 items-center justify-center text-[#7f91a8]">
            <IconClock size={14} />
          </span>
        </div>

        <div className="flex flex-col gap-12 px-6 pb-12 pt-12">
          <header className="flex min-h-[111px] flex-col items-center justify-center gap-3 px-6">
            <h2 className="text-center text-[36px] font-bold leading-[40px] tracking-[-0.9px] text-[#0f52ba]">
              Evidence Review
            </h2>
            <p className="max-w-[430px] text-center text-[12px] leading-[16px] text-[#6f7f93]">
              Our AI has structured your narrative. Please verify the timeline
              events below before final submission.
            </p>
          </header>

          <article className="mx-auto min-h-[700px] w-full max-w-[1136px] bg-transparent">
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
                            <p className="mt-1 text-[13px] font-semibold leading-[18px] text-[#1f2a3a]">
                              {entry.value}
                            </p>
                            {entry.hint ? (
                              <p className="mt-3 inline-flex items-center gap-1 text-[10px] font-semibold text-[#16a56a]">
                                <IconBoltFilled size={10} />
                                {entry.hint}
                              </p>
                            ) : null}
                          </div>

                          {entry.action ? (
                            <div className="flex justify-end">
                              <button
                                type="button"
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
                            event.target.value as TimelineEntry["chip"]
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
                      disabled={!manualEntryValue.trim()}
                      className="inline-flex h-8 items-center rounded-[8px] bg-[#0f52ba] px-3 text-[10px] font-semibold text-white disabled:cursor-not-allowed disabled:opacity-50"
                    >
                      Add Entry
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
            </div>

            <div className="mt-5 flex justify-center">
              <Link
                href="/dashboard?view=reportsubmissionsuccess"
                className="inline-flex h-[44px] w-full max-w-[392px] items-center justify-center rounded-[8px] bg-[#ff9800] px-8 text-[11px] font-bold text-white shadow-[0_8px_20px_rgba(255,152,0,0.34)]"
              >
                {t("dashboard.reportSubmission.submitReport")}
                <IconChevronRight size={14} className="ml-1" />
              </Link>
            </div>
          </article>
        </div>
      </div>
    </div>
  );
}

export { ReportSubmissionReviewPage };
