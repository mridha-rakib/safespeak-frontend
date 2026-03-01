"use client";

import { Outfit, Space_Grotesk } from "next/font/google";

import {
  IconBolt,
  IconFileText,
  IconLanguage,
  IconMicrophone,
  IconPhoto,
  IconRouteAltLeft,
  IconWorld,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

const outfitBold = Outfit({
  subsets: ["latin"],
  weight: ["700"],
});

const spaceGroteskRegular = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400"],
});

function LanguageSwitcher() {
  return (
    <div className="flex h-8 w-[252px] items-center min-[1440px]:absolute min-[1440px]:left-[34px] min-[1440px]:top-[253px]">
      <button
        type="button"
        className="bg-[#bfeee2]Multilingual flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[14px] font-semibold leading-none text-[#04574b]"
        aria-label="English"
      >
        EN
      </button>
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f86d63] text-[14px] font-semibold leading-none text-white"
        aria-label="Spanish"
      >
        ES
      </button>
      <button
        type="button"
        className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#f5cf00] text-[14px] font-bold leading-none text-[#075247]"
        aria-label="More languages"
      >
        +
      </button>
    </div>
  );
}

export default function ResourcesSection() {
  const { t } = useTranslation();

  return (
    <section className="relative z-20 -mt-12">
      <div
        id="what-you-can-do"
        className="w-full rounded-t-[32px] bg-[#f4f1e8] px-4 py-12 sm:px-8 sm:py-16 lg:px-8 lg:py-20 min-[1440px]:h-[524.25px] min-[1440px]:rounded-t-[64px] min-[1440px]:px-8 min-[1440px]:py-24"
      >
        <div className="mx-auto grid h-full w-full max-w-[1376px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6 min-[1440px]:h-[332.25px] min-[1440px]:w-[1376px] min-[1440px]:gap-8">
          <article className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[22px] bg-[#f8f9f9] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.10)] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:rounded-none min-[1440px]:rounded-br-[48px] min-[1440px]:rounded-tl-[48px] min-[1440px]:px-[34px] min-[1440px]:pt-[34px]">
            <span className="pointer-events-none absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[#e5eceb]" />
            <div className="relative z-10 inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#ddf2e7] text-[#076f63]">
              <IconWorld size={20} stroke={2} />
            </div>
            <h3
              className={`relative z-10 mt-5 text-[24px] font-extrabold leading-tight text-[#093b33] min-[1440px]:mt-6 min-[1440px]:h-7 min-[1440px]:w-[252px] min-[1440px]:text-[20px] min-[1440px]:leading-[28px] min-[1440px]:tracking-[0px] ${outfitBold.className}`}
            >
              {t("landing.resources.cards.multiLingual.title")}
            </h3>
            <p
              className={`relative z-10 mt-4 text-sm leading-6 text-[#4b5b57] min-[1440px]:mt-3 min-[1440px]:h-[91px] min-[1440px]:w-[252px] min-[1440px]:text-[14px] min-[1440px]:leading-[22.75px] min-[1440px]:tracking-[0px] ${spaceGroteskRegular.className}`}
            >
              {t("landing.resources.cards.multiLingual.description")}
            </p>
            <div className="relative z-10 mt-auto pt-6 min-[1440px]:static min-[1440px]:m-0 min-[1440px]:p-0">
              <LanguageSwitcher />
            </div>
          </article>

          <article className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[22px] bg-[#01579b] p-6 text-white shadow-[0_22px_45px_rgba(1,87,155,0.35)] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:rounded-none min-[1440px]:rounded-br-[48px] min-[1440px]:rounded-tl-[48px]">
            <span className="pointer-events-none absolute -bottom-7 left-5 h-14 w-14 rounded-full bg-[#f4f1e8]" />
            <div className="bg-white/12 inline-flex h-10 w-10 items-center justify-center rounded-full text-white">
              <IconBolt size={20} stroke={2} />
            </div>
            <h3 className="mt-5 text-[24px] font-extrabold leading-tight">
              {t("landing.resources.cards.quickExit.title")}
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/90">
              {t("landing.resources.cards.quickExit.description")}
            </p>
            <button className="mt-auto inline-flex w-fit rounded-full border border-white/35 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.11em] text-white/95">
              {t("landing.resources.cards.quickExit.action")}
            </button>
          </article>

          <article className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[22px] bg-[#efe37b] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.10)] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:rounded-none min-[1440px]:rounded-br-[48px] min-[1440px]:rounded-tl-[48px]">
            <span className="pointer-events-none absolute -bottom-8 -right-8 h-24 w-24 rounded-full bg-[#e6bd2b]" />
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#f6da68] text-[#d94942]">
              <IconLanguage size={20} stroke={2} />
            </div>
            <h3 className="mt-5 text-[24px] font-extrabold leading-tight text-[#395620]">
              {t("landing.resources.cards.multiInput.title")}
            </h3>
            <p className="mt-4 text-sm leading-6 text-[#5f5d2f]">
              {t("landing.resources.cards.multiInput.description")}
            </p>
            <div className="mt-auto flex items-center gap-3 pt-6 text-[#7c7444]">
              <IconMicrophone size={18} stroke={2} />
              <IconFileText size={18} stroke={2} />
              <IconPhoto size={18} stroke={2} />
            </div>
          </article>

          <article className="flex min-h-[260px] flex-col overflow-hidden rounded-[22px] bg-[#ff9500] p-6 text-white shadow-[0_18px_40px_rgba(255,149,0,0.30)] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:rounded-none min-[1440px]:rounded-br-[48px] min-[1440px]:rounded-tl-[48px]">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/15 text-white">
              <IconRouteAltLeft size={20} stroke={2} />
            </div>
            <h3 className="mt-5 text-[24px] font-extrabold leading-tight">
              {t("landing.resources.cards.guidedTriage.title")}
            </h3>
            <p className="mt-4 text-sm leading-6 text-white/90">
              {t("landing.resources.cards.guidedTriage.description")}
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}
