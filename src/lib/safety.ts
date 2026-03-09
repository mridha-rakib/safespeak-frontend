import { clearAuthSession } from "@/lib/auth";
import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n";

export const SAFETY_GATE_ACK_KEY = "safespeak_safety_gate_ack";
export const COVERT_MODE_KEY = "safespeak_covert_mode";
export const EMERGENCY_NUMBER = "000";
export const SUPPORT_NUMBER_DISPLAY = "1800RESPECT";
export const SUPPORT_NUMBER_DIAL = "1800737732";
export const NEUTRAL_ROUTE = "/neutral";
export const QUICK_EXIT_BODY_CLASS = "quick-exit-active";

const DEFAULT_DOCUMENT_TITLE = "SafeSpeak";
const COVERT_DOCUMENT_TITLE = "Calculator";
const DEFAULT_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Ctext y='.9em' font-size='90'%3ES%3C/text%3E%3C/svg%3E";
const COVERT_FAVICON =
  "data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 64 64'%3E%3Crect x='8' y='6' width='48' height='52' rx='10' fill='%23e2e8f0'/%3E%3Crect x='16' y='14' width='32' height='10' rx='4' fill='%2394a3b8'/%3E%3Cg fill='%2364748b'%3E%3Crect x='16' y='30' width='8' height='8' rx='2'/%3E%3Crect x='28' y='30' width='8' height='8' rx='2'/%3E%3Crect x='40' y='30' width='8' height='8' rx='2'/%3E%3Crect x='16' y='42' width='8' height='8' rx='2'/%3E%3Crect x='28' y='42' width='20' height='8' rx='2'/%3E%3C/g%3E%3C/svg%3E";

function telUri(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
}

function setFavicon(href: string): void {
  if (typeof document === "undefined") return;

  let faviconLink = document.querySelector<HTMLLinkElement>("link[rel='icon']");

  if (!faviconLink) {
    faviconLink = document.createElement("link");
    faviconLink.rel = "icon";
    document.head.appendChild(faviconLink);
  }

  faviconLink.href = href;
}

function setDocumentShell(title: string, favicon: string, blurActive: boolean): void {
  if (typeof document === "undefined") return;

  document.title = title;
  setFavicon(favicon);
  document.body.classList.toggle(QUICK_EXIT_BODY_CLASS, blurActive);
}

export function applyDefaultSafetyPresentation(): void {
  if (typeof document === "undefined") return;
  setDocumentShell(DEFAULT_DOCUMENT_TITLE, DEFAULT_FAVICON, false);
}

export function applyCovertSafetyPresentation({
  blurActive = false,
}: {
  blurActive?: boolean;
} = {}): void {
  if (typeof document === "undefined") return;
  setDocumentShell(COVERT_DOCUMENT_TITLE, COVERT_FAVICON, blurActive);
}

export function syncSafetyPresentation(pathname: string): void {
  if (typeof document === "undefined") return;

  if (pathname.startsWith(NEUTRAL_ROUTE)) {
    applyCovertSafetyPresentation();
    return;
  }

  applyDefaultSafetyPresentation();
}

export function launchEmergencyCall(): void {
  if (typeof window === "undefined") return;
  window.location.href = telUri(EMERGENCY_NUMBER);
}

export function launchSupportCall(): void {
  if (typeof window === "undefined") return;
  window.location.href = telUri(SUPPORT_NUMBER_DIAL);
}

export function triggerQuickExit(): void {
  if (typeof window === "undefined") return;

  const savedLanguage = window.localStorage.getItem(LANGUAGE_STORAGE_KEY);
  const savedTheme = window.localStorage.getItem("theme");

  clearAuthSession();

  Object.keys(window.localStorage).forEach((key) => {
    if (key.startsWith("safespeak_") && key !== LANGUAGE_STORAGE_KEY) {
      window.localStorage.removeItem(key);
    }
  });

  if (savedLanguage) {
    window.localStorage.setItem(LANGUAGE_STORAGE_KEY, savedLanguage);
  }

  if (savedTheme) {
    window.localStorage.setItem("theme", savedTheme);
  }

  window.sessionStorage.removeItem(SAFETY_GATE_ACK_KEY);
  window.sessionStorage.setItem(COVERT_MODE_KEY, "1");
  applyCovertSafetyPresentation({ blurActive: true });

  window.setTimeout(() => {
    window.location.replace(NEUTRAL_ROUTE);
  }, 90);
}

