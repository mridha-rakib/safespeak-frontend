"use client";

import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconSearch,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import digitalFootPrint from "@/assets/digital_foot_print.svg?url";
import documentingEv from "@/assets/documentig_ev.svg?url";
import hackerImage from "@/assets/hacker.jpg";
import identifyBulling from "@/assets/identifyBulling.svg?url";
import safeReporting from "@/assets/safe_reporting.svg?url";
import { cn } from "@/lib/utils";

import { interFont } from "./dashboard-shared";

type MicroCardTone = "blue" | "yellow" | "teal";

function MicroCardLesson({
  title,
  iconSrc,
  tone,
  className,
  readMoreHref = "/dashboard?view=microcarddetail",
}: {
  title: string;
  iconSrc: string;
  tone: MicroCardTone;
  className?: string;
  readMoreHref?:
    | "/dashboard?view=microcarddetail"
    | "/dashboard?view=microcards";
}) {
  const { t } = useTranslation();
  const toneStyles: Record<
    MicroCardTone,
    {
      card: string;
      title: string;
      meta: string;
      iconWrap: string;
      button: string;
    }
  > = {
    blue: {
      card: "bg-[#0f5fa7]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/20",
      button: "bg-white text-[#0d4d85]",
    },
    yellow: {
      card: "bg-[#f7b500]",
      title: "text-[#111827]",
      meta: "text-[#5f4b00]",
      iconWrap: "bg-white/35",
      button: "bg-white text-[#312600]",
    },
    teal: {
      card: "bg-[#1f9f97]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/22",
      button: "bg-white text-[#0e6e67]",
    },
  };

  const currentTone = toneStyles[tone];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 sm:p-5",
        currentTone.card,
        className
      )}
    >
      <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex h-full min-w-0 flex-col">
          <h3
            className={cn(
              `${interFont.className} text-[22px] font-extrabold leading-[0.95] sm:text-[28px]`,
              currentTone.title
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              "mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl",
              currentTone.iconWrap
            )}
          >
            <Image
              src={iconSrc}
              alt={title}
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </div>
          <div className="mt-auto inline-flex items-center gap-1.5">
            <IconClock size={10} className={currentTone.meta} />
            <span className={cn("text-[10px] font-semibold", currentTone.meta)}>
              {t("dashboard.microcards.fourMinRead")}
            </span>
          </div>
        </div>

        <Link
          href={readMoreHref}
          className={cn(
            "self-start rounded-full px-4 py-2 text-[11px] font-bold leading-none sm:mt-1 sm:self-auto",
            currentTone.button
          )}
        >
          {t("dashboard.microcards.readMore")}
        </Link>
      </div>
    </article>
  );
}

function MicroCardsPage() {
  const { t } = useTranslation();

  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.microcards.cyberBullying")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="pt-4">
          <h1
            className={`${interFont.className} text-4xl font-black leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]`}
          >
            {t("dashboard.microcards.title")}
          </h1>
          <p className="mt-1 text-sm text-[#5f6f86]">
            {t("dashboard.microcards.cyberBullying")}
          </p>

          <div className="relative mt-4 max-w-[540px]">
            <IconSearch
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a6b9]"
            />
            <input
              type="text"
              placeholder={t("dashboard.microcards.searchPlaceholder")}
              className="h-10 w-full rounded-full border border-[#dbe5f0] bg-white px-10 text-xs text-[#1f2937] outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title={t("dashboard.microcards.identifyingBullying")}
                iconSrc={identifyBulling}
                tone="blue"
                className="min-h-[132px] xl:h-[140px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.documentingEvidence")}
                iconSrc={documentingEv}
                tone="yellow"
                className="min-h-[132px] xl:h-[140px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]">
              <MicroCardLesson
                title={t("dashboard.microcards.safeReporting")}
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.digitalFootprints")}
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>

            <MicroCardLesson
              title={t("dashboard.microcards.documentingEvidence")}
              iconSrc={documentingEv}
              tone="teal"
              className="min-h-[132px] xl:h-[140px]"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title={t("dashboard.microcards.digitalFootprints")}
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.safeReporting")}
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title={t("dashboard.microcards.safeReporting")}
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.digitalFootprints")}
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MicroCardDetailPage() {
  const { t } = useTranslation();

  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=microcards"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.microcardDetail.safeSpeakEducation")}
          </Link>
          <Link
            href="/dashboard?view=microcards"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="mt-4 rounded-[12px] border border-[#dce4ef] bg-white p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] sm:aspect-auto sm:h-[330px]">
            <Image
              src={hackerImage}
              alt={t("dashboard.microcardDetail.internetHoaxAwareness")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(16,132,220,0.14)_0%,rgba(10,49,91,0.62)_62%,rgba(4,26,51,0.88)_100%)]" />
            <p
              className={`${interFont.className} absolute right-8 top-8 rotate-[-10deg] text-[42px] font-black uppercase leading-[0.84] text-[#d42828] sm:text-[52px]`}
            >
              {t("dashboard.microcardDetail.internet")}
              <br />
              {t("dashboard.microcardDetail.hoax")}
              <br />!
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,17,43,0.78)_100%)] px-4 pb-4 pt-10">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/95">
                {t("dashboard.microcardDetail.safetyEssentials")}
              </p>
              <h2
                className={`${interFont.className} mt-1 text-[34px] font-extrabold leading-[0.95] text-white sm:text-[40px]`}
              >
                {t("dashboard.microcardDetail.stayingSafeOnline")}
              </h2>
            </div>
          </div>

          <div className="px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
            <h3
              className={`${interFont.className} text-[20px] font-extrabold text-[#0f1f35]`}
            >
              {t("dashboard.microcardDetail.digitalHarassmentOverview")}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#4e5f76]">
              {t("dashboard.microcardDetail.overviewParagraph1")}
            </p>

            <div className="mt-4 rounded-[8px] bg-[#e9eef5] px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3b82f6]/40 text-[#2d74d7]">
                  <IconAlertCircleFilled size={12} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1f63c9]">
                    {t("dashboard.microcardDetail.keyTakeaway")}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-[1.45] text-[#4e5f76]">
                    {t("dashboard.microcardDetail.keyTakeawayBody")}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-[1.6] text-[#4e5f76]">
              {t("dashboard.microcardDetail.overviewParagraph2")}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe5f2] bg-white px-4 py-2 text-[11px] font-semibold text-[#334155] transition hover:bg-[#f8fafc]"
              >
                <IconChevronLeft size={12} />
                {t("dashboard.microcardDetail.previousMicrocards")}
              </Link>
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0c5aa4] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0b4f90]"
              >
                {t("dashboard.microcardDetail.nextMicrocards")}
                <IconChevronRight size={12} />
              </Link>
            </div>

            <p className="mt-4 text-center text-[9px] text-[#9aa7b8]">
              {t("dashboard.microcardDetail.educationalDisclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MicroCardDetailPage, MicroCardsPage };
