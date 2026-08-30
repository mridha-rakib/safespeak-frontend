"use client";

import { useEffect, useState } from "react";

import {
  getProfile as fetchProfile,
  updateProfile as persistProfile,
} from "@/lib/profile-client";
import {
  type SafeSpeakProfile,
  SAFESPEAK_PROFILE_EVENT,
  defaultSafeSpeakProfile,
  getSafeSpeakProfile,
  mapBackendProfileToSafeSpeakProfile,
  mapSafeSpeakProfileToBackend,
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
    void fetchProfile()
      .then((backendProfile) => {
        const normalizedProfile = mapBackendProfileToSafeSpeakProfile(backendProfile);
        saveSafeSpeakProfile(normalizedProfile);
        setProfile(normalizedProfile);
      })
      .catch(() => {
        setProfile(getSafeSpeakProfile());
      });

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
      void persistProfile(mapSafeSpeakProfileToBackend(normalizedProfile)).catch(() => {
        // Keep local profile as fallback if backend persistence fails.
      });
      return normalizedProfile;
    });
  };

  return { profile, updateProfile };
}

