import { ApiRequestError, apiRequest, getApiBaseUrl } from "@/lib/api";

export type UserRole =
  | "public_user"
  | "advocate_user"
  | "partner_user"
  | "admin"
  | "super_admin"
  | "content_admin"
  | "integration_admin"
  | "analytics_viewer";

export type UserStatus = "active" | "inactive" | "suspended" | "deleted";

export interface SafeSpeakUser {
  id: string;
  email: string;
  fullName: string;
  avatarUrl?: string;
  role: UserRole;
  status: UserStatus;
  isEmailVerified: boolean;
  lastLoginAt?: string;
  createdAt: string;
  updatedAt: string;
}

export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
}

export interface AuthData {
  user: SafeSpeakUser;
  tokens: AuthTokens;
}

export interface AuthSession extends AuthData {
  timestamp: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput extends LoginInput {
  fullName?: string;
}

export interface PasswordResetCodeRequestInput {
  email: string;
}

export interface PasswordResetCodeRequestResult {
  resetRequestId: string;
  expiresAt: string;
  debugOtp?: string;
}

export interface PasswordResetCodeVerifyInput {
  email: string;
  resetRequestId: string;
  code: string;
}

export interface PasswordResetCodeVerifyResult {
  resetToken: string;
  resetTokenExpiresAt: string;
}

export interface PasswordResetInput {
  email: string;
  resetRequestId: string;
  resetToken: string;
  newPassword: string;
}

export interface PasswordResetSession {
  email: string;
  resetRequestId: string;
  expiresAt: string;
}

export interface AuthOptions {
  baseUrl?: string;
  persistSession?: boolean;
}

export type SocialAuthProvider = "google" | "facebook" | "apple";

const AUTH_SESSION_KEY = "safespeak_auth_session";
const PASSWORD_RESET_SESSION_KEY = "safespeak_password_reset_session";
const TOKEN_REFRESH_SKEW_SECONDS = 30;
let refreshAuthSessionPromise: Promise<AuthData> | null = null;

function getStorage(persistSession: boolean): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  return persistSession ? window.localStorage : window.sessionStorage;
}

export function saveAuthSession(session: AuthSession, persistSession = true): void {
  const storage = getStorage(persistSession);

  if (!storage) {
    return;
  }

  clearAuthSession();
  storage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

export function getAuthSession(): AuthSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw =
    window.sessionStorage.getItem(AUTH_SESSION_KEY) ??
    window.localStorage.getItem(AUTH_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthSession;
  } catch {
    clearAuthSession();
    return null;
  }
}

function getAuthSessionStorage(): Storage | null {
  if (typeof window === "undefined") {
    return null;
  }

  if (window.sessionStorage.getItem(AUTH_SESSION_KEY)) {
    return window.sessionStorage;
  }

  if (window.localStorage.getItem(AUTH_SESSION_KEY)) {
    return window.localStorage;
  }

  return null;
}

export function clearAuthSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(AUTH_SESSION_KEY);
  window.sessionStorage.removeItem(AUTH_SESSION_KEY);
}

export function savePasswordResetSession(session: PasswordResetSession): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.setItem(
    PASSWORD_RESET_SESSION_KEY,
    JSON.stringify(session)
  );
}

export function getPasswordResetSession(): PasswordResetSession | null {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = window.sessionStorage.getItem(PASSWORD_RESET_SESSION_KEY);

  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as PasswordResetSession;
  } catch {
    clearPasswordResetSession();
    return null;
  }
}

export function clearPasswordResetSession(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.sessionStorage.removeItem(PASSWORD_RESET_SESSION_KEY);
}

function replaceAuthSession(
  session: AuthSession,
  storage: Storage | null = getAuthSessionStorage()
): void {
  if (typeof window === "undefined") {
    return;
  }

  const targetStorage = storage ?? window.localStorage;

  clearAuthSession();
  targetStorage.setItem(AUTH_SESSION_KEY, JSON.stringify(session));
}

function persistAuthData(data: AuthData, options: AuthOptions, timestamp?: string): AuthSession {
  const session = {
    ...data,
    timestamp: timestamp ?? new Date().toISOString(),
  };

  saveAuthSession(session, options.persistSession ?? true);
  return session;
}

function getApiOrigin(baseUrl?: string): string {
  const apiBaseUrl = getApiBaseUrl(baseUrl);

  try {
    return new URL(apiBaseUrl).origin;
  } catch {
    return apiBaseUrl.replace(/\/api(?:\/v\d+)?\/?$/, "");
  }
}

function decodeBase64Url(value: string): string {
  if (typeof globalThis.atob !== "function") {
    throw new Error("Browser auth decoding is unavailable.");
  }

  const normalizedValue = value.replace(/-/g, "+").replace(/_/g, "/");
  const paddedValue = normalizedValue.padEnd(
    normalizedValue.length + ((4 - (normalizedValue.length % 4)) % 4),
    "="
  );

  return globalThis.atob(paddedValue);
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const payload = token.split(".")[1];

  if (!payload || typeof globalThis.atob !== "function") {
    return null;
  }

  try {
    const normalizedPayload = payload.replace(/-/g, "+").replace(/_/g, "/");
    const paddedPayload = normalizedPayload.padEnd(
      normalizedPayload.length + ((4 - (normalizedPayload.length % 4)) % 4),
      "="
    );

    return JSON.parse(globalThis.atob(paddedPayload)) as { exp?: number };
  } catch {
    return null;
  }
}

function isTokenExpired(token: string, skewSeconds = 0): boolean {
  const payload = decodeJwtPayload(token);

  if (!payload?.exp) {
    return true;
  }

  return payload.exp * 1000 <= Date.now() + skewSeconds * 1000;
}

export function getAccessToken(): string | null {
  return getAuthSession()?.tokens.accessToken ?? null;
}

export function isAccessTokenExpired(): boolean {
  const token = getAccessToken();

  return !token || isTokenExpired(token, TOKEN_REFRESH_SKEW_SECONDS);
}

export async function refreshAuthSession(
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<AuthData> {
  if (refreshAuthSessionPromise) {
    return refreshAuthSessionPromise;
  }

  const session = getAuthSession();

  if (!session?.tokens.refreshToken) {
    clearAuthSession();
    throw new Error("Login is required.");
  }

  if (isTokenExpired(session.tokens.refreshToken)) {
    clearAuthSession();
    throw new Error("Session expired. Please login again.");
  }

  refreshAuthSessionPromise = (async () => {
    const storage = getAuthSessionStorage();
    const response = await apiRequest<AuthData>("/auth/refresh", {
      method: "POST",
      body: {
        refreshToken: session.tokens.refreshToken,
      },
      baseUrl: options.baseUrl,
    });
    const nextSession = {
      ...response.data,
      timestamp: response.timestamp ?? new Date().toISOString(),
    };

    replaceAuthSession(nextSession, storage);
    return response.data;
  })();

  try {
    return await refreshAuthSessionPromise;
  } catch (error) {
    clearAuthSession();
    throw error;
  } finally {
    refreshAuthSessionPromise = null;
  }
}

export async function ensureValidAuthSession(
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<AuthSession | null> {
  const session = getAuthSession();

  if (!session) {
    return null;
  }

  if (!isAccessTokenExpired()) {
    return session;
  }

  await refreshAuthSession(options);
  return getAuthSession();
}

export async function getValidAccessToken(
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<string> {
  const session = await ensureValidAuthSession(options);
  const token = session?.tokens.accessToken;

  if (!token) {
    throw new Error("Login is required.");
  }

  return token;
}

export async function loginUser(
  input: LoginInput,
  options: AuthOptions = {}
): Promise<AuthData> {
  const response = await apiRequest<AuthData>("/auth/login", {
    method: "POST",
    body: input,
    baseUrl: options.baseUrl,
  });

  persistAuthData(response.data, options, response.timestamp);
  return response.data;
}

export async function registerUser(
  input: RegisterInput,
  options: AuthOptions = {}
): Promise<AuthData> {
  const response = await apiRequest<AuthData>("/auth/register", {
    method: "POST",
    body: input,
    baseUrl: options.baseUrl,
  });

  persistAuthData(response.data, options, response.timestamp);
  return response.data;
}

export async function requestPasswordResetCode(
  input: PasswordResetCodeRequestInput,
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<PasswordResetCodeRequestResult> {
  const response = await apiRequest<PasswordResetCodeRequestResult>(
    "/auth/forgot-password",
    {
      method: "POST",
      body: {
        email: input.email,
        audience: "public",
      },
      baseUrl: options.baseUrl,
    }
  );

  return response.data;
}

export async function verifyPasswordResetCode(
  input: PasswordResetCodeVerifyInput,
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<PasswordResetCodeVerifyResult> {
  const response = await apiRequest<PasswordResetCodeVerifyResult>(
    "/auth/verify-reset-otp",
    {
      method: "POST",
      body: {
        email: input.email,
        audience: "public",
        resetRequestId: input.resetRequestId,
        otp: input.code,
      },
      baseUrl: options.baseUrl,
    }
  );

  return response.data;
}

export async function resetPasswordWithVerifiedCode(
  input: PasswordResetInput,
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<void> {
  await apiRequest<null>("/auth/reset-password", {
    method: "POST",
    body: {
      email: input.email,
      audience: "public",
      resetRequestId: input.resetRequestId,
      resetToken: input.resetToken,
      newPassword: input.newPassword,
    },
    baseUrl: options.baseUrl,
  });
}

export async function getCurrentUser(
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<SafeSpeakUser> {
  const token = await getValidAccessToken(options);
  let response: { data: { user: SafeSpeakUser }; timestamp?: string };

  try {
    response = await apiRequest<{ user: SafeSpeakUser }>("/auth/me", {
      token,
      baseUrl: options.baseUrl,
    });
  } catch (error) {
    if (
      error instanceof ApiRequestError &&
      (error.status === 401 || error.status === 403)
    ) {
      clearAuthSession();
    }

    throw error;
  }

  const session = getAuthSession();

  if (session) {
    replaceAuthSession({
      ...session,
      user: response.data.user,
      timestamp: response.timestamp ?? session.timestamp,
    });
  }

  return response.data.user;
}

export async function logoutUser(
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<void> {
  const session = await ensureValidAuthSession(options).catch(() => null);
  const token = session?.tokens.accessToken;

  try {
    if (token) {
      await apiRequest<null>("/auth/logout", {
        method: "POST",
        token,
        baseUrl: options.baseUrl,
      });
    }
  } catch {
    // Local logout should still complete even if the backend is unreachable.
  } finally {
    clearAuthSession();
  }
}

export function completeSocialAuth(
  encodedAuthData: string,
  options: AuthOptions = {}
): AuthSession {
  const authData = JSON.parse(decodeBase64Url(encodedAuthData)) as AuthData;

  return persistAuthData(authData, {
    ...options,
    persistSession: options.persistSession ?? true,
  });
}

export function getAuthErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiRequestError) {
    if (error.status === 409) {
      return "This email is already registered. Please log in instead.";
    }

    if (error.status === 401) {
      return "Invalid email or password.";
    }

    return error.message || fallback;
  }

  if (error instanceof Error) {
    return error.message || fallback;
  }

  return fallback;
}

export async function startSocialAuth(
  provider: SocialAuthProvider,
  options: Pick<AuthOptions, "baseUrl"> = {}
): Promise<void> {
  if (provider === "google") {
    if (typeof window === "undefined") {
      throw new Error("Google sign-in must be started in a browser.");
    }

    window.location.assign(`${getApiOrigin(options.baseUrl)}/api/auth/google`);
    return;
  }

  // Placeholder flow so UI wiring is ready before OAuth providers are connected.
  await new Promise<void>((resolve) => {
    setTimeout(resolve, 400);
  });

  void provider;
}
