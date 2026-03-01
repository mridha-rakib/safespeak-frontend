"use client";

import Image from "next/image";
import { useState } from "react";
import { useTranslation } from "react-i18next";

import { IconAlertTriangleFilled, IconMinus, IconMoon, IconPlus } from "@tabler/icons-react";

import appleIcon from "@/assets/apple.svg";
import playstoreIcon from "@/assets/playstore.svg";
import worldIcon from "@/assets/world.svg";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);
  const faqItems: FaqItem[] = [0, 1, 2, 3, 4].map((index) => ({
    question: t(`landing.faq.items.${index}.question`),
    answer: t(`landing.faq.items.${index}.answer`),
  }));

  return (
    <section className="mx-auto w-full max-w-[1280px] bg-[#F0FDFA] pb-16 xl:min-h-[709px]">
      <div className="mx-auto flex w-full max-w-[1280px] flex-col gap-10 px-4 sm:px-8 lg:gap-12 xl:px-0">
        <div className="grid w-full gap-10 lg:gap-12 xl:h-[645px] xl:grid-cols-[362.66px_minmax(0,1fr)] xl:gap-12">
          <div className="xl:h-[645px] xl:w-[362.66px]">
            <h3
              className="h-12 w-full text-[48px] font-bold leading-[48px] tracking-[-1.2px] text-[#0F766E]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {t("landing.faq.heading")}
            </h3>

            <article className="mt-[32px] rounded-[16px] border-l-[8px] border-l-[#EF4444] bg-white p-8 shadow-[0_10px_22px_rgba(15,23,42,0.10)] xl:h-[565px]">
              <div className="flex items-center gap-2 text-[#DC2626]">
                <IconAlertTriangleFilled size={12} />
                <p className="text-[20px] font-bold uppercase leading-[1.2] tracking-[0.02em]">{t("landing.faq.emergencyNotice")}</p>
              </div>

              <p className="mt-7 text-[11px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">{t("landing.faq.immediateDanger")}</p>
              <p className="mt-1 text-[54px] font-extrabold leading-none text-[#111827]">{t("landing.faq.emergencyNumber")}</p>

              <p className="mt-6 text-[11px] font-medium uppercase tracking-[0.05em] text-[#6B7280]">{t("landing.faq.supportLabel")}</p>
              <p className="mt-1 text-[38px] font-extrabold leading-none text-[#0B5FA6]">{t("landing.faq.supportNumber")}</p>

              <hr className="my-6 border-[#DFE4E3]" />
              <p className="text-[11px] leading-[1.65] text-[#6B7280]">{t("landing.faq.disclaimer")}</p>
            </article>
          </div>

          <div className="w-full xl:h-[645px]">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.question + idx} className="border-b border-[#B9D8D4] py-5 sm:py-6">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="flex w-full items-start justify-between gap-4 text-left sm:gap-6"
                  >
                    <span className={`pr-4 text-[22px] leading-[1.35] text-[#111827] ${isOpen ? "font-semibold" : "font-medium"}`}>
                      {item.question}
                    </span>
                    <span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-[#0F9D9A] text-[#0F9D9A]">
                      {isOpen ? <IconMinus size={14} stroke={2.3} /> : <IconPlus size={14} stroke={2.3} />}
                    </span>
                  </button>

                  {isOpen && (
                    <p className="mt-4 max-w-[760px] text-[13px] leading-[1.85] text-[#5E7774]">{item.answer}</p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="relative isolate w-full overflow-hidden rounded-[24px] bg-[linear-gradient(100deg,#01579B_0%,#0A5FA2_48%,#075695_100%)] px-6 pb-10 pt-11 text-center text-white shadow-[0_14px_36px_rgba(3,54,101,0.26)] sm:px-10 sm:pb-12 sm:pt-14 lg:px-16">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_54%,rgba(35,172,216,0.38)_0%,rgba(35,172,216,0.22)_24%,rgba(35,172,216,0)_60%)]" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-6 bg-gradient-to-r from-[#054C84]/80 via-[#0D5F97]/75 to-[#1B75B0]/55" />

          <div className="relative z-10 mx-auto max-w-[760px]">
            <span
              className="inline-flex rounded-full border border-[#24ABC8] bg-[#0B76A9] px-5 py-1.5 text-[10px] font-semibold uppercase tracking-[0.09em] text-[#E6FDFF]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {t("landing.faq.ctaTag")}
            </span>
            <h4
              className="mx-auto mt-5 max-w-[460px] text-[40px] font-bold leading-[1.05] tracking-[-1.2px] text-white sm:text-[50px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              {t("landing.faq.ctaTitle")}
            </h4>
            <p className="mx-auto mt-3 max-w-[620px] text-[14px] leading-[1.45] text-[#D3EFFF] sm:text-[15px]">{t("landing.faq.ctaDescription")}</p>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-3 sm:mt-10">
              <button
                type="button"
                className="inline-flex h-[52px] min-w-[186px] items-center gap-2.5 rounded-[11px] border border-white bg-white px-5 text-[#06558F] transition-colors hover:bg-[#F4FAFF]"
              >
                <Image src={appleIcon} alt={t("landing.faq.appStore")} width={18} height={21} />
                <span className="flex flex-col items-start text-left leading-none">
                  <span className="text-[6.5px] font-semibold uppercase tracking-[0.08em] text-[#7E9AB9]">Download on the</span>
                  <span
                    className="mt-0.5 inline-flex h-6 w-[79px] items-center text-[16px] font-bold leading-6 tracking-[0px] text-[#01579B]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t("landing.faq.appStore")}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="inline-flex h-[52px] min-w-[186px] items-center gap-2.5 rounded-[11px] border border-white bg-white px-5 text-[#06558F] transition-colors hover:bg-[#F4FAFF]"
              >
                <Image src={playstoreIcon} alt={t("landing.faq.android")} width={23} height={26} />
                <span className="flex flex-col items-start text-left leading-none">
                  <span className="text-[6.5px] font-semibold uppercase tracking-[0.08em] text-[#7E9AB9]">Download for</span>
                  <span
                    className="mt-0.5 inline-flex h-6 w-[79px] items-center text-[16px] font-bold leading-6 tracking-[0px] text-[#01579B]"
                    style={{ fontFamily: "Inter, sans-serif" }}
                  >
                    {t("landing.faq.android")}
                  </span>
                </span>
              </button>
              <button
                type="button"
                className="inline-flex h-[52px] min-w-[186px] items-center gap-2.5 rounded-[11px] border border-[#F8D15A] bg-transparent px-6 text-[14px] font-semibold text-[#F8D15A] transition-colors hover:bg-[#F8D15A]/10"
              >
                <Image src={worldIcon} alt={t("landing.faq.webVersion")} width={19} height={19} />
                {t("landing.faq.webVersion")}
              </button>
            </div>
          </div>
        </div>

        <div className="ml-auto inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#9BD7D2] text-[#0F9D9A]">
          <IconMoon size={15} stroke={2.2} />
        </div>
      </div>
    </section>
  );
}
