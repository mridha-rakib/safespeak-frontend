"use client";

import type { Route } from "next";
import Link from "next/link";

import { IconChevronLeft } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const reportSubmissionSteps = [
  { key: "support", label: "Support" },
  { key: "details", label: "Details" },
  { key: "evidence", label: "Evidence" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
] as const;

export type ReportSubmissionStep =
  (typeof reportSubmissionSteps)[number]["key"];

function ReportSubmissionFrame({
  title,
  subtitle,
  step,
  backHref,
  children,
}: {
  title: string;
  subtitle: string;
  step: ReportSubmissionStep;
  backHref: Route;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const activeStepIndex = reportSubmissionSteps.findIndex(
    (item) => item.key === step
  );

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex min-h-[996px] w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.reportSubmission.reportSubmission")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce4ef] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f5d9f]">
                {t("dashboard.reportSubmission.incidentBuilder")}
              </p>
              <h2 className="mt-1 text-[28px] font-extrabold leading-[1.02] text-[#1f2a3a] sm:text-[34px]">
                {title}
              </h2>
              <p className="mt-1 text-xs text-[#6a7d94]">{subtitle}</p>
            </div>

            <div className="flex flex-col gap-1 sm:items-end">
              <div className="flex items-center gap-1.5">
                {reportSubmissionSteps.map((item, index) => (
                  <span
                    key={item.key}
                    className={cn(
                      "h-2 w-10 rounded-full",
                      index <= activeStepIndex ? "bg-[#0f5d9f]" : "bg-[#dbe4ef]"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8fa0b6]">
                {t("dashboard.reportSubmission.stepOf", {
                  current: activeStepIndex + 1,
                  total: reportSubmissionSteps.length,
                })}
              </p>
            </div>
          </div>

          {children}
        </article>
      </div>
    </div>
  );
}

export { ReportSubmissionFrame };
