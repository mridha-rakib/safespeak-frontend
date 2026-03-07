"use client";

import { SafetyGate } from "./safety-gate";
import { SafetyRail } from "./safety-rail";

export function SafetyExperience() {
  return (
    <>
      <SafetyGate />
      <SafetyRail />
    </>
  );
}

