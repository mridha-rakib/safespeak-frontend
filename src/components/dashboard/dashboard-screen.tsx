"use client";

import type { Route } from "next";
import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconBellFilled,
  IconBoltFilled,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconMicrophone,
  IconSearch,
  IconSettingsFilled,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import abuseImage from "@/assets/abuse.png";
import bottomLeft from "@/assets/bottom-left.svg?url";
import bottomRight from "@/assets/bottom-right.svg?url";
import digitalFootPrint from "@/assets/digital_foot_print.svg?url";
import documentingEv from "@/assets/documentig_ev.svg?url";
import domesticViolanceImage from "@/assets/domestic-violance.jpg";
import hackerImage from "@/assets/hacker.jpg";
import identifyBulling from "@/assets/identifyBulling.svg?url";
import mentalHealth from "@/assets/mental_health.svg?url";
import mentalHealth2 from "@/assets/mental_health_2.svg?url";
import mentalHealthLove from "@/assets/mental_health_love.svg?url";
import migrateImage from "@/assets/migrate.jpg";
import safeReporting from "@/assets/safe_reporting.svg?url";
import scamShield from "@/assets/scam shield icon.svg?url";
import sendIcon from "@/assets/sendIcon.svg?url";
import sphereAdv from "@/assets/sphere-adv.svg?url";
import topLeft from "@/assets/top-left.svg?url";
import topMask from "@/assets/top-mask.svg?url";
import topRight from "@/assets/top-right.svg?url";
import { AssistantInteraction } from "@/components/dashboard/assistant-interaction";
import { SafeSpeakLogo } from "@/components/ui/safe-speak-logo";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguage,
  isSupportedLanguage,
} from "@/lib/i18n";
import { cn } from "@/lib/utils";

import SMDasboardHome from "./sm-dashboard-home";

type DashboardTab = "home" | "explorer" | "notifications" | "settings";
type HomeView =
  | "overview"
  | "microeducation"
  | "microcards"
  | "microcarddetail"
  | "assistantconversation"
  | "assistant"
  | "scamshieldintake"
  | "scamshieldrisk"
  | "scamshieldassets"
  | "scamshieldagency"
  | "reportshistory"
  | "reportoverview"
  | "reportsubmissionsupport"
  | "reportsubmissiondetails"
  | "reportsubmissionevidence"
  | "reportsubmissionreview"
  | "reportsubmissionsuccess";
type NotificationView = "today" | "past";
type SettingsView = "overview" | "support" | "privacy";

const pageFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["600", "800", "900"],
});

const SPHERE_TOP = 275; // offset from top of the grid area
// eslint-disable-next-line n/no-process-env
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const localIntelligenceMapSrc = googleMapsApiKey
  ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=-33.8688,151.2093&zoom=13&maptype=roadmap`
  : null;

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
  icon: React.ReactNode;
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
    <aside className="sticky top-0 w-[72px] shrink-0 border-r border-[#d7dee8] bg-[#f8fafc] px-2 py-6 sm:w-[88px] sm:px-3 lg:w-56 lg:px-5 lg:py-8 xl:h-[1574px] xl:w-[256px]">
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
    <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4">
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

function HomeDashboardPage() {
  const { t } = useTranslation();

  return (
      <div className="px-2 pb-4 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
        <div className="relative mx-auto w-full [--dashboard-card-gap:12px] sm:[--dashboard-card-gap:16px] lg:[--dashboard-card-gap:20px] xl:max-w-[1120px] xl:[--dashboard-card-gap:24px] 2xl:max-w-[1184px]">
          <div className="hidden flex-col gap-[var(--dashboard-card-gap)] md:flex">
            <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2 xl:grid-cols-[1fr_2.122fr_1fr]">
              <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-1 xl:order-none xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]">
                <Image
                  src={topLeft}
                  alt="Domestic violence"
                  fill
                  className="object-cover transition duration-[250ms] ease-out group-hover:brightness-110"
                />
              </article>

              <Link
                href={{
                  pathname: "/dashboard",
                  query: { view: "assistant" },
                }}
                className="xl:notch-bl group relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-3 md:col-span-2 xl:order-none xl:col-span-1 xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]"
              >
                <Image alt="dfhksdjf" fill src={topMask} />
                <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[96px] w-[96px] -translate-x-1/2 sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px] xl:hidden">
                  <Image
                    src={sphereAdv}
                    alt="SafeSpeak assistant sphere"
                    fill
                    className="object-contain"
                  />
                </div>
              </Link>

              <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-2 xl:order-none xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]">
                <Image
                  src={topRight}
                  alt="Racial abuse"
                  fill
                  className="object-cover transition duration-[250ms] ease-out group-hover:brightness-110"
                />
              </article>
            </div>

            <div>
              <div className="relative xl:h-[406.2px] xl:w-full">
                <div className="grid h-full grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2">
                  <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]">
                    <Image alt="dfhksdjf" fill src={bottomLeft} />
                  </article>

                  <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]">
                    <Image alt="dfhksdjf" fill src={bottomRight} />
                  </article>
                </div>
              </div>
            </div>
          </div>
          <SMDasboardHome />
          <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2 xl:grid-cols-[262px_357.34px_452.66px]">
            <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] xl:grid-rows-2">
              <Link
                href={{
                  pathname: "/dashboard",
                  query: { view: "scamshieldintake" },
                }}
                className="relative block min-h-[190px] w-full overflow-hidden rounded-[24px] border border-white/20 bg-[#004D73] p-5 transition hover:brightness-110 sm:min-h-[220px] sm:p-6 xl:h-[238px] xl:max-w-[262px] xl:rounded-[40px]"
              >
                <p className="text-[18px] font-semibold uppercase tracking-[0.18em] text-[#77c6df]">
                  {t("dashboard.home.cyber")}
                </p>
                <h4
                  className={`${interFont.className} mt-3 w-full text-[24px] font-extrabold uppercase leading-[30px] tracking-[0] text-white`}
                >
                  {t("dashboard.home.scamShield")
                    .split(" ")
                    .slice(0, 1)
                    .join(" ")}
                  <br />
                  {t("dashboard.home.scamShield").split(" ").slice(1).join(" ")}
                </h4>
                <IconShieldFilled
                  size={118}
                  className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-white/10"
                />
                <div className="absolute bottom-6 left-6 grid h-[54px] w-[54px] place-items-center rounded-[14px] border border-white/35 bg-white/5">
                  <Image
                    src={scamShield}
                    alt="Scam Shield icon"
                    width={30}
                    height={30}
                    className="h-[30px] w-[30px]"
                  />
                </div>
              </Link>

              <article className="relative min-h-[190px] w-full overflow-hidden rounded-[24px] bg-[#FFC107] p-5 sm:min-h-[220px] sm:p-6 xl:h-[238px] xl:max-w-[262px] xl:rounded-[40px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
                  {t("dashboard.home.legal")}
                </p>
                <h4
                  className={`${interFont.className} mt-1 h-[30px] w-[214px] text-[24px] font-extrabold uppercase leading-[30px] tracking-[0] text-[#171717]`}
                >
                  {t("dashboard.home.resources")}
                </h4>
                <IconFolderFilled
                  size={72}
                  className="absolute bottom-6 right-6 text-[#dca906]"
                />
              </article>
            </div>

            <Link
              href={{
                pathname: "/dashboard",
                query: { view: "microeducation" },
              }}
              className="relative block min-h-[280px] w-full overflow-hidden rounded-[24px] bg-[#FF8F00] px-5 pb-5 pt-5 transition hover:brightness-105 sm:min-h-[360px] sm:px-6 sm:pb-6 sm:pt-[23.25px] xl:h-[500px] xl:w-[357.34px] xl:rounded-[40px]"
            >
              <h4
                className={`${interFont.className} h-[83.75px] w-full pb-2 text-[30px] font-extrabold leading-[37.5px] tracking-[0] text-white`}
              >
                {t("dashboard.home.microCards")}
              </h4>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[11px] font-semibold text-white/90">
                  {t("dashboard.home.lessons")}
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/35">
                  <div className="h-2 w-2/3 rounded-full bg-white/95" />
                </div>
              </div>
            </Link>

            <article className="min-h-[320px] w-full overflow-hidden rounded-[24px] border border-[#cfd9e5] bg-white p-3 sm:min-h-[420px] sm:p-4 md:col-span-2 xl:col-span-1 xl:h-[500px] xl:w-[452.66px] xl:rounded-[40px]">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#334155]">
                  {t("dashboard.home.localIntelligence")}
                </h4>
                <span className="text-sm font-bold leading-none text-[#94a3b8]">
                  ...
                </span>
              </div>

              <div className="relative h-[240px] w-full overflow-hidden rounded-[18px] border border-[#d5dece] bg-[#d9e6d2] sm:h-[320px] sm:rounded-[24px] xl:h-[422px] xl:rounded-[32px]">
                {localIntelligenceMapSrc ? (
                  <iframe
                    title="Local Intelligence Map"
                    src={localIntelligenceMapSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(130deg,#cfdebf_0%,#e3edd8_45%,#cedebf_100%)]" />
                )}

                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 px-4 py-2 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#f2a122]">
                        {t("dashboard.home.currentLocation")}
                      </p>
                      <p className="text-[11px] font-semibold leading-tight text-[#334155]">
                        {t("dashboard.home.activeZonesNearby")}
                      </p>
                    </div>
                    <button className="rounded-full bg-[#f59e0b] px-3 py-1 text-[10px] font-bold text-white">
                      {t("dashboard.home.details")}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>

          <div
            className="pointer-events-none absolute left-1/2 z-20 hidden -translate-x-1/2 p-10 xl:block"
            style={{
              top: `${SPHERE_TOP}px`,
              width: "270px",
              height: "270px",
            }}
          >
            <Image
              src={sphereAdv}
              alt="SafeSpeak center sphere"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
  );
}

type MicroCardTone = "blue" | "yellow" | "teal";

function MicroCardLesson({
  title,
  iconSrc,
  tone,
  className,
  readMoreHref = "/dashboard?view=microcarddetail",
}: {
  title: string;
  iconSrc: string;
  tone: MicroCardTone;
  className?: string;
  readMoreHref?:
    | "/dashboard?view=microcarddetail"
    | "/dashboard?view=microcards";
}) {
  const { t } = useTranslation();
  const toneStyles: Record<
    MicroCardTone,
    {
      card: string;
      title: string;
      meta: string;
      iconWrap: string;
      button: string;
    }
  > = {
    blue: {
      card: "bg-[#0f5fa7]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/20",
      button: "bg-white text-[#0d4d85]",
    },
    yellow: {
      card: "bg-[#f7b500]",
      title: "text-[#111827]",
      meta: "text-[#5f4b00]",
      iconWrap: "bg-white/35",
      button: "bg-white text-[#312600]",
    },
    teal: {
      card: "bg-[#1f9f97]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/22",
      button: "bg-white text-[#0e6e67]",
    },
  };

  const currentTone = toneStyles[tone];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 sm:p-5",
        currentTone.card,
        className
      )}
    >
      <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex h-full min-w-0 flex-col">
          <h3
            className={cn(
              `${interFont.className} text-[22px] font-extrabold leading-[0.95] sm:text-[28px]`,
              currentTone.title
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              "mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl",
              currentTone.iconWrap
            )}
          >
            <Image
              src={iconSrc}
              alt={title}
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </div>
          <div className="mt-auto inline-flex items-center gap-1.5">
            <IconClock size={10} className={currentTone.meta} />
            <span className={cn("text-[10px] font-semibold", currentTone.meta)}>
              {t("dashboard.microcards.fourMinRead")}
            </span>
          </div>
        </div>

        <Link
          href={readMoreHref}
          className={cn(
            "self-start rounded-full px-4 py-2 text-[11px] font-bold leading-none sm:mt-1 sm:self-auto",
            currentTone.button
          )}
        >
          {t("dashboard.microcards.readMore")}
        </Link>
      </div>
    </article>
  );
}

function MicroCardsPage() {
  const { t } = useTranslation();

  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.microcards.cyberBullying")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="pt-4">
          <h1
            className={`${interFont.className} text-4xl font-black leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]`}
          >
            {t("dashboard.microcards.title")}
          </h1>
          <p className="mt-1 text-sm text-[#5f6f86]">
            {t("dashboard.microcards.cyberBullying")}
          </p>

          <div className="relative mt-4 max-w-[540px]">
            <IconSearch
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a6b9]"
            />
            <input
              type="text"
              placeholder={t("dashboard.microcards.searchPlaceholder")}
              className="h-10 w-full rounded-full border border-[#dbe5f0] bg-white px-10 text-xs text-[#1f2937] outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title={t("dashboard.microcards.identifyingBullying")}
                iconSrc={identifyBulling}
                tone="blue"
                className="min-h-[132px] xl:h-[140px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.documentingEvidence")}
                iconSrc={documentingEv}
                tone="yellow"
                className="min-h-[132px] xl:h-[140px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]">
              <MicroCardLesson
                title={t("dashboard.microcards.safeReporting")}
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.digitalFootprints")}
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>

            <MicroCardLesson
              title={t("dashboard.microcards.documentingEvidence")}
              iconSrc={documentingEv}
              tone="teal"
              className="min-h-[132px] xl:h-[140px]"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title={t("dashboard.microcards.digitalFootprints")}
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.safeReporting")}
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title={t("dashboard.microcards.safeReporting")}
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title={t("dashboard.microcards.digitalFootprints")}
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MicroCardDetailPage() {
  const { t } = useTranslation();

  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=microcards"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.microcardDetail.safeSpeakEducation")}
          </Link>
          <Link
            href="/dashboard?view=microcards"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="mt-4 rounded-[12px] border border-[#dce4ef] bg-white p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] sm:aspect-auto sm:h-[330px]">
            <Image
              src={hackerImage}
              alt={t("dashboard.microcardDetail.internetHoaxAwareness")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(16,132,220,0.14)_0%,rgba(10,49,91,0.62)_62%,rgba(4,26,51,0.88)_100%)]" />
            <p
              className={`${interFont.className} absolute right-8 top-8 rotate-[-10deg] text-[42px] font-black uppercase leading-[0.84] text-[#d42828] sm:text-[52px]`}
            >
              {t("dashboard.microcardDetail.internet")}
              <br />
              {t("dashboard.microcardDetail.hoax")}
              <br />!
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,17,43,0.78)_100%)] px-4 pb-4 pt-10">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/95">
                {t("dashboard.microcardDetail.safetyEssentials")}
              </p>
              <h2
                className={`${interFont.className} mt-1 text-[34px] font-extrabold leading-[0.95] text-white sm:text-[40px]`}
              >
                {t("dashboard.microcardDetail.stayingSafeOnline")}
              </h2>
            </div>
          </div>

          <div className="px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
            <h3
              className={`${interFont.className} text-[20px] font-extrabold text-[#0f1f35]`}
            >
              {t("dashboard.microcardDetail.digitalHarassmentOverview")}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#4e5f76]">
              {t("dashboard.microcardDetail.overviewParagraph1")}
            </p>

            <div className="mt-4 rounded-[8px] bg-[#e9eef5] px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3b82f6]/40 text-[#2d74d7]">
                  <IconAlertCircleFilled size={12} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1f63c9]">
                    {t("dashboard.microcardDetail.keyTakeaway")}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-[1.45] text-[#4e5f76]">
                    {t("dashboard.microcardDetail.keyTakeawayBody")}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-[1.6] text-[#4e5f76]">
              {t("dashboard.microcardDetail.overviewParagraph2")}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe5f2] bg-white px-4 py-2 text-[11px] font-semibold text-[#334155] transition hover:bg-[#f8fafc]"
              >
                <IconChevronLeft size={12} />
                {t("dashboard.microcardDetail.previousMicrocards")}
              </Link>
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0c5aa4] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0b4f90]"
              >
                {t("dashboard.microcardDetail.nextMicrocards")}
                <IconChevronRight size={12} />
              </Link>
            </div>

            <p className="mt-4 text-center text-[9px] text-[#9aa7b8]">
              {t("dashboard.microcardDetail.educationalDisclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SafeSpeakAssistantPage({
  isRecording = false,
}: {
  isRecording?: boolean;
}) {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.assistant.timelineBuilder")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <AssistantInteraction
          isRecording={isRecording}
          headlineClassName={`${interFont.className} mt-[40px] max-w-[510px] text-center text-[36px] font-semibold leading-[40px] tracking-[0] text-[#24364f]`}
        />
      </div>
    </div>
  );
}

function SafeSpeakAssistantConversationPage({
  initialMessage,
}: {
  initialMessage?: string;
}) {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=assistant"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.assistant.timelineBuilder")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="mt-2 grid min-h-[730px] grid-cols-1 gap-2 xl:grid-cols-[1.65fr_1fr]">
          <div className="rounded-[14px] bg-[#dff0fb] p-3">
            <div className="space-y-3">
              <div>
                <div className="inline-flex max-w-[420px] rounded-2xl bg-white px-3 py-2 text-[10px] text-[#5f6f86]">
                  {t("dashboard.assistant.conversation.botPromptWho")}
                </div>
                <p className="mt-1 text-[9px] text-[#9aa7b8]">9:41 AM</p>
              </div>

              <div className="flex justify-end">
                <div className="max-w-[360px] rounded-2xl bg-white px-3 py-2 text-[10px] text-[#3d4a5f]">
                  {initialMessage?.trim() ||
                    t("dashboard.assistant.conversation.defaultUserReply")}
                </div>
              </div>

              <div>
                <div className="inline-flex max-w-[420px] rounded-2xl bg-white px-3 py-2 text-[10px] text-[#5f6f86]">
                  {t("dashboard.assistant.conversation.botPromptWhere")}
                </div>
                <p className="mt-1 text-[9px] text-[#9aa7b8]">9:42 AM</p>
              </div>
            </div>

            <div className="mt-6 rounded-[16px] border border-[#dbe6f2] bg-white p-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder={t("dashboard.assistant.typeYourResponse")}
                  className="h-9 flex-1 rounded-full bg-[#f6f9fc] px-4 text-xs text-[#1f2937] outline-none placeholder:text-[#95a3b8]"
                />
                <button
                  aria-label={t("dashboard.assistant.toggleMicrophone")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8b97a8]"
                >
                  <IconMicrophone size={14} />
                </button>
                <button
                  aria-label={t("common.send")}
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f59e0b] text-white"
                >
                  <Image
                    src={sendIcon}
                    alt={t("common.send")}
                    width={10}
                    height={14}
                    className="h-[14px] w-[10px]"
                  />
                </button>
              </div>
            </div>
          </div>

          <div className="rounded-[14px] border border-[#e3e9f2] bg-white p-3">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#5f6f86]">
                {t("dashboard.assistant.conversation.liveTimelineBuilder")}
              </p>
              <span className="rounded-full bg-[#eaf2ff] px-2 py-0.5 text-[8px] font-semibold text-[#3f7de0]">
                {t("dashboard.assistant.conversation.updating")}
              </span>
            </div>

            <div className="mt-3 space-y-2">
              <div className="rounded-[10px] border border-[#ebeff5] bg-[#f9fbfd] p-2.5">
                <p className="text-[8px] font-semibold uppercase text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.who")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  {t("dashboard.assistant.conversation.whoValue")}
                </p>
                <div className="mt-2 h-[2px] rounded-full bg-[#d8e3f5]">
                  <div className="h-[2px] w-[68%] rounded-full bg-[#3f7de0]" />
                </div>
              </div>

              <div className="rounded-[10px] border border-[#ebeff5] bg-[#f9fbfd] p-2.5">
                <p className="text-[8px] font-semibold uppercase text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.what")}
                </p>
                <p className="mt-1 text-[11px] italic text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.waitingForDetails")}
                </p>
              </div>

              <div className="rounded-[10px] border border-[#ebeff5] bg-[#f9fbfd] p-2.5">
                <p className="text-[8px] font-semibold uppercase text-[#8fa0b6]">
                  {t("dashboard.assistant.conversation.where")}
                </p>
                <p className="mt-1 text-[11px] text-[#8fa0b6]">
                  {t(
                    "dashboard.assistant.conversation.processingFromTranscript"
                  )}
                </p>
              </div>

              <div className="rounded-[10px] border border-dashed border-[#e3e9f2] bg-[#fbfdff] p-6 text-center text-[9px] text-[#c0c9d6]">
                {t("dashboard.assistant.conversation.moreFields")}
              </div>

              <div className="pt-1">
                <Link
                  href="/dashboard?view=reportsubmissionsupport"
                  className="inline-flex h-9 items-center rounded-full bg-[#0f5d9f] px-5 text-[11px] font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
                >
                  {t("dashboard.assistant.continueToReportSubmission")}
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

const reportSubmissionSteps = [
  { key: "support", label: "Support" },
  { key: "details", label: "Details" },
  { key: "evidence", label: "Evidence" },
  { key: "review", label: "Review" },
  { key: "done", label: "Done" },
] as const;

type ReportSubmissionStep = (typeof reportSubmissionSteps)[number]["key"];

type IncidentReportStatus = "in-review" | "submitted" | "draft";

type IncidentReport = {
  id: string;
  title: string;
  status: IncidentReportStatus;
  createdAt: string;
  location: string;
  narrative: string;
  supportKey: string;
  impactLevel: "High Priority" | "Moderate" | "Low";
};

const incidentReports: IncidentReport[] = [
  {
    id: "SS-2026-0421",
    title: "Harassment Incident - Wing A",
    status: "in-review",
    createdAt: "22 Feb, 2026 - 10:31 PM",
    location: "Terminal C, Gate 14",
    narrative:
      "I was walking through the gate area around 8:30 PM when I noticed two individuals following me closely. They were making comments in a low voice and later approached near Exit C.",
    supportKey: "KEY-8745",
    impactLevel: "High Priority",
  },
  {
    id: "SS-2026-0379",
    title: "Wellbeing Support Request",
    status: "draft",
    createdAt: "20 Feb, 2026 - 05:12 PM",
    location: "Online submission",
    narrative:
      "I am submitting an early support request related to repeated verbal pressure from a supervisor. This report is currently saved as a draft.",
    supportKey: "KEY-8624",
    impactLevel: "Moderate",
  },
  {
    id: "SS-2026-0316",
    title: "Safety Concern - Main Entry",
    status: "submitted",
    createdAt: "16 Feb, 2026 - 09:44 AM",
    location: "Main Entry Hall",
    narrative:
      "Suspicious loitering behavior was observed near the main entry. I submitted this report with timestamps and a brief witness summary.",
    supportKey: "KEY-8311",
    impactLevel: "Low",
  },
];

function findIncidentReport(reportId?: string): IncidentReport {
  if (!reportId) {
    return incidentReports[0];
  }

  return (
    incidentReports.find((report) => report.id === reportId) ??
    incidentReports[0]
  );
}

function ReportSubmissionFrame({
  title,
  subtitle,
  step,
  backHref,
  children,
}: {
  title: string;
  subtitle: string;
  step: ReportSubmissionStep;
  backHref: Route;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const activeStepIndex = reportSubmissionSteps.findIndex(
    (item) => item.key === step
  );

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.reportSubmission.reportSubmission")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce4ef] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f5d9f]">
                {t("dashboard.reportSubmission.incidentBuilder")}
              </p>
              <h2 className="mt-1 text-[28px] font-extrabold leading-[1.02] text-[#1f2a3a] sm:text-[34px]">
                {title}
              </h2>
              <p className="mt-1 text-xs text-[#6a7d94]">{subtitle}</p>
            </div>

            <div className="flex flex-col gap-1 sm:items-end">
              <div className="flex items-center gap-1.5">
                {reportSubmissionSteps.map((item, index) => (
                  <span
                    key={item.key}
                    className={cn(
                      "h-2 w-10 rounded-full",
                      index <= activeStepIndex ? "bg-[#0f5d9f]" : "bg-[#dbe4ef]"
                    )}
                  />
                ))}
              </div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8fa0b6]">
                {t("dashboard.reportSubmission.stepOf", {
                  current: activeStepIndex + 1,
                  total: reportSubmissionSteps.length,
                })}
              </p>
            </div>
          </div>

          {children}
        </article>
      </div>
    </div>
  );
}

function ReportSubmissionSupportPage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.supportTitle")}
      subtitle={t("dashboard.reportSubmission.supportSubtitle")}
      step="support"
      backHref="/dashboard?view=assistantconversation"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f7fafe] p-4">
          <p className="text-sm leading-[1.55] text-[#516279]">
            {t("dashboard.reportSubmission.supportBody")}
          </p>

          <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <div className="rounded-xl bg-[#0f5d9f] p-3 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/80">
                {t("dashboard.reportSubmission.anonymousSupport")}
              </p>
              <p className="mt-1 text-[11px] font-semibold">
                {t("dashboard.reportSubmission.anonymousSupportBody")}
              </p>
            </div>
            <div className="rounded-xl bg-[#144f9b] p-3 text-white">
              <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-white/80">
                {t("dashboard.reportSubmission.recoveryTools")}
              </p>
              <p className="mt-1 text-[11px] font-semibold">
                {t("dashboard.reportSubmission.recoveryToolsBody")}
              </p>
            </div>
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#f6d6d6] bg-[#fff6f6] p-4">
          <p className="inline-flex items-center gap-1 rounded-full bg-[#ffe4e4] px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#cf3131]">
            <IconAlertCircleFilled size={12} />
            {t("dashboard.reportSubmission.urgentHelp")}
          </p>
          <h3 className="mt-2 text-base font-extrabold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.needImmediateSafetyAssistance")}
          </h3>
          <p className="mt-1 text-xs leading-[1.5] text-[#6a7d94]">
            {t("dashboard.reportSubmission.urgentHelpBody")}
          </p>
        </aside>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-3">
        <div className="rounded-xl border border-[#e2eaf4] bg-[#f9fbff] p-3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf2ff] text-[#0f5d9f]">
            <IconShieldFilled size={14} />
          </div>
          <p className="mt-2 text-xs font-bold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.safetyPlan")}
          </p>
          <p className="mt-1 text-[10px] text-[#7a8ca2]">
            {t("dashboard.reportSubmission.safetyPlanBody")}
          </p>
        </div>
        <div className="rounded-xl border border-[#e2eaf4] bg-[#f9fbff] p-3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf2ff] text-[#0f5d9f]">
            <IconFolderFilled size={14} />
          </div>
          <p className="mt-2 text-xs font-bold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.saveDraft")}
          </p>
          <p className="mt-1 text-[10px] text-[#7a8ca2]">
            {t("dashboard.reportSubmission.saveDraftBody")}
          </p>
        </div>
        <div className="rounded-xl border border-[#e2eaf4] bg-[#f9fbff] p-3">
          <div className="inline-flex h-8 w-8 items-center justify-center rounded-lg bg-[#eaf2ff] text-[#0f5d9f]">
            <IconBellFilled size={14} />
          </div>
          <p className="mt-2 text-xs font-bold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.crisisContacts")}
          </p>
          <p className="mt-1 text-[10px] text-[#7a8ca2]">
            {t("dashboard.reportSubmission.crisisContactsBody")}
          </p>
        </div>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <Link
          href="/dashboard?view=assistantconversation"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("dashboard.reportSubmission.backToConversation")}
        </Link>
        <Link
          href="/dashboard?view=reportsubmissiondetails"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
        >
          {t("common.continue")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

function ReportSubmissionDetailsPage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.detailsTitle")}
      subtitle={t("dashboard.reportSubmission.detailsSubtitle")}
      step="details"
      backHref="/dashboard?view=reportsubmissionsupport"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.65fr_1fr]">
        <article className="space-y-3 rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <div>
            <label
              htmlFor="incident-title"
              className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
            >
              {t("dashboard.reportSubmission.incidentTitle")}
            </label>
            <input
              id="incident-title"
              defaultValue={t("dashboard.reportSubmission.incidentTitleValue")}
              className="mt-1 h-10 w-full rounded-xl border border-[#d7e1ee] bg-white px-3 text-xs font-semibold text-[#1f2a3a] outline-none"
            />
          </div>

          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            <div>
              <label
                htmlFor="incident-date"
                className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
              >
                {t("dashboard.reportSubmission.date")}
              </label>
              <input
                id="incident-date"
                defaultValue="2026-02-22"
                className="mt-1 h-10 w-full rounded-xl border border-[#d7e1ee] bg-white px-3 text-xs font-semibold text-[#1f2a3a] outline-none"
              />
            </div>
            <div>
              <label
                htmlFor="incident-location"
                className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
              >
                {t("dashboard.reportSubmission.location")}
              </label>
              <input
                id="incident-location"
                defaultValue={t("dashboard.reportSubmission.locationValue")}
                className="mt-1 h-10 w-full rounded-xl border border-[#d7e1ee] bg-white px-3 text-xs font-semibold text-[#1f2a3a] outline-none"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="incident-summary"
              className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
            >
              {t("dashboard.reportSubmission.summary")}
            </label>
            <textarea
              id="incident-summary"
              rows={5}
              defaultValue={t("dashboard.reportSubmission.summaryValue")}
              className="mt-1 w-full resize-none rounded-xl border border-[#d7e1ee] bg-white px-3 py-2 text-xs leading-[1.55] text-[#1f2a3a] outline-none"
            />
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.reportSubmission.completeness")}
          </p>
          <div className="mt-2 h-2 rounded-full bg-[#e7eef8]">
            <div className="h-2 w-[72%] rounded-full bg-[#0f5d9f]" />
          </div>
          <p className="mt-2 text-xs font-semibold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.completed72")}
          </p>

          <ul className="mt-4 space-y-2 text-[11px] text-[#60728a]">
            <li className="inline-flex items-center gap-1.5">
              <IconShieldFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.incidentTypeIdentified")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconFolderFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.whoWhatWhereCaptured")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconClock size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.addEvidenceToStrengthenCase")}
            </li>
          </ul>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=reportsubmissionsupport"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=scamshieldintake"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
        >
          {t("dashboard.reportSubmission.nextScamShield")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

function ReportSubmissionEvidencePage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.evidenceTitle")}
      subtitle={t("dashboard.reportSubmission.evidenceSubtitle")}
      step="evidence"
      backHref="/dashboard?view=reportsubmissiondetails"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.7fr_1fr]">
        <div className="space-y-3">
          <article className="rounded-[14px] border border-dashed border-[#b9cee7] bg-[#f6f9fd] p-4 text-center">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.reportSubmission.dragFiles")}
            </p>
            <p className="mt-1 text-[10px] text-[#7c8da3]">
              {t("dashboard.reportSubmission.uploadLimits")}
            </p>
            <button className="mt-3 inline-flex h-9 items-center rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white">
              {t("dashboard.reportSubmission.uploadEvidence")}
            </button>
          </article>

          <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
            <article className="overflow-hidden rounded-xl border border-[#dde7f2] bg-white">
              <div className="relative h-[108px] w-full">
                <Image
                  src={domesticViolanceImage}
                  alt="Evidence file"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold text-[#1f2a3a]">
                  Hallway-photo.jpg
                </p>
                <p className="text-[9px] text-[#7c8da3]">1.4 MB</p>
              </div>
            </article>

            <article className="overflow-hidden rounded-xl border border-[#dde7f2] bg-white">
              <div className="relative h-[108px] w-full">
                <Image
                  src={hackerImage}
                  alt="Evidence file"
                  fill
                  className="object-cover"
                />
                <span className="absolute right-2 top-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-black/55 text-white">
                  <IconChevronRight size={12} />
                </span>
              </div>
              <div className="p-2">
                <p className="text-[10px] font-bold text-[#1f2a3a]">
                  CCTV-clip.mp4
                </p>
                <p className="text-[9px] text-[#7c8da3]">6.8 MB</p>
              </div>
            </article>
          </div>
        </div>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.reportSubmission.evidenceStatus")}
          </p>
          <div className="mt-2 space-y-2">
            <div className="flex items-center justify-between rounded-lg bg-[#f6f9fd] px-3 py-2 text-[10px] font-semibold text-[#334155]">
              <span>{t("dashboard.reportSubmission.photos")}</span>
              <span>{t("dashboard.reportSubmission.oneAttached")}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#f6f9fd] px-3 py-2 text-[10px] font-semibold text-[#334155]">
              <span>{t("dashboard.reportSubmission.videos")}</span>
              <span>{t("dashboard.reportSubmission.oneAttached")}</span>
            </div>
            <div className="flex items-center justify-between rounded-lg bg-[#f6f9fd] px-3 py-2 text-[10px] font-semibold text-[#334155]">
              <span>{t("dashboard.reportSubmission.documents")}</span>
              <span>{t("dashboard.reportSubmission.zeroAttached")}</span>
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=reportsubmissiondetails"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=reportsubmissionreview"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
        >
          {t("dashboard.reportSubmission.nextReview")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

function ReportSubmissionReviewPage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.reviewTitle")}
      subtitle={t("dashboard.reportSubmission.reviewSubtitle")}
      step="review"
      backHref="/dashboard?view=reportsubmissionevidence"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.6fr_1fr]">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <div className="space-y-3">
            <div className="rounded-xl bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.reportSubmission.incidentSummary")}
              </p>
              <p className="mt-1 text-xs font-semibold text-[#1f2a3a]">
                {t("dashboard.reportSubmission.incidentTitleValue")}
              </p>
              <p className="mt-1 text-[11px] leading-[1.5] text-[#60728a]">
                {t("dashboard.reportSubmission.summaryValue")}
              </p>
            </div>

            <div className="rounded-xl bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.reportSubmission.attachedEvidence")}
              </p>
              <ul className="mt-2 space-y-1 text-[11px] text-[#334155]">
                <li className="inline-flex items-center gap-1.5">
                  <IconFolderFilled size={12} className="text-[#0f5d9f]" />
                  Hallway-photo.jpg
                </li>
                <li className="inline-flex items-center gap-1.5">
                  <IconFolderFilled size={12} className="text-[#0f5d9f]" />
                  CCTV-clip.mp4
                </li>
              </ul>
            </div>
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.reportSubmission.finalChecks")}
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-[#60728a]">
            <li className="inline-flex items-center gap-1.5">
              <IconShieldFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.personalDataRemoved")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconClock size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.timelineFieldsCompleted")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconBellFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.reportSubmission.emergencyEscalationNotRequired")}
            </li>
          </ul>
        </aside>
      </div>

      <label className="mt-3 inline-flex items-start gap-2 rounded-xl bg-[#f8fbff] px-3 py-2 text-[11px] text-[#42546b]">
        <input
          type="checkbox"
          defaultChecked
          className="mt-0.5 h-3.5 w-3.5 rounded border-[#c8d5e6]"
        />
        {t("dashboard.reportSubmission.confirmAccuracy")}
      </label>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldagency"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=reportsubmissionsuccess"
          className="inline-flex h-10 items-center rounded-full bg-[#f59e0b] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(245,158,11,0.32)]"
        >
          {t("dashboard.reportSubmission.submitReport")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

function ReportSubmissionSuccessPage() {
  const { t } = useTranslation();

  return (
    <ReportSubmissionFrame
      title={t("dashboard.reportSubmission.doneTitle")}
      subtitle={t("dashboard.reportSubmission.doneSubtitle")}
      step="done"
      backHref="/dashboard?view=reportsubmissionreview"
    >
      <div className="mt-4 rounded-[16px] border border-[#dfe8f3] bg-[#f8fbff] p-5 text-center">
        <span className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#eaf2ff] text-[#0f5d9f]">
          <IconShieldFilled size={24} />
        </span>
        <h3 className="mt-3 text-xl font-extrabold text-[#1f2a3a]">
          {t("dashboard.reportSubmission.reportReceivedSuccessfully")}
        </h3>
        <p className="mt-1 text-sm text-[#60728a]">
          {t("dashboard.reportSubmission.referenceKeyPrefix")}{" "}
          <span className="font-bold text-[#0f5d9f]">SS-2026-0421</span>.{" "}
          {t("dashboard.reportSubmission.referenceKeySuffix")}
        </p>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-2 md:grid-cols-2">
        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <p className="text-xs font-bold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.trackSubmission")}
          </p>
          <p className="mt-1 text-[11px] text-[#7c8da3]">
            {t("dashboard.reportSubmission.trackSubmissionBody")}
          </p>
        </article>
        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <p className="text-xs font-bold text-[#1f2a3a]">
            {t("dashboard.reportSubmission.needSupport")}
          </p>
          <p className="mt-1 text-[11px] text-[#7c8da3]">
            {t("dashboard.reportSubmission.needSupportBody")}
          </p>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-end gap-2">
        <Link
          href="/dashboard/reports"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("dashboard.reportSubmission.openReports")}
        </Link>
        <Link
          href="/dashboard"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
        >
          {t("dashboard.reportSubmission.backToDashboard")}
        </Link>
      </div>
    </ReportSubmissionFrame>
  );
}

const scamShieldSteps = [
  {
    key: "intake",
    number: "15",
    labelKey: "dashboard.scamShield.journeyReport",
  },
  {
    key: "risk",
    number: "16",
    labelKey: "dashboard.scamShield.scamRiskResults",
  },
  { key: "assets", number: "17", labelKey: "dashboard.scamShield.nextSteps" },
  {
    key: "agency",
    number: "18",
    labelKey: "dashboard.scamShield.agencyReport",
  },
] as const;

type ScamShieldStep = (typeof scamShieldSteps)[number]["key"];

function ScamShieldFrame({
  title,
  subtitle,
  step,
  backHref,
  children,
}: {
  title: string;
  subtitle: string;
  step: ScamShieldStep;
  backHref: Route;
  children: React.ReactNode;
}) {
  const { t } = useTranslation();
  const activeStepIndex = scamShieldSteps.findIndex(
    (item) => item.key === step
  );

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href={backHref}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.scamShield.brand")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce4ef] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#0f5d9f]">
                {t("dashboard.scamShield.brand")}
              </p>
              <h2 className="mt-1 text-[28px] font-extrabold leading-[1.02] text-[#1f2a3a] sm:text-[34px]">
                {title}
              </h2>
              <p className="mt-1 text-xs text-[#6a7d94]">{subtitle}</p>
            </div>

            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {scamShieldSteps.map((item, index) => (
                <div
                  key={item.key}
                  className={cn(
                    "rounded-xl px-3 py-2 text-center",
                    index <= activeStepIndex ? "bg-[#eaf2ff]" : "bg-[#f3f6fb]"
                  )}
                >
                  <p
                    className={cn(
                      "text-[11px] font-extrabold",
                      index <= activeStepIndex
                        ? "text-[#0f5d9f]"
                        : "text-[#8fa0b6]"
                    )}
                  >
                    {item.number}
                  </p>
                  <p className="mt-0.5 text-[9px] font-semibold text-[#60728a]">
                    {t(item.labelKey)}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {children}
        </article>
      </div>
    </div>
  );
}

function ScamShieldIntakePage() {
  const { t } = useTranslation();

  return (
    <ScamShieldFrame
      title={t("dashboard.scamShield.journeyReport")}
      subtitle={t("dashboard.scamShield.journeyReportSubtitle")}
      step="intake"
      backHref="/dashboard?view=reportsubmissiondetails"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.62fr_1fr]">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <label
            htmlFor="scam-journey-report"
            className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]"
          >
            {t("dashboard.reports.incidentNarrative")}
          </label>
          <textarea
            id="scam-journey-report"
            rows={12}
            defaultValue={t("dashboard.scamShield.journeyNarrativeSample")}
            className="mt-2 w-full resize-none rounded-xl border border-[#d7e1ee] bg-white px-3 py-2 text-xs leading-[1.6] text-[#1f2a3a] outline-none"
          />

          <div className="mt-3 rounded-xl bg-[#eaf2ff] px-3 py-2">
            <p className="text-[10px] font-semibold text-[#3c5574]">
              {t("dashboard.scamShield.autoDetectHint")}
            </p>
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <div className="rounded-xl border border-[#dbe5f2] bg-[#f7faff] p-3 text-center">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
              {t("dashboard.scamShield.uploadScreenshots")}
            </p>
            <button className="mt-2 inline-flex h-9 items-center rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white">
              {t("dashboard.scamShield.addScreenshot")}
            </button>
          </div>

          <div className="mt-3 grid grid-cols-3 gap-2">
            <article className="overflow-hidden rounded-lg border border-[#dde7f2] bg-[#f8fbff]">
              <div className="relative h-[84px] w-full">
                <Image
                  src={hackerImage}
                  alt="Screenshot evidence"
                  fill
                  className="object-cover"
                />
              </div>
            </article>
            <article className="overflow-hidden rounded-lg border border-[#dde7f2] bg-[#f8fbff]">
              <div className="relative h-[84px] w-full">
                <Image
                  src={domesticViolanceImage}
                  alt="Screenshot evidence"
                  fill
                  className="object-cover"
                />
              </div>
            </article>
            <article className="grid h-[84px] place-items-center rounded-lg border border-dashed border-[#bfd0e7] bg-[#f7faff] text-[10px] font-semibold text-[#6f83a0]">
              {t("dashboard.scamShield.add")}
            </article>
          </div>

          <div className="mt-3 rounded-xl bg-[#fff7ea] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#d47d00]">
              {t("dashboard.scamShield.safetyReminder")}
            </p>
            <p className="mt-1 text-[10px] leading-[1.45] text-[#7b5a23]">
              {t("dashboard.scamShield.safetyReminderBody")}
            </p>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=reportsubmissiondetails"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=scamshieldrisk"
          className="inline-flex h-10 items-center rounded-full bg-[#f59e0b] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(245,158,11,0.3)]"
        >
          {t("dashboard.scamShield.analyzeRisk")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
  );
}

function ScamShieldRiskPage() {
  const { t } = useTranslation();

  return (
    <ScamShieldFrame
      title={t("dashboard.scamShield.scamRiskResults")}
      subtitle={t("dashboard.scamShield.scamRiskResultsSubtitle")}
      step="risk"
      backHref="/dashboard?view=scamshieldintake"
    >
      <article className="mt-4 rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4 text-center">
        <p className="text-[44px] font-black leading-none text-[#de3838]">
          85%
        </p>
        <p className="mt-1 text-sm font-bold text-[#de3838]">
          {t("dashboard.scamShield.highFraudRisk")}
        </p>
        <p className="mt-1 text-xs text-[#60728a]">
          {t("dashboard.scamShield.highFraudRiskBody")}
        </p>
      </article>

      <div className="mt-3 grid grid-cols-1 gap-2 xl:grid-cols-[1.65fr_1fr]">
        <div className="space-y-2">
          <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.urgentLanguageUsage")}
            </p>
            <p className="mt-1 text-[11px] text-[#60728a]">
              {t("dashboard.scamShield.urgentLanguageUsageBody")}
            </p>
          </article>
          <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.repeatedContactBehavior")}
            </p>
            <p className="mt-1 text-[11px] text-[#60728a]">
              {t("dashboard.scamShield.repeatedContactBehaviorBody")}
            </p>
          </article>
          <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
            <p className="text-xs font-bold text-[#1f2a3a]">
              {t("dashboard.scamShield.credentialHarvestIndicators")}
            </p>
            <p className="mt-1 text-[11px] text-[#60728a]">
              {t("dashboard.scamShield.credentialHarvestIndicatorsBody")}
            </p>
          </article>
        </div>

        <aside className="rounded-xl border border-[#f6d6d6] bg-[#fff6f6] p-3">
          <p className="inline-flex items-center gap-1 rounded-full bg-[#ffe4e4] px-2 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#cf3131]">
            <IconAlertCircleFilled size={12} />
            {t("dashboard.scamShield.immediateActions")}
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-[#6b4a4a]">
            <li>{t("dashboard.scamShield.immediateAction1")}</li>
            <li>{t("dashboard.scamShield.immediateAction2")}</li>
            <li>{t("dashboard.scamShield.immediateAction3")}</li>
          </ul>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldintake"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=scamshieldassets"
          className="inline-flex h-10 items-center rounded-full bg-[#de3838] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(222,56,56,0.3)]"
        >
          {t("dashboard.scamShield.reportThisIncident")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
  );
}

function ScamShieldAssetsPage() {
  const { t } = useTranslation();

  return (
    <ScamShieldFrame
      title={t("dashboard.scamShield.nextSteps")}
      subtitle={t("dashboard.scamShield.nextStepsSubtitle")}
      step="assets"
      backHref="/dashboard?view=scamshieldrisk"
    >
      <div className="mt-4 space-y-3">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <h3 className="text-base font-extrabold text-[#1f2a3a]">
            {t("dashboard.scamShield.secureAssetsTitle")}
          </h3>
          <p className="mt-1 text-xs text-[#60728a]">
            {t("dashboard.scamShield.secureAssetsSubtitle")}
          </p>
        </article>

        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[#1f2a3a]">
                {t("dashboard.scamShield.contactYourBank")}
              </p>
              <p className="mt-1 text-[11px] text-[#60728a]">
                {t("dashboard.scamShield.contactYourBankBody")}
              </p>
            </div>
            <button className="inline-flex h-8 items-center rounded-full bg-[#ff8f00] px-4 text-[10px] font-bold text-white">
              {t("dashboard.scamShield.markAsCompleted")}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[#1f2a3a]">
                {t("dashboard.scamShield.reportToAccc")}
              </p>
              <p className="mt-1 text-[11px] text-[#60728a]">
                {t("dashboard.scamShield.reportToAcccBody")}
              </p>
            </div>
            <button className="inline-flex h-8 items-center rounded-full bg-[#ff8f00] px-4 text-[10px] font-bold text-white">
              {t("dashboard.scamShield.markAsCompleted")}
            </button>
          </div>
        </article>

        <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-xs font-bold text-[#1f2a3a]">
                {t("dashboard.scamShield.reportToEmergencyCyberTeam")}
              </p>
              <p className="mt-1 text-[11px] text-[#60728a]">
                {t("dashboard.scamShield.reportToEmergencyCyberTeamBody")}
              </p>
            </div>
            <button className="inline-flex h-8 items-center rounded-full bg-[#ff8f00] px-4 text-[10px] font-bold text-white">
              {t("dashboard.scamShield.markAsCompleted")}
            </button>
          </div>
        </article>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldrisk"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=scamshieldagency"
          className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.3)]"
        >
          {t("dashboard.scamShield.nextAgencyReport")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
  );
}

function ScamShieldAgencyPage() {
  const { t } = useTranslation();

  return (
    <ScamShieldFrame
      title={t("dashboard.scamShield.agencyReport")}
      subtitle={t("dashboard.scamShield.agencyReportSubtitle")}
      step="agency"
      backHref="/dashboard?view=scamshieldassets"
    >
      <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-[1.7fr_1fr]">
        <article className="rounded-[14px] border border-[#e3ebf4] bg-[#f9fbfe] p-4">
          <h3 className="text-lg font-extrabold text-[#1f2a3a]">
            {t("dashboard.scamShield.prefilledAgencyReports")}
          </h3>
          <p className="mt-1 text-xs text-[#60728a]">
            {t("dashboard.scamShield.prefilledAgencyReportsBody")}
          </p>

          <div className="mt-3 space-y-2">
            <div className="rounded-xl border border-[#dbe5f2] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.scamShield.scamNarrative")}
              </p>
              <p className="mt-1 text-[11px] text-[#42546b]">
                {t("dashboard.scamShield.scamNarrativeBody")}
              </p>
            </div>

            <div className="rounded-xl border border-[#dbe5f2] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.scamShield.impactedAssets")}
              </p>
              <p className="mt-1 text-[11px] text-[#42546b]">
                {t("dashboard.scamShield.impactedAssetsBody")}
              </p>
            </div>

            <div className="rounded-xl border border-[#dbe5f2] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.scamShield.bankSecurityStep")}
              </p>
              <p className="mt-1 text-[11px] text-[#42546b]">
                {t("dashboard.scamShield.bankSecurityStepBody")}
              </p>
            </div>
          </div>
        </article>

        <aside className="rounded-[14px] border border-[#e3ebf4] bg-white p-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
            {t("dashboard.scamShield.submissionChecklist")}
          </p>
          <ul className="mt-2 space-y-2 text-[11px] text-[#60728a]">
            <li className="inline-flex items-center gap-1.5">
              <IconShieldFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.scamShield.identitySafeModeEnabled")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconFolderFilled size={12} className="text-[#0f5d9f]" />
              {t("dashboard.scamShield.evidencePackageAttached")}
            </li>
            <li className="inline-flex items-center gap-1.5">
              <IconClock size={12} className="text-[#0f5d9f]" />
              {t("dashboard.scamShield.timelineAndMetadataVerified")}
            </li>
          </ul>

          <div className="mt-3 rounded-xl bg-[#f8fbff] p-3">
            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
              {t("dashboard.scamShield.privacyTier")}
            </p>
            <div className="mt-1 inline-flex h-6 items-center rounded-full bg-[#d7e5fa] px-2 text-[10px] font-bold text-[#20539d]">
              {t("dashboard.scamShield.anonymousReporting")}
            </div>
          </div>
        </aside>
      </div>

      <div className="mt-5 flex flex-wrap items-center justify-between gap-2">
        <Link
          href="/dashboard?view=scamshieldassets"
          className="inline-flex h-10 items-center rounded-full border border-[#d7e0ec] px-5 text-xs font-semibold text-[#334155]"
        >
          {t("common.back")}
        </Link>
        <Link
          href="/dashboard?view=reportsubmissionreview"
          className="inline-flex h-10 items-center rounded-full bg-[#ff8f00] px-6 text-xs font-bold text-white shadow-[0_8px_18px_rgba(255,143,0,0.32)]"
        >
          {t("dashboard.scamShield.submitPackage")}
          <IconChevronRight size={14} className="ml-1" />
        </Link>
      </div>
    </ScamShieldFrame>
  );
}

function ReportStatusChip({ status }: { status: IncidentReportStatus }) {
  const { t } = useTranslation();
  const statusStyles: Record<
    IncidentReportStatus,
    { label: string; className: string; iconWrapClassName: string }
  > = {
    "in-review": {
      label: t("dashboard.reports.statusInReview"),
      className: "bg-[#e8f1ff] text-[#1d72d8]",
      iconWrapClassName: "bg-[#d9e8ff] text-[#1d72d8]",
    },
    submitted: {
      label: t("dashboard.reports.statusSubmitted"),
      className: "bg-[#e8f8ef] text-[#1b8f4b]",
      iconWrapClassName: "bg-[#d7f1e4] text-[#1b8f4b]",
    },
    draft: {
      label: t("dashboard.reports.statusDraft"),
      className: "bg-[#fff3e2] text-[#c97b00]",
      iconWrapClassName: "bg-[#ffe8c7] text-[#c97b00]",
    },
  };

  const styles = statusStyles[status];

  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-[10px] font-bold",
        styles.className
      )}
    >
      <span
        className={cn("h-1.5 w-1.5 rounded-full", styles.iconWrapClassName)}
      />
      {styles.label}
    </span>
  );
}

function ReportsHistoryPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.reports.yourReports")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f8fbff] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <div className="flex flex-col items-center text-center">
            <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#deecff] text-[#1d72d8]">
              <IconFolderFilled size={14} />
            </span>
            <h2 className="mt-2 text-[30px] font-extrabold leading-[1.03] text-[#1f2a3a] sm:text-[36px]">
              {t("dashboard.reports.yourIncidentHistory")}
            </h2>
            <p className="mt-1 text-xs text-[#7b8ca2]">
              {t("dashboard.reports.secureRecords")}
            </p>
          </div>

          <div className="relative mx-auto mt-4 max-w-[760px]">
            <IconSearch
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#9babc0]"
            />
            <input
              type="text"
              placeholder={t("dashboard.reports.searchPlaceholder")}
              className="h-10 w-full rounded-full border border-[#dce6f2] bg-white px-9 text-xs text-[#1f2a3a] outline-none placeholder:text-[#96a7bc] focus:border-[#cbd9ea]"
            />
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <span className="inline-flex rounded-full bg-[#0f5d9f] px-3 py-1 text-[10px] font-bold text-white">
              {t("dashboard.reports.allReports")}
            </span>
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#60728a]">
              {t("dashboard.reports.drafts")}
            </span>
            <span className="inline-flex rounded-full bg-white px-3 py-1 text-[10px] font-semibold text-[#60728a]">
              {t("dashboard.reports.inReview")}
            </span>
          </div>

          <div className="mt-3 space-y-2">
            {incidentReports.map((report) => (
              <Link
                key={report.id}
                href={`/dashboard/reports/${report.id}`}
                className="group flex items-center justify-between rounded-[14px] border border-[#e3ebf5] bg-white p-3 transition hover:border-[#cfddee] hover:shadow-[0_10px_20px_rgba(15,23,42,0.06)]"
              >
                <div className="min-w-0 pr-2">
                  <p className="truncate text-sm font-bold text-[#1f2a3a]">
                    {t(`dashboard.reports.sampleTitles.${report.id}`, {
                      defaultValue: report.title,
                    })}
                  </p>
                  <p className="mt-1 text-[10px] font-medium text-[#74869d]">
                    {report.id} | {report.createdAt}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  <ReportStatusChip status={report.status} />
                  <span className="inline-flex h-8 w-8 items-center justify-center rounded-[9px] bg-[#0f5d9f] text-white transition group-hover:bg-[#0b4f89]">
                    <IconChevronRight size={14} />
                  </span>
                </div>
              </Link>
            ))}
          </div>

          <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-2">
            <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.reports.totalReports")}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#0f5d9f]">12</p>
            </article>
            <article className="rounded-xl border border-[#e2eaf4] bg-white p-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                {t("dashboard.reports.resolvedCases")}
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#1b8f4b]">48</p>
            </article>
          </div>
        </article>
      </div>
    </div>
  );
}

function ReportOverviewPage({ reportId }: { reportId?: string }) {
  const { t } = useTranslation();
  const report = findIncidentReport(reportId);

  const impactLabelKey: Record<IncidentReport["impactLevel"], string> = {
    "High Priority": "dashboard.reports.impactHighPriority",
    Moderate: "dashboard.reports.impactModerate",
    Low: "dashboard.reports.impactLow",
  };

  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/reports"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.reports.reportOverview")}
          </Link>
          <Link
            href="/dashboard"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-[1.55fr_1fr]">
          <article className="rounded-[16px] border border-[#dce5f1] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0f5d9f]">
                  {t("dashboard.reports.incidentNarrative")}
                </p>
                <h2 className="mt-1 text-2xl font-extrabold leading-[1.05] text-[#1f2a3a] sm:text-[30px]">
                  {t(`dashboard.reports.sampleTitles.${report.id}`, {
                    defaultValue: report.title,
                  })}
                </h2>
              </div>
              <span className="inline-flex rounded-full bg-[#ffe8d2] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#c26c00]">
                {t(impactLabelKey[report.impactLevel])}
              </span>
            </div>

            <div className="mt-3 rounded-[12px] border border-[#e2eaf4] bg-[#f8fbff] p-3">
              <p className="text-[11px] font-semibold leading-[1.6] text-[#405368]">
                &ldquo;
                {t(`dashboard.reports.sampleNarratives.${report.id}`, {
                  defaultValue: report.narrative,
                })}
                &rdquo;
              </p>
            </div>

            <div className="mt-3 grid grid-cols-1 gap-2 sm:grid-cols-3">
              <article className="rounded-xl border border-[#e2eaf4] bg-[#f8fbff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {t("dashboard.reports.reportId")}
                </p>
                <p className="mt-1 text-xs font-extrabold text-[#1f2a3a]">
                  {report.id}
                </p>
              </article>
              <article className="rounded-xl border border-[#e2eaf4] bg-[#f8fbff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {t("dashboard.reports.created")}
                </p>
                <p className="mt-1 text-xs font-extrabold text-[#1f2a3a]">
                  {report.createdAt}
                </p>
              </article>
              <article className="rounded-xl border border-[#e2eaf4] bg-[#f8fbff] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {t("dashboard.reports.status")}
                </p>
                <div className="mt-1">
                  <ReportStatusChip status={report.status} />
                </div>
              </article>
            </div>
          </article>

          <aside className="rounded-[16px] border border-[#dce5f1] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.1em] text-[#0f5d9f]">
              {t("dashboard.reports.reportMetadata")}
            </p>

            <div className="mt-2 grid grid-cols-2 gap-2">
              <div className="rounded-lg bg-[#f8fbff] p-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b6]">
                  {t("dashboard.reports.lastUpdate")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  22 Feb
                </p>
              </div>
              <div className="rounded-lg bg-[#f8fbff] p-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b6]">
                  {t("dashboard.reports.supportKey")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  {report.supportKey}
                </p>
              </div>
              <div className="col-span-2 rounded-lg bg-[#f8fbff] p-2">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#8ca0b6]">
                  {t("dashboard.reports.location")}
                </p>
                <p className="mt-1 text-[11px] font-semibold text-[#1f2a3a]">
                  {t(`dashboard.reports.sampleLocations.${report.id}`, {
                    defaultValue: report.location,
                  })}
                </p>
              </div>
            </div>

            <div className="relative mt-3 h-[170px] overflow-hidden rounded-[12px] border border-[#d7e1ee] bg-[#d9e6d2]">
              {localIntelligenceMapSrc ? (
                <iframe
                  title="Report incident map"
                  src={localIntelligenceMapSrc}
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  className="h-full w-full border-0"
                />
              ) : (
                <div className="absolute inset-0 bg-[linear-gradient(130deg,#cfdebf_0%,#e3edd8_45%,#cedebf_100%)]" />
              )}
              <span className="absolute bottom-2 left-2 rounded-full bg-white/95 px-2 py-1 text-[9px] font-bold text-[#334155]">
                {t(`dashboard.reports.sampleLocations.${report.id}`, {
                  defaultValue: report.location,
                })}
              </span>
            </div>

            <div className="mt-3 flex flex-col gap-2">
              <Link
                href="/dashboard?view=reportsubmissiondetails"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
              >
                {t("dashboard.reports.editReport")}
              </Link>
              <Link
                href="/dashboard?view=reportsubmissionreview"
                className="inline-flex h-10 items-center justify-center rounded-full bg-[#f59e0b] px-5 text-xs font-bold text-white shadow-[0_8px_18px_rgba(245,158,11,0.3)]"
              >
                {t("dashboard.reports.proceedToSubmission")}
              </Link>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function MicroEducationPage() {
  const { t } = useTranslation();
  const chips = [
    t("dashboard.microeducation.allLessons"),
    t("dashboard.microeducation.harassment"),
    t("dashboard.microeducation.rights"),
    t("dashboard.microeducation.safety"),
    t("dashboard.microeducation.mentalHealth"),
  ];

  return (
    <div className="px-2 pb-4 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.microeducation.title")}
          </Link>
          <button className="text-xs font-medium text-[#7b8798]">
            {t("common.cancel")}
          </button>
        </div>

        <div className="pt-4">
          <h1 className="text-4xl font-extrabold leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]">
            {t("dashboard.microeducation.headline")}
          </h1>
          <p className="mt-2 max-w-[700px] text-sm leading-[1.45] text-[#5f6f86]">
            {t("dashboard.microeducation.subtitleLine1")}
            <br />
            {t("dashboard.microeducation.subtitleLine2")}
          </p>

          <div className="relative mt-4 max-w-[540px]">
            <IconSearch
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a6b9]"
            />
            <input
              type="text"
              placeholder={t("dashboard.microcards.searchPlaceholder")}
              className="h-10 w-full rounded-full border border-[#dbe5f0] bg-white px-10 text-xs text-[#1f2937] outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <span
                key={chip}
                className={cn(
                  "inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold",
                  index === 0
                    ? "bg-[#3b82f6] text-white"
                    : "bg-white text-[#5f6f86]"
                )}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[400px_712px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#006699] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.home.cyber")}
                </p>
                <h3 className="mt-1 text-[40px] font-extrabold leading-[0.9] text-white">
                  {t("dashboard.microeducation.bullying")}
                </h3>
                <IconShieldFilled
                  size={70}
                  className="text-white/12 absolute bottom-8 right-8"
                />
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#F48C06] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <h3
                  className={`${interFont.className} w-full max-w-[448px] text-[30px] font-black uppercase leading-[1] tracking-[0] text-white sm:text-[36px] sm:leading-[36px]`}
                >
                  {t("dashboard.microeducation.discrimination")}
                </h3>
                <div className="absolute bottom-5 left-5 max-w-[448px] rounded-xl bg-white/20 px-4 py-3 text-[11px] leading-[1.25] text-white/95 sm:bottom-6 sm:left-6 xl:bottom-8 xl:left-8">
                  {t("dashboard.microeducation.discriminationBody")}
                </div>
              </article>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[712px_400px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#10B981] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.microeducation.protection")}
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold uppercase leading-[0.9] text-white">
                  {t("dashboard.explorer.onlineSafety")}
                </h3>
                <p className="mt-2 max-w-[300px] text-xs text-white/90">
                  {t("dashboard.microeducation.onlineSafetyBody")}
                </p>
                <button className="mt-3 inline-flex rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-[#159968]">
                  {t("dashboard.microeducation.getProtected")}
                </button>
                <div className="bg-white/22 absolute right-8 top-1/2 inline-flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-2xl text-white">
                  <IconShieldFilled size={34} />
                </div>
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#f7bd23] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5300]">
                  {t("dashboard.home.legal")}
                </p>
                <h3 className="mt-1 w-full max-w-[336px] text-[36px] font-extrabold leading-[0.9] text-[#111827]">
                  {t("dashboard.microeducation.migrantStudentRights")}
                </h3>
                <IconFolderFilled
                  size={36}
                  className="absolute bottom-8 right-8 text-[#cf9f1a]"
                />
              </article>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[656px_456px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#8157e8] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.microeducation.mental")}
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                  {t("dashboard.microeducation.mentalHealthTitle")}
                </h3>
                <div className="pointer-events-none absolute bottom-8 left-8">
                  <Image
                    src={mentalHealth}
                    alt="Mental health circle"
                    width={48}
                    height={48}
                    className="h-12 w-12 opacity-45"
                  />
                  <Image
                    src={mentalHealth2}
                    alt="Mental health circle overlap"
                    width={48}
                    height={48}
                    className="absolute left-8 top-0 h-12 w-12 opacity-45"
                  />
                </div>
                <Image
                  src={mentalHealthLove}
                  alt="Mental health love icon"
                  width={28}
                  height={28}
                  className="absolute bottom-8 right-8 h-7 w-7"
                />
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#1c9d8f] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  {t("dashboard.microeducation.fundamentals")}
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                  {t("dashboard.microeducation.legalAidBasics")}
                </h3>
                <button className="absolute bottom-8 right-8 rounded-full bg-[#0b7f73] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  {t("dashboard.microeducation.startNow")}
                </button>
              </article>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

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
        "group relative min-h-[160px] overflow-hidden rounded-[14px] border border-white/20",
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

function ExplorerPage() {
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

type NotificationFeedItem = {
  id: string;
  title: string;
  subtitle: string;
  time?: string;
  highlighted?: boolean;
};

function NotificationsPage({ view }: { view: NotificationView }) {
  const { t } = useTranslation();

  const todayFeedItems: NotificationFeedItem[] = [
    {
      id: "n1",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      highlighted: true,
    },
    {
      id: "n2",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: "10:30 AM",
    },
    {
      id: "n3",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: "9:15 AM",
    },
    {
      id: "n4",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: t("dashboard.notifications.yesterday"),
    },
    {
      id: "n5",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 8,
      }),
      time: t("dashboard.notifications.yesterday"),
    },
  ];
  const pastFeedItems: NotificationFeedItem[] = [
    {
      id: "p1",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 4,
      }),
      time: "Feb 18",
    },
    {
      id: "p2",
      title: t("dashboard.notifications.weeklySummary"),
      subtitle: t("dashboard.notifications.weeklySummarySubtitle"),
      time: "Feb 17",
    },
    {
      id: "p3",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 2,
      }),
      time: "Feb 16",
    },
    {
      id: "p4",
      title: t("dashboard.notifications.timelineReminder"),
      subtitle: t("dashboard.notifications.timelineReminderSubtitle"),
      time: "Feb 15",
    },
    {
      id: "p5",
      title: t("dashboard.notifications.unreadMessagesTitle"),
      subtitle: t("dashboard.notifications.unreadMessagesSubtitle", {
        count: 1,
      }),
      time: "Feb 14",
    },
  ];
  const isToday = view === "today";
  const feedItems = isToday ? todayFeedItems : pastFeedItems;

  return (
    <div className="px-3 pb-8 sm:px-6 xl:px-6">
      <div className="mx-auto w-full max-w-[1184px]">
        <div className="flex items-center justify-between bg-[#f1f3f7] px-4 py-3">
          <div className="inline-flex items-center gap-2 text-sm font-bold text-[#1f2a3a]">
            <IconChevronLeft size={16} />
            {t("dashboard.notifications.notification")}
          </div>
          <button className="text-sm font-medium text-[#6f8096]">
            {t("common.cancel")}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-2 sm:gap-3">
          <Link
            href={{
              pathname: "/dashboard/notifications",
              query: { view: "today" },
            }}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl text-sm transition",
              isToday
                ? "bg-[#04589f] font-bold text-white shadow-[0_6px_16px_rgba(4,88,159,0.25)]"
                : "border border-[#e4e9f1] bg-[#f7f8fc] font-semibold text-[#0f4f96]"
            )}
          >
            {t("dashboard.notifications.today")}
          </Link>
          <Link
            href={{
              pathname: "/dashboard/notifications",
              query: { view: "past" },
            }}
            className={cn(
              "inline-flex h-11 items-center justify-center rounded-xl text-sm transition",
              !isToday
                ? "bg-[#04589f] font-bold text-white shadow-[0_6px_16px_rgba(4,88,159,0.25)]"
                : "border border-[#e4e9f1] bg-[#f7f8fc] font-semibold text-[#0f4f96]"
            )}
          >
            {t("dashboard.notifications.past")}
          </Link>
        </div>

        <div className="mt-4 space-y-3">
          {feedItems.map((item, index) => (
            <article
              key={item.id}
              className={cn(
                "relative flex min-h-[64px] items-center rounded-2xl px-4 py-3",
                item.highlighted
                  ? "bg-[#f48600] text-white shadow-[0_8px_22px_rgba(244,134,0,0.35)]"
                  : "bg-[#e9e6f2] text-[#1f2a3a]"
              )}
            >
              {index === 0 && (
                <span className="absolute -left-9 top-1/2 hidden h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#e94242] xl:block" />
              )}

              <span
                className={cn(
                  "relative mr-3 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full",
                  item.highlighted
                    ? "bg-[#f8a337] text-white"
                    : "bg-[#f7f7fb] text-[#2a3342]"
                )}
              >
                {item.highlighted ? (
                  <>
                    <IconBellFilled size={14} />
                    <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-[#ffb861]" />
                  </>
                ) : (
                  <IconBoltFilled size={14} />
                )}
              </span>

              <div className="min-w-0">
                <p className="truncate text-sm font-bold">{item.title}</p>
                <p
                  className={cn(
                    "mt-0.5 text-xs",
                    item.highlighted ? "text-white/90" : "text-[#7c8699]"
                  )}
                >
                  {item.subtitle}
                </p>
              </div>

              {item.time && (
                <span className="ml-auto pl-3 text-[10px] font-medium text-[#98a3b6]">
                  {item.time}
                </span>
              )}
            </article>
          ))}
        </div>

        <button className="mx-auto mt-4 inline-flex w-full items-center justify-center gap-1 text-xs font-medium text-[#6e7f95]">
          {t("dashboard.notifications.viewEarlier")}
          <IconChevronDown size={12} />
        </button>
      </div>
    </div>
  );
}

function SettingsQuickCard({
  icon,
  title,
  subtitle,
  actionLabel,
  subtitleClassName,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionLabel: string;
  subtitleClassName?: string;
}) {
  return (
    <article className="rounded-[18px] border border-[#dbe4f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-5">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#1d72d8]">
        {icon}
      </div>
      <h3 className="mt-3 text-[22px] font-bold leading-tight text-[#1f2a3a]">
        {title}
      </h3>
      <p className={cn("mt-1 text-xs text-[#6a7d94]", subtitleClassName)}>
        {subtitle}
      </p>
      <button className="mt-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#1d72d8]">
        {actionLabel}
      </button>
    </article>
  );
}

function SettingsPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]">
            <IconChevronLeft size={14} />
            {t("dashboard.settings.profileSettings")}
          </div>
          <button className="text-xs font-medium text-[#7b8798]">
            {t("common.cancel")}
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-4xl font-extrabold leading-[0.9] text-[#0f4f96] sm:text-5xl">
            {t("dashboard.settings.heyAlex")}
          </h1>
          <p className="mt-1 text-sm text-[#6a7d94]">
            {t("dashboard.settings.secureSpace")}
          </p>
        </div>

        <article className="relative mt-4 overflow-hidden rounded-[22px] bg-[#0e5d9f] p-5 text-white shadow-[0_16px_34px_rgba(14,93,159,0.26)] sm:p-6">
          <div className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#2f7cb6]/45" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[28px] font-bold leading-tight sm:text-[34px]">
                {t("dashboard.settings.culturalFaithProfile")}
              </h2>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                <IconHomeFilled size={12} />
                Muslim
              </p>
              <p className="mt-3 max-w-[580px] text-xs leading-[1.45] text-white/80">
                {t("dashboard.settings.culturalPreference")}
              </p>
            </div>

            <button className="inline-flex h-11 items-center justify-center gap-1 rounded-full bg-white px-6 text-sm font-bold text-[#0e5d9f] shadow-[0_8px_20px_rgba(6,46,80,0.22)] sm:shrink-0">
              {t("dashboard.settings.change")}
              <IconChevronRight size={14} />
            </button>
          </div>
        </article>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <SettingsQuickCard
            icon={<IconCompassFilled size={17} />}
            title={t("dashboard.settings.language")}
            subtitle={t("dashboard.settings.english")}
            actionLabel={t("dashboard.settings.update")}
          />
          <SettingsQuickCard
            icon={<IconShieldFilled size={16} />}
            title={t("dashboard.settings.emailSecurity")}
            subtitle={t("dashboard.settings.activeSecure")}
            subtitleClassName="text-[#16914a] font-semibold"
            actionLabel={t("dashboard.settings.manage")}
          />
          <SettingsQuickCard
            icon={<IconSettingsFilled size={16} />}
            title={t("dashboard.settings.accountSettings")}
            subtitle={t("dashboard.settings.manageProfileDetails")}
            actionLabel={t("dashboard.settings.editProfile")}
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
          <article className="relative overflow-hidden rounded-[18px] border border-[#dbe4f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#1d72d8]">
              <IconSearch size={15} />
            </div>
            <h3 className="mt-3 text-[22px] font-bold leading-tight text-[#1f2a3a]">
              {t("dashboard.settings.faqs")}
            </h3>
            <p className="mt-1 max-w-[240px] text-xs text-[#6a7d94]">
              {t("dashboard.settings.faqDescription")}
            </p>
            <button className="mt-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#1d72d8]">
              {t("dashboard.settings.viewAll")}
            </button>
            <span className="pointer-events-none absolute -bottom-7 right-4 text-[86px] font-extrabold leading-none text-[#e3e9f2]">
              ?
            </span>
          </article>

          <article className="rounded-[18px] border border-[#dbe4f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-5 xl:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7e6f3] text-[#dd2c8b]">
                  <IconMicrophone size={16} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[22px] font-bold leading-tight text-[#1f2a3a]">
                    {t("dashboard.settings.helpSupport")}
                  </h3>
                  <p className="mt-1 text-xs text-[#6a7d94]">
                    {t("dashboard.settings.helpSupportDescription")}
                  </p>
                </div>
              </div>

              <Link
                href={{
                  pathname: "/dashboard/settings",
                  query: { view: "support" },
                }}
                className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#0f5d9f] px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
              >
                {t("dashboard.settings.chatNow")}
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-3 flex justify-end">
          <Link
            href="/dashboard/settings/privacy-policy"
            className="inline-flex h-10 items-center rounded-full border border-[#d6e0ec] bg-white px-5 text-xs font-semibold text-[#0f5d9f] transition hover:bg-[#f7fbff]"
          >
            {t("footer.privacyPolicy")}
          </Link>
        </div>
      </div>
    </div>
  );
}

function SettingsSupportPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.settings.profileSettings")}
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="flex flex-col items-center px-2 pb-3 pt-7 sm:pt-10">
          <div className="relative h-[102px] w-[102px] sm:h-[128px] sm:w-[128px]">
            <Image
              src={safeReporting}
              alt="Help and support"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="mt-4 text-center text-[30px] font-bold leading-[1.05] text-[#ff9800] sm:text-[36px]">
            {t("dashboard.settings.supportHeading")}
          </h2>
          <p className="mt-1 text-center text-xs text-[#95a3b6]">
            {t("dashboard.settings.supportSubheading")}
          </p>

          <form className="mt-5 w-full rounded-[16px] border border-[#dde6f1] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
            <div>
              <label
                htmlFor="support-title"
                className="text-[11px] font-semibold text-[#374151]"
              >
                {t("dashboard.settings.supportTitleLabel")}
              </label>
              <input
                id="support-title"
                type="text"
                placeholder={t("dashboard.settings.supportTitlePlaceholder")}
                className="mt-2 h-10 w-full rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] px-3 text-xs text-[#1f2937] outline-none placeholder:text-[#9ca3af] focus:border-[#cfd8e3]"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="support-message"
                className="text-[11px] font-semibold text-[#374151]"
              >
                {t("dashboard.settings.supportMessageLabel")}
              </label>
              <textarea
                id="support-message"
                rows={6}
                placeholder={t("dashboard.settings.supportMessagePlaceholder")}
                className="mt-2 w-full resize-none rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#1f2937] outline-none placeholder:text-[#9ca3af] focus:border-[#cfd8e3]"
              />
            </div>

            <button className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1 rounded-[12px] bg-[#ff9800] text-xs font-bold text-white shadow-[0_8px_20px_rgba(255,152,0,0.33)]">
              {t("dashboard.settings.send")}
              <IconChevronRight size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

function SettingsPrivacyPolicyPage() {
  const { t } = useTranslation();
  const policyItems = [
    t("dashboard.settings.privacyItems.0"),
    t("dashboard.settings.privacyItems.1"),
    t("dashboard.settings.privacyItems.2"),
    t("dashboard.settings.privacyItems.3"),
    t("dashboard.settings.privacyItems.4"),
  ];

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.settings.privacyPolicyTitle")}
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-4 rounded-[10px] border border-[#e1e8f2] bg-white px-4 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-6 sm:py-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b97a8]">
            {t("dashboard.settings.privacyEffectiveDate")}
          </p>
          <h2 className="mt-2 text-center text-[34px] font-extrabold leading-[1.04] text-[#1f2a3a] sm:text-[40px]">
            {t("dashboard.settings.privacyAgreement")}
          </h2>
          <p className="mx-auto mt-2 max-w-[760px] text-center text-xs leading-[1.6] text-[#6a7d94]">
            {t("dashboard.settings.privacyIntro")}
          </p>

          <div className="mt-6 space-y-3">
            {policyItems.map((item, index) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf2ff] text-[10px] font-bold text-[#1d72d8]">
                  {index + 1}
                </span>
                <p className="text-sm leading-[1.65] text-[#42546b]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/dashboard/settings"
              className="inline-flex h-10 items-center rounded-lg border border-[#d8e0eb] bg-white px-5 text-xs font-semibold text-[#42546b] transition hover:bg-[#f8fafd]"
            >
              {t("dashboard.settings.decline")}
            </Link>
            <Link
              href="/dashboard/settings"
              className="inline-flex h-10 items-center rounded-lg bg-[#ef4444] px-5 text-xs font-bold text-white transition hover:bg-[#dc2626]"
            >
              {t("dashboard.settings.acceptContinue")}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}

function DashboardShell({
  activeTab,
  homeView,
  children,
}: {
  activeTab: DashboardTab;
  homeView?: HomeView;
  children: React.ReactNode;
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
    homeView === "reportsubmissiondetails" ||
    homeView === "reportsubmissionevidence" ||
    homeView === "reportsubmissionreview" ||
    homeView === "reportsubmissionsuccess";

  const sectionSizeClass =
    activeTab === "notifications"
      ? "xl:h-[749px] xl:w-[1184px]"
      : activeTab === "home" && isIncidentBuilderView
        ? "xl:h-[868.68px] xl:w-[1184px]"
        : "xl:min-h-[1498px] xl:w-[1184px]";

  return (
    <div
      className={`${pageFont.className} mx-auto flex min-h-screen w-full overflow-x-hidden bg-[#eef3f8] xl:max-w-[1440px] 2xl:max-w-[1536px]`}
    >
      <Sidebar activeTab={activeTab} />

      <section
        className={cn(
          "flex-1 p-2 sm:p-3 md:p-4 xl:flex-none",
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

export default function DashboardScreen({
  activeTab,
  homeView = "overview",
  notificationsView = "today",
  settingsView = "overview",
  assistantRecording = false,
  assistantMessage,
  reportId,
}: {
  activeTab: DashboardTab;
  homeView?: HomeView;
  notificationsView?: NotificationView;
  settingsView?: SettingsView;
  assistantRecording?: boolean;
  assistantMessage?: string;
  reportId?: string;
}) {
  let page: React.ReactNode;

  if (activeTab === "home") {
    page =
      homeView === "microeducation" ? (
        <MicroEducationPage />
      ) : homeView === "microcards" ? (
        <MicroCardsPage />
      ) : homeView === "microcarddetail" ? (
        <MicroCardDetailPage />
      ) : homeView === "assistantconversation" ? (
        <SafeSpeakAssistantConversationPage initialMessage={assistantMessage} />
      ) : homeView === "assistant" ? (
        <SafeSpeakAssistantPage isRecording={assistantRecording} />
      ) : homeView === "scamshieldintake" ? (
        <ScamShieldIntakePage />
      ) : homeView === "scamshieldrisk" ? (
        <ScamShieldRiskPage />
      ) : homeView === "scamshieldassets" ? (
        <ScamShieldAssetsPage />
      ) : homeView === "scamshieldagency" ? (
        <ScamShieldAgencyPage />
      ) : homeView === "reportshistory" ? (
        <ReportsHistoryPage />
      ) : homeView === "reportoverview" ? (
        <ReportOverviewPage reportId={reportId} />
      ) : homeView === "reportsubmissionsupport" ? (
        <ReportSubmissionSupportPage />
      ) : homeView === "reportsubmissiondetails" ? (
        <ReportSubmissionDetailsPage />
      ) : homeView === "reportsubmissionevidence" ? (
        <ReportSubmissionEvidencePage />
      ) : homeView === "reportsubmissionreview" ? (
        <ReportSubmissionReviewPage />
      ) : homeView === "reportsubmissionsuccess" ? (
        <ReportSubmissionSuccessPage />
      ) : (
        <HomeDashboardPage />
      );
  } else if (activeTab === "explorer") {
    page = <ExplorerPage />;
  } else if (activeTab === "notifications") {
    page = <NotificationsPage view={notificationsView} />;
  } else {
    page =
      settingsView === "support" ? (
        <SettingsSupportPage />
      ) : settingsView === "privacy" ? (
        <SettingsPrivacyPolicyPage />
      ) : (
        <SettingsPage />
      );
  }

  return (
    <DashboardShell activeTab={activeTab} homeView={homeView}>
      {page}
    </DashboardShell>
  );
}
