"use client";

import Link from "next/link";
import { useState } from "react";

import {
  IconArrowLeft,
  IconArrowRight,
  IconChevronDown,
  IconLanguage,
  IconMail,
  IconPhone,
  IconScale,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { cn } from "@/lib/utils";

const explorerServiceIds = [
  "legal-aid",
  "community-support",
  "counselling",
  "health-services",
  "elder-support",
  "crisis-support",
  "online-safety",
] as const;

type ExplorerServiceId = (typeof explorerServiceIds)[number];

function isExplorerServiceId(value?: string): value is ExplorerServiceId {
  if (!value) {
    return false;
  }

  return explorerServiceIds.includes(value as ExplorerServiceId);
}

function ContactInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#f7f9fc] px-3 py-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#e5eefb] text-[#3b82f6]">
          {icon}
        </span>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#91a0b4]">
            {label}
          </p>
          <p className="mt-0.5 text-[13px] font-semibold text-[#21324c]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

export function ExplorerServiceDetailsPage({
  serviceId,
}: {
  serviceId?: string;
}) {
  const { t } = useTranslation();
  const [includeIncidentSummary, setIncludeIncidentSummary] = useState(true);
  const selectedServiceId: ExplorerServiceId = isExplorerServiceId(serviceId)
    ? serviceId
    : "community-support";

  const serviceMap: Record<ExplorerServiceId, { title: string; subtitle: string }> = {
    "legal-aid": {
      title: t("dashboard.explorer.legalAid"),
      subtitle: t("dashboard.explorer.legalAidSubtitle"),
    },
    "community-support": {
      title: t("dashboard.explorer.communitySupport"),
      subtitle: t("dashboard.explorer.communitySupportSubtitle"),
    },
    counselling: {
      title: t("dashboard.explorer.counselling"),
      subtitle: t("dashboard.explorer.counsellingSubtitle"),
    },
    "health-services": {
      title: t("dashboard.explorer.healthServices"),
      subtitle: t("dashboard.explorer.healthServicesSubtitle"),
    },
    "elder-support": {
      title: t("dashboard.explorer.elderSupport"),
      subtitle: t("dashboard.explorer.elderSupportSubtitle"),
    },
    "crisis-support": {
      title: t("dashboard.explorer.crisisSupport"),
      subtitle: t("dashboard.explorer.crisisSupportSubtitle"),
    },
    "online-safety": {
      title: t("dashboard.explorer.onlineSafety"),
      subtitle: t("dashboard.explorer.onlineSafetySubtitle"),
    },
  };
  const selectedService = serviceMap[selectedServiceId];

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/explorer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconArrowLeft size={14} />
            {t("dashboard.explorer.serviceDetails.title")}
          </Link>
          <Link href="/dashboard/explorer" className="text-xs font-medium text-[#7b8798]">
            {t("common.cancel")}
          </Link>
        </div>

        <section className="mt-4 rounded-[16px] border border-[#dae3f0] bg-white px-4 py-8 sm:px-6">
          <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef3fb] text-[#24344d]">
              <IconScale size={23} />
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#35c66a] ring-2 ring-white" />
            </div>

            <h1 className="mt-4 text-[30px] font-extrabold leading-[1.05] text-[#1f2a3a] sm:text-[46px]">
              {selectedService.title}
            </h1>
            <p className="mt-1 text-sm font-medium text-[#5b79bd]">
              {selectedService.subtitle}
            </p>

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#dff4e5] px-3 py-1 text-[11px] font-semibold text-[#1a8b3c]">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2dc567]">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {t("dashboard.explorer.serviceDetails.availableNow")}
            </span>
          </div>
        </section>

        <section className="mt-3 rounded-[16px] border border-[#dae3f0] bg-white px-4 py-4 sm:px-6">
          <h2 className="text-sm font-bold text-[#2b3d58]">
            {t("dashboard.explorer.serviceDetails.contactInformation")}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ContactInfoItem
              icon={<IconPhone size={13} />}
              label={t("dashboard.explorer.serviceDetails.phone")}
              value={t("dashboard.explorer.serviceDetails.phoneValue")}
            />
            <ContactInfoItem
              icon={<IconMail size={13} />}
              label={t("dashboard.explorer.serviceDetails.email")}
              value={t("dashboard.explorer.serviceDetails.emailValue")}
            />
            <ContactInfoItem
              icon={<IconLanguage size={13} />}
              label={t("dashboard.explorer.serviceDetails.languages")}
              value={t("dashboard.explorer.serviceDetails.languagesValue")}
            />
          </div>
        </section>

        <section className="mt-3 rounded-[16px] border border-[#dae3f0] bg-[#edf3fb] px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <h3 className="inline-flex items-center gap-2 text-[29px] font-extrabold leading-none text-[#24344d]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#dbe4f1] text-[13px] font-bold text-[#2b3d58]">
                  *
                </span>
                {t("dashboard.explorer.serviceDetails.warmReferral")}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[#6e8099]">
                {t("dashboard.explorer.serviceDetails.warmReferralDescription")}
              </p>
            </div>

            <div className="w-full max-w-[292px]">
              <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#d7deea]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-[#273955]">
                      {t("dashboard.explorer.serviceDetails.includeIncidentSummary")}
                    </p>
                    <p className="text-[9px] text-[#98a6b9]">
                      {t("dashboard.explorer.serviceDetails.includeIncidentSummaryHelp")}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={includeIncidentSummary}
                    aria-label={t("dashboard.explorer.serviceDetails.includeIncidentSummary")}
                    onClick={() => setIncludeIncidentSummary((current) => !current)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition",
                      includeIncidentSummary ? "bg-[#3b70e8]" : "bg-[#cad4e3]"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition",
                        includeIncidentSummary ? "left-[22px]" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>

              <button
                type="button"
                className="mt-5 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#ff9800] px-5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(255,152,0,0.36)] transition hover:bg-[#eb8d00]"
              >
                {t("dashboard.explorer.serviceDetails.sendReferral")}
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        <section className="mt-3 border-t border-[#d6deea] px-1 py-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#2c3f5a]"
          >
            {t("dashboard.explorer.serviceDetails.relevantResources")}
            <IconChevronDown size={15} className="text-[#7e8fa6]" />
          </button>
        </section>
      </div>
    </div>
  );
}
