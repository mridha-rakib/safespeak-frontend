export type SafeSpeakCultureOption =
  | "Migrant family"
  | "International student"
  | "Refugee or asylum seeker"
  | "First Nations"
  | "Local community member";

export type SafeSpeakFaithOption =
  | "Muslim"
  | "Christian"
  | "Hindu"
  | "Buddhist"
  | "Secular"
  | "Prefer not to say";

export type SafeSpeakCommunityOption =
  | "South Asian"
  | "Middle Eastern"
  | "African diaspora"
  | "East Asian"
  | "Pacific community"
  | "Multicultural";

export type SafeSpeakInterpreterLanguage =
  | "English"
  | "Spanish"
  | "Arabic"
  | "Mandarin"
  | "Hindi"
  | "Urdu";

export interface SafeSpeakProfile {
  culturalProfile: SafeSpeakCultureOption;
  faithProfile: SafeSpeakFaithOption;
  communityBackground: SafeSpeakCommunityOption;
  interpreterLanguage: SafeSpeakInterpreterLanguage;
  shareProfileInReferral: boolean;
}

export const SAFESPEAK_PROFILE_STORAGE_KEY = "safespeak_user_profile";
export const SAFESPEAK_PROFILE_EVENT = "safespeak-profile-updated";

export const cultureOptions: SafeSpeakCultureOption[] = [
  "Migrant family",
  "International student",
  "Refugee or asylum seeker",
  "First Nations",
  "Local community member",
];

export const faithOptions: SafeSpeakFaithOption[] = [
  "Muslim",
  "Christian",
  "Hindu",
  "Buddhist",
  "Secular",
  "Prefer not to say",
];

export const communityOptions: SafeSpeakCommunityOption[] = [
  "South Asian",
  "Middle Eastern",
  "African diaspora",
  "East Asian",
  "Pacific community",
  "Multicultural",
];

export const interpreterLanguageOptions: SafeSpeakInterpreterLanguage[] = [
  "English",
  "Spanish",
  "Arabic",
  "Mandarin",
  "Hindi",
  "Urdu",
];

export const defaultSafeSpeakProfile: SafeSpeakProfile = {
  culturalProfile: "Migrant family",
  faithProfile: "Muslim",
  communityBackground: "South Asian",
  interpreterLanguage: "English",
  shareProfileInReferral: true,
};

function isCultureOption(value: string): value is SafeSpeakCultureOption {
  return cultureOptions.includes(value as SafeSpeakCultureOption);
}

function isFaithOption(value: string): value is SafeSpeakFaithOption {
  return faithOptions.includes(value as SafeSpeakFaithOption);
}

function isCommunityOption(value: string): value is SafeSpeakCommunityOption {
  return communityOptions.includes(value as SafeSpeakCommunityOption);
}

function isInterpreterLanguage(
  value: string
): value is SafeSpeakInterpreterLanguage {
  return interpreterLanguageOptions.includes(
    value as SafeSpeakInterpreterLanguage
  );
}

export function normalizeSafeSpeakProfile(
  value?: Partial<SafeSpeakProfile> | null
): SafeSpeakProfile {
  const culturalProfile = value?.culturalProfile;
  const faithProfile = value?.faithProfile;
  const communityBackground = value?.communityBackground;
  const interpreterLanguage = value?.interpreterLanguage;
  const nextCulturalProfile = isCultureOption(culturalProfile ?? "")
    ? (culturalProfile as SafeSpeakCultureOption)
    : defaultSafeSpeakProfile.culturalProfile;
  const nextFaithProfile = isFaithOption(faithProfile ?? "")
    ? (faithProfile as SafeSpeakFaithOption)
    : defaultSafeSpeakProfile.faithProfile;
  const nextCommunityBackground = isCommunityOption(communityBackground ?? "")
    ? (communityBackground as SafeSpeakCommunityOption)
    : defaultSafeSpeakProfile.communityBackground;
  const nextInterpreterLanguage = isInterpreterLanguage(
    interpreterLanguage ?? ""
  )
    ? (interpreterLanguage as SafeSpeakInterpreterLanguage)
    : defaultSafeSpeakProfile.interpreterLanguage;

  return {
    culturalProfile: nextCulturalProfile,
    faithProfile: nextFaithProfile,
    communityBackground: nextCommunityBackground,
    interpreterLanguage: nextInterpreterLanguage,
    shareProfileInReferral:
      typeof value?.shareProfileInReferral === "boolean"
        ? value.shareProfileInReferral
        : defaultSafeSpeakProfile.shareProfileInReferral,
  };
}

export function getSafeSpeakProfile(): SafeSpeakProfile {
  if (typeof window === "undefined") {
    return defaultSafeSpeakProfile;
  }

  const raw = window.localStorage.getItem(SAFESPEAK_PROFILE_STORAGE_KEY);
  if (!raw) {
    return defaultSafeSpeakProfile;
  }

  try {
    const parsed = JSON.parse(raw) as Partial<SafeSpeakProfile>;
    return normalizeSafeSpeakProfile(parsed);
  } catch {
    window.localStorage.removeItem(SAFESPEAK_PROFILE_STORAGE_KEY);
    return defaultSafeSpeakProfile;
  }
}

export function saveSafeSpeakProfile(profile: SafeSpeakProfile): void {
  if (typeof window === "undefined") {
    return;
  }

  const normalized = normalizeSafeSpeakProfile(profile);
  window.localStorage.setItem(
    SAFESPEAK_PROFILE_STORAGE_KEY,
    JSON.stringify(normalized)
  );
  window.dispatchEvent(new CustomEvent(SAFESPEAK_PROFILE_EVENT));
}
