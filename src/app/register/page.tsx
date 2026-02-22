"use client";

import { FormEvent, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";

import { AuthShell } from "@/components/auth/auth-shell";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function RegisterPage() {
  const { t } = useTranslation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isDisabled = useMemo(() => {
    return (
      isSubmitting
      || !fullName.trim()
      || !email.trim()
      || !password
      || !confirmPassword
      || !acceptedTerms
    );
  }, [acceptedTerms, confirmPassword, email, fullName, isSubmitting, password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);

    if (password.length < 8) {
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
      await new Promise<void>((resolve) => {
        window.setTimeout(resolve, 700);
      });

      setSuccess(t("auth.register.success"));
      setFullName("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
      setAcceptedTerms(false);
    } catch (submitError) {
      const message =
        submitError instanceof Error ? submitError.message : t("auth.register.error");
      setError(message);
    } finally {
      setIsSubmitting(false);
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
          <label htmlFor="fullName" className="text-sm font-medium text-white">
            {t("auth.register.fullName")}
          </label>
          <Input
            id="fullName"
            type="text"
            value={fullName}
            onChange={(event) => setFullName(event.target.value)}
            placeholder={t("auth.register.fullNamePlaceholder")}
            autoComplete="name"
            className="h-11 rounded-md border border-white/20 bg-white text-[#0f172a] placeholder:text-slate-400 focus-visible:ring-[#4ba3d9]"
            required
          />
        </div>

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
          <label htmlFor="confirmPassword" className="text-sm font-medium text-white">
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
          {t("auth.register.terms")}
        </label>

        {error ? (
          <p className="rounded-md border border-[#fecaca]/70 bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">{error}</p>
        ) : null}

        {success ? (
          <p className="rounded-md border border-[#bbf7d0]/70 bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">{success}</p>
        ) : null}

        <Button
          type="submit"
          size="lg"
          disabled={isDisabled}
          className="h-11 w-full rounded-md bg-[#ff8f00] text-[#0b3152] hover:bg-[#f57c00]"
        >
          {isSubmitting ? t("auth.register.submitting") : t("auth.register.submit")}
        </Button>
      </form>
    </AuthShell>
  );
}
