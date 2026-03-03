"use client";

import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconBoltFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClipboardText,
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
            <Link
              href="/dashboard?view=reportsubmissionrecommendations"
              className="relative block min-h-[124px] overflow-hidden rounded-3xl bg-[#0f57a0] px-3 pb-3 pt-3 text-white shadow-[0_14px_24px_rgba(15,87,160,0.23)]"
            >
              <span className="bg-white/18 inline-flex h-8 w-8 items-center justify-center rounded-full">
                <IconUsersGroup size={14} />
              </span>
              <h4 className="mt-6 text-[16px] font-extrabold leading-[1.04] sm:text-[18px]">
                {t("dashboard.assistant.triage.worriedOthersTitle")}
              </h4>
              <p className="mt-1 text-[11px] text-white/80">
                {t("dashboard.assistant.triage.worriedOthersBody")}
              </p>
            </Link>

            <Link
              href="/dashboard?view=reportsubmissionrecommendations"
              className="relative block min-h-[124px] overflow-hidden rounded-3xl bg-gradient-to-br from-[#155ead] to-[#2f45b4] px-3 pb-3 pt-3 text-white shadow-[0_14px_24px_rgba(30,76,173,0.22)]"
            >
              <span className="bg-white/18 inline-flex h-8 w-8 items-center justify-center rounded-full">
                <IconClipboardText size={14} />
              </span>
              <h4 className="mt-6 text-[16px] font-extrabold leading-[1.04] sm:text-[18px]">
                {t("dashboard.assistant.triage.selfHelpTitle")}
              </h4>
              <p className="mt-1 text-[11px] text-white/80">
                {t("dashboard.assistant.triage.selfHelpBody")}
              </p>
            </Link>

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

export { ReportSubmissionSupportPage };
