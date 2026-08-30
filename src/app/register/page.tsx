"use client";

import Link from "next/link";
import type { Route } from "next";
import { FormEvent, useEffect, useMemo, useState } from "react";

import { useRouter, useSearchParams } from "next/navigation";
import { useTranslation } from "react-i18next";

import { AuthShell } from "@/components/auth/auth-shell";
import { AuthSocialButtons } from "@/components/auth/auth-social-buttons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  type SocialAuthProvider,
  ensureValidAuthSession,
  getAuthErrorMessage,
  registerUser,
  startSocialAuth,
} from "@/lib/auth";

export default function RegisterPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [activeSocialProvider, setActiveSocialProvider] =
    useState<SocialAuthProvider | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const authError = searchParams.get("authError");

    if (authError) {
      setError(authError);
    }
  }, [searchParams]);

  useEffect(() => {
    let isActive = true;

    void ensureValidAuthSession()
      .then((session) => {
        if (isActive && session) {
          router.replace("/dashboard");
        }
      })
      .catch(() => {
        // Invalid saved sessions are cleared by the auth helper.
      });

    return () => {
      isActive = false;
    };
  }, [router]);

  const isDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !email.trim() ||
      !password ||
      !confirmPassword ||
      !acceptedTerms
    );
  }, [acceptedTerms, confirmPassword, email, isSubmitting, password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 10) {
      setError(t("auth.register.passwordMinError"));
      return;
    }

    if (password !== confirmPassword) {
      setError(t("auth.register.passwordMatchError"));
      return;
    }

    if (!acceptedTerms) {
      setError(t("auth.register.acceptTermsError"));
      return;
    }

    setIsSubmitting(true);

    try {
      await registerUser({
        email: email.trim(),
        password,
      });

      setSuccess(t("auth.register.success"));
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptedTerms(false);
      router.push("/dashboard");
    } catch (submitError) {
      setError(getAuthErrorMessage(submitError, t("auth.register.error")));
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
      badge={t("auth.shell.newAccount")}
      title={t("auth.register.title")}
      description={t("auth.register.description")}
      footerPrefix={t("auth.register.footerPrefix")}
      footerLinkLabel={t("auth.register.footerLinkLabel")}
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label htmlFor="email" className="text-sm font-medium text-white">
            {t("auth.register.email")}
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
            {t("auth.register.password")}
          </label>
          <Input
            id="password"
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder={t("auth.register.passwordPlaceholder")}
            autoComplete="new-password"
            className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
            required
          />
        </div>

        <div className="space-y-1.5">
          <label
            htmlFor="confirmPassword"
            className="text-sm font-medium text-white"
          >
            {t("auth.register.confirmPassword")}
          </label>
          <Input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(event) => setConfirmPassword(event.target.value)}
            placeholder={t("auth.register.confirmPasswordPlaceholder")}
            autoComplete="new-password"
            className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
            required
          />
        </div>

        <label className="flex items-start gap-2 text-xs leading-relaxed text-white/90">
          <input
            type="checkbox"
            checked={acceptedTerms}
            onChange={(event) => setAcceptedTerms(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-white/30 bg-transparent accent-[#ff8f00]"
          />
          <span>
            {t("auth.register.termsPrefix")}{" "}
            <Link
              href={"/terms-conditions" as Route}
              className="font-semibold text-[#ffb54a] underline-offset-4 hover:underline"
            >
              {t("footer.termsOfUse")}
            </Link>{" "}
            {t("auth.register.termsJoiner")}{" "}
            <Link
              href={"/privacy-policy" as Route}
              className="font-semibold text-[#ffb54a] underline-offset-4 hover:underline"
            >
              {t("footer.privacyPolicy")}
            </Link>
            .
          </span>
        </label>

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
          {isSubmitting
            ? t("auth.register.submitting")
            : t("auth.register.submit")}
        </Button>

        <AuthSocialButtons
          onProviderClick={handleSocialAuth}
          activeProvider={activeSocialProvider}
          disabled={isSubmitting}
        />
      </form>
    </AuthShell>
  );
}
