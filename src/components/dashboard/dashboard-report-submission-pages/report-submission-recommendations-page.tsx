"use client";

import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconHeadphones,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

function ReportSubmissionRecommendationsPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=reportsubmissionsupport"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.assistant.triage.recommendations.title")}
          </Link>
          <Link
            href="/dashboard?view=reportsubmissionhistory"
            aria-label="View report history"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb] transition hover:text-[#74879e]"
          >
            <IconClock size={12} />
          </Link>
        </div>

        <article className="mt-3 flex w-full flex-col gap-6 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] px-4 pb-10 pt-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-5 sm:pb-14 sm:pt-5 lg:min-h-[805px] lg:gap-10 lg:px-6 lg:pb-20 lg:pt-6">
          <p className="mx-auto max-w-[680px] text-center text-xs leading-[1.5] text-[#7a8ca2]">
            {t("dashboard.assistant.triage.recommendations.subtitle")}
          </p>

          <div className="space-y-6">
            <article className="flex w-full flex-col gap-6 rounded-[24px] border border-[#FEE2E2] bg-white p-8 sm:flex-row sm:items-center sm:justify-between lg:h-[154px]">
              <div className="flex min-w-0 items-start gap-6">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ffe7e7] text-[#ef4b4b]">
                  <IconAlertCircleFilled size={13} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#1f2a3a]">
                    {t(
                      "dashboard.assistant.triage.recommendations.immediateDangerTitle"
                    )}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-[1.45] text-[#7e8fa5]">
                    {t(
                      "dashboard.assistant.triage.recommendations.immediateDangerBody"
                    )}
                  </p>
                </div>
              </div>
              <button className="inline-flex h-8 items-center justify-center rounded-full bg-[#f59e0b] px-4 text-[10px] font-bold text-white sm:px-5">
                {t("dashboard.assistant.triage.recommendations.contactPolice")}
              </button>
            </article>

            <Link
              href="/dashboard?view=reportsubmissionevidence"
              className="flex w-full flex-col gap-6 rounded-[24px] border border-[#FEE2E2] bg-white p-8 transition hover:border-[#f7d4d4] hover:bg-[#fffefe] sm:flex-row sm:items-center sm:justify-between lg:h-[154px]"
            >
              <div className="flex min-w-0 items-start gap-6">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#ece7ff] text-[#6a4de7]">
                  <IconShieldFilled size={12} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#1f2a3a]">
                    {t(
                      "dashboard.assistant.triage.recommendations.esafetyTitle"
                    )}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-[1.45] text-[#7e8fa5]">
                    {t(
                      "dashboard.assistant.triage.recommendations.esafetyBody"
                    )}
                  </p>
                </div>
              </div>
              <span className="inline-flex h-8 items-center justify-center gap-1 rounded-full bg-[#eef2f7] px-4 text-[10px] font-semibold text-[#42546b] sm:px-5">
                {t(
                  "dashboard.assistant.triage.recommendations.reportToEsafety"
                )}
                <IconChevronRight size={12} />
              </span>
            </Link>

            <Link
              href="/dashboard?view=reportsubmissionevidence"
              className="flex w-full flex-col gap-6 rounded-[24px] border border-[#FEE2E2] bg-white p-8 transition hover:border-[#f7d4d4] hover:bg-[#fffefe] sm:flex-row sm:items-center sm:justify-between lg:h-[154px]"
            >
              <div className="flex min-w-0 items-start gap-6">
                <span className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-[#e6f7f3] text-[#00a486]">
                  <IconHeadphones size={12} />
                </span>
                <div className="min-w-0">
                  <h4 className="text-sm font-bold text-[#1f2a3a]">
                    {t(
                      "dashboard.assistant.triage.recommendations.counsellingTitle"
                    )}
                  </h4>
                  <p className="mt-0.5 text-[11px] leading-[1.45] text-[#7e8fa5]">
                    {t(
                      "dashboard.assistant.triage.recommendations.counsellingBody"
                    )}
                  </p>
                </div>
              </div>
              <span className="inline-flex h-8 items-center justify-center gap-1 rounded-full bg-[#eef2f7] px-4 text-[10px] font-semibold text-[#42546b] sm:px-5">
                {t("dashboard.assistant.triage.recommendations.callLifeline")}
                <IconChevronRight size={12} />
              </span>
            </Link>
          </div>

          <Link
            href="/dashboard?view=reportsubmissiondetailedexplanations"
            className="mx-auto inline-flex h-[68px] w-full max-w-[1136px] items-center justify-center rounded-[9999px] bg-[#005EA2] px-6 py-5 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.22)]"
          >
            {t("dashboard.assistant.triage.recommendations.readMore")}
          </Link>
        </article>
      </div>
    </div>
  );
}

export { ReportSubmissionRecommendationsPage };
