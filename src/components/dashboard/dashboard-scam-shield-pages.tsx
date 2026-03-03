"use client";

import type { Route } from "next";
import Link from "next/link";

import {
  IconAlertTriangle,
  IconAt,
  IconArrowRight,
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

import { cn } from "@/lib/utils";

const scamShieldSteps = [
  {
    key: "intake",
    number: "15",
    labelKey: "dashboard.scamShield.journeyReport",
  },
  {
    key: "risk",
    number: "16",
    labelKey: "dashboard.scamShield.scamRiskResults",
  },
  { key: "assets", number: "17", labelKey: "dashboard.scamShield.nextSteps" },
  {
    key: "agency",
    number: "18",
    labelKey: "dashboard.scamShield.agencyReport",
  },
] as const;

type ScamShieldStep = (typeof scamShieldSteps)[number]["key"];

function ScamShieldFrame({
  title,
  subtitle,
  step,
  backHref,
  children,
}: {
  title: string;
  subtitle: string;
  step: ScamShieldStep;
  backHref: Route;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const activeStepIndex = scamShieldSteps.findIndex(
    (item) => item.key === step
  );

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.brand")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce4ef] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f5d9f]">
                {t("dashboard.scamShield.brand")}
              </p>
              <h2 className="mt-1 text-[28px] font-extrabold leading-[1.02] text-[#1f2a3a] sm:text-[34px]">
                {title}
              </h2>
              <p className="mt-1 text-xs text-[#6a7d94]">{subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {scamShieldSteps.map((item, index) => (
                <div
                  key={item.key}
                  className={cn(
                    "rounded-xl px-3 py-2 text-center",
                    index <= activeStepIndex ? "bg-[#eaf2ff]" : "bg-[#f3f6fb]"
                  )}
                >
                  <p
                    className={cn(
                      "text-[11px] font-extrabold",
                      index <= activeStepIndex
                        ? "text-[#0f5d9f]"
                        : "text-[#8fa0b6]"
                    )}
                  >
                    {item.number}
                  </p>
                  <p className="mt-0.5 text-[9px] font-semibold text-[#60728a]">
                    {t(item.labelKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {children}
        </article>
      </div>
    </div>
  );
}

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

                <button className="inline-flex h-10 items-center gap-1.5 rounded-[8px] bg-[#ff9800] px-5 text-[11px] font-semibold text-white shadow-[0_8px_16px_rgba(255,152,0,0.26)]">
                  {t("dashboard.scamShield.launchReportTool")}
                  <IconExternalLink size={12} />
                </button>
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

  return (
    <ScamShieldFrame
      title={t("dashboard.scamShield.agencyReport")}
      subtitle={t("dashboard.scamShield.agencyReportSubtitle")}
      step="agency"
      backHref="/dashboard?view=scamshieldassets"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.7fr_1fr]">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <h3 className="text-lg font-extrabold text-[#1f2a3a]">
            {t("dashboard.scamShield.prefilledAgencyReports")}
          </h3>
          <p className="mt-1 text-xs text-[#60728a]">
            {t("dashboard.scamShield.prefilledAgencyReportsBody")}
          </p>

          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-[#dbe5f2] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.scamShield.scamNarrative")}
              </p>
              <p className="mt-1 text-[11px] text-[#42546b]">
                {t("dashboard.scamShield.scamNarrativeBody")}
              </p>
            </div>

            <div className="rounded-xl border border-[#dbe5f2] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.scamShield.impactedAssets")}
              </p>
              <p className="mt-1 text-[11px] text-[#42546b]">
                {t("dashboard.scamShield.impactedAssetsBody")}
              </p>
            </div>

            <div className="rounded-xl border border-[#dbe5f2] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.scamShield.bankSecurityStep")}
              </p>
              <p className="mt-1 text-[11px] text-[#42546b]">
                {t("dashboard.scamShield.bankSecurityStepBody")}
              </p>
            </div>
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.scamShield.submissionChecklist")}
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-[#60728a]">
            <li className="inline-flex items-center gap-1.5">
              <IconShieldFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.scamShield.identitySafeModeEnabled")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconFolderFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.scamShield.evidencePackageAttached")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconClock size={12} className="text-[#0f5d9f]" />
              {t("dashboard.scamShield.timelineAndMetadataVerified")}
            </li>
          </ul>

          <div className="mt-3 rounded-xl bg-[#f8fbff] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
              {t("dashboard.scamShield.privacyTier")}
            </p>
            <div className="mt-1 inline-flex h-6 items-center rounded-full bg-[#d7e5fa] px-2 text-[10px] font-bold text-[#20539d]">
              {t("dashboard.scamShield.anonymousReporting")}
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldassets"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=reportsubmissionreview"
          className="inline-flex h-10 items-center rounded-full bg-[#ff8f00] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(255,143,0,0.32)]"
        >
          {t("dashboard.scamShield.submitPackage")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
  );
}


export {
  ScamShieldAgencyPage,
  ScamShieldAssetsPage,
  ScamShieldIntakePage,
  ScamShieldRiskPage,
};
