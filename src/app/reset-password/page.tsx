"use client";

import Link from "next/link";
import { FormEvent, useEffect, useMemo, useState } from "react";

import type { Route } from "next";
import { useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  clearPasswordResetSession,
  getAuthErrorMessage,
  getPasswordResetSession,
  requestPasswordResetCode,
  resetPasswordWithVerifiedCode,
  savePasswordResetSession,
  verifyPasswordResetCode,
} from "@/lib/auth";

type ResetStep = "code" | "password";

export default function ResetPasswordPage() {
  const { t } = useTranslation();
  const router = useRouter();
  const [step, setStep] = useState<ResetStep>("code");
  const [email, setEmail] = useState("");
  const [resetRequestId, setResetRequestId] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  useEffect(() => {
    const session = getPasswordResetSession();

    if (!session) {
      setError(t("auth.resetPassword.missingSession"));
      return;
    }

    setEmail(session.email);
    setResetRequestId(session.resetRequestId);
  }, [t]);

  const normalizedCode = code.replace(/\D/g, "").slice(0, 4);

  const isCodeDisabled = useMemo(() => {
    return isSubmitting || !email || !resetRequestId || normalizedCode.length !== 4;
  }, [email, isSubmitting, normalizedCode.length, resetRequestId]);

  const isPasswordDisabled = useMemo(() => {
    return (
      isSubmitting ||
      !resetToken ||
      !newPassword ||
      !confirmPassword
    );
  }, [confirmPassword, isSubmitting, newPassword, resetToken]);

  async function handleVerifyCode(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !resetRequestId) {
      setError(t("auth.resetPassword.missingSession"));
      return;
    }

    if (normalizedCode.length !== 4) {
      setError(t("auth.resetPassword.codeLengthError"));
      return;
    }

    setIsSubmitting(true);

    try {
      const result = await verifyPasswordResetCode({
        email,
        resetRequestId,
        code: normalizedCode,
      });

      setResetToken(result.resetToken);
      setStep("password");
      setSuccess(t("auth.resetPassword.codeSuccess"));
    } catch (submitError) {
      setError(
        getAuthErrorMessage(submitError, t("auth.resetPassword.codeError"))
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleResendCode() {
    if (!email) {
      setError(t("auth.resetPassword.missingSession"));
      return;
    }

    setError(null);
    setSuccess(null);
    setIsResending(true);

    try {
      const result = await requestPasswordResetCode({ email });

      setResetRequestId(result.resetRequestId);
      setCode("");
      setResetToken("");
      setStep("code");
      savePasswordResetSession({
        email,
        resetRequestId: result.resetRequestId,
        expiresAt: result.expiresAt,
      });
      setSuccess(t("auth.resetPassword.resendSuccess"));
    } catch (submitError) {
      setError(
        getAuthErrorMessage(submitError, t("auth.resetPassword.resendError"))
      );
    } finally {
      setIsResending(false);
    }
  }

  async function handleResetPassword(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (!email || !resetRequestId || !resetToken) {
      setError(t("auth.resetPassword.sessionExpired"));
      return;
    }

    if (newPassword.length < 10) {
      setError(t("auth.resetPassword.passwordMinError"));
      return;
    }

    if (newPassword !== confirmPassword) {
      setError(t("auth.resetPassword.passwordMatchError"));
      return;
    }

    setIsSubmitting(true);

    try {
      await resetPasswordWithVerifiedCode({
        email,
        resetRequestId,
        resetToken,
        newPassword,
      });

      clearPasswordResetSession();
      router.replace("/login?reset=success" as Route);
    } catch (submitError) {
      setError(
        getAuthErrorMessage(submitError, t("auth.resetPassword.error"))
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <AuthShell
      badge={t("auth.shell.accountRecovery")}
      title={t("auth.resetPassword.title")}
      description={
        email
          ? t("auth.resetPassword.descriptionWithEmail", { email })
          : t("auth.resetPassword.description")
      }
      footerPrefix={t("auth.resetPassword.footerPrefix")}
      footerLinkLabel={t("auth.resetPassword.footerLinkLabel")}
      footerLinkHref="/login"
    >
      {step === "code" ? (
        <form onSubmit={handleVerifyCode} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="reset-code"
              className="text-sm font-medium text-white"
            >
              {t("auth.resetPassword.code")}
            </label>
            <Input
              id="reset-code"
              type="text"
              value={normalizedCode}
              onChange={(event) => setCode(event.target.value)}
              placeholder={t("auth.resetPassword.codePlaceholder")}
              inputMode="numeric"
              autoComplete="one-time-code"
              maxLength={4}
              className="h-12 rounded-md border border-white/20 bg-white text-center text-2xl font-semibold tracking-[0.28em] text-[#0f172a] placeholder:text-center placeholder:text-base placeholder:font-normal placeholder:tracking-normal placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
              required
            />
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
            disabled={isCodeDisabled}
            className="h-11 w-full rounded-md bg-[#ff8f00] text-[#0b3152] hover:bg-[#f57c00]"
          >
            {isSubmitting
              ? t("auth.resetPassword.verifying")
              : t("auth.resetPassword.verifySubmit")}
          </Button>

          <div className="flex flex-wrap items-center justify-between gap-3 text-sm text-white/85">
            <Link
              href={"/forgot-password" as Route}
              className="font-semibold text-[#ffb54a] underline-offset-4 hover:underline"
            >
              {t("auth.resetPassword.changeEmail")}
            </Link>
            <button
              type="button"
              onClick={handleResendCode}
              disabled={isResending || !email}
              className="font-semibold text-[#ffb54a] underline-offset-4 transition hover:underline disabled:cursor-not-allowed disabled:text-white/50"
            >
              {isResending
                ? t("auth.resetPassword.resending")
                : t("auth.resetPassword.resendCode")}
            </button>
          </div>
        </form>
      ) : (
        <form onSubmit={handleResetPassword} className="space-y-5">
          <div className="space-y-1.5">
            <label
              htmlFor="new-password"
              className="text-sm font-medium text-white"
            >
              {t("auth.resetPassword.newPassword")}
            </label>
            <Input
              id="new-password"
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder={t("auth.resetPassword.newPasswordPlaceholder")}
              autoComplete="new-password"
              className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
              required
            />
          </div>

          <div className="space-y-1.5">
            <label
              htmlFor="confirm-new-password"
              className="text-sm font-medium text-white"
            >
              {t("auth.resetPassword.confirmPassword")}
            </label>
            <Input
              id="confirm-new-password"
              type="password"
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder={t("auth.resetPassword.confirmPasswordPlaceholder")}
              autoComplete="new-password"
              className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
              required
            />
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
            disabled={isPasswordDisabled}
            className="h-11 w-full rounded-md bg-[#ff8f00] text-[#0b3152] hover:bg-[#f57c00]"
          >
            {isSubmitting
              ? t("auth.resetPassword.submitting")
              : t("auth.resetPassword.submit")}
          </Button>

          <button
            type="button"
            onClick={() => {
              setStep("code");
              setResetToken("");
              setSuccess(null);
              setError(null);
            }}
            className="w-full text-sm font-semibold text-[#ffb54a] underline-offset-4 hover:underline"
          >
            {t("auth.resetPassword.backToCode")}
          </button>
        </form>
      )}
    </AuthShell>
  );
}
