"use client";

import Image from "next/image";

import {
  IconBellFilled,
  IconChevronDown,
  IconChevronLeft,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconMicrophone,
  IconSearch,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import abuseImage from "@/assets/abuse.png";
import bottomLeft from "@/assets/bottom-left.svg?url";
import domesticViolanceImage from "@/assets/domestic-violance.jpg";
import hackerImage from "@/assets/hacker.jpg";
import migrateImage from "@/assets/migrate.jpg";
import topRight from "@/assets/top-right.svg?url";
import { cn } from "@/lib/utils";

function ExplorerSupportCard({
  title,
  subtitle,
  icon,
  className,
  imageSrc,
  gradientClassName,
}: {
  title: string;
  subtitle: string;
  icon: React.ReactNode;
  className?: string;
  imageSrc?: React.ComponentProps<typeof Image>["src"];
  gradientClassName?: string;
}) {
  return (
    <article
      className={cn(
        "group relative min-h-[198px] overflow-hidden rounded-[18px] border border-white/20",
        className
      )}
    >
      {imageSrc ? (
        <Image
          src={imageSrc}
          alt={title}
          fill
          className="object-cover transition duration-300 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className={cn("absolute inset-0", gradientClassName)} />
      )}

      <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.06)_5%,rgba(15,23,42,0.62)_72%,rgba(15,23,42,0.8)_100%)]" />

      <span className="bg-white/28 absolute left-3 top-3 inline-flex h-5 w-5 items-center justify-center rounded-full text-white backdrop-blur-sm">
        {icon}
      </span>

      <div className="absolute inset-x-3 bottom-3">
        <h3 className="text-[22px] font-bold leading-tight text-white">
          {title}
        </h3>
        <p className="mt-1 text-[11px] text-white/80">{subtitle}</p>
      </div>
    </article>
  );
}

export function ExplorerPage() {
  const { t } = useTranslation();
  const filters = [
    t("dashboard.explorer.filterLanguage"),
    t("dashboard.explorer.filterRegion"),
    t("dashboard.explorer.filterServiceType"),
  ];

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]">
            <IconChevronLeft size={14} />
            {t("dashboard.explorer.safeConnections")}
          </div>
          <button className="text-xs font-medium text-[#7b8798]">
            {t("common.cancel")}
          </button>
        </div>

        <div className="mx-auto mt-6 max-w-[560px] text-center">
          <h1 className="text-[44px] font-extrabold leading-[0.92] text-[#1f2a3a]">
            {t("dashboard.explorer.title")}
          </h1>
          <p className="mt-2 text-xs text-[#7e8fa5]">
            {t("dashboard.explorer.subtitle")}
          </p>

          <div className="relative mx-auto mt-4 max-w-[420px]">
            <IconSearch
              size={13}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a6b9]"
            />
            <input
              type="text"
              placeholder={t("dashboard.explorer.searchPlaceholder")}
              className="h-9 w-full rounded-full border border-[#dbe4f0] bg-white px-9 text-[11px] text-[#1f2937] outline-none placeholder:text-[#a2afc2] focus:border-[#3b82f6]"
            />
          </div>

          <div className="mt-3 flex items-center justify-center gap-4 text-[10px] font-semibold text-[#2f6fca]">
            {filters.map((filter) => (
              <button
                key={filter}
                className="inline-flex items-center gap-1 rounded-full px-1 py-0.5 hover:text-[#0f5d9f]"
              >
                {filter}
                <IconChevronDown size={11} />
              </button>
            ))}
          </div>
        </div>

        <div className="mt-5 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <ExplorerSupportCard
            className="md:col-span-2 xl:col-span-2"
            title={t("dashboard.explorer.legalAid")}
            subtitle={t("dashboard.explorer.legalAidSubtitle")}
            icon={<IconFolderFilled size={10} />}
            imageSrc={hackerImage}
          />
          <ExplorerSupportCard
            title={t("dashboard.explorer.communitySupport")}
            subtitle={t("dashboard.explorer.communitySupportSubtitle")}
            icon={<IconCompassFilled size={10} />}
            imageSrc={abuseImage}
          />
          <ExplorerSupportCard
            title={t("dashboard.explorer.counselling")}
            subtitle={t("dashboard.explorer.counsellingSubtitle")}
            icon={<IconMicrophone size={10} />}
            imageSrc={domesticViolanceImage}
          />
          <ExplorerSupportCard
            title={t("dashboard.explorer.healthServices")}
            subtitle={t("dashboard.explorer.healthServicesSubtitle")}
            icon={<IconShieldFilled size={10} />}
            imageSrc={topRight}
          />
          <ExplorerSupportCard
            title={t("dashboard.explorer.elderSupport")}
            subtitle={t("dashboard.explorer.elderSupportSubtitle")}
            icon={<IconHomeFilled size={10} />}
            imageSrc={migrateImage}
          />
          <ExplorerSupportCard
            title={t("dashboard.explorer.crisisSupport")}
            subtitle={t("dashboard.explorer.crisisSupportSubtitle")}
            icon={<IconBellFilled size={10} />}
            imageSrc={bottomLeft}
          />
          <ExplorerSupportCard
            className="md:col-span-2 xl:col-span-2"
            title={t("dashboard.explorer.onlineSafety")}
            subtitle={t("dashboard.explorer.onlineSafetySubtitle")}
            icon={<IconShieldFilled size={10} />}
            gradientClassName="bg-[linear-gradient(130deg,#6240e6_0%,#6f4fe8_50%,#7f61ee_100%)]"
          />
        </div>
      </div>
    </div>
  );
}
