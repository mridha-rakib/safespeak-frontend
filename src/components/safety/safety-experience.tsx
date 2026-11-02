"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";

import {
  DEFAULT_PLATFORM_SETTINGS,
  type PlatformSettingsPayload,
  getPublicPlatformSettings,
} from "@/lib/platform-settings";
import { syncSafetyPresentation } from "@/lib/safety";

import { SafetyGate } from "./safety-gate";
import { SafetyRail } from "./safety-rail";

export function SafetyExperience() {
  const pathname = usePathname();
  const [platformSettings, setPlatformSettings] =
    useState<PlatformSettingsPayload>(DEFAULT_PLATFORM_SETTINGS);

  useEffect(() => {
    syncSafetyPresentation(pathname);
  }, [pathname]);

  useEffect(() => {
    let isMounted = true;

    getPublicPlatformSettings()
      .then((settings) => {
        if (isMounted) {
          setPlatformSettings(settings);
        }
      })
      .catch(() => {
        if (isMounted) {
          setPlatformSettings(DEFAULT_PLATFORM_SETTINGS);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  return (
    <>
      <SafetyGate platformSettings={platformSettings} />
      <SafetyRail platformSettings={platformSettings} />
    </>
  );
}
