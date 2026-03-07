"use client";

import { useEffect, useMemo, useState } from "react";

import { usePathname } from "next/navigation";
import { IconLanguage, IconShieldFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n";
import {
  COVERT_MODE_KEY,
  EMERGENCY_NUMBER,
  SUPPORT_NUMBER_DIAL,
  SUPPORT_NUMBER_DISPLAY,
  triggerQuickExit,
} from "@/lib/safety";

function isHiddenRoute(pathname: string): boolean {
  return pathname.startsWith("/neutral");
}

export function SafetyRail() {
  const pathname = usePathname();
  const { i18n } = useTranslation();
  const [isCovertModeActive, setIsCovertModeActive] = useState(false);

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

  return (
    <aside
      aria-label="Safety controls"
      className="fixed bottom-3 left-1/2 z-[110] w-[calc(100%-1rem)] max-w-[980px] -translate-x-1/2"
    >
      <div className="rounded-2xl border border-[#1f2937]/50 bg-[#0b1725]/95 px-3 py-3 text-white shadow-[0_14px_30px_rgba(0,0,0,0.35)] sm:px-4">
        <p className="text-[11px] font-semibold leading-4 text-white/90">
          Safety reminder: If you are in immediate danger, call{" "}
          {EMERGENCY_NUMBER}. If safe, contact {SUPPORT_NUMBER_DISPLAY} (24/7).
          Information only, not legal advice.
        </p>

        <div className="mt-2 flex flex-wrap items-center gap-2">
          <a
            href={`tel:${EMERGENCY_NUMBER}`}
            className="inline-flex h-10 items-center rounded-full bg-[#dc2626] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
          >
            Emergency {EMERGENCY_NUMBER}
          </a>
          <a
            href={`tel:${SUPPORT_NUMBER_DIAL}`}
            className="inline-flex h-10 items-center rounded-full bg-[#0f5d9f] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
          >
            {SUPPORT_NUMBER_DISPLAY}
          </a>
          <button
            type="button"
            onClick={triggerQuickExit}
            className="inline-flex h-10 items-center rounded-full bg-[#111827] px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
          >
            Quick Exit
          </button>
          <button
            type="button"
            onClick={() => void toggleLanguage()}
            className="inline-flex h-10 items-center gap-1 rounded-full border border-white/35 bg-transparent px-3 text-[10px] font-bold uppercase tracking-[0.08em] text-white"
            aria-label="Toggle language"
          >
            <IconLanguage size={12} />
            {currentLanguage}
          </button>
          <span className="inline-flex h-10 items-center gap-1 rounded-full border border-[#35a463]/40 bg-[#0b2a1f] px-3 text-[10px] font-semibold uppercase tracking-[0.08em] text-[#9de6ba]">
            <IconShieldFilled size={11} />
            {isCovertModeActive ? "Covert mode on" : "Covert mode ready"}
          </span>
        </div>
      </div>
    </aside>
  );
}
