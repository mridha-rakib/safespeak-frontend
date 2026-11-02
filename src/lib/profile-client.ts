"use client";

import { apiRequest } from "@/lib/api";
import { getSessionAwareAuthHeaders } from "@/lib/frontend-session";

export type ProfileRecord = {
  preferredLanguage?: string;
  interpreterLanguage?: string;
  jurisdiction?: string;
  lga?: string;
  culturalProfile?: string;
  faithProfile?: string;
  communityProfile?: string;
  referralSharingPreference?: boolean;
  accessibilityPreferences?: Record<string, unknown>;
};

type ProfileResponse = {
  profile: ProfileRecord;
};

type LanguageOption = { code?: string; label?: string; name?: string } | string;

type OptionListEnvelope = {
  languages?: LanguageOption[];
  culturalProfiles?: string[];
  faithProfiles?: string[];
  communityProfiles?: string[];
};

export async function getProfile(): Promise<ProfileRecord> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<ProfileResponse>("/profile", { headers });

  return response.data.profile;
}

export async function updateProfile(
  input: Partial<ProfileRecord>
): Promise<ProfileRecord> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<ProfileResponse>("/profile", {
    method: "PATCH",
    headers,
    body: input,
  });

  return response.data.profile;
}

export async function getLanguageOptions(): Promise<LanguageOption[]> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<OptionListEnvelope>("/languages", { headers });

  return response.data.languages ?? [];
}

export async function getCulturalProfiles(): Promise<string[]> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<OptionListEnvelope>("/cultural-profiles", { headers });

  return response.data.culturalProfiles ?? [];
}

export async function getFaithProfiles(): Promise<string[]> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<OptionListEnvelope>("/faith-profiles", { headers });

  return response.data.faithProfiles ?? [];
}

export async function getCommunityProfiles(): Promise<string[]> {
  const headers = await getSessionAwareAuthHeaders();
  const response = await apiRequest<OptionListEnvelope>("/community-profiles", { headers });

  return response.data.communityProfiles ?? [];
}
