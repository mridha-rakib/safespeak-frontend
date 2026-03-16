"use client";

import { useEffect, useState } from "react";

import {
  type SafeSpeakProfile,
  SAFESPEAK_PROFILE_EVENT,
  defaultSafeSpeakProfile,
  getSafeSpeakProfile,
  normalizeSafeSpeakProfile,
  saveSafeSpeakProfile,
} from "@/lib/safespeak-profile";

export function useSafeSpeakProfile() {
  const [profile, setProfile] = useState<SafeSpeakProfile>(
    defaultSafeSpeakProfile
  );

  useEffect(() => {
    const syncProfile = () => {
      setProfile(getSafeSpeakProfile());
    };

    syncProfile();
    window.addEventListener(SAFESPEAK_PROFILE_EVENT, syncProfile);

    return () => {
      window.removeEventListener(SAFESPEAK_PROFILE_EVENT, syncProfile);
    };
  }, []);

  const updateProfile = (
    nextProfile:
      | SafeSpeakProfile
      | ((currentProfile: SafeSpeakProfile) => SafeSpeakProfile)
  ) => {
    setProfile((currentProfile) => {
      const resolvedProfile =
        typeof nextProfile === "function"
          ? nextProfile(currentProfile)
          : nextProfile;
      const normalizedProfile = normalizeSafeSpeakProfile(resolvedProfile);

      saveSafeSpeakProfile(normalizedProfile);
      return normalizedProfile;
    });
  };

  return { profile, updateProfile };
}

