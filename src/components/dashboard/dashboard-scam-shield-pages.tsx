"use client";

import Link from "next/link";
import { useState } from "react";

import {
  IconAlertTriangle,
  IconArrowRight,
  IconAt,
  IconBuildingBank,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconExternalLink,
  IconFolderFilled,
  IconGavel,
  IconPhoto,
  IconPlus,
  IconShieldFilled,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { interFont } from "./dashboard-shared";

function ScamShieldIntakePage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=reportsubmissiondetails"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.analyzeMessage")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 overflow-hidden rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="grid grid-cols-1 gap-3 p-3 sm:p-4 lg:grid-cols-[1fr_1fr]">
            <article className="rounded-[14px] border border-[#e2eaf4] bg-white p-3 sm:p-4">
              <label
                htmlFor="scam-message-content"
                className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#6f88a8]"
              >
                {t("dashboard.scamShield.messageContent")}
              </label>
              <div className="relative mt-2">
                <textarea
                  id="scam-message-content"
                  rows={15}
                  placeholder={t(
                    "dashboard.scamShield.messageContentPlaceholder"
                  )}
                  className="min-h-[340px] w-full resize-none rounded-[11px] border border-[#dbe4ef] bg-[#f8fbff] px-3 py-3 text-xs leading-[1.6] text-[#1f2a3a] outline-none placeholder:text-[#9aabc0]"
                />
                <div className="absolute bottom-2 right-2 flex items-center gap-1 text-[#9db0c8]">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] border border-[#d8e2ee] bg-white">
                    <IconFolderFilled size={10} />
                  </span>
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-[4px] border border-[#d8e2ee] bg-white">
                    <IconClock size={10} />
                  </span>
                </div>
              </div>
            </article>

            <aside className="space-y-3">
              <article className="rounded-[14px] border border-[#e2eaf4] bg-white p-4 text-center">
                <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ecf4ff] text-[#0f5d9f]">
                  <IconPhoto size={20} />
                </span>
                <h3 className="mt-3 text-xl font-bold leading-[1.1] text-[#1f2a3a]">
                  {t("dashboard.scamShield.uploadScreenshotTitle")}
                </h3>
                <p className="mx-auto mt-1 max-w-[250px] text-xs leading-[1.5] text-[#7f90a6]">
                  {t("dashboard.scamShield.uploadScreenshotDescription")}
                </p>
                <button className="mt-3 inline-flex h-9 items-center gap-1.5 rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white">
                  <IconFolderFilled size={12} />
                  {t("dashboard.scamShield.selectFiles")}
                </button>
              </article>

              <article className="rounded-[14px] border border-[#e2eaf4] bg-white p-3 sm:p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7f90a6]">
                  {t("dashboard.scamShield.attachedEvidence")}
                </p>
                <div className="mt-3 grid grid-cols-3 gap-2">
                  <article className="relative rounded-[10px] border border-[#e2eaf4] bg-[#f2f5f9] p-2">
                    <button className="absolute -right-1.5 -top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#f05151] text-white">
                      <IconX size={9} />
                    </button>
                    <div className="mx-auto w-[44px] rounded-[7px] border border-[#cad6e6] bg-white p-1 shadow-[0_4px_8px_rgba(100,116,139,0.18)]">
                      <div className="h-[64px] w-full rounded-[5px] bg-[linear-gradient(180deg,#f8fbff_0%,#edf3fb_100%)] p-1">
                        <span className="mt-0.5 block h-1 w-full rounded bg-[#d1dbe8]" />
                        <span className="mt-1 block h-1 w-[70%] rounded bg-[#dce4ef]" />
                        <span className="mt-1 block h-1 w-[82%] rounded bg-[#dce4ef]" />
                        <span className="mt-1 block h-1 w-[64%] rounded bg-[#dce4ef]" />
                      </div>
                    </div>
                  </article>

                  <article className="relative rounded-[10px] border border-[#e2d5cb] bg-[#dcc0ad] p-2">
                    <button className="absolute -right-1.5 -top-1.5 inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#f05151] text-white">
                      <IconX size={9} />
                    </button>
                    <div className="mx-auto w-[52px] rounded-[7px] border border-[#c6b0a0] bg-white p-2 shadow-[0_4px_8px_rgba(100,116,139,0.16)]">
                      <span className="block h-1 w-full rounded bg-[#d8d4cf]" />
                      <span className="mt-1 block h-1 w-[78%] rounded bg-[#e2ddd7]" />
                      <span className="mt-1 block h-1 w-[84%] rounded bg-[#e2ddd7]" />
                      <span className="mt-1 block h-1 w-[66%] rounded bg-[#e2ddd7]" />
                      <span className="mt-1 block h-1 w-[74%] rounded bg-[#e2ddd7]" />
                    </div>
                  </article>

                  <article className="grid min-h-[100px] place-items-center rounded-[10px] border border-dashed border-[#c4d2e6] bg-[#f8fbff] text-center">
                    <div>
                      <span className="mx-auto inline-flex h-5 w-5 items-center justify-center text-[#8ea2bf]">
                        <IconPlus size={14} />
                      </span>
                      <p className="mt-1 text-[9px] font-semibold text-[#8ea2bf]">
                        {t("dashboard.scamShield.addMore")}
                      </p>
                    </div>
                  </article>
                </div>
              </article>
            </aside>
          </div>

          <div className="flex flex-col gap-2 border-t border-[#e2eaf5] bg-white px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-4">
            <p className="text-[10px] font-medium text-[#6c7f96]">
              {t("dashboard.scamShield.readyForAnalysis")}
            </p>
            <Link
              href="/dashboard?view=scamshieldrisk"
              className="inline-flex h-10 items-center justify-center gap-1.5 rounded-full bg-[#ff9900] px-7 text-[11px] font-bold uppercase tracking-[0.02em] text-white shadow-[0_8px_18px_rgba(255,153,0,0.33)]"
            >
              <IconShieldFilled size={12} />
              {t("dashboard.scamShield.analyzeNow")}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

function ScamShieldRiskPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=scamshieldintake"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.scamRiskResults")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
          <article className="rounded-[14px] border border-[#e3eaf5] bg-white px-4 py-5 text-center sm:px-6 sm:py-6">
            <p className="text-[58px] font-black leading-none text-[#cf2f34]">
              85%
            </p>
            <p className="mt-1 text-[8px] font-bold uppercase tracking-[0.18em] text-[#ba9ea3]">
              {t("dashboard.scamShield.highRiskLabel")}
            </p>
            <p className="mt-2 text-[26px] font-extrabold leading-none text-[#cf2f34]">
              {t("dashboard.scamShield.highRiskDetected")}
            </p>
            <p className="mx-auto mt-2 max-w-[540px] text-xs leading-[1.5] text-[#61748f]">
              {t("dashboard.scamShield.highRiskDetectedBody")}
            </p>
          </article>

          <div className="mt-4 flex items-center justify-between">
            <h3 className="text-sm font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.detectedRedFlags")}
            </h3>
            <span className="inline-flex h-5 items-center rounded-full bg-[#ffe9e9] px-2 text-[9px] font-bold uppercase tracking-[0.07em] text-[#df4a4a]">
              {t("dashboard.scamShield.twoFound")}
            </span>
          </div>

          <div className="mt-2 space-y-2">
            <article className="flex items-start gap-3 rounded-xl border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fff6e5] text-[#f59e0b]">
                <IconAlertTriangle size={13} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1f2a3a]">
                  {t("dashboard.scamShield.urgentLanguage")}
                </p>
                <p className="mt-1 text-[11px] leading-[1.45] text-[#64748b]">
                  {t("dashboard.scamShield.urgentLanguageBody")}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-[#2c66b0]">
                  {t("dashboard.scamShield.howToStaySafe")}
                  <IconArrowRight size={10} />
                </span>
              </div>
            </article>

            <article className="flex items-start gap-3 rounded-xl border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4">
              <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-[#fff6e5] text-[#f59e0b]">
                <IconAt size={13} />
              </span>
              <div className="min-w-0">
                <p className="text-xs font-bold text-[#1f2a3a]">
                  {t("dashboard.scamShield.suspiciousSender")}
                </p>
                <p className="mt-1 text-[11px] leading-[1.45] text-[#64748b]">
                  {t("dashboard.scamShield.suspiciousSenderBody")}
                </p>
                <span className="mt-2 inline-flex items-center gap-1 text-[9px] font-semibold text-[#2c66b0]">
                  {t("dashboard.scamShield.howToStaySafe")}
                  <IconArrowRight size={10} />
                </span>
              </div>
            </article>
          </div>

          <div className="mt-4 flex justify-center">
            <Link
              href="/dashboard?view=scamshieldassets"
              className="inline-flex h-10 items-center gap-1.5 rounded-lg bg-[#df3c3c] px-8 text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(223,60,60,0.26)]"
            >
              <IconAlertTriangle size={12} />
              {t("dashboard.scamShield.reportThisIncident")}
            </Link>
          </div>

          <article className="mt-4 rounded-xl border border-[#dfe8f4] bg-[#edf4ff] p-3 sm:p-4">
            <p className="inline-flex items-center gap-1.5 text-sm font-bold text-[#1f4f93]">
              <IconShieldFilled size={13} />
              {t("dashboard.scamShield.stayProtected")}
            </p>
            <p className="mt-1 text-[10px] leading-[1.5] text-[#4b607d]">
              {t("dashboard.scamShield.stayProtectedBody")}
            </p>
            <div className="mt-3 rounded-[4px] border border-[#f0dc9f] bg-[#fff5dd] px-2 py-1.5">
              <p className="inline-flex items-center gap-1 text-[9px] text-[#8c6d1f]">
                <IconAlertTriangle size={10} />
                {t("dashboard.scamShield.infoDisclaimer")}
              </p>
            </div>
          </article>
        </article>
      </div>
    </div>
  );
}

function ScamShieldAssetsPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=scamshieldrisk"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.nextSteps")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
          <article className="rounded-[14px] border border-[#e3eaf5] bg-white px-4 py-6 text-center sm:px-6 sm:py-7">
            <h2 className="text-[32px] font-black leading-[1.08] text-[#1f2a3a] sm:text-[42px]">
              {t("dashboard.scamShield.secureAssetsTitle")}
            </h2>
            <p className="mx-auto mt-2 max-w-[560px] text-xs leading-[1.55] text-[#6a7e96] sm:text-sm">
              {t("dashboard.scamShield.assetActionIntro")}
            </p>
          </article>

          <div className="mt-3 space-y-3">
            <article className="rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff3df] text-[#ef7d00]">
                    <IconBuildingBank size={17} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[25px] font-extrabold leading-none text-[#1f2a3a]">
                      {t("dashboard.scamShield.contactYourBank")}
                    </p>
                    <p className="mt-1 text-[11px] leading-[1.5] text-[#6a7e96]">
                      {t("dashboard.scamShield.contactYourBankDetailed")}
                    </p>
                  </div>
                </div>

                <button className="inline-flex h-10 items-center gap-1.5 rounded-[8px] bg-[#ff9800] px-5 text-[11px] font-semibold text-white shadow-[0_8px_16px_rgba(255,152,0,0.26)]">
                  {t("dashboard.scamShield.callFraudDepartment")}
                  <IconExternalLink size={12} />
                </button>
              </div>
            </article>

            <article className="rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff3df] text-[#ef7d00]">
                    <IconGavel size={17} />
                  </span>
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="text-[25px] font-extrabold leading-none text-[#1f2a3a]">
                        {t("dashboard.scamShield.reportToAcccScamwatch")}
                      </p>
                      <span className="inline-flex h-5 items-center rounded-full bg-[#ecf3ff] px-2 text-[8px] font-bold uppercase tracking-[0.08em] text-[#2c66b0]">
                        {t("dashboard.scamShield.communityPrevention")}
                      </span>
                    </div>
                    <p className="mt-1 text-[11px] leading-[1.5] text-[#6a7e96]">
                      {t("dashboard.scamShield.reportToAcccDetailed")}
                    </p>
                    <p className="mt-1 text-[10px] font-semibold text-[#374b64]">
                      {t("dashboard.scamShield.communityPreventionBody")}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard?view=scamshieldagency"
                  className="inline-flex h-10 items-center gap-1.5 rounded-[8px] bg-[#ff9800] px-5 text-[11px] font-semibold text-white shadow-[0_8px_16px_rgba(255,152,0,0.26)]"
                >
                  {t("dashboard.scamShield.launchReportTool")}
                  <IconExternalLink size={12} />
                </Link>
              </div>
            </article>

            <article className="rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4 sm:py-4">
              <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-start gap-3">
                  <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#fff3df] text-[#ef7d00]">
                    <IconShieldFilled size={14} />
                  </span>
                  <div className="min-w-0">
                    <p className="text-[25px] font-extrabold leading-none text-[#1f2a3a]">
                      {t("dashboard.scamShield.reportToReportCyber")}
                    </p>
                    <p className="mt-1 text-[11px] leading-[1.5] text-[#6a7e96]">
                      {t("dashboard.scamShield.reportToReportCyberBody")}
                    </p>
                  </div>
                </div>

                <Link
                  href="/dashboard?view=scamshieldagency"
                  className="inline-flex h-10 items-center gap-1.5 rounded-[8px] bg-[#ff9800] px-5 text-[11px] font-semibold text-white shadow-[0_8px_16px_rgba(255,152,0,0.26)]"
                >
                  {t("dashboard.scamShield.launchReportTool")}
                  <IconExternalLink size={12} />
                </Link>
              </div>
            </article>
          </div>
        </article>
      </div>
    </div>
  );
}

function ScamShieldAgencyPage() {
  const { t } = useTranslation();
  const [expandedSection, setExpandedSection] = useState<
    "accc" | "reportCyber" | "bank" | null
  >("accc");
  const [privacyConsentEnabled, setPrivacyConsentEnabled] = useState(false);

  return (
    <div className="px-2 pt-2 sm:px-4 sm:pt-4">
      <div className="mx-auto flex min-h-[1196px] w-full max-w-[1184px] flex-col pb-8">
        <div className="mx-auto flex h-[61px] w-full max-w-[1184px] items-center justify-between border-b border-[#E2E8F0] bg-[#FFFFFFCC] px-4 sm:px-8 lg:px-[80px]">
          <Link
            href="/dashboard?view=scamshieldassets"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.safeSpeakAnalyzer")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f4f7fc] p-3 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-4">
          <article className="mx-auto w-full max-w-[1136px] rounded-[14px] border border-[#e3eaf5] bg-white px-4 py-5 text-center sm:px-6 sm:py-6">
            <h2
              className={`${interFont.className} mx-auto h-[36px] w-full max-w-[369px] text-[30px] font-extrabold leading-[36px] tracking-[0] text-[#1f2a3a]`}
            >
              {t("dashboard.scamShield.prefilledAgencyReports")}
            </h2>
            <p
              className={`${interFont.className} mx-auto mt-3 w-full max-w-[780px] text-center text-[18px] font-normal leading-[29.25px] tracking-[0] text-[#6b7280]`}
            >
              {t("dashboard.scamShield.prefilledAgencyReportsAnalyzerBody")}
            </p>
          </article>

          <div className="mt-3 space-y-3">
            <article className="overflow-hidden rounded-[12px] border border-[#e2eaf4] bg-white">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection((currentSection) =>
                    currentSection === "accc" ? null : "accc"
                  )
                }
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#ecf3ff] text-[#2d66b0]">
                    <IconGavel size={14} />
                  </span>
                  <p className="truncate text-[14px] font-bold text-[#1f2a3a] sm:text-[15px]">
                    {t("dashboard.scamShield.reportToAcccScamwatch")}
                  </p>
                </div>
                <IconChevronRight
                  size={14}
                  className={`text-[#8fa0b6] transition-transform ${
                    expandedSection === "accc" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {expandedSection === "accc" ? (
                <div className="border-t border-[#e8eff8] px-3 pb-3 pt-2.5 sm:px-4 sm:pb-4">
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b8]">
                    {t("dashboard.scamShield.prefilledDetails")}
                  </p>

                  <div className="mt-2.5">
                    <label className="text-[10px] font-semibold text-[#60728a]">
                      {t("dashboard.scamShield.senderName")}
                    </label>
                    <div className="relative mt-1">
                      <input
                        readOnly
                        value={t("dashboard.scamShield.prefilledSenderName")}
                        className="h-10 w-full rounded-[8px] border border-[#dce5f1] bg-[#f8fbff] px-3 pr-10 text-[12px] text-[#253447] outline-none"
                      />
                      <span className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-[#16a56a]">
                        <IconShieldFilled size={13} />
                      </span>
                    </div>
                  </div>

                  <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-2 sm:gap-3">
                    <div>
                      <label className="text-[10px] font-semibold text-[#60728a]">
                        {t("dashboard.scamShield.scamCategory")}
                      </label>
                      <div className="relative mt-1">
                        <input
                          readOnly
                          value={t(
                            "dashboard.scamShield.prefilledScamCategory"
                          )}
                          className="h-10 w-full rounded-[8px] border border-[#dce5f1] bg-[#f8fbff] px-3 pr-9 text-[12px] text-[#253447] outline-none"
                        />
                        <IconChevronRight
                          size={12}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#8fa0b6]"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="text-[10px] font-semibold text-[#60728a]">
                        {t("dashboard.scamShield.platform")}
                      </label>
                      <div className="relative mt-1">
                        <input
                          readOnly
                          value={t("dashboard.scamShield.prefilledPlatform")}
                          className="h-10 w-full rounded-[8px] border border-[#dce5f1] bg-[#f8fbff] px-3 pr-9 text-[12px] text-[#253447] outline-none"
                        />
                        <IconChevronRight
                          size={12}
                          className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 rotate-90 text-[#8fa0b6]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              ) : null}
            </article>

            <article className="overflow-hidden rounded-[12px] border border-[#e2eaf4] bg-white">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection((currentSection) =>
                    currentSection === "reportCyber" ? null : "reportCyber"
                  )
                }
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#edf1ff] text-[#5f6be0]">
                    <IconShieldFilled size={13} />
                  </span>
                  <p className="truncate text-[14px] font-bold text-[#1f2a3a] sm:text-[15px]">
                    {t("dashboard.scamShield.reportCyberAcsc")}
                  </p>
                </div>
                <IconChevronRight
                  size={14}
                  className={`text-[#8fa0b6] transition-transform ${
                    expandedSection === "reportCyber" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {expandedSection === "reportCyber" ? (
                <div className="border-t border-[#e8eff8] px-3 py-3 text-[12px] leading-[1.55] text-[#60728a] sm:px-4">
                  {t("dashboard.scamShield.reportCyberPanelBody")}
                </div>
              ) : null}
            </article>

            <article className="overflow-hidden rounded-[12px] border border-[#e2eaf4] bg-white">
              <button
                type="button"
                onClick={() =>
                  setExpandedSection((currentSection) =>
                    currentSection === "bank" ? null : "bank"
                  )
                }
                className="flex w-full items-center justify-between gap-3 px-3 py-3 text-left sm:px-4 sm:py-3.5"
              >
                <div className="flex min-w-0 items-center gap-3">
                  <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#e7fbf6] text-[#0f9c7c]">
                    <IconBuildingBank size={14} />
                  </span>
                  <p className="truncate text-[14px] font-bold text-[#1f2a3a] sm:text-[15px]">
                    {t("dashboard.scamShield.bankSecurityDept")}
                  </p>
                </div>
                <IconChevronRight
                  size={14}
                  className={`text-[#8fa0b6] transition-transform ${
                    expandedSection === "bank" ? "rotate-90" : "rotate-0"
                  }`}
                />
              </button>

              {expandedSection === "bank" ? (
                <div className="border-t border-[#e8eff8] px-3 py-3 text-[12px] leading-[1.55] text-[#60728a] sm:px-4">
                  {t("dashboard.scamShield.bankSecurityPanelBody")}
                </div>
              ) : null}
            </article>
          </div>

          <article className="mt-3 rounded-[12px] border border-[#e2eaf4] bg-white px-3 py-3 sm:px-4 sm:py-3.5">
            <div className="flex items-center justify-between gap-3">
              <div className="min-w-0">
                <p className="text-[14px] font-bold text-[#1f2a3a]">
                  {t("dashboard.scamShield.privacyConsent")}
                </p>
                <p className="mt-1 text-[10px] leading-[1.45] text-[#6a7e96] sm:text-[11px]">
                  {t("dashboard.scamShield.privacyConsentBody")}
                </p>
              </div>

              <button
                type="button"
                role="switch"
                aria-checked={privacyConsentEnabled}
                onClick={() =>
                  setPrivacyConsentEnabled((isEnabled) => !isEnabled)
                }
                className={`relative inline-flex h-6 w-11 shrink-0 items-center rounded-full transition-colors ${
                  privacyConsentEnabled ? "bg-[#ff9800]" : "bg-[#d5dde8]"
                }`}
              >
                <span
                  className={`h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.35)] transition-transform ${
                    privacyConsentEnabled ? "translate-x-5" : "translate-x-0.5"
                  }`}
                />
              </button>
            </div>
          </article>

          <Link
            href="/dashboard?view=reportsubmissionreview"
            className="mt-3 inline-flex h-11 w-full items-center justify-center gap-1.5 rounded-full bg-[#ff9800] px-6 text-[12px] font-bold text-white shadow-[0_8px_18px_rgba(255,152,0,0.34)]"
          >
            <IconArrowRight size={13} />
            {t("dashboard.scamShield.submitAllReports")}
          </Link>
          <p className="mt-2 text-center text-[8px] font-semibold uppercase tracking-[0.08em] text-[#9aabc0]">
            {t("dashboard.scamShield.encryptedSubmissionNotice")}
          </p>
        </article>
      </div>
    </div>
  );
}

export {
  ScamShieldAgencyPage,
  ScamShieldAssetsPage,
  ScamShieldIntakePage,
  ScamShieldRiskPage,
};
