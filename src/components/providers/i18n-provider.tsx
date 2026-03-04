"use client";

import { PropsWithChildren, useEffect } from "react";

import i18n, {
  DEFAULT_LANGUAGE,
  LANGUAGE_STORAGE_KEY,
  isSupportedLanguage,
} from "@/lib/i18n";

export function I18nProvider({ children }: PropsWithChildren) {
  useEffect(() => {
    const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);

    if (savedLanguage && isSupportedLanguage(savedLanguage)) {
      void i18n.changeLanguage(savedLanguage);
      document.documentElement.lang = savedLanguage;
      return;
    }

    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, DEFAULT_LANGUAGE);
    document.documentElement.lang = DEFAULT_LANGUAGE;
  }, []);

  return <>{children}</>;
}
