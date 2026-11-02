"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter, useSearchParams } from "next/navigation";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { useTranslation } from "react-i18next";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type SocialAuthProvider,
  ensureValidAuthSession,
  getAuthErrorMessage,
  loginUser,
  startSocialAuth,
} from "@/lib/auth";

function getSafeRedirectTarget(value: string | null): string {
  if (!value?.startsWith("/") || value.startsWith("//")) {
    return "/dashboard";
  }

  return value;
}

export default function LoginPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const redirectTarget = getSafeRedirectTarget(searchParams.get("next"));
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberSession, setRememberSession] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSocialProvider, setActiveSocialProvider] =
    useState<SocialAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const authError = searchParams.get("authError");
    const resetStatus = searchParams.get("reset");

    if (authError) {
      setError(authError);
      return;
    }

    if (resetStatus === "success") {
      setSuccess(t("auth.login.resetSuccess"));
    }
  }, [searchParams, t]);

  useEffect(() => {
    let isActive = true;

    void ensureValidAuthSession()
      .then((session) => {
        if (isActive && session) {
          router.replace(redirectTarget as Route);
        }
      })
      .catch(() => {
        // Invalid saved sessions are cleared by the auth helper.
      });

    return () => {
      isActive = false;
    };
  }, [redirectTarget, router]);

  const isDisabled = useMemo(() => {
    return isSubmitting || !email.trim() || !password.trim();
  }, [email, isSubmitting, password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      await loginUser(
        {
          email: email.trim(),
          password,
        },
        {
          persistSession: rememberSession,
        }
      );

      setSuccess(t("auth.login.success"));
      router.push(redirectTarget as Route);
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, t("auth.login.error")));
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleSocialAuth(provider: SocialAuthProvider) {
    setError(null);
    setSuccess(null);
    setActiveSocialProvider(provider);

    const providerLabel = t(`auth.social.providers.${provider}`);

    try {
      await startSocialAuth(provider);
      setSuccess(
        t("auth.social.placeholderSuccess", { provider: providerLabel })
      );
    } catch {
      setError(t("auth.social.placeholderError", { provider: providerLabel }));
    } finally {
      setActiveSocialProvider(null);
    }
  }

  return (
    <AuthShell
      badge={t("auth.shell.userAccess")}
      title={t("auth.login.title")}
      description={t("auth.login.description")}
      footerPrefix={t("auth.login.footerPrefix")}
      footerLinkLabel={t("auth.login.footerLinkLabel")}
      footerLinkHref="/register"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-white">
            {t("auth.login.email")}
          </label>
          <Input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label htmlFor="password" className="text-sm font-medium text-white">
            {t("auth.login.password")}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("auth.login.passwordPlaceholder")}
            autoComplete="current-password"
            className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
            required
          />
        </div>

        <div className="flex items-center justify-between text-xs text-white/85">
          <label className="inline-flex items-center gap-2">
            <input
              type="checkbox"
              checked={rememberSession}
              onChange={(event) => setRememberSession(event.target.checked)}
              className="h-4 w-4 rounded border-white/30 bg-transparent accent-[#ff8f00]"
            />
            {t("auth.login.rememberMe")}
          </label>
          <Link
            href={"/forgot-password" as Route}
            className="font-semibold text-[#ffb54a] transition hover:text-[#ffc56f]"
          >
            {t("auth.login.forgotPassword")}
          </Link>
        </div>

        {error ? (
          <p className="rounded-md border border-[#fecaca]/70 bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">
            {error}
          </p>
        ) : null}

        {success ? (
          <p className="rounded-md border border-[#bbf7d0]/70 bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">
            {success}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={isDisabled}
          className="h-11 w-full rounded-md bg-[#ff8f00] text-[#0b3152] hover:bg-[#f57c00]"
        >
          {isSubmitting ? t("auth.login.submitting") : t("auth.login.submit")}
        </Button>

        <AuthSocialButtons
          onProviderClick={handleSocialAuth}
          activeProvider={activeSocialProvider}
          disabled={isSubmitting}
        />

        <p className="text-center text-sm text-white/80">
          {t("auth.shell.backToHome")}{" "}
          <Link
            href="/"
            className="font-semibold text-[#ffb54a] underline-offset-4 hover:underline"
          >
            {t("dashboard.nav.home")}
          </Link>
        </p>
      </form>
    </AuthShell>
  );
}
