"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconBellFilled,
  IconBoltFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardText,
  IconClock,
  IconFolderFilled,
  IconHeadphones,
  IconShieldFilled,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import domesticViolanceImage from "@/assets/domestic-violance.jpg";
import hackerImage from "@/assets/hacker.jpg";
import { cn } from "@/lib/utils";

import { interFont } from "./dashboard-shared";

const reportSubmissionSteps = [
  { key: "support", label: "Support" },
  { key: "details", label: "Details" },
  { key: "evidence", label: "Evidence" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
] as const;

type ReportSubmissionStep = (typeof reportSubmissionSteps)[number]["key"];

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

function ReportSubmissionSupportPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=assistantconversation"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.assistant.triage.title")}
          </Link>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb]">
            <IconClock size={12} />
          </span>
        </div>

        <article className="mt-2 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] px-3 py-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-4 sm:py-4">
          <h2 className="text-[28px] font-extrabold leading-[1.02] text-[#0f4f95] sm:text-[34px]">
            {t("dashboard.assistant.triage.title")}
          </h2>
          <p className="mt-1 text-xs text-[#7a8ca2]">
            {t("dashboard.assistant.triage.subtitle")}
          </p>

          <div className="relative mt-3 rounded-[24px] bg-white px-4 pb-4 pt-7 text-center shadow-[0_14px_30px_rgba(15,23,42,0.06)] sm:px-8 sm:pb-5 sm:pt-8">
            <span className="absolute left-1/2 top-0 inline-flex h-[54px] w-[122px] -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-b-full bg-[#e7effb] text-[11px] font-semibold lowercase text-[#5b84b9]">
              {t("dashboard.assistant.triage.specialtyTag")}
            </span>
            <p className="mt-3 text-[9px] font-bold uppercase tracking-[0.12em] text-[#95a5bb]">
              {t("dashboard.assistant.triage.incidentClassification")}
            </p>
            <h3
              className={`${interFont.className} mx-auto mt-2 max-w-[350px] text-[36px] font-extrabold leading-[0.95] text-[#0f5d9f] sm:text-[42px]`}
            >
              {t("dashboard.assistant.triage.supportType")}
            </h3>
            <p className="mx-auto mt-3 max-w-[560px] text-sm leading-[1.6] text-[#5f6f86]">
              {t("dashboard.assistant.triage.assessmentBody")}
            </p>
            <p className="mt-2 text-[11px] italic text-[#9babbf]">
              {t("dashboard.assistant.triage.assessmentNote")}
            </p>
          </div>

          <p className="mx-auto mt-3 max-w-[650px] text-center text-[9px] leading-[1.45] text-[#b0bccb]">
            {t("dashboard.assistant.triage.legalInfo")}
          </p>

          <div className="mt-4 flex items-center justify-between gap-3">
            <h3 className="text-lg font-bold text-[#1f2a3a]">
              {t("dashboard.assistant.triage.recommendedSteps")}
            </h3>
            <button className="text-[10px] font-semibold text-[#95a6bd] transition hover:text-[#6b7f98]">
              {t("dashboard.assistant.triage.saveToHistory")}
            </button>
          </div>

          <button className="mt-2 flex w-full items-center justify-between gap-3 rounded-2xl border border-[#e4eaf3] bg-white px-4 py-2.5 text-left transition hover:border-[#d3deed] hover:bg-[#f8fbff]">
            <div className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ffe9dd] text-[#e88a42]">
              <IconBoltFilled size={14} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-xs font-bold text-[#1f2a3a]">
                {t("dashboard.assistant.triage.primaryStepTitle")}
              </p>
              <p className="text-[10px] text-[#8da0b8]">
                {t("dashboard.assistant.triage.primaryStepBody")}
              </p>
            </div>
            <IconChevronRight size={14} className="shrink-0 text-[#b5c2d3]" />
          </button>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <article className="relative min-h-[124px] overflow-hidden rounded-3xl bg-[#0f57a0] px-3 pb-3 pt-3 text-white shadow-[0_14px_24px_rgba(15,87,160,0.23)]">
              <span className="bg-white/18 inline-flex h-8 w-8 items-center justify-center rounded-full">
                <IconUsersGroup size={14} />
              </span>
              <h4 className="mt-6 text-[16px] font-extrabold leading-[1.04] sm:text-[18px]">
                {t("dashboard.assistant.triage.worriedOthersTitle")}
              </h4>
              <p className="mt-1 text-[11px] text-white/80">
                {t("dashboard.assistant.triage.worriedOthersBody")}
              </p>
            </article>

            <article className="relative min-h-[124px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#155ead] to-[#2f45b4] px-3 pb-3 pt-3 text-white shadow-[0_14px_24px_rgba(30,76,173,0.22)]">
              <span className="bg-white/18 inline-flex h-8 w-8 items-center justify-center rounded-full">
                <IconClipboardText size={14} />
              </span>
              <h4 className="mt-6 text-[16px] font-extrabold leading-[1.04] sm:text-[18px]">
                {t("dashboard.assistant.triage.selfHelpTitle")}
              </h4>
              <p className="mt-1 text-[11px] text-white/80">
                {t("dashboard.assistant.triage.selfHelpBody")}
              </p>
            </article>

            <article className="relative min-h-[124px] rounded-3xl border border-[#f7d7d7] bg-[#fdeeee] px-3 pb-3 pt-3 text-[#1f2a3a] shadow-[0_14px_24px_rgba(227,106,106,0.12)]">
              <span className="absolute right-4 top-4 h-2 w-2 rounded-full bg-[#f05454]" />
              <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f35d5d] text-white">
                <IconAlertCircleFilled size={14} />
              </span>
              <h4 className="mt-3 text-[16px] font-extrabold leading-[1.02] text-[#212d3f] sm:text-[18px]">
                {t("dashboard.assistant.triage.unsafeTitle")}
              </h4>
              <p className="mt-1 text-[10px] text-[#7f8fa5] sm:text-[11px]">
                {t("dashboard.assistant.triage.unsafeBody")}
              </p>
              <button className="mt-2 inline-flex h-7 items-center justify-center rounded-full bg-[#f04444] px-4 text-[9px] font-bold text-white shadow-[0_10px_16px_rgba(240,68,68,0.35)] sm:h-8 sm:px-7 sm:text-[11px]">
                {t("dashboard.assistant.triage.callEmergency")}
              </button>
              <p className="mt-1 text-[9px] text-[#b1bccb]">
                {t("dashboard.assistant.triage.tapForFullScreen")}
              </p>
            </article>
          </div>

          <div className="mt-8 min-h-[180px] w-full max-w-[1136px] pt-8">
            <div className="flex h-full min-h-[148px] w-full flex-col gap-6">
              <h3 className="text-lg font-bold text-[#1f2a3a]">
                {t("dashboard.assistant.triage.additionalResources")}
              </h3>

              <div className="grid min-h-[92px] w-full grid-cols-1 gap-6 md:grid-cols-2">
                <Link
                  href="/dashboard?view=reportsubmissionrecommendations"
                  className="relative flex h-[92px] w-full items-center gap-3 overflow-hidden rounded-[48px] bg-[#004E92] p-6 text-left text-white shadow-[0_12px_22px_rgba(12,74,131,0.28)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(100.94deg, #004E92 0%, #003A6D 100%)",
                  }}
                >
                  <span className="bg-white/16 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <IconShieldFilled size={12} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-bold leading-none">
                      {t("dashboard.assistant.triage.resourceEsafetyTitle")}
                    </span>
                    <span className="mt-1 block truncate text-[9px] text-white/75">
                      {t("dashboard.assistant.triage.resourceEsafetyBody")}
                    </span>
                  </span>
                  <span className="bg-white/14 pointer-events-none absolute -right-4 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full" />
                </Link>

                <Link
                  href="/dashboard?view=reportsubmissionrecommendations"
                  className="relative flex h-[92px] w-full items-center gap-3 overflow-hidden rounded-[48px] bg-[#004E92] p-6 text-left text-white shadow-[0_12px_22px_rgba(12,74,131,0.28)]"
                  style={{
                    backgroundImage:
                      "linear-gradient(100.94deg, #004E92 0%, #003A6D 100%)",
                  }}
                >
                  <span className="bg-white/16 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full">
                    <IconHeadphones size={12} />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-[11px] font-bold leading-none">
                      {t("dashboard.assistant.triage.resourceCounsellingTitle")}
                    </span>
                    <span className="mt-1 block truncate text-[9px] text-white/75">
                      {t("dashboard.assistant.triage.resourceCounsellingBody")}
                    </span>
                  </span>
                  <span className="bg-white/14 pointer-events-none absolute -right-4 top-1/2 h-14 w-14 -translate-y-1/2 rounded-full" />
                </Link>
              </div>
            </div>
          </div>

          <div className="min-h-[120px] w-full max-w-[1136px] pt-12">
            <div className="h-full min-h-[72px] w-full border-t border-[#F3F4F6] px-6 pt-8 lg:px-[152px]">
              <p
                className={`${interFont.className} mx-auto h-[39px] w-full max-w-[672px] text-center text-[12px] font-normal leading-[19.5px] text-[#9CA3AF]`}
              >
                {t("dashboard.assistant.triage.footerNote")}
              </p>
            </div>
          </div>
        </article>
      </div>
    </div>
  );
}

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
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb]">
            <IconClock size={12} />
          </span>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <p className="mx-auto max-w-[680px] text-center text-xs leading-[1.5] text-[#7a8ca2]">
            {t("dashboard.assistant.triage.recommendations.subtitle")}
          </p>

          <div className="mt-4 space-y-2.5">
            <article className="flex flex-col gap-3 rounded-2xl border border-[#e4ebf4] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex min-w-0 items-start gap-3">
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

            <article className="flex flex-col gap-3 rounded-2xl border border-[#e4ebf4] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex min-w-0 items-start gap-3">
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
              <button className="inline-flex h-8 items-center justify-center gap-1 rounded-full bg-[#eef2f7] px-4 text-[10px] font-semibold text-[#42546b] sm:px-5">
                {t(
                  "dashboard.assistant.triage.recommendations.reportToEsafety"
                )}
                <IconChevronRight size={12} />
              </button>
            </article>

            <article className="flex flex-col gap-3 rounded-2xl border border-[#e4ebf4] bg-white p-3.5 sm:flex-row sm:items-center sm:justify-between sm:p-4">
              <div className="flex min-w-0 items-start gap-3">
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
              <button className="inline-flex h-8 items-center justify-center gap-1 rounded-full bg-[#eef2f7] px-4 text-[10px] font-semibold text-[#42546b] sm:px-5">
                {t("dashboard.assistant.triage.recommendations.callLifeline")}
                <IconChevronRight size={12} />
              </button>
            </article>
          </div>

          <Link
            href="/dashboard?view=reportsubmissiondetailedexplanations"
            className="mt-4 inline-flex h-9 w-full items-center justify-center rounded-full bg-[#0f5d9f] px-5 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.22)]"
          >
            {t("dashboard.assistant.triage.recommendations.readMore")}
          </Link>
        </article>
      </div>
    </div>
  );
}

function ReportSubmissionDetailedExplanationsPage() {
  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=reportsubmissionrecommendations"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            Detailed Explanations
          </Link>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb]">
            <IconClock size={12} />
          </span>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <p className="mx-auto max-w-[700px] text-center text-xs leading-[1.6] text-[#7a8ca2]">
            Please review the following information carefully. These guidelines
            are tailored to your current situation and location to ensure you
            understand your rights and the process ahead.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.55fr_1fr]">
            <article className="rounded-[22px] border border-[#e3ebf4] bg-white p-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ffecd8] text-[#f97316]">
                  <IconBoltFilled size={13} />
                </span>
                <h4 className="text-base font-extrabold text-[#f97316]">
                  Legal Rights
                </h4>
              </div>

              <div className="mt-4 space-y-3 text-[#1f2a3a]">
                <div>
                  <h5 className="text-sm font-bold">Right to Silence</h5>
                  <p className="mt-1 text-[11px] leading-[1.5] text-[#7e8fa5]">
                    You have the right to remain silent. Anything you say can be
                    used in legal proceedings. It is crucial to understand that
                    silence cannot be used as an admission of guilt.
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-bold">Legal Counsel</h5>
                  <p className="mt-1 text-[11px] leading-[1.5] text-[#7e8fa5]">
                    You have the right to legal counsel immediately. If you
                    cannot afford private representation, a duty lawyer can be
                    appointed before questioning begins.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border-l-2 border-[#f97316] bg-[#f8fafc] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#f97316]">
                  Interpreter Access
                </p>
                <p className="mt-1 text-[10px] leading-[1.5] text-[#7e8fa5]">
                  You can request a state-provided interpreter for official
                  interviews if you are not fluent in the primary language.
                </p>
              </div>
            </article>

            <div className="space-y-3">
              <article className="rounded-[20px] bg-[#0f5d9f] p-4 text-white shadow-[0_12px_22px_rgba(15,93,159,0.28)]">
                <span className="bg-white/16 inline-flex h-7 w-7 items-center justify-center rounded-full">
                  <IconShieldFilled size={13} />
                </span>
                <h4 className="mt-4 text-base font-extrabold">
                  Cultural Rights
                </h4>
                <p className="mt-1 text-[11px] leading-[1.5] text-white/80">
                  Universal protections for your identity and heritage.
                  Understand how your background is protected by law.
                </p>
              </article>

              <article className="rounded-[20px] bg-[#0b4e87] p-4 text-white shadow-[0_12px_22px_rgba(11,78,135,0.28)]">
                <span className="bg-white/16 inline-flex h-7 w-7 items-center justify-center rounded-full">
                  <IconUsersGroup size={13} />
                </span>
                <h4 className="mt-4 text-base font-extrabold">
                  What to Expect
                </h4>
                <p className="mt-1 text-[11px] leading-[1.5] text-white/80">
                  Step-by-step walk-through of the legal process. Know what
                  comes next and prepare accordingly.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#e4ebf4] bg-white px-2 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#f97316] transition hover:bg-[#fff7ed]">
                <IconFolderFilled size={14} />
                Save to History
              </button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#f97316] transition hover:bg-[#fff7ed]">
                <IconClipboardText size={14} />
                Share Report
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-[#a3b1c4]">
            Info saved securely to local storage.
          </p>
        </article>
      </div>
    </div>
  );
}

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

function ReportSubmissionEvidencePage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.evidenceTitle")}
      subtitle={t("dashboard.reportSubmission.evidenceSubtitle")}
      step="evidence"
      backHref="/dashboard?view=reportsubmissiondetails"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-3">
          <article className="rounded-[14px] border border-dashed border-[#b9cee7] bg-[#f6f9fd] p-4 text-center">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.reportSubmission.dragFiles")}
            </p>
            <p className="mt-1 text-[10px] text-[#7c8da3]">
              {t("dashboard.reportSubmission.uploadLimits")}
            </p>
            <button className="mt-3 inline-flex h-9 items-center rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white">
              {t("dashboard.reportSubmission.uploadEvidence")}
            </button>
          </article>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <article className="overflow-hidden rounded-xl border border-[#dde7f2] bg-white">
              <div className="relative h-[108px] w-full">
                <Image
                  src={domesticViolanceImage}
                  alt="Evidence file"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold text-[#1f2a3a]">
                  Hallway-photo.jpg
                </p>
                <p className="text-[9px] text-[#7c8da3]">1.4 MB</p>
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border border-[#dde7f2] bg-white">
              <div className="relative h-[108px] w-full">
                <Image
                  src={hackerImage}
                  alt="Evidence file"
                  fill
                  className="object-cover"
                />
                <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white">
                  <IconChevronRight size={12} />
                </span>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold text-[#1f2a3a]">
                  CCTV-clip.mp4
                </p>
                <p className="text-[9px] text-[#7c8da3]">6.8 MB</p>
              </div>
            </article>
          </div>
        </div>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.reportSubmission.evidenceStatus")}
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-[#f6f9fd] px-3 py-2 text-[10px] font-semibold text-[#334155]">
              <span>{t("dashboard.reportSubmission.photos")}</span>
              <span>{t("dashboard.reportSubmission.oneAttached")}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#f6f9fd] px-3 py-2 text-[10px] font-semibold text-[#334155]">
              <span>{t("dashboard.reportSubmission.videos")}</span>
              <span>{t("dashboard.reportSubmission.oneAttached")}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#f6f9fd] px-3 py-2 text-[10px] font-semibold text-[#334155]">
              <span>{t("dashboard.reportSubmission.documents")}</span>
              <span>{t("dashboard.reportSubmission.zeroAttached")}</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=reportsubmissiondetails"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=reportsubmissionreview"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
        >
          {t("dashboard.reportSubmission.nextReview")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

function ReportSubmissionReviewPage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.reviewTitle")}
      subtitle={t("dashboard.reportSubmission.reviewSubtitle")}
      step="review"
      backHref="/dashboard?view=reportsubmissionevidence"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <div className="space-y-3">
            <div className="rounded-xl bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.reportSubmission.incidentSummary")}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#1f2a3a]">
                {t("dashboard.reportSubmission.incidentTitleValue")}
              </p>
              <p className="mt-1 text-[11px] leading-[1.5] text-[#60728a]">
                {t("dashboard.reportSubmission.summaryValue")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.reportSubmission.attachedEvidence")}
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-[#334155]">
                <li className="inline-flex items-center gap-1.5">
                  <IconFolderFilled size={12} className="text-[#0f5d9f]" />
                  Hallway-photo.jpg
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <IconFolderFilled size={12} className="text-[#0f5d9f]" />
                  CCTV-clip.mp4
                </li>
              </ul>
            </div>
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.reportSubmission.finalChecks")}
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-[#60728a]">
            <li className="inline-flex items-center gap-1.5">
              <IconShieldFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.personalDataRemoved")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconClock size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.timelineFieldsCompleted")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconBellFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.emergencyEscalationNotRequired")}
            </li>
          </ul>
        </aside>
      </div>

      <label className="mt-3 inline-flex items-start gap-2 rounded-xl bg-[#f8fbff] px-3 py-2 text-[11px] text-[#42546b]">
        <input
          type="checkbox"
          defaultChecked
          className="mt-0.5 h-3.5 w-3.5 rounded border-[#c8d5e6]"
        />
        {t("dashboard.reportSubmission.confirmAccuracy")}
      </label>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldagency"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=reportsubmissionsuccess"
          className="inline-flex h-10 items-center rounded-full bg-[#f59e0b] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(245,158,11,0.32)]"
        >
          {t("dashboard.reportSubmission.submitReport")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

function ReportSubmissionSuccessPage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.doneTitle")}
      subtitle={t("dashboard.reportSubmission.doneSubtitle")}
      step="done"
      backHref="/dashboard?view=reportsubmissionreview"
    >
      <div className="mt-4 rounded-[16px] border border-[#dfe8f3] bg-[#f8fbff] p-5 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf2ff] text-[#0f5d9f]">
          <IconShieldFilled size={24} />
        </span>
        <h3 className="mt-3 text-xl font-extrabold text-[#1f2a3a]">
          {t("dashboard.reportSubmission.reportReceivedSuccessfully")}
        </h3>
        <p className="mt-1 text-sm text-[#60728a]">
          {t("dashboard.reportSubmission.referenceKeyPrefix")}{" "}
          <span className="font-bold text-[#0f5d9f]">SS-2026-0421</span>.{" "}
          {t("dashboard.reportSubmission.referenceKeySuffix")}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <p className="text-xs font-bold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.trackSubmission")}
          </p>
          <p className="mt-1 text-[11px] text-[#7c8da3]">
            {t("dashboard.reportSubmission.trackSubmissionBody")}
          </p>
        </article>
        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <p className="text-xs font-bold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.needSupport")}
          </p>
          <p className="mt-1 text-[11px] text-[#7c8da3]">
            {t("dashboard.reportSubmission.needSupportBody")}
          </p>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <Link
          href="/dashboard/reports"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("dashboard.reportSubmission.openReports")}
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
        >
          {t("dashboard.reportSubmission.backToDashboard")}
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

export {
  ReportSubmissionDetailedExplanationsPage,
  ReportSubmissionDetailsPage,
  ReportSubmissionEvidencePage,
  ReportSubmissionRecommendationsPage,
  ReportSubmissionReviewPage,
  ReportSubmissionSuccessPage,
  ReportSubmissionSupportPage,
};
