"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import type { ReactNode } from "react";

import {
  IconAlertCircleFilled,
  IconBellFilled,
  IconChevronDown,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconSettingsFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { SafeSpeakLogo } from "@/components/ui/safe-speak-logo";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguage,
  isSupportedLanguage,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

import type { DashboardTab, HomeView } from "./dashboard-types";

const pageFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

function NavItem({
  href,
  icon,
  label,
  active,
  showDot = false,
}: {
  href:
    | "/dashboard"
    | "/dashboard/explorer"
    | "/dashboard/notifications"
    | "/dashboard/settings";
  icon: ReactNode;
  label: string;
  active: boolean;
  showDot?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center justify-center rounded-full px-2 py-2.5 text-sm font-semibold transition lg:justify-start lg:gap-3 lg:px-4",
        active
          ? "bg-[#f6ebda] text-[#f39a22]"
          : "text-[#60718a] hover:bg-[#eef2f7]"
      )}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center">
        {icon}
      </span>
      <span className="hidden lg:inline">{label}</span>
      {showDot && (
        <span className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#f05353] lg:right-3" />
      )}
    </Link>
  );
}

function Sidebar({ activeTab }: { activeTab: DashboardTab }) {
  const { t } = useTranslation();

  return (
    <aside className="sticky top-0 w-[72px] shrink-0 border-r border-[#d7dee8] bg-[#f8fafc] px-2 py-6 sm:w-[88px] sm:px-3 lg:w-56 lg:px-5 lg:py-8 2xl:h-[1574px] 2xl:w-[256px]">
      <div className="px-1 lg:px-2">
        <SafeSpeakLogo
          tone="brand"
          size="md"
          className="hidden lg:inline-flex"
        />
        <div className="flex justify-center lg:hidden">
          <SafeSpeakLogo variant="mark" size="lg" />
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-2 lg:mt-10">
        <NavItem
          href="/dashboard"
          icon={<IconHomeFilled size={12} />}
          label={t("dashboard.nav.home")}
          active={activeTab === "home"}
        />
        <NavItem
          href="/dashboard/explorer"
          icon={<IconCompassFilled size={12} />}
          label={t("dashboard.nav.explorer")}
          active={activeTab === "explorer"}
        />
        <NavItem
          href="/dashboard/notifications"
          icon={<IconBellFilled size={12} />}
          label={t("dashboard.nav.notifications")}
          active={activeTab === "notifications"}
          showDot
        />
      </nav>

      <div className="mt-auto">
        <NavItem
          href="/dashboard/settings"
          icon={<IconSettingsFilled size={12} />}
          label={t("dashboard.nav.settings")}
          active={activeTab === "settings"}
        />
      </div>
    </aside>
  );
}

function EmergencyToolbar() {
  const { t, i18n } = useTranslation();
  const resolvedLanguage =
    i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LANGUAGE;
  const currentLanguage = isSupportedLanguage(resolvedLanguage)
    ? resolvedLanguage
    : DEFAULT_LANGUAGE;
  const activeLanguage =
    LANGUAGE_OPTIONS.find((option) => option.code === currentLanguage) ??
    LANGUAGE_OPTIONS[0];

  const toggleLanguage = async () => {
    const nextLanguage: SupportedLanguage =
      currentLanguage === "en" ? "es" : "en";

    await i18n.changeLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  return (
    <div className="mx-auto flex max-w-[1120px] flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full bg-[#de3838] px-3 py-1.5 text-[10px] font-bold text-white sm:px-4 sm:text-[11px]">
          <IconAlertCircleFilled size={13} />
          {t("dashboard.toolbar.emergencyCall")}
          <button
            type="button"
            onClick={() => void toggleLanguage()}
            className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px]"
            aria-label={t("navbar.language.chooseLanguage")}
          >
            {activeLanguage.shortCode}
            <IconChevronDown size={10} />
          </button>
        </div>

        <button className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#de3838] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#cf3131]">
          {t("dashboard.toolbar.quickExit")}
          <IconFolderFilled size={12} />
        </button>
      </div>

      <div className="self-end text-right">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#93a3b8]">
          {t("dashboard.toolbar.welcomeBack")}
        </p>
        <p className="text-sm font-bold text-[#1f2a3a]">
          {t("dashboard.toolbar.userName")}
        </p>
      </div>
    </div>
  );
}

export function DashboardShell({
  activeTab,
  homeView,
  children,
}: {
  activeTab: DashboardTab;
  homeView?: HomeView;
  children: ReactNode;
}) {
  const isIncidentBuilderView =
    homeView === "assistant" ||
    homeView === "assistantconversation" ||
    homeView === "scamshieldintake" ||
    homeView === "scamshieldrisk" ||
    homeView === "scamshieldassets" ||
    homeView === "scamshieldagency" ||
    homeView === "reportshistory" ||
    homeView === "reportoverview" ||
    homeView === "reportsubmissionsupport" ||
    homeView === "reportsubmissionrecommendations" ||
    homeView === "reportsubmissionhistory" ||
    homeView === "reportsubmissiondetailedexplanations" ||
    homeView === "reportsubmissiondetails" ||
    homeView === "reportsubmissionevidence" ||
    homeView === "reportsubmissionreview" ||
    homeView === "reportsubmissionsuccess";

  const sectionSizeClass =
    activeTab === "notifications"
      ? "xl:min-h-[749px] xl:w-full xl:max-w-[1184px]"
      : activeTab === "home" && isIncidentBuilderView
        ? "xl:min-h-[868.68px]"
        : "xl:min-h-[1498px]";

  return (
    <div
      className={`${pageFont.className} mx-auto flex min-h-screen w-full overflow-x-hidden bg-[#eef3f8]`}
    >
      <Sidebar activeTab={activeTab} />

      <section
        className={cn("min-w-0 flex-1 p-2 sm:p-3 md:p-4", sectionSizeClass)}
      >
        <div className="overflow-hidden rounded-[16px] bg-[#edf2f8] sm:rounded-[20px] xl:h-full">
          <EmergencyToolbar />
          {children}
        </div>
      </section>
    </div>
  );
}
