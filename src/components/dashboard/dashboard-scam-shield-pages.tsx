"use client";

import type { Route } from "next";
import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconFolderFilled,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import domesticViolanceImage from "@/assets/domestic-violance.jpg";
import hackerImage from "@/assets/hacker.jpg";
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
    <ScamShieldFrame
      title={t("dashboard.scamShield.journeyReport")}
      subtitle={t("dashboard.scamShield.journeyReportSubtitle")}
      step="intake"
      backHref="/dashboard?view=reportsubmissiondetails"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.62fr_1fr]">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <label
            htmlFor="scam-journey-report"
            className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
          >
            {t("dashboard.reports.incidentNarrative")}
          </label>
          <textarea
            id="scam-journey-report"
            rows={12}
            defaultValue={t("dashboard.scamShield.journeyNarrativeSample")}
            className="mt-2 w-full resize-none rounded-xl border border-[#d7e1ee] bg-white px-3 py-2 text-xs leading-[1.6] text-[#1f2a3a] outline-none"
          />

          <div className="mt-3 rounded-xl bg-[#eaf2ff] px-3 py-2">
            <p className="text-[10px] font-semibold text-[#3c5574]">
              {t("dashboard.scamShield.autoDetectHint")}
            </p>
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <div className="rounded-xl border border-[#dbe5f2] bg-[#f7faff] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
              {t("dashboard.scamShield.uploadScreenshots")}
            </p>
            <button className="mt-2 inline-flex h-9 items-center rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white">
              {t("dashboard.scamShield.addScreenshot")}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <article className="overflow-hidden rounded-lg border border-[#dde7f2] bg-[#f8fbff]">
              <div className="relative h-[84px] w-full">
                <Image
                  src={hackerImage}
                  alt="Screenshot evidence"
                  fill
                  className="object-cover"
                />
              </div>
            </article>
            <article className="overflow-hidden rounded-lg border border-[#dde7f2] bg-[#f8fbff]">
              <div className="relative h-[84px] w-full">
                <Image
                  src={domesticViolanceImage}
                  alt="Screenshot evidence"
                  fill
                  className="object-cover"
                />
              </div>
            </article>
            <article className="grid h-[84px] place-items-center rounded-lg border border-dashed border-[#bfd0e7] bg-[#f7faff] text-[10px] font-semibold text-[#6f83a0]">
              {t("dashboard.scamShield.add")}
            </article>
          </div>

          <div className="mt-3 rounded-xl bg-[#fff7ea] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#d47d00]">
              {t("dashboard.scamShield.safetyReminder")}
            </p>
            <p className="mt-1 text-[10px] leading-[1.45] text-[#7b5a23]">
              {t("dashboard.scamShield.safetyReminderBody")}
            </p>
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
          href="/dashboard?view=scamshieldrisk"
          className="inline-flex h-10 items-center rounded-full bg-[#f59e0b] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(245,158,11,0.3)]"
        >
          {t("dashboard.scamShield.analyzeRisk")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
  );
}

function ScamShieldRiskPage() {
  const { t } = useTranslation();

  return (
    <ScamShieldFrame
      title={t("dashboard.scamShield.scamRiskResults")}
      subtitle={t("dashboard.scamShield.scamRiskResultsSubtitle")}
      step="risk"
      backHref="/dashboard?view=scamshieldintake"
    >
      <article className="mt-4 rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4 text-center">
        <p className="text-[44px] font-black leading-none text-[#de3838]">
          85%
        </p>
        <p className="mt-1 text-sm font-bold text-[#de3838]">
          {t("dashboard.scamShield.highFraudRisk")}
        </p>
        <p className="mt-1 text-xs text-[#60728a]">
          {t("dashboard.scamShield.highFraudRiskBody")}
        </p>
      </article>

      <div className="mt-3 grid grid-cols-1 gap-2 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-2">
          <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.urgentLanguageUsage")}
            </p>
            <p className="mt-1 text-[11px] text-[#60728a]">
              {t("dashboard.scamShield.urgentLanguageUsageBody")}
            </p>
          </article>
          <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.repeatedContactBehavior")}
            </p>
            <p className="mt-1 text-[11px] text-[#60728a]">
              {t("dashboard.scamShield.repeatedContactBehaviorBody")}
            </p>
          </article>
          <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.credentialHarvestIndicators")}
            </p>
            <p className="mt-1 text-[11px] text-[#60728a]">
              {t("dashboard.scamShield.credentialHarvestIndicatorsBody")}
            </p>
          </article>
        </div>

        <aside className="rounded-xl border border-[#f6d6d6] bg-[#fff6f6] p-3">
          <p className="inline-flex items-center gap-1 rounded-full bg-[#ffe4e4] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#cf3131]">
            <IconAlertCircleFilled size={12} />
            {t("dashboard.scamShield.immediateActions")}
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-[#6b4a4a]">
            <li>{t("dashboard.scamShield.immediateAction1")}</li>
            <li>{t("dashboard.scamShield.immediateAction2")}</li>
            <li>{t("dashboard.scamShield.immediateAction3")}</li>
          </ul>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldintake"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=scamshieldassets"
          className="inline-flex h-10 items-center rounded-full bg-[#de3838] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(222,56,56,0.3)]"
        >
          {t("dashboard.scamShield.reportThisIncident")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
  );
}

function ScamShieldAssetsPage() {
  const { t } = useTranslation();

  return (
    <ScamShieldFrame
      title={t("dashboard.scamShield.nextSteps")}
      subtitle={t("dashboard.scamShield.nextStepsSubtitle")}
      step="assets"
      backHref="/dashboard?view=scamshieldrisk"
    >
      <div className="mt-4 space-y-3">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <h3 className="text-base font-extrabold text-[#1f2a3a]">
            {t("dashboard.scamShield.secureAssetsTitle")}
          </h3>
          <p className="mt-1 text-xs text-[#60728a]">
            {t("dashboard.scamShield.secureAssetsSubtitle")}
          </p>
        </article>

        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[#1f2a3a]">
                {t("dashboard.scamShield.contactYourBank")}
              </p>
              <p className="mt-1 text-[11px] text-[#60728a]">
                {t("dashboard.scamShield.contactYourBankBody")}
              </p>
            </div>
            <button className="inline-flex h-8 items-center rounded-full bg-[#ff8f00] px-4 text-[10px] font-bold text-white">
              {t("dashboard.scamShield.markAsCompleted")}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[#1f2a3a]">
                {t("dashboard.scamShield.reportToAccc")}
              </p>
              <p className="mt-1 text-[11px] text-[#60728a]">
                {t("dashboard.scamShield.reportToAcccBody")}
              </p>
            </div>
            <button className="inline-flex h-8 items-center rounded-full bg-[#ff8f00] px-4 text-[10px] font-bold text-white">
              {t("dashboard.scamShield.markAsCompleted")}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[#1f2a3a]">
                {t("dashboard.scamShield.reportToEmergencyCyberTeam")}
              </p>
              <p className="mt-1 text-[11px] text-[#60728a]">
                {t("dashboard.scamShield.reportToEmergencyCyberTeamBody")}
              </p>
            </div>
            <button className="inline-flex h-8 items-center rounded-full bg-[#ff8f00] px-4 text-[10px] font-bold text-white">
              {t("dashboard.scamShield.markAsCompleted")}
            </button>
          </div>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldrisk"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=scamshieldagency"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.3)]"
        >
          {t("dashboard.scamShield.nextAgencyReport")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
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
