"use client";

import Link from "next/link";

import {
  IconBoltFilled,
  IconBook2,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconHeadphones,
  IconShieldFilled,
  IconUsersGroup,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { interFont } from "../dashboard-shared";

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
          <Link
            href="/dashboard?view=reportsubmissionhistory"
            aria-label="View report history"
            className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb] transition hover:text-[#74879e]"
          >
            <IconClock size={12} />
          </Link>
        </div>

        <article className="mt-2 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] px-3 py-3.5 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-4 sm:py-4">
          <h2 className="text-[28px] font-extrabold leading-[1.02] text-[#0f4f95] sm:text-[34px]">
            {t("dashboard.assistant.triage.title")}
          </h2>
          <p className="mt-1 text-xs text-[#7a8ca2]">
            {t("dashboard.assistant.triage.subtitle")}
          </p>

          <div className="relative mx-auto mt-3 w-full max-w-[1136px] rounded-[48px] bg-white p-6 text-center shadow-[0_14px_30px_rgba(15,23,42,0.06)] sm:p-10 lg:h-[442.5px] lg:p-12">
            <div className="pointer-events-none absolute left-1/2 top-0 z-10 h-[128px] w-[256px] -translate-x-1/2 overflow-hidden">
              <div
                className={`${interFont.className} absolute left-0 top-0 flex h-[256px] w-[256px] -translate-y-1/2 items-end justify-center rounded-[9999px] bg-[#e7effb] pb-9 text-center text-[24px] font-medium lowercase leading-[32px] tracking-[-0.6px] text-[#004E92]`}
              >
                {t("dashboard.assistant.triage.specialtyTag")}
              </div>
            </div>
            <p
              className={`${interFont.className} mt-[92px] text-center text-[12px] font-bold uppercase leading-[16px] tracking-[1.2px] text-[#9CA3AF]`}
            >
              {t("dashboard.assistant.triage.incidentClassification")}
            </p>
            <h3
              className={`${interFont.className} mx-auto mt-2 max-w-[350px] text-[36px] font-extrabold leading-[0.95] text-[#0f5d9f] sm:text-[42px]`}
            >
              {t("dashboard.assistant.triage.supportType")}
            </h3>
            <span className="mx-auto mt-3 block h-[3px] w-[56px] rounded-full bg-[#eceff4]" />
            <p className="mx-auto mt-6 max-w-[560px] text-sm leading-[1.6] text-[#5f6f86]">
              {t("dashboard.assistant.triage.assessmentBody")}
            </p>
            <p className="mt-3 text-[11px] italic text-[#9babbf]">
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
            <Link
              href="/dashboard?view=reportsubmissionhistory"
              className="text-[10px] font-semibold text-[#95a6bd] transition hover:text-[#6b7f98]"
            >
              {t("dashboard.assistant.triage.saveToHistory")}
            </Link>
          </div>

          <button className="mx-auto mt-2 flex h-[114px] w-full max-w-[1136px] items-center justify-between gap-4 rounded-[32px] border border-[#e4eaf3] bg-white p-6 text-left transition hover:border-[#d3deed] hover:bg-[#f8fbff]">
            <div className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#ffe9dd] text-[#e88a42]">
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

          <div className="mx-auto mt-3 grid w-full max-w-[1136px] grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3 lg:gap-6 lg:px-20">
            <Link
              href="/dashboard?view=reportsubmissionrecommendations"
              className="relative flex h-[318px] w-full flex-col overflow-hidden rounded-[48px] p-8 text-white shadow-[0_14px_24px_rgba(15,87,160,0.23)]"
              style={{
                backgroundImage:
                  "linear-gradient(135.79deg, #005C97 0%, #363795 100%)",
              }}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#FFFFFF33]">
                <IconUsersGroup size={20} />
              </span>
              <span className="text-white/8 pointer-events-none absolute right-8 top-16">
                <IconUsersGroup size={92} stroke={1.6} />
              </span>
              <div className="mt-auto">
                <h4 className="text-[16px] font-extrabold leading-[1.04] sm:text-[18px]">
                  {t("dashboard.assistant.triage.worriedOthersTitle")}
                </h4>
                <p className="mt-2 text-[11px] text-white/80">
                  {t("dashboard.assistant.triage.worriedOthersBody")}
                </p>
              </div>
            </Link>

            <Link
              href="/dashboard?view=reportsubmissionrecommendations"
              className="relative flex h-[318px] w-full flex-col overflow-hidden rounded-[48px] p-8 text-white shadow-[0_14px_24px_rgba(30,76,173,0.22)]"
              style={{
                backgroundImage:
                  "linear-gradient(135.79deg, #005C97 0%, #363795 100%)",
              }}
            >
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#FFFFFF33]">
                <IconBook2 size={20} />
              </span>
              <span className="text-white/8 pointer-events-none absolute right-10 top-14">
                <IconBook2 size={98} stroke={1.4} />
              </span>
              <div className="mt-auto">
                <h4 className="text-[16px] font-extrabold leading-[1.04] sm:text-[18px]">
                  {t("dashboard.assistant.triage.selfHelpTitle")}
                </h4>
                <p className="mt-2 text-[11px] text-white/80">
                  {t("dashboard.assistant.triage.selfHelpBody")}
                </p>
              </div>
            </Link>

            <article className="relative flex h-[318px] w-full flex-col rounded-[48px] border border-[#f7d7d7] bg-[#fdeeee] p-8 text-[#1f2a3a] shadow-[0_14px_24px_rgba(227,106,106,0.12)]">
              <span className="absolute right-6 top-6 h-2.5 w-2.5 rounded-full bg-[#f05454]" />
              <span className="inline-flex h-12 w-12 items-center justify-center rounded-[24px] bg-[#f04444] text-white">
                <IconShieldFilled size={21} />
              </span>
              <h4 className="mt-8 text-[16px] font-extrabold leading-[1.02] text-[#212d3f] sm:text-[18px]">
                {t("dashboard.assistant.triage.unsafeTitle")}
              </h4>
              <p className="mt-3 text-[10px] leading-[1.45] text-[#7f8fa5] sm:text-[11px]">
                {t("dashboard.assistant.triage.unsafeBody")}
              </p>
              <button className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-[#f04444] px-8 text-[11px] font-bold text-white shadow-[0_10px_16px_rgba(240,68,68,0.35)]">
                {t("dashboard.assistant.triage.callEmergency")}
              </button>
              <p className="mt-auto text-center text-[9px] text-[#b1bccb]">
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

export { ReportSubmissionSupportPage };
