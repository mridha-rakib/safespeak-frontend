"use client";

import { Outfit, Space_Grotesk } from "next/font/google";
import Image from "next/image";

import {
  IconBolt,
  IconFileText,
  IconMicrophone,
  IconPhoto,
  IconWorld,
} from "@tabler/icons-react";
import { motion, type HTMLMotionProps, useReducedMotion } from "framer-motion";
import { useTranslation } from "react-i18next";

import guidedTriageIcon from "@/assets/guidedTriage.svg";
import voiceInputIcon from "@/assets/voiceinpu.svg";

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
  const shouldReduceMotion = useReducedMotion();

  const cardMotionProps: Partial<
    Pick<HTMLMotionProps<"article">, "whileHover" | "whileTap" | "transition">
  > = shouldReduceMotion
    ? {}
    : {
        whileHover: { y: -10, scale: 1.02 },
        whileTap: { scale: 0.995 },
        transition: { type: "spring", stiffness: 280, damping: 24 },
      };

  return (
    <section className="relative z-20 -mt-12">
      <div
        id="what-you-can-do"
        className="w-full rounded-t-[32px] bg-[#f4f1e8] px-4 py-12 sm:px-8 sm:py-16 lg:px-8 lg:py-20 min-[1440px]:h-[524.25px] min-[1440px]:rounded-t-[64px] min-[1440px]:px-8 min-[1440px]:py-24"
      >
        <div className="mx-auto grid h-full w-full max-w-[1376px] grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4 xl:gap-6 min-[1440px]:h-[332.25px] min-[1440px]:w-[1376px] min-[1440px]:gap-8">
          <motion.article
            {...cardMotionProps}
            className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[22px] bg-[#f8f9f9] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.10)] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:rounded-none min-[1440px]:rounded-br-[48px] min-[1440px]:rounded-tl-[48px] min-[1440px]:px-[34px] min-[1440px]:pt-[34px]"
          >
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
          </motion.article>

          <motion.article
            {...cardMotionProps}
            className="relative min-h-[260px] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:pt-12"
          >
            <div className="relative flex h-full flex-col overflow-hidden rounded-[22px] bg-[#01579b] p-6 text-white shadow-[0_22px_45px_rgba(1,87,155,0.35)] min-[1440px]:rounded-none min-[1440px]:rounded-bl-[48px] min-[1440px]:rounded-tr-[48px]">
              <span className="pointer-events-none absolute left-[-2.5rem] top-[12.265625rem] h-32 w-32 rounded-full bg-[linear-gradient(90deg,#01579B_0%,#001E35_100%)]" />
              <div className="relative z-10 inline-flex h-6 w-6 items-center justify-center text-[#FFA300]">
                <IconBolt size={22} stroke={2.25} />
              </div>
              <h3 className="relative z-10 mt-5 text-[24px] font-extrabold leading-tight">
                {t("landing.resources.cards.quickExit.title")}
              </h3>
              <p className="relative z-10 mt-4 text-sm leading-6 text-white/90">
                {t("landing.resources.cards.quickExit.description")}
              </p>
              <button className="relative z-30 mt-auto inline-flex w-fit rounded-full border border-white/35 bg-white/10 px-3 py-2 text-[10px] font-bold uppercase tracking-[0.11em] text-white/95">
                {t("landing.resources.cards.quickExit.action")}
              </button>
            </div>
          </motion.article>

          <motion.article
            {...cardMotionProps}
            className="relative flex min-h-[260px] flex-col overflow-hidden rounded-[22px] bg-[#efe37b] p-6 shadow-[0_18px_40px_rgba(15,23,42,0.10)] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:rounded-none min-[1440px]:rounded-br-[48px] min-[1440px]:rounded-tl-[48px] min-[1440px]:px-[34px] min-[1440px]:pt-[39px]"
          >
            <span className="pointer-events-none absolute bottom-0 right-0 h-20 w-20 rounded-tl-[48px] bg-[#FBBF24]" />
            <div className="relative z-10 inline-flex min-[1440px]:ml-[6px]">
              <Image
                src={voiceInputIcon}
                alt={t("landing.resources.cards.multiInput.title")}
                width={24}
                height={30}
                className="h-[30px] w-[24px]"
              />
            </div>
            <h3
              className={`relative z-10 mt-5 text-[24px] font-extrabold leading-tight text-[#004D40] min-[1440px]:mt-6 min-[1440px]:h-7 min-[1440px]:w-[103.56px] min-[1440px]:text-[20px] min-[1440px]:leading-[28px] min-[1440px]:tracking-[0px] ${outfitBold.className}`}
            >
              {t("landing.resources.cards.multiInput.title")}
            </h3>
            <p
              className={`relative z-10 mt-4 text-sm leading-6 text-[#5f5d2f] min-[1440px]:mt-[20.25px] min-[1440px]:h-[69px] min-[1440px]:w-[252px] min-[1440px]:text-[14px] min-[1440px]:leading-[23px] min-[1440px]:tracking-[0px] ${spaceGroteskRegular.className}`}
            >
              {t("landing.resources.cards.multiInput.description")}
            </p>
            <div className="relative z-10 mt-auto flex items-center gap-3 pt-6 text-[#7c7444] min-[1440px]:absolute min-[1440px]:left-[34px] min-[1440px]:top-[230.25px] min-[1440px]:m-0 min-[1440px]:h-[19px] min-[1440px]:w-[252px] min-[1440px]:gap-4 min-[1440px]:p-0">
              <IconMicrophone size={18} stroke={2} />
              <IconFileText size={18} stroke={2} />
              <IconPhoto size={18} stroke={2} />
            </div>
          </motion.article>

          <motion.article
            {...cardMotionProps}
            className="relative min-h-[260px] xl:h-full min-[1440px]:h-[332.25px] min-[1440px]:w-[320px] min-[1440px]:pt-12"
          >
            <div className="flex h-full flex-col overflow-hidden rounded-[22px] bg-[#FF8F00] p-6 text-white shadow-[0_18px_40px_rgba(255,149,0,0.30)] min-[1440px]:h-[284.25px] min-[1440px]:w-[320px] min-[1440px]:rounded-none min-[1440px]:rounded-br-[48px] min-[1440px]:rounded-tl-[48px] min-[1440px]:px-[35px] min-[1440px]:pt-[37px]">
              <div className="inline-flex h-[30px] w-[30px] items-center justify-center">
                <Image
                  src={guidedTriageIcon}
                  alt={t("landing.resources.cards.guidedTriage.title")}
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px]"
                />
              </div>
              <h3 className="mt-5 text-[24px] font-extrabold leading-tight">
                {t("landing.resources.cards.guidedTriage.title")}
              </h3>
              <p className="mt-4 text-sm leading-6 text-white/90">
                {t("landing.resources.cards.guidedTriage.description")}
              </p>
              <div className="mt-auto pt-8">
                <div className="relative h-[8px] w-full overflow-hidden rounded-full bg-white">
                  <span className="absolute inset-y-0 right-0 w-[32%] rounded-full bg-[#CB7000]" />
                </div>
              </div>
            </div>
          </motion.article>
        </div>
      </div>
    </section>
  );
}
