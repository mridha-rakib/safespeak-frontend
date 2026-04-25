"use client";

import { Plus_Jakarta_Sans } from "next/font/google";
import type { Route } from "next";
import Link from "next/link";
import type { ReactNode } from "react";
import type { UrlObject } from "url";

import {
  IconAlertCircleFilled,
  IconBellFilled,
  IconBook2,
  IconChevronDown,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconSettingsFilled,
  IconShieldFilled,
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
import {
  EMERGENCY_NUMBER,
  SUPPORT_NUMBER_DIAL,
  SUPPORT_NUMBER_DISPLAY,
  triggerQuickExit,
} from "@/lib/safety";
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
  href: Route | UrlObject;
  icon: ReactNode;
  label: string;
  active: boolean;
  showDot?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex min-h-11 items-center justify-center rounded-full px-2 py-2.5 text-sm font-semibold transition lg:justify-start lg:gap-3 lg:px-4",
        active
          ? "bg-[#f6ebda] text-[#f39a22]"
          : "text-[#60718a] hover:bg-[#eef2f7]"
      )}
      aria-current={active ? "page" : undefined}
      title={label}
    >
      <span className="inline-flex h-5 w-5 items-center justify-center">
        {icon}
      </span>
      <span className="hidden lg:inline">{label}</span>
      {showDot && (
        <span className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#f05353] lg:right-3" />
      )}
    </Link>
  );
}

const REPORT_VIEWS: HomeView[] = [
  "assistant",
  "assistantconversation",
  "reportshistory",
  "reportoverview",
  "reportsubmissionsupport",
  "reportsubmissionrecommendations",
  "reportsubmissionhistory",
  "reportsubmissiondetailedexplanations",
  "reportsubmissiondetails",
  "reportsubmissionevidence",
  "reportsubmissionreview",
  "reportsubmissionsuccess",
];

const SCAMSHIELD_VIEWS: HomeView[] = [
  "scamshieldintake",
  "scamshieldrisk",
  "scamshieldassets",
  "scamshieldagency",
];

const LEARNING_VIEWS: HomeView[] = [
  "microeducation",
  "microcards",
  "microcarddetail",
];

function Sidebar({
  activeTab,
  homeView = "overview",
}: {
  activeTab: DashboardTab;
  homeView?: HomeView;
}) {
  const { t } = useTranslation();
  const isHomeTab = activeTab === "home";
  const isReportActive = isHomeTab && REPORT_VIEWS.includes(homeView);
  const isScamShieldActive = isHomeTab && SCAMSHIELD_VIEWS.includes(homeView);
  const isLearningActive = isHomeTab && LEARNING_VIEWS.includes(homeView);

  return (
    <aside className="fixed inset-y-0 left-0 z-30 flex h-screen w-[72px] shrink-0 flex-col overflow-y-auto border-r border-[#d7dee8] bg-[#f8fafc] px-2 py-6 sm:w-[88px] sm:px-3 lg:w-56 lg:px-5 lg:py-8 2xl:w-[256px]">
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
          active={isHomeTab && homeView === "overview"}
        />
        <NavItem
          href={{
            pathname: "/dashboard",
            query: { view: "assistant" },
          }}
          icon={<IconAlertCircleFilled size={13} />}
          label="Report Incident"
          active={isReportActive}
        />
        <NavItem
          href={{
            pathname: "/dashboard",
            query: { view: "scamshieldintake" },
          }}
          icon={<IconShieldFilled size={13} />}
          label="ScamShield"
          active={isScamShieldActive}
        />
        <NavItem
          href="/dashboard/explorer"
          icon={<IconCompassFilled size={12} />}
          label="Get Support"
          active={activeTab === "explorer"}
        />
        <NavItem
          href={{
            pathname: "/dashboard",
            query: { view: "microeducation" },
          }}
          icon={<IconBook2 size={13} stroke={2.2} />}
          label="Learn & Resources"
          active={isLearningActive}
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
          label="My SafeSpeak"
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
        <a
          href={`tel:${EMERGENCY_NUMBER}`}
          className="inline-flex h-11 max-w-full items-center gap-2 whitespace-nowrap rounded-full bg-[#de3838] px-3 py-1.5 text-[10px] font-bold text-white sm:px-4 sm:text-[11px]"
        >
          <IconAlertCircleFilled size={13} />
          {t("dashboard.toolbar.emergencyCall")}
        </a>

        <a
          href={`tel:${SUPPORT_NUMBER_DIAL}`}
          className="inline-flex h-11 items-center rounded-full bg-[#0f5d9f] px-4 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
        >
          {SUPPORT_NUMBER_DISPLAY}
        </a>

        <button
          type="button"
          onClick={() => void toggleLanguage()}
          className="inline-flex h-11 items-center gap-1 rounded-full bg-[#1f2a3a] px-2.5 text-[10px] font-bold text-white"
          aria-label={t("navbar.language.chooseLanguage")}
        >
          {activeLanguage.shortCode}
          <IconChevronDown size={10} />
        </button>

        <button
          type="button"
          onClick={triggerQuickExit}
          className="inline-flex h-11 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#de3838] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#cf3131]"
        >
          {t("dashboard.toolbar.quickExit")}
          <IconFolderFilled size={12} />
        </button>

        <span className="inline-flex h-8 items-center rounded-full border border-[#c3d2e6] bg-[#ffffffcc] px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#334155]">
          Safety info only
        </span>
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
      ? "xl:mx-auto xl:min-h-[749px] xl:w-full xl:max-w-[1184px]"
      : activeTab === "home" && isIncidentBuilderView
        ? "xl:min-h-[868.68px]"
        : "xl:min-h-[1498px]";

  return (
    <div
      className={`${pageFont.className} min-h-screen w-full overflow-x-hidden bg-[#eef3f8]`}
    >
      <Sidebar activeTab={activeTab} homeView={homeView} />

      <section
        className={cn(
          "min-w-0 p-2 pl-[80px] sm:p-3 sm:pl-[100px] md:p-4 md:pl-[104px] lg:pl-[240px] 2xl:pl-[272px]",
          sectionSizeClass
        )}
      >
        <div className="overflow-hidden rounded-[16px] bg-[#edf2f8] sm:rounded-[20px] xl:h-full">
          <EmergencyToolbar />
          {children}
        </div>
      </section>
    </div>
  );
}
