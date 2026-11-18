"use client";

import { useCallback, useState } from "react";

import {
  ConsentRequiredError,
  ensureConsent,
  getConsentGrantFlags,
  grantConsent,
  type ConsentFlags,
  type ConsentRequirement,
} from "@/lib/consent";

export function useConsentGate() {
  const [pendingConsentRequirement, setPendingConsentRequirement] =
    useState<ConsentRequirement | null>(null);
  const [isGrantingConsent, setIsGrantingConsent] = useState(false);

  const clearPendingConsent = useCallback(() => {
    setPendingConsentRequirement(null);
  }, []);

  const captureConsentError = useCallback((error: unknown): boolean => {
    if (error instanceof ConsentRequiredError) {
      setPendingConsentRequirement(error.requirement);
      return true;
    }

    return false;
  }, []);

  const requireConsent = useCallback(
    async (
      requirement: ConsentRequirement,
      headers?: HeadersInit
    ): Promise<boolean> => {
      try {
        await ensureConsent(requirement, headers);
        setPendingConsentRequirement(null);
        return true;
      } catch (error) {
        if (error instanceof ConsentRequiredError) {
          setPendingConsentRequirement(error.requirement);
          return false;
        }

        throw error;
      }
    },
    []
  );

  const grantPendingConsent = useCallback(
    async (flags?: ConsentFlags): Promise<ConsentFlags | null> => {
      if (!pendingConsentRequirement) {
        return null;
      }

      setIsGrantingConsent(true);

      try {
        const consent = await grantConsent(
          flags ?? getConsentGrantFlags(pendingConsentRequirement),
          pendingConsentRequirement.source
        );
        setPendingConsentRequirement(null);
        return consent;
      } finally {
        setIsGrantingConsent(false);
      }
    },
    [pendingConsentRequirement]
  );

  return {
    pendingConsentRequirement,
    isGrantingConsent,
    captureConsentError,
    clearPendingConsent,
    grantPendingConsent,
    requireConsent,
    setPendingConsentRequirement,
  };
}
