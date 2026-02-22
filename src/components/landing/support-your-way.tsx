"use client";

import { IconBook2, IconClipboardList, IconHeadphones, IconPointer } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

function ActionLink({ children }: { children: string }) {
  return (
    <button className="mt-4 inline-flex items-center gap-1 text-sm font-semibold text-[#0b5fa6] transition hover:text-[#084c87]">
      {children}
      <span aria-hidden="true">&gt;</span>
    </button>
  );
}

function CardShell({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <article
      className={`overflow-hidden rounded-[18px] border border-[#d6dde6] border-t-[2px] border-t-[#f29a1f] bg-white shadow-[0_10px_22px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </article>
  );
}

export default function SupportYourWay() {
  const { t } = useTranslation();

  return (
    <section className="bg-white">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <div className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[#1f8ce6]">
              {t("landing.supportYourWay.label")}
            </p>
            <h3 className="mt-2 text-3xl font-extrabold text-[#111827] sm:text-4xl lg:text-5xl 2xl:text-6xl">
              {t("landing.supportYourWay.title")}
            </h3>
            <p className="mx-auto mt-4 max-w-[560px] text-base leading-relaxed text-[#6b7280] sm:text-lg lg:text-xl">
              {t("landing.supportYourWay.subtitle")}
            </p>
          </div>

          <div className="mt-10 grid grid-cols-1 gap-4 sm:gap-5 lg:mt-12 lg:grid-cols-2 lg:gap-6">
            <CardShell>
              <div className="relative h-[170px] border-b border-[#edf1f6] bg-gradient-to-r from-[#f7f8fa] to-[#e6ecf4] sm:h-[190px]">
                <p className="pt-2 text-center text-base font-medium tracking-[0.08em] text-[#d4b68a] sm:text-[18px]">
                  {t("landing.supportYourWay.natural")}
                </p>
                <div className="mx-auto mt-7 flex w-[78%] items-end justify-between sm:mt-8">
                  <span className="h-12 w-12 rounded-full bg-[#1f2937] sm:h-16 sm:w-16" />
                  <span className="h-14 w-14 rounded-full bg-[#d1a56c] sm:h-20 sm:w-20" />
                  <span className="h-12 w-12 rounded-full bg-[#8cc2a8] sm:h-16 sm:w-16" />
                  <span className="h-12 w-12 rounded-full bg-[#f2c99f] sm:h-16 sm:w-16" />
                </div>
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 text-[#111827]">
                  <IconPointer size={18} className="text-[#f29a1f]" />
                  <h4 className="text-xl font-bold leading-none sm:text-[22px]">
                    {t("landing.supportYourWay.cards.reportIncident.title")}
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280] sm:text-base">
                  {t("landing.supportYourWay.cards.reportIncident.description")}
                </p>
                <ActionLink>{t("landing.supportYourWay.cards.reportIncident.action")}</ActionLink>
              </div>
            </CardShell>

            <CardShell className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[#111827]">
                <IconClipboardList size={18} className="text-[#f29a1f]" />
                <h4 className="text-xl font-bold leading-none sm:text-[22px]">
                  {t("landing.supportYourWay.cards.trackCase.title")}
                </h4>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#6b7280] sm:text-base">
                {t("landing.supportYourWay.cards.trackCase.description")}
              </p>
              <ActionLink>{t("landing.supportYourWay.cards.trackCase.action")}</ActionLink>
            </CardShell>

            <CardShell className="p-5 sm:p-6">
              <div className="flex items-center gap-2 text-[#111827]">
                <IconBook2 size={18} className="text-[#f29a1f]" />
                <h4 className="text-xl font-bold leading-none sm:text-[22px]">
                  {t("landing.supportYourWay.cards.accessResources.title")}
                </h4>
              </div>
              <p className="mt-3 text-sm leading-relaxed text-[#6b7280] sm:text-base">
                {t("landing.supportYourWay.cards.accessResources.description")}
              </p>
              <ActionLink>{t("landing.supportYourWay.cards.accessResources.action")}</ActionLink>
            </CardShell>

            <CardShell>
              <div className="relative h-[170px] border-b border-[#edf1f6] bg-gradient-to-r from-[#7e4f4e] via-[#d5b3a5] to-[#9ec6c1] sm:h-[190px]">
                <div className="absolute bottom-0 left-8 h-[125px] w-[108px] rounded-t-[90px] bg-[#f4d3b9] sm:h-[135px] sm:w-[120px]" />
                <div className="absolute bottom-0 left-6 h-[102px] w-[108px] rounded-t-[90px] bg-[#5b2e2c] sm:h-[110px] sm:w-[120px]" />
              </div>
              <div className="p-5 sm:p-6">
                <div className="flex items-center gap-2 text-[#111827]">
                  <IconHeadphones size={18} className="text-[#f29a1f]" />
                  <h4 className="text-xl font-bold leading-none sm:text-[22px]">
                    {t("landing.supportYourWay.cards.chatCounselor.title")}
                  </h4>
                </div>
                <p className="mt-3 text-sm leading-relaxed text-[#6b7280] sm:text-base">
                  {t("landing.supportYourWay.cards.chatCounselor.description")}
                </p>
                <ActionLink>{t("landing.supportYourWay.cards.chatCounselor.action")}</ActionLink>
              </div>
            </CardShell>
          </div>
        </div>
      </div>
    </section>
  );
}
