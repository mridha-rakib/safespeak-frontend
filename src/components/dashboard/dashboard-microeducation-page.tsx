"use client";

import Image from "next/image";
import Link from "next/link";

import {
  IconChevronLeft,
  IconFolderFilled,
  IconSearch,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import mentalHealth from "@/assets/mental_health.svg?url";
import mentalHealth2 from "@/assets/mental_health_2.svg?url";
import mentalHealthLove from "@/assets/mental_health_love.svg?url";
import { cn } from "@/lib/utils";

import { interFont } from "./dashboard-shared";

function MicroEducationPage() {
  const { t } = useTranslation();
  const chips = [
    t("dashboard.microeducation.allLessons"),
    t("dashboard.microeducation.harassment"),
    t("dashboard.microeducation.rights"),
    t("dashboard.microeducation.safety"),
    t("dashboard.microeducation.mentalHealth"),
  ];

  return (
    <div className="px-2 pb-4 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.microeducation.title")}
          </Link>
          <button className="text-xs font-medium text-[#7b8798]">
            {t("common.cancel")}
          </button>
        </div>

        <div className="pt-4">
          <h1 className="text-4xl font-extrabold leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]">
            {t("dashboard.microeducation.headline")}
          </h1>
          <p className="mt-2 max-w-[700px] text-sm leading-[1.45] text-[#5f6f86]">
            {t("dashboard.microeducation.subtitleLine1")}
            <br />
            {t("dashboard.microeducation.subtitleLine2")}
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

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <span
                key={chip}
                className={cn(
                  "inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold",
                  index === 0
                    ? "bg-[#3b82f6] text-white"
                    : "bg-white text-[#5f6f86]"
                )}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[400px_712px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#006699] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.home.cyber")}
                </p>
                <h3 className="mt-1 text-[40px] font-extrabold leading-[0.9] text-white">
                  {t("dashboard.microeducation.bullying")}
                </h3>
                <IconShieldFilled
                  size={70}
                  className="text-white/12 absolute bottom-8 right-8"
                />
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#F48C06] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <h3
                  className={`${interFont.className} w-full max-w-[448px] text-[30px] font-black uppercase leading-[1] tracking-[0] text-white sm:text-[36px] sm:leading-[36px]`}
                >
                  {t("dashboard.microeducation.discrimination")}
                </h3>
                <div className="absolute bottom-5 left-5 max-w-[448px] rounded-xl bg-white/20 px-4 py-3 text-[11px] leading-[1.25] text-white/95 sm:bottom-6 sm:left-6 xl:bottom-8 xl:left-8">
                  {t("dashboard.microeducation.discriminationBody")}
                </div>
              </article>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[712px_400px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#10B981] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.microeducation.protection")}
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold uppercase leading-[0.9] text-white">
                  {t("dashboard.explorer.onlineSafety")}
                </h3>
                <p className="mt-2 max-w-[300px] text-xs text-white/90">
                  {t("dashboard.microeducation.onlineSafetyBody")}
                </p>
                <button className="mt-3 inline-flex rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-[#159968]">
                  {t("dashboard.microeducation.getProtected")}
                </button>
                <div className="bg-white/22 absolute right-8 top-1/2 inline-flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-2xl text-white">
                  <IconShieldFilled size={34} />
                </div>
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#f7bd23] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5300]">
                  {t("dashboard.home.legal")}
                </p>
                <h3 className="mt-1 w-full max-w-[336px] text-[36px] font-extrabold leading-[0.9] text-[#111827]">
                  {t("dashboard.microeducation.migrantStudentRights")}
                </h3>
                <IconFolderFilled
                  size={36}
                  className="absolute bottom-8 right-8 text-[#cf9f1a]"
                />
              </article>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[656px_456px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#8157e8] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.microeducation.mental")}
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                  {t("dashboard.microeducation.mentalHealthTitle")}
                </h3>
                <div className="pointer-events-none absolute bottom-8 left-8">
                  <Image
                    src={mentalHealth}
                    alt="Mental health circle"
                    width={48}
                    height={48}
                    className="h-12 w-12 opacity-45"
                  />
                  <Image
                    src={mentalHealth2}
                    alt="Mental health circle overlap"
                    width={48}
                    height={48}
                    className="absolute left-8 top-0 h-12 w-12 opacity-45"
                  />
                </div>
                <Image
                  src={mentalHealthLove}
                  alt="Mental health love icon"
                  width={28}
                  height={28}
                  className="absolute bottom-8 right-8 h-7 w-7"
                />
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#1c9d8f] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.microeducation.fundamentals")}
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                  {t("dashboard.microeducation.legalAidBasics")}
                </h3>
                <button className="absolute bottom-8 right-8 rounded-full bg-[#0b7f73] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  {t("dashboard.microeducation.startNow")}
                </button>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}


export { MicroEducationPage };
