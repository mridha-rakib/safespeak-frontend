"use client";

import Link from "next/link";

import {
  IconChevronRight,
  IconClock,
  IconFolderFilled,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { ReportSubmissionFrame } from "./report-submission-frame";

function ReportSubmissionDetailsPage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.detailsTitle")}
      subtitle={t("dashboard.reportSubmission.detailsSubtitle")}
      step="details"
      backHref="/dashboard?view=reportsubmissionsupport"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.65fr_1fr]">
        <article className="space-y-3 rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <div>
            <label
              htmlFor="incident-title"
              className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
            >
              {t("dashboard.reportSubmission.incidentTitle")}
            </label>
            <input
              id="incident-title"
              defaultValue={t("dashboard.reportSubmission.incidentTitleValue")}
              className="mt-1 h-10 w-full rounded-xl border border-[#d7e1ee] bg-white px-3 text-xs font-semibold text-[#1f2a3a] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="incident-date"
                className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
              >
                {t("dashboard.reportSubmission.date")}
              </label>
              <input
                id="incident-date"
                defaultValue="2026-02-22"
                className="mt-1 h-10 w-full rounded-xl border border-[#d7e1ee] bg-white px-3 text-xs font-semibold text-[#1f2a3a] outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="incident-location"
                className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
              >
                {t("dashboard.reportSubmission.location")}
              </label>
              <input
                id="incident-location"
                defaultValue={t("dashboard.reportSubmission.locationValue")}
                className="mt-1 h-10 w-full rounded-xl border border-[#d7e1ee] bg-white px-3 text-xs font-semibold text-[#1f2a3a] outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="incident-summary"
              className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
            >
              {t("dashboard.reportSubmission.summary")}
            </label>
            <textarea
              id="incident-summary"
              rows={5}
              defaultValue={t("dashboard.reportSubmission.summaryValue")}
              className="mt-1 w-full resize-none rounded-xl border border-[#d7e1ee] bg-white px-3 py-2 text-xs leading-[1.55] text-[#1f2a3a] outline-none"
            />
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.reportSubmission.completeness")}
          </p>
          <div className="mt-2 h-2 rounded-full bg-[#e7eef8]">
            <div className="h-2 w-[72%] rounded-full bg-[#0f5d9f]" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.completed72")}
          </p>

          <ul className="mt-4 space-y-2 text-[11px] text-[#60728a]">
            <li className="inline-flex items-center gap-1.5">
              <IconShieldFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.incidentTypeIdentified")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconFolderFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.whoWhatWhereCaptured")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconClock size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.addEvidenceToStrengthenCase")}
            </li>
          </ul>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=reportsubmissionsupport"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=scamshieldintake"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
        >
          {t("dashboard.reportSubmission.nextScamShield")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

export { ReportSubmissionDetailsPage };
