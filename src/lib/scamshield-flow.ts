"use client";

import { useEffect, useState } from "react";

import type { ScamAnalysisRecord } from "@/lib/scamshield-client";

const SCAMSHIELD_FLOW_KEY = "safespeak_scamshield_flow";
const SCAMSHIELD_FLOW_EVENT = "safespeak:scamshield-flow-updated";

export type ScamShieldFlowState = {
  inputText: string;
  inputMode: "text" | "url" | "email" | "screenshot";
  analysis?: ScamAnalysisRecord;
  reportDraft?: ScamAnalysisRecord;
  submitted?: boolean;
  selectedAgency?: "accc" | "reportCyber" | "bank";
  updatedAt: string;
};

export function getScamShieldFlowState(): ScamShieldFlowState | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(SCAMSHIELD_FLOW_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as ScamShieldFlowState;
  } catch {
    window.sessionStorage.removeItem(SCAMSHIELD_FLOW_KEY);
    return null;
  }
}

export function saveScamShieldFlowState(
  state: Omit<ScamShieldFlowState, "updatedAt">
): ScamShieldFlowState {
  const nextState = {
    ...state,
    updatedAt: new Date().toISOString(),
  } satisfies ScamShieldFlowState;

  if (typeof window !== "undefined") {
    window.sessionStorage.setItem(
      SCAMSHIELD_FLOW_KEY,
      JSON.stringify(nextState)
    );
    window.dispatchEvent(new CustomEvent(SCAMSHIELD_FLOW_EVENT));
  }

  return nextState;
}

export function mergeScamShieldFlowState(
  state: Partial<Omit<ScamShieldFlowState, "updatedAt">>
): ScamShieldFlowState {
  const currentState = getScamShieldFlowState();

  return saveScamShieldFlowState({
    inputText: state.inputText ?? currentState?.inputText ?? "",
    inputMode: state.inputMode ?? currentState?.inputMode ?? "text",
    analysis: state.analysis ?? currentState?.analysis,
    reportDraft: state.reportDraft ?? currentState?.reportDraft,
    submitted: state.submitted ?? currentState?.submitted,
    selectedAgency: state.selectedAgency ?? currentState?.selectedAgency,
  });
}

export function clearScamShieldFlowState(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(SCAMSHIELD_FLOW_KEY);
  window.dispatchEvent(new CustomEvent(SCAMSHIELD_FLOW_EVENT));
}

export function useScamShieldFlowState(): ScamShieldFlowState | null {
  const [flowState, setFlowState] = useState<ScamShieldFlowState | null>(null);

  useEffect(() => {
    const syncState = () => {
      setFlowState(getScamShieldFlowState());
    };

    syncState();
    window.addEventListener("storage", syncState);
    window.addEventListener(SCAMSHIELD_FLOW_EVENT, syncState);

    return () => {
      window.removeEventListener("storage", syncState);
      window.removeEventListener(SCAMSHIELD_FLOW_EVENT, syncState);
    };
  }, []);

  return flowState;
}
