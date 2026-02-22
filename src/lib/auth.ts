export interface AgentUser {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  referralCode?: string;
}

export interface AgentProfile {
  _id: string;
  userInfo: string;
  licenseNumber: string;
  brokerageName: string;
  title: string;
  isActive: boolean;
  totalRentersReferred: number;
  activeReferrals: number;
  emailSubscriptionEnabled: boolean;
  acceptingRequests: boolean;
  hasGrantAccess: boolean;
  grantAccessCount: number;
  totalMatches: number;
  successfulMatches: number;
  profileImageUrl: string;
  createdAt: string;
  updatedAt: string;
}

export interface AgentLoginData {
  user: AgentUser;
  profile: AgentProfile;
  accessToken: string;
  expiresIn: string;
}

export interface AgentLoginResponse {
  success: boolean;
  message: string;
  data: AgentLoginData;
  timestamp: string;
}

export interface AgentLoginInput {
  email: string;
  password: string;
}

export interface AgentLoginOptions {
  baseUrl?: string;
  persistSession?: boolean;
}

export interface AuthSession {
  user: AgentUser;
  profile: AgentProfile;
  accessToken: string;
  expiresIn: string;
  timestamp: string;
}

const AUTH_SESSION_KEY = "safespeak_auth_session";

function getApiBaseUrl(explicit?: string): string {
  // eslint-disable-next-line n/no-process-env
  const value = explicit ?? process.env.NEXT_PUBLIC_API_BASE_URL ?? "";
  const trimmed = value.trim();

  if (!trimmed) {
    throw new Error("Missing API base URL. Set NEXT_PUBLIC_API_BASE_URL or enter Base URL.");
  }

  return trimmed.replace(/\/+$/, "");
}

async function parseJsonSafe(response: Response): Promise<unknown> {
  try {
    return await response.json();
  } catch {
    return null;
  }
}

export function saveAuthSession(session: AuthSession): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") return null;
  const raw = window.localStorage.getItem(AUTH_SESSION_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    window.localStorage.removeItem(AUTH_SESSION_KEY);
    return null;
  }
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(AUTH_SESSION_KEY);
}

export async function loginAgent(
  input: AgentLoginInput,
  options: AgentLoginOptions = {},
): Promise<AgentLoginResponse> {
  const baseUrl = getApiBaseUrl(options.baseUrl);
  const persistSession = options.persistSession ?? true;

  const response = await fetch(`${baseUrl}/auth/login`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(input),
  });

  const payload = (await parseJsonSafe(response)) as Partial<AgentLoginResponse> | null;
  const message = payload?.message ?? "Login failed";

  if (!response.ok || !payload?.success || !payload?.data?.user || !payload?.data?.profile) {
    throw new Error(message);
  }

  const normalized: AgentLoginResponse = {
    success: true,
    message: payload.message ?? "Login successful",
    data: payload.data as AgentLoginData,
    timestamp: payload.timestamp ?? new Date().toISOString(),
  };

  if (persistSession) {
    saveAuthSession({
      ...normalized.data,
      timestamp: normalized.timestamp,
    });
  }

  return normalized;
}
