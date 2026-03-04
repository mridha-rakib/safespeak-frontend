"use client";

import dynamic from "next/dynamic";

import { useTranslation } from "react-i18next";

const LocalIntelligenceMap = dynamic(() => import("./local-intelligence-map"), {
  ssr: false,
  loading: () => (
    <div className="h-full w-full animate-pulse bg-[linear-gradient(145deg,#d7e1dc,#c6d5cf)]" />
  ),
});

export default function LocalIntelligence() {
  const { t } = useTranslation();

  return (
    <section className="bg-[#d9e8f3]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-24 xl:h-[828px] xl:px-20 xl:py-24">
        <div className="mx-auto flex h-full w-full max-w-[1280px] flex-col">
          <div className="w-fit">
            <h3 className="text-3xl font-extrabold text-[#111827] sm:text-4xl lg:text-5xl 2xl:text-6xl">
              {t("landing.localIntelligence.title")}
            </h3>
            <div className="mt-2 h-1 w-16 rounded-full bg-[#ff8f00]" />
          </div>

          <div className="relative mt-6 min-h-[280px] flex-1 overflow-hidden rounded-2xl border-[6px] border-white/75 bg-[#c8d5d0] shadow-[0_14px_28px_rgba(15,23,42,0.08)] sm:min-h-[340px] sm:rounded-3xl lg:mt-8 lg:min-h-[420px]">
            <LocalIntelligenceMap />

            <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_78%_35%,rgba(255,255,255,0.2),transparent_42%)]" />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_16px_28px_rgba(0,0,0,0.16)] sm:bottom-6 sm:left-6 sm:right-auto sm:flex sm:items-center sm:gap-5 sm:px-5 sm:py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f29a1f]">
                  {t("landing.localIntelligence.currentLocation")}
                </p>
                <p className="mt-1 text-lg font-extrabold leading-tight text-[#111827] sm:text-[26px] sm:leading-[1.05]">
                  {t("landing.localIntelligence.activeZonesLine1")}
                  <br />
                  {t("landing.localIntelligence.activeZonesLine2")}
                </p>
              </div>
              <button className="mt-3 rounded-full bg-[#ff8f00] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_16px_rgba(255,143,0,0.35)] sm:mt-0 sm:px-5 sm:text-sm">
                {t("common.details")}
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
