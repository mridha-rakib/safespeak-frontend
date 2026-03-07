import { clearAuthSession } from "@/lib/auth";
import { LANGUAGE_STORAGE_KEY } from "@/lib/i18n";

export const SAFETY_GATE_ACK_KEY = "safespeak_safety_gate_ack";
export const COVERT_MODE_KEY = "safespeak_covert_mode";
export const EMERGENCY_NUMBER = "000";
export const SUPPORT_NUMBER_DISPLAY = "1800RESPECT";
export const SUPPORT_NUMBER_DIAL = "1800737732";
export const NEUTRAL_ROUTE = "/neutral";

function telUri(phone: string): string {
  return `tel:${phone.replace(/\s+/g, "")}`;
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
  window.location.replace(NEUTRAL_ROUTE);
}

