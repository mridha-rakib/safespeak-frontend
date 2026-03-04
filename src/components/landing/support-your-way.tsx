"use client";

import Image from "next/image";

import {
  IconBook2,
  IconChevronRight,
  IconClipboardList,
  IconHeadphones,
  IconPointer,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import chatWithCounselorImage from "@/assets/chatwithcounselor.svg?url";
import naturalImage from "@/assets/natural.svg?url";

function ActionLink({ children }: { children: string }) {
  return (
    <button
      type="button"
      className="mt-5 inline-flex items-center gap-1 text-[14px] font-semibold text-[#0B5FA6] transition-colors hover:text-[#084C87]"
    >
      {children}
      <IconChevronRight aria-hidden size={14} />
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
      className={`flex h-full flex-col overflow-hidden rounded-[22px] border border-t-[2px] border-[#D6DDE6] border-t-[#F29A1F] bg-[#FDFEFF] shadow-[0_10px_22px_rgba(15,23,42,0.06)] ${className}`}
    >
      {children}
    </article>
  );
}

function CardImageBand({ src, alt }: { src: string; alt: string }) {
  return (
    <div className="relative h-40 overflow-hidden border-b border-[#E8EDF4] bg-[#F5F7FA] sm:h-44">
      <Image
        src={src}
        alt={alt}
        fill
        sizes="(min-width: 1024px) 35vw, 100vw"
        className="object-cover"
      />
    </div>
  );
}

export default function SupportYourWay() {
  const { t } = useTranslation();

  return (
    <section className="mx-auto w-full max-w-[1440px] bg-white px-4 py-14 sm:px-8 sm:py-16 lg:px-40 lg:py-20">
      <div className="mx-auto flex w-full max-w-[1120px] flex-col gap-10 lg:gap-16">
        <header className="mx-auto max-w-[520px] text-center">
          <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#1F8CE6]">
            {t("landing.supportYourWay.label")}
          </p>
          <h3 className="mt-2 text-[44px] font-extrabold leading-[1.05] text-[#111827] sm:text-[52px]">
            {t("landing.supportYourWay.title")}
          </h3>
          <p className="mx-auto mt-4 max-w-[470px] text-[14px] leading-[1.65] text-[#667085] sm:text-[16px]">
            {t("landing.supportYourWay.subtitle")}
          </p>
        </header>

        <div className="grid grid-cols-1 gap-5 sm:gap-6 lg:auto-rows-fr lg:grid-cols-2 lg:gap-x-6 lg:gap-y-8 lg:py-3 lg:[&>*:nth-child(even)]:translate-y-3 lg:[&>*:nth-child(odd)]:-translate-y-3 lg:[&>*]:transition-transform">
          <CardShell>
            <CardImageBand
              src={naturalImage}
              alt={`${t("landing.supportYourWay.natural")} ${t("landing.supportYourWay.cards.reportIncident.title")}`}
            />
            <div className="flex flex-1 flex-col p-6 lg:p-7">
              <div className="flex items-center gap-2 text-[#111827]">
                <IconPointer size={16} className="text-[#F29A1F]" />
                <h4 className="text-[28px] font-bold leading-[1.1]">
                  {t("landing.supportYourWay.cards.reportIncident.title")}
                </h4>
              </div>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#6B7280]">
                {t("landing.supportYourWay.cards.reportIncident.description")}
              </p>
              <ActionLink>
                {t("landing.supportYourWay.cards.reportIncident.action")}
              </ActionLink>
            </div>
          </CardShell>

          <CardShell className="p-6 lg:p-7">
            <div className="flex items-center gap-2 text-[#111827]">
              <IconClipboardList size={16} className="text-[#F29A1F]" />
              <h4 className="text-[28px] font-bold leading-[1.1]">
                {t("landing.supportYourWay.cards.trackCase.title")}
              </h4>
            </div>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#6B7280]">
              {t("landing.supportYourWay.cards.trackCase.description")}
            </p>
            <ActionLink>
              {t("landing.supportYourWay.cards.trackCase.action")}
            </ActionLink>
          </CardShell>

          <CardShell className="p-6 lg:p-7">
            <div className="flex items-center gap-2 text-[#111827]">
              <IconBook2 size={16} className="text-[#F29A1F]" />
              <h4 className="text-[28px] font-bold leading-[1.1]">
                {t("landing.supportYourWay.cards.accessResources.title")}
              </h4>
            </div>
            <p className="mt-4 text-[14px] leading-[1.7] text-[#6B7280]">
              {t("landing.supportYourWay.cards.accessResources.description")}
            </p>
            <ActionLink>
              {t("landing.supportYourWay.cards.accessResources.action")}
            </ActionLink>
          </CardShell>

          <CardShell>
            <CardImageBand
              src={chatWithCounselorImage}
              alt={t("landing.supportYourWay.cards.chatCounselor.title")}
            />
            <div className="flex flex-1 flex-col p-6 lg:p-7">
              <div className="flex items-center gap-2 text-[#111827]">
                <IconHeadphones size={16} className="text-[#F29A1F]" />
                <h4 className="text-[28px] font-bold leading-[1.1]">
                  {t("landing.supportYourWay.cards.chatCounselor.title")}
                </h4>
              </div>
              <p className="mt-4 text-[14px] leading-[1.7] text-[#6B7280]">
                {t("landing.supportYourWay.cards.chatCounselor.description")}
              </p>
              <ActionLink>
                {t("landing.supportYourWay.cards.chatCounselor.action")}
              </ActionLink>
            </div>
          </CardShell>
        </div>
      </div>
    </section>
  );
}
