"use client";

import type { Route } from "next";
import Link from "next/link";

import {
  IconChevronLeft,
  IconClock,
  IconPhoneFilled,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const reportSubmissionSteps = [
  { key: "support", label: "Support" },
  { key: "details", label: "Details" },
  { key: "review", label: "Review" },
  { key: "share", label: "Share" },
  { key: "done", label: "Done" },
] as const;

export type ReportSubmissionStep =
  | (typeof reportSubmissionSteps)[number]["key"]
  | "evidence";

function ReportSubmissionFrame({
  title,
  subtitle,
  step,
  skipSupportStep = false,
  backHref,
  backLabel,
  children,
}: {
  title: string;
  subtitle: string;
  step: ReportSubmissionStep;
  skipSupportStep?: boolean;
  backHref?: Route;
  backLabel?: string;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const visibleSteps = skipSupportStep
    ? reportSubmissionSteps.filter((item) => item.key !== "support")
    : reportSubmissionSteps;
  const resolvedStep =
    step === "evidence"
      ? "details"
      : step === "support" && skipSupportStep
        ? "details"
        : step;
  const activeStepIndex = visibleSteps.findIndex(
    (item) => item.key === resolvedStep
  );

  return (
    <div className="px-2 pb-36 pt-2 sm:px-4 sm:pb-44 sm:pt-4">
      <div className="mx-auto flex min-h-[996px] w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          {backHref ? (
            <Link
              href={backHref}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
            >
              <IconChevronLeft size={14} />
              {backLabel || t("dashboard.reportSubmission.reportSubmission")}
            </Link>
          ) : (
            <div />
          )}
          <div className="flex items-center gap-2">
            <Link
              href="/dashboard?view=reportsubmissionhistory"
              className="inline-flex h-8 items-center gap-1.5 rounded-full border border-[#d7e1ee] bg-white px-3 text-[11px] font-semibold text-[#526982] transition hover:bg-[#f8fbff]"
            >
              <IconClock size={12} />
              View history
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#7b8798]"
            >
              {t("common.cancel")}
            </Link>
          </div>
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
                {visibleSteps.map((item, index) => (
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
                  total: visibleSteps.length,
                })}
              </p>
            </div>
          </div>

          <div className="mt-4 rounded-[14px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0">
                <p className="inline-flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                  <IconShieldFilled size={12} />
                  Safety-first report flow
                </p>
                <p className="mt-1 text-[11px] leading-[1.55] text-[#60728a]">
                  Nothing is auto-submitted on entry. Reports are created, updated, or prepared only when you explicitly continue or save.
                </p>
              </div>
              <Link
                href="/dashboard?view=smartdialler"
                className="inline-flex h-9 items-center gap-1 rounded-full border border-[#d7e1ee] px-4 text-[11px] font-semibold text-[#334155]"
              >
                <IconPhoneFilled size={12} />
                Smart Dialler
              </Link>
            </div>
          </div>

          {children}
        </article>
      </div>
    </div>
  );
}

export { ReportSubmissionFrame };
