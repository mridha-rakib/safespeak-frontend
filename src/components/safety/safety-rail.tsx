"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  IconAlertCircleFilled,
  IconChevronUp,
  IconLanguage,
  IconShieldFilled,
  IconX,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import type { PlatformSettingsPayload } from "@/lib/platform-settings";
import {
  COVERT_MODE_KEY,
  EMERGENCY_NUMBER,
  SUPPORT_NUMBER_DIAL,
  triggerQuickExit,
} from "@/lib/safety";

function isHiddenRoute(pathname: string): boolean {
  return pathname.startsWith("/neutral");
}

function isDashboardRoute(pathname: string): boolean {
  return pathname.startsWith("/dashboard");
}

type SafetyRailProps = {
  platformSettings: PlatformSettingsPayload;
};

export function SafetyRail({ platformSettings }: SafetyRailProps) {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const [isCovertModeActive, setIsCovertModeActive] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);
  const safetyCopy = platformSettings.safety;

  useEffect(() => {
    if (typeof window === "undefined") return;

    const covertMode = window.sessionStorage.getItem(COVERT_MODE_KEY) === "1";
    setIsCovertModeActive(covertMode);
  }, [pathname]);

  const currentLanguage = useMemo(() => {
    const language = i18n.resolvedLanguage ?? i18n.language;
    return language === "es" ? "ES" : "EN";
  }, [i18n.language, i18n.resolvedLanguage]);

  const toggleLanguage = async () => {
    const nextLanguage = currentLanguage === "EN" ? "es" : "en";
    await i18n.changeLanguage(nextLanguage);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, nextLanguage);
    document.documentElement.lang = nextLanguage;
  };

  if (isHiddenRoute(pathname)) return null;

  const isDashboard = isDashboardRoute(pathname);
  const railClassName = isDashboard
    ? "dashboard-safety-rail fixed z-[110]"
    : "fixed bottom-3 left-1/2 z-[110] w-[calc(100%-1rem)] max-w-[980px] -translate-x-1/2";
  const minimizedClassName = isDashboard
    ? "dashboard-safety-minimized fixed z-[110]"
    : "fixed bottom-3 right-3 z-[110]";

  if (isMinimized) {
    return (
      <aside
        aria-label="Minimized safety controls"
        className={minimizedClassName}
      >
        <button
          type="button"
          onClick={() => setIsMinimized(false)}
          aria-label="Expand emergency safety controls"
          aria-expanded="false"
          className="group flex max-w-[calc(100vw-1.5rem)] items-center gap-3 rounded-2xl border border-[#233449]/70 bg-[#0b1725]/95 px-3 py-2.5 text-left text-white shadow-[0_14px_30px_rgba(0,0,0,0.35)] transition hover:-translate-y-0.5 hover:bg-[#102033] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15] sm:px-4"
        >
          <span className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-[#dc2626]">
            <IconAlertCircleFilled size={18} />
          </span>
          <span className="min-w-0">
            <span className="block text-[11px] font-black uppercase tracking-[0.12em] text-[#facc15]">
              Emergency
            </span>
            <span className="block truncate text-[12px] font-bold text-white">
              000 / {safetyCopy.respectCallLabel}
            </span>
          </span>
          <IconChevronUp
            size={16}
            className="shrink-0 text-white/70 transition group-hover:text-white"
            aria-hidden="true"
          />
        </button>
      </aside>
    );
  }

  return (
    <>
      <aside aria-label="Safety controls" className={railClassName}>
        <div className="relative rounded-2xl border border-[#1f2937]/50 bg-[#0b1725]/95 px-3 py-2 pr-12 text-white shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:px-4 sm:py-3 sm:pr-14">
          <button
            type="button"
            onClick={() => setIsMinimized(true)}
            aria-label="Minimize emergency safety controls"
            aria-expanded="true"
            className="absolute right-2 top-2 inline-flex h-8 w-8 items-center justify-center rounded-full border border-white/15 bg-white/10 text-white transition hover:bg-white/20 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#facc15] sm:right-3 sm:top-3"
          >
            <IconX size={15} aria-hidden="true" />
          </button>

          <div className="flex items-center justify-between gap-3 sm:hidden">
            <div>
              <p className="text-[11px] font-black uppercase tracking-[0.12em] text-[#facc15]">
                In an Emergency
              </p>
              <p className="mt-0.5 text-[11px] font-semibold leading-4 text-white/80">
                Safety info only. Use quick exit if needed.
              </p>
            </div>
            <span className="inline-flex shrink-0 items-center gap-1 rounded-full border border-[#35a463]/40 bg-[#0b2a1f] px-2.5 py-1.5 text-[11px] font-semibold uppercase tracking-[0.06em] text-[#9de6ba]">
              <IconShieldFilled size={11} />
              {isCovertModeActive ? "On" : "Ready"}
            </span>
          </div>

          <div className="hidden flex-col gap-2 sm:flex">
            <p className="text-[10px] font-black uppercase tracking-[0.14em] text-[#facc15]">
              In an Emergency
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center rounded-full bg-[#7f1d1d]/70 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                Emergency Services: {EMERGENCY_NUMBER}
              </span>
              <span className="inline-flex items-center rounded-full bg-[#0f5d9f]/65 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                Domestic Violence Support: {safetyCopy.respectCallLabel} (24/7)
              </span>
            </div>
            <p className="max-w-3xl text-[11px] font-semibold leading-4 text-white/90">
              {safetyCopy.platformRoleText}
            </p>
            <p className="max-w-3xl text-[11px] leading-4 text-white/80">
              {safetyCopy.informationOnlyText}
            </p>
          </div>

          <div className="mt-2 grid grid-cols-4 gap-2 sm:mt-3 sm:flex sm:flex-wrap sm:items-center">
            <a
              href={`tel:${EMERGENCY_NUMBER}`}
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#dc2626] px-2 text-[11px] font-bold uppercase tracking-[0.04em] text-white sm:h-10 sm:px-3 sm:text-[10px] sm:tracking-[0.08em]"
              aria-label="Call emergency services on 000"
            >
              <span className="hidden sm:inline">Emergency </span>
              {EMERGENCY_NUMBER}
            </a>
            <a
              href={`tel:${SUPPORT_NUMBER_DIAL}`}
              aria-label={`Call ${safetyCopy.respectCallLabel}`}
              className="inline-flex h-9 min-w-0 items-center justify-center overflow-hidden rounded-full bg-[#0f5d9f] px-2 text-[11px] font-bold uppercase tracking-[0.04em] text-white sm:h-10 sm:px-3 sm:text-[10px] sm:tracking-[0.08em]"
            >
              <span className="truncate sm:hidden">Respect</span>
              <span className="hidden sm:inline">
                {safetyCopy.respectCallLabel}
              </span>
            </a>
            <Link
              href="/dashboard?view=smartdialler"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#1d4ed8] px-2 text-[11px] font-bold uppercase tracking-[0.04em] text-white sm:h-10 sm:px-3 sm:text-[10px] sm:tracking-[0.08em]"
              aria-label="Open Smart Dialler"
            >
              Smart Dialler
            </Link>
            <button
              type="button"
              onClick={triggerQuickExit}
              className="inline-flex h-9 min-w-0 items-center justify-center overflow-hidden rounded-full bg-[#111827] px-2 text-[11px] font-bold uppercase tracking-[0.04em] text-white sm:h-10 sm:px-3 sm:text-[10px] sm:tracking-[0.08em]"
              aria-label="Quick Exit to neutral page"
            >
              <span className="truncate">{safetyCopy.quickExitLabel}</span>
            </button>
            <button
              type="button"
              onClick={() => void toggleLanguage()}
              className="inline-flex h-9 items-center justify-center gap-1 rounded-full border border-white/35 bg-transparent px-2 text-[11px] font-bold uppercase tracking-[0.04em] text-white sm:h-10 sm:px-3 sm:text-[10px] sm:tracking-[0.08em]"
              aria-label="Toggle language"
            >
              <IconLanguage size={12} />
              {currentLanguage}
            </button>
            <span className="hidden h-10 items-center gap-1 rounded-full border border-[#35a463]/40 bg-[#0b2a1f] px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9de6ba] sm:inline-flex">
              <IconShieldFilled size={11} />
              {isCovertModeActive
                ? "Covert mode on"
                : safetyCopy.covertModeLabel}
            </span>
          </div>
        </div>
      </aside>
    </>
  );
}
