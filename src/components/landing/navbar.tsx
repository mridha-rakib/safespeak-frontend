"use client";

import { Inter } from "next/font/google";
import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";

import { IconChevronDown } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { SafeSpeakLogo } from "@/components/ui/safe-speak-logo";
import {
  DEFAULT_LANGUAGE,
  LANGUAGE_OPTIONS,
  LANGUAGE_STORAGE_KEY,
  type SupportedLanguage,
  isSupportedLanguage,
} from "@/lib/i18n";

const LANGUAGE_FLAGS: Record<SupportedLanguage, string> = {
  en: "🇺🇸",
  es: "🇪🇸",
};

const interExtraBold = Inter({
  subsets: ["latin"],
  weight: ["800"],
});

export default function LandingNavbar() {
  const { t, i18n } = useTranslation();
  const [isLanguageMenuOpen, setIsLanguageMenuOpen] = useState(false);
  const languageMenuRef = useRef<HTMLDivElement | null>(null);

  const currentLanguage = useMemo<SupportedLanguage>(() => {
    const resolvedLanguage =
      i18n.resolvedLanguage ?? i18n.language ?? DEFAULT_LANGUAGE;
    return isSupportedLanguage(resolvedLanguage)
      ? resolvedLanguage
      : DEFAULT_LANGUAGE;
  }, [i18n.language, i18n.resolvedLanguage]);

  const activeLanguage = useMemo(() => {
    return (
      LANGUAGE_OPTIONS.find((option) => option.code === currentLanguage) ??
      LANGUAGE_OPTIONS[0]
    );
  }, [currentLanguage]);

  const links = useMemo(
    () => [
      { label: t("navbar.links.whatIsSafeSpeak"), href: "#" },
      { label: t("navbar.links.whatYouCanDoWithSafeSpeak"), href: "#" },
      { label: t("navbar.links.contactUs"), href: "#" },
    ],
    [t]
  );

  useEffect(() => {
    const handleOutsideClick = (event: MouseEvent) => {
      if (
        languageMenuRef.current &&
        !languageMenuRef.current.contains(event.target as Node)
      ) {
        setIsLanguageMenuOpen(false);
      }
    };

    document.addEventListener("mousedown", handleOutsideClick);
    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, []);

  useEffect(() => {
    document.documentElement.lang = currentLanguage;
  }, [currentLanguage]);

  const handleLanguageChange = async (language: SupportedLanguage) => {
    await i18n.changeLanguage(language);
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, language);
    setIsLanguageMenuOpen(false);
  };

  return (
    <header className="bg-[#01579B]">
      <div className="mx-auto w-full max-w-[1200px] px-4 sm:px-6 md:px-8 lg:px-10 xl:px-0">
        <div className="flex h-[72px] items-center justify-between gap-3 sm:h-[84px] lg:h-[96px] xl:h-[112.34px] xl:gap-8">
          <Link href="/" className="inline-flex items-center">
            <SafeSpeakLogo tone="light" size="sm" />
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-4 lg:gap-6 xl:gap-10">
            {links.map((item) => (
              <a
                key={item.label}
                href={item.href}
                className="nav-link text-xs lg:text-sm xl:text-[15px]"
              >
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 lg:h-[48px] lg:justify-end lg:gap-3">
            <a
              href="/login"
              className="inline-flex h-9 items-center justify-center rounded-full bg-[#ff8f00] px-5 text-xs font-bold text-[#0b3152] shadow-[0_10px_24px_rgba(255,143,0,0.35)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_28px_rgba(255,143,0,0.42)] lg:h-[38px] lg:w-[96px] lg:px-0"
            >
              {t("navbar.login")}
            </a>

            <div className="relative hidden lg:block" ref={languageMenuRef}>
              <button
                type="button"
                onClick={() => setIsLanguageMenuOpen((value) => !value)}
                className="inline-flex items-center justify-center gap-2 rounded-full px-2 py-1 text-white transition hover:text-white/85"
                aria-expanded={isLanguageMenuOpen}
                aria-label={t("navbar.language.chooseLanguage")}
              >
                <span aria-hidden className="text-base leading-none">
                  {LANGUAGE_FLAGS[activeLanguage.code]}
                </span>
                <span
                  className={`${interExtraBold.className} inline-flex h-[28px] ${
                    activeLanguage.code === "en" ? "w-[51px]" : "w-auto"
                  } items-center align-middle text-[13.6px] font-extrabold leading-[28px] tracking-[0.15px]`}
                >
                  {t(activeLanguage.labelKey)}
                </span>
                <IconChevronDown
                  size={18}
                  className={`transition-transform duration-150 ${isLanguageMenuOpen ? "rotate-180" : ""}`}
                />
              </button>

              {isLanguageMenuOpen ? (
                <div className="absolute right-0 top-[calc(100%+8px)] z-20 w-[172px] rounded-2xl border border-white/20 bg-[#01579B] p-1.5 shadow-[0_16px_30px_rgba(0,0,0,0.3)]">
                  {LANGUAGE_OPTIONS.map((option) => {
                    const isActive = option.code === currentLanguage;

                    return (
                      <button
                        key={option.code}
                        type="button"
                        onClick={() => void handleLanguageChange(option.code)}
                        className={`flex w-full items-center gap-2 rounded-xl px-3 py-2 text-left text-sm font-semibold transition ${
                          isActive
                            ? "bg-white/15 text-white"
                            : "text-white/85 hover:bg-white/10 hover:text-white"
                        }`}
                      >
                        <span aria-hidden className="text-base leading-none">
                          {LANGUAGE_FLAGS[option.code]}
                        </span>
                        <span>{t(option.labelKey)}</span>
                      </button>
                    );
                  })}
                </div>
              ) : null}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
