"use client";

import { apiRequest } from "@/lib/api";
import { ensureValidAuthSession } from "@/lib/auth";

const ANONYMOUS_SESSION_KEY = "safespeak_anonymous_session";
export const SAFE_SPEAK_SESSION_HEADER = "X-SafeSpeak-Session";

type AnonymousSessionData = {
  sessionToken: string;
};

type AnonymousSessionResponse = {
  sessionToken: string;
};

function getStoredAnonymousSession(): AnonymousSessionData | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(ANONYMOUS_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AnonymousSessionData;
  } catch {
    window.sessionStorage.removeItem(ANONYMOUS_SESSION_KEY);
    return null;
  }
}

function saveAnonymousSession(session: AnonymousSessionData): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(ANONYMOUS_SESSION_KEY, JSON.stringify(session));
}

export function clearAnonymousSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(ANONYMOUS_SESSION_KEY);
}

export async function getAnonymousSessionToken(options?: { forceNew?: boolean }): Promise<string> {
  if (options?.forceNew) {
    clearAnonymousSession();
  }

  const storedSession = getStoredAnonymousSession();

  if (storedSession?.sessionToken) {
    return storedSession.sessionToken;
  }

  const response = await apiRequest<AnonymousSessionResponse>(
    "/sessions/anonymous",
    {
      method: "POST",
      body: {
        language: "en",
        safetyGateAccepted: true,
      },
    }
  );

  saveAnonymousSession({ sessionToken: response.data.sessionToken });
  return response.data.sessionToken;
}

export async function getSessionAwareAuthHeaders(options?: { forceNewAnonymous?: boolean }): Promise<HeadersInit> {
  const authSession = await ensureValidAuthSession().catch(() => null);

  if (authSession?.tokens.accessToken) {
    return {
      Authorization: `Bearer ${authSession.tokens.accessToken}`,
    };
  }

  const sessionToken = await getAnonymousSessionToken({
    forceNew: options?.forceNewAnonymous,
  });

  return {
    [SAFE_SPEAK_SESSION_HEADER]: sessionToken,
  };
}
