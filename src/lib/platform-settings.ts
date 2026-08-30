import { apiRequest } from "@/lib/api";

export type PlatformSettingsPayload = {
  safety: {
    immediateDangerText: string;
    respectSupportText: string;
    platformRoleText: string;
    informationOnlyText: string;
    emergencyCallLabel: string;
    respectCallLabel: string;
    quickExitLabel: string;
    covertModeLabel: string;
  };
  consent: {
    introText: string;
    localStorageLabel: string;
    cloudSyncLabel: string;
    agencySharingLabel: string;
    analyticsLabel: string;
  };
  ai: {
    disclaimerText: string;
    humanReviewText: string;
    triageSystemPrompt: string;
    triageResponseTemplate: string;
    triageFallbackText: string;
    triageTemplateStatus: "draft" | "approved";
  };
};

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettingsPayload = {
  safety: {
    immediateDangerText: "If you are in immediate danger, call 000 now.",
    respectSupportText: "If it is safe, contact 1800RESPECT (24/7).",
    platformRoleText:
      "SafeSpeak is a triage and intelligence platform. It is not a substitute for legal or medical advice.",
    informationOnlyText:
      "Information provided is educational only. Always prioritize your immediate safety and seek professional guidance.",
    emergencyCallLabel: "Emergency 000",
    respectCallLabel: "1800RESPECT",
    quickExitLabel: "Covert Exit",
    covertModeLabel: "Covert mode ready",
  },
  consent: {
    introText:
      "SafeSpeak needs your explicit consent before storing, syncing, processing with AI, or sharing information.",
    localStorageLabel: "Store data locally",
    cloudSyncLabel: "Sync to cloud",
    agencySharingLabel: "Share with agencies",
    analyticsLabel: "Use anonymised data for analytics",
  },
  ai: {
    disclaimerText: "This is information only, not legal advice.",
    humanReviewText:
      "Review and edit all AI-generated text before saving or sharing.",
    triageSystemPrompt:
      "Triage reports into information-only support guidance without legal, clinical, counselling, crisis-service, or case-management advice.",
    triageResponseTemplate:
      "Return severity, support need, concise explanation, confidence, citations, fallback reason, and review status.",
    triageFallbackText:
      "SafeSpeak cannot confidently triage this with the available information.",
    triageTemplateStatus: "approved",
  },
};

export async function getPublicPlatformSettings(): Promise<PlatformSettingsPayload> {
  const response = await apiRequest<{
    platformSettings: {
      settings: PlatformSettingsPayload;
    };
  }>("/platform-settings");

  return response.data.platformSettings.settings;
}
