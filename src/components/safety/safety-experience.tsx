"use client";

import { useEffect } from "react";

import { usePathname } from "next/navigation";

import { syncSafetyPresentation } from "@/lib/safety";

import { SafetyGate } from "./safety-gate";
import { SafetyRail } from "./safety-rail";

export function SafetyExperience() {
  const pathname = usePathname();

  useEffect(() => {
    syncSafetyPresentation(pathname);
  }, [pathname]);

  return (
    <>
      <SafetyGate />
      <SafetyRail />
    </>
  );
}

