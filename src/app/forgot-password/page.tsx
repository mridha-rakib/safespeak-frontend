"use client";

import { FormEvent, useMemo, useState } from "react";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  getAuthErrorMessage,
  requestPasswordResetCode,
  savePasswordResetSession,
} from "@/lib/auth";

export default function ForgotPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isDisabled = useMemo(() => {
    return isSubmitting || !email.trim();
  }, [email, isSubmitting]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const normalizedEmail = email.trim().toLowerCase();

    try {
      const result = await requestPasswordResetCode({
        email: normalizedEmail,
      });

      savePasswordResetSession({
        email: normalizedEmail,
        resetRequestId: result.resetRequestId,
        expiresAt: result.expiresAt,
      });
      router.push("/reset-password" as Route);
    } catch (submitError) {
      setError(
        getAuthErrorMessage(
          submitError,
          t("auth.forgotPassword.error")
        )
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      badge={t("auth.shell.accountRecovery")}
      title={t("auth.forgotPassword.title")}
      description={t("auth.forgotPassword.description")}
      footerPrefix={t("auth.forgotPassword.footerPrefix")}
      footerLinkLabel={t("auth.forgotPassword.footerLinkLabel")}
      footerLinkHref="/login"
    >
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="space-y-1.5">
          <label
            htmlFor="forgot-password-email"
            className="text-sm font-medium text-white"
          >
            {t("auth.forgotPassword.email")}
          </label>
          <Input
            id="forgot-password-email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
            required
          />
        </div>

        {error ? (
          <p className="rounded-md border border-[#fecaca]/70 bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">
            {error}
          </p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={isDisabled}
          className="h-11 w-full rounded-md bg-[#ff8f00] text-[#0b3152] hover:bg-[#f57c00]"
        >
          {isSubmitting
            ? t("auth.forgotPassword.submitting")
            : t("auth.forgotPassword.submit")}
        </Button>
      </form>
    </AuthShell>
  );
}
