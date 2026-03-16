"use client";

import Image from "next/image";
import Link from "next/link";

import {
  IconChevronLeft,
  IconChevronRight,
  IconCompassFilled,
  IconHomeFilled,
  IconMicrophone,
  IconSearch,
  IconSettingsFilled,
  IconShieldFilled,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import safeReporting from "@/assets/safe_reporting.svg?url";
import { useSafeSpeakProfile } from "@/hooks/use-safespeak-profile";
import {
  communityOptions,
  cultureOptions,
  faithOptions,
  interpreterLanguageOptions,
} from "@/lib/safespeak-profile";
import { cn } from "@/lib/utils";

function SettingsQuickCard({
  icon,
  title,
  subtitle,
  actionLabel,
  subtitleClassName,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  actionLabel: string;
  subtitleClassName?: string;
}) {
  return (
    <article className="rounded-[18px] border border-[#dbe4f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-5">
      <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#1d72d8]">
        {icon}
      </div>
      <h3 className="mt-3 text-[22px] font-bold leading-tight text-[#1f2a3a]">
        {title}
      </h3>
      <p className={cn("mt-1 text-xs text-[#6a7d94]", subtitleClassName)}>
        {subtitle}
      </p>
      <button className="mt-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#1d72d8]">
        {actionLabel}
      </button>
    </article>
  );
}

export function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { profile, updateProfile } = useSafeSpeakProfile();
  const isSpanish =
    (i18n.resolvedLanguage ?? i18n.language ?? "en").toLowerCase() === "es";
  const profileCopy = isSpanish
    ? {
        profileSaved: "Los cambios se guardan en este dispositivo.",
        profileEditorTitle: "Preferencias del perfil",
        profileEditorBody:
          "Estas selecciones ayudan a adaptar referencias, guiones de llamada y apoyo cultural.",
        culturalProfile: "Perfil cultural",
        faithProfile: "Perfil de fe",
        communityBackground: "Comunidad",
        interpreterLanguage: "Idioma del interprete",
        shareProfileInReferral: "Compartir contexto cultural en derivaciones",
        shareProfileHint:
          "Incluye tu comunidad, fe e idioma preferido cuando prepares una derivacion.",
        interpreterPreview: "Los guiones de llamada usaran",
        referralPreview: "Estado de derivacion",
        referralEnabled: "Se compartira el contexto del perfil",
        referralDisabled: "Se ocultara el contexto del perfil",
      }
    : {
        profileSaved: "Changes save on this device.",
        profileEditorTitle: "Profile preferences",
        profileEditorBody:
          "These selections help tailor warm referrals, call scripts, and culturally responsive support.",
        culturalProfile: "Cultural profile",
        faithProfile: "Faith profile",
        communityBackground: "Community background",
        interpreterLanguage: "Interpreter language",
        shareProfileInReferral: "Share cultural context in warm referrals",
        shareProfileHint:
          "Include your community, faith, and preferred language when a referral is prepared.",
        interpreterPreview: "Call scripts will use",
        referralPreview: "Referral status",
        referralEnabled: "Profile context will be shared",
        referralDisabled: "Profile context will stay private",
      };

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <div className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]">
            <IconChevronLeft size={14} />
            {t("dashboard.settings.profileSettings")}
          </div>
          <button className="text-xs font-medium text-[#7b8798]">
            {t("common.cancel")}
          </button>
        </div>

        <div className="mt-4">
          <h1 className="text-4xl font-extrabold leading-[0.9] text-[#0f4f96] sm:text-5xl">
            {t("dashboard.settings.heyAlex")}
          </h1>
          <p className="mt-1 text-sm text-[#6a7d94]">
            {t("dashboard.settings.secureSpace")}
          </p>
        </div>

        <article className="relative mt-4 overflow-hidden rounded-[22px] bg-[#0e5d9f] p-5 text-white shadow-[0_16px_34px_rgba(14,93,159,0.26)] sm:p-6">
          <div className="pointer-events-none absolute -right-16 top-1/2 h-56 w-56 -translate-y-1/2 rounded-full bg-[#2f7cb6]/45" />

          <div className="relative flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <h2 className="text-[28px] font-bold leading-tight sm:text-[34px]">
                {t("dashboard.settings.culturalFaithProfile")}
              </h2>
              <p className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-white/90">
                <IconHomeFilled size={12} />
                {profile.faithProfile}
              </p>
              <p className="mt-3 max-w-[580px] text-xs leading-[1.45] text-white/80">
                {t("dashboard.settings.culturalPreference")}
              </p>
            </div>

            <div className="rounded-[18px] bg-white/12 px-4 py-3 text-white shadow-[0_8px_20px_rgba(6,46,80,0.18)] sm:shrink-0">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-white/70">
                {profile.communityBackground}
              </p>
              <p className="mt-1 text-sm font-semibold text-white">
                {profile.interpreterLanguage}
              </p>
              <p className="mt-1 text-[10px] text-white/75">
                {profileCopy.profileSaved}
              </p>
            </div>
          </div>
        </article>

        <article className="mt-4 rounded-[22px] border border-[#dbe4f0] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-6">
          <div className="flex flex-col gap-5">
            <div>
              <h3 className="text-[24px] font-bold leading-tight text-[#1f2a3a]">
                {profileCopy.profileEditorTitle}
              </h3>
              <p className="mt-1 max-w-[720px] text-sm text-[#6a7d94]">
                {profileCopy.profileEditorBody}
              </p>
            </div>

            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <label className="text-sm font-semibold text-[#334155]">
                {profileCopy.culturalProfile}
                <select
                  value={profile.culturalProfile}
                  onChange={(event) =>
                    updateProfile((currentProfile) => ({
                      ...currentProfile,
                      culturalProfile: event.target.value as (typeof cultureOptions)[number],
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-[12px] border border-[#dbe4f0] bg-[#f8fbff] px-3 text-sm font-medium text-[#1f2a3a] outline-none"
                >
                  {cultureOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-[#334155]">
                {profileCopy.faithProfile}
                <select
                  value={profile.faithProfile}
                  onChange={(event) =>
                    updateProfile((currentProfile) => ({
                      ...currentProfile,
                      faithProfile: event.target.value as (typeof faithOptions)[number],
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-[12px] border border-[#dbe4f0] bg-[#f8fbff] px-3 text-sm font-medium text-[#1f2a3a] outline-none"
                >
                  {faithOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-[#334155]">
                {profileCopy.communityBackground}
                <select
                  value={profile.communityBackground}
                  onChange={(event) =>
                    updateProfile((currentProfile) => ({
                      ...currentProfile,
                      communityBackground:
                        event.target.value as (typeof communityOptions)[number],
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-[12px] border border-[#dbe4f0] bg-[#f8fbff] px-3 text-sm font-medium text-[#1f2a3a] outline-none"
                >
                  {communityOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>

              <label className="text-sm font-semibold text-[#334155]">
                {profileCopy.interpreterLanguage}
                <select
                  value={profile.interpreterLanguage}
                  onChange={(event) =>
                    updateProfile((currentProfile) => ({
                      ...currentProfile,
                      interpreterLanguage:
                        event.target.value as (typeof interpreterLanguageOptions)[number],
                    }))
                  }
                  className="mt-2 h-11 w-full rounded-[12px] border border-[#dbe4f0] bg-[#f8fbff] px-3 text-sm font-medium text-[#1f2a3a] outline-none"
                >
                  {interpreterLanguageOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="grid grid-cols-1 gap-3 lg:grid-cols-[1.2fr_0.8fr]">
              <article className="rounded-[18px] border border-[#dbe4f0] bg-[#f8fbff] p-4">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-sm font-bold text-[#1f2a3a]">
                      {profileCopy.shareProfileInReferral}
                    </p>
                    <p className="mt-1 text-xs text-[#6a7d94]">
                      {profileCopy.shareProfileHint}
                    </p>
                  </div>

                  <button
                    type="button"
                    role="switch"
                    aria-checked={profile.shareProfileInReferral}
                    onClick={() =>
                      updateProfile((currentProfile) => ({
                        ...currentProfile,
                        shareProfileInReferral:
                          !currentProfile.shareProfileInReferral,
                      }))
                    }
                    className={cn(
                      "relative inline-flex h-7 w-12 shrink-0 items-center rounded-full transition-colors",
                      profile.shareProfileInReferral
                        ? "bg-[#0f5d9f]"
                        : "bg-[#cbd5e1]"
                    )}
                  >
                    <span
                      className={cn(
                        "h-5 w-5 rounded-full bg-white shadow-[0_1px_2px_rgba(15,23,42,0.35)] transition-transform",
                        profile.shareProfileInReferral
                          ? "translate-x-6"
                          : "translate-x-1"
                      )}
                    />
                  </button>
                </div>
              </article>

              <article className="rounded-[18px] border border-[#dbe4f0] bg-white p-4">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {profileCopy.interpreterPreview}
                </p>
                <p className="mt-2 text-lg font-extrabold text-[#0f5d9f]">
                  {profile.interpreterLanguage}
                </p>
                <p className="mt-4 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {profileCopy.referralPreview}
                </p>
                <p className="mt-2 text-sm font-semibold text-[#1f2a3a]">
                  {profile.shareProfileInReferral
                    ? profileCopy.referralEnabled
                    : profileCopy.referralDisabled}
                </p>
              </article>
            </div>
          </div>
        </article>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
          <SettingsQuickCard
            icon={<IconCompassFilled size={17} />}
            title={t("dashboard.settings.language")}
            subtitle={profile.interpreterLanguage}
            actionLabel={t("dashboard.settings.update")}
          />
          <SettingsQuickCard
            icon={<IconShieldFilled size={16} />}
            title={t("dashboard.settings.emailSecurity")}
            subtitle={t("dashboard.settings.activeSecure")}
            subtitleClassName="text-[#16914a] font-semibold"
            actionLabel={t("dashboard.settings.manage")}
          />
          <SettingsQuickCard
            icon={<IconSettingsFilled size={16} />}
            title={t("dashboard.settings.accountSettings")}
            subtitle={t("dashboard.settings.manageProfileDetails")}
            actionLabel={t("dashboard.settings.editProfile")}
          />
        </div>

        <div className="mt-3 grid grid-cols-1 gap-3 xl:grid-cols-3">
          <article className="relative overflow-hidden rounded-[18px] border border-[#dbe4f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-5">
            <div className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-[#e8f1ff] text-[#1d72d8]">
              <IconSearch size={15} />
            </div>
            <h3 className="mt-3 text-[22px] font-bold leading-tight text-[#1f2a3a]">
              {t("dashboard.settings.faqs")}
            </h3>
            <p className="mt-1 max-w-[240px] text-xs text-[#6a7d94]">
              {t("dashboard.settings.faqDescription")}
            </p>
            <button className="mt-4 text-xs font-extrabold uppercase tracking-[0.08em] text-[#1d72d8]">
              {t("dashboard.settings.viewAll")}
            </button>
            <span className="pointer-events-none absolute -bottom-7 right-4 text-[86px] font-extrabold leading-none text-[#e3e9f2]">
              ?
            </span>
          </article>

          <article className="rounded-[18px] border border-[#dbe4f0] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.05)] sm:p-5 xl:col-span-2">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex min-w-0 items-start gap-3">
                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-[#f7e6f3] text-[#dd2c8b]">
                  <IconMicrophone size={16} />
                </span>
                <div className="min-w-0">
                  <h3 className="text-[22px] font-bold leading-tight text-[#1f2a3a]">
                    {t("dashboard.settings.helpSupport")}
                  </h3>
                  <p className="mt-1 text-xs text-[#6a7d94]">
                    {t("dashboard.settings.helpSupportDescription")}
                  </p>
                </div>
              </div>

              <Link
                href={{
                  pathname: "/dashboard/settings",
                  query: { view: "support" },
                }}
                className="inline-flex h-11 items-center justify-center rounded-[14px] bg-[#0f5d9f] px-6 text-sm font-bold text-white shadow-[0_8px_18px_rgba(15,93,159,0.25)]"
              >
                {t("dashboard.settings.chatNow")}
              </Link>
            </div>
          </article>
        </div>

        <div className="mt-3 flex justify-end">
          <Link
            href="/dashboard/settings/privacy-policy"
            className="inline-flex h-10 items-center rounded-full border border-[#d6e0ec] bg-white px-5 text-xs font-semibold text-[#0f5d9f] transition hover:bg-[#f7fbff]"
          >
            {t("footer.privacyPolicy")}
          </Link>
        </div>
      </div>
    </div>
  );
}

export function SettingsSupportPage() {
  const { t } = useTranslation();

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.settings.profileSettings")}
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="flex flex-col items-center px-2 pb-3 pt-7 sm:pt-10">
          <div className="relative h-[102px] w-[102px] sm:h-[128px] sm:w-[128px]">
            <Image
              src={safeReporting}
              alt="Help and support"
              fill
              className="object-contain"
            />
          </div>

          <h2 className="mt-4 text-center text-[30px] font-bold leading-[1.05] text-[#ff9800] sm:text-[36px]">
            {t("dashboard.settings.supportHeading")}
          </h2>
          <p className="mt-1 text-center text-xs text-[#95a3b6]">
            {t("dashboard.settings.supportSubheading")}
          </p>

          <form className="mt-5 w-full rounded-[16px] border border-[#dde6f1] bg-white p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
            <div>
              <label
                htmlFor="support-title"
                className="text-[11px] font-semibold text-[#374151]"
              >
                {t("dashboard.settings.supportTitleLabel")}
              </label>
              <input
                id="support-title"
                type="text"
                placeholder={t("dashboard.settings.supportTitlePlaceholder")}
                className="mt-2 h-10 w-full rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] px-3 text-xs text-[#1f2937] outline-none placeholder:text-[#9ca3af] focus:border-[#cfd8e3]"
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="support-message"
                className="text-[11px] font-semibold text-[#374151]"
              >
                {t("dashboard.settings.supportMessageLabel")}
              </label>
              <textarea
                id="support-message"
                rows={6}
                placeholder={t("dashboard.settings.supportMessagePlaceholder")}
                className="mt-2 w-full resize-none rounded-[8px] border border-[#e2e8f0] bg-[#f8fafc] px-3 py-2 text-xs text-[#1f2937] outline-none placeholder:text-[#9ca3af] focus:border-[#cfd8e3]"
              />
            </div>

            <button className="mt-4 inline-flex h-10 w-full items-center justify-center gap-1 rounded-[12px] bg-[#ff9800] text-xs font-bold text-white shadow-[0_8px_20px_rgba(255,152,0,0.33)]">
              {t("dashboard.settings.send")}
              <IconChevronRight size={12} />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}

export function SettingsPrivacyPolicyPage() {
  const { t } = useTranslation();
  const policyItems = [
    t("dashboard.settings.privacyItems.0"),
    t("dashboard.settings.privacyItems.1"),
    t("dashboard.settings.privacyItems.2"),
    t("dashboard.settings.privacyItems.3"),
    t("dashboard.settings.privacyItems.4"),
  ];

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/settings"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.settings.privacyPolicyTitle")}
          </Link>
          <Link
            href="/dashboard/settings"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <article className="mt-4 rounded-[10px] border border-[#e1e8f2] bg-white px-4 py-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:px-6 sm:py-8">
          <p className="text-center text-[10px] font-bold uppercase tracking-[0.12em] text-[#8b97a8]">
            {t("dashboard.settings.privacyEffectiveDate")}
          </p>
          <h2 className="mt-2 text-center text-[34px] font-extrabold leading-[1.04] text-[#1f2a3a] sm:text-[40px]">
            {t("dashboard.settings.privacyAgreement")}
          </h2>
          <p className="mx-auto mt-2 max-w-[760px] text-center text-xs leading-[1.6] text-[#6a7d94]">
            {t("dashboard.settings.privacyIntro")}
          </p>

          <div className="mt-6 space-y-3">
            {policyItems.map((item, index) => (
              <div key={item} className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-[#eaf2ff] text-[10px] font-bold text-[#1d72d8]">
                  {index + 1}
                </span>
                <p className="text-sm leading-[1.65] text-[#42546b]">{item}</p>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-2">
            <Link
              href="/dashboard/settings"
              className="inline-flex h-10 items-center rounded-lg border border-[#d8e0eb] bg-white px-5 text-xs font-semibold text-[#42546b] transition hover:bg-[#f8fafd]"
            >
              {t("dashboard.settings.decline")}
            </Link>
            <Link
              href="/dashboard/settings"
              className="inline-flex h-10 items-center rounded-lg bg-[#ef4444] px-5 text-xs font-bold text-white transition hover:bg-[#dc2626]"
            >
              {t("dashboard.settings.acceptContinue")}
            </Link>
          </div>
        </article>
      </div>
    </div>
  );
}
