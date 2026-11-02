"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  IconArrowLeft,
  IconArrowRight,
  IconBellFilled,
  IconChevronDown,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconLanguage,
  IconMail,
  IconMicrophone,
  IconPhone,
  IconScale,
  IconShieldFilled,
  IconSparkles,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import {
  ConsentRequiredError,
  grantConsent,
  type ConsentRequirement,
} from "@/lib/consent";
import { useSafeSpeakProfile } from "@/hooks/use-safespeak-profile";
import { ensureValidAuthSession, type AuthSession } from "@/lib/auth";
import {
  createWarmReferral,
  getSupportService,
  listAdvocates,
  type SupportServiceRecord,
} from "@/lib/support-client";
import { cn } from "@/lib/utils";

const explorerServiceIds = [
  "legal-aid",
  "community-support",
  "counselling",
  "health-services",
  "elder-support",
  "crisis-support",
  "online-safety",
] as const;

type ExplorerServiceId = (typeof explorerServiceIds)[number];

function isExplorerServiceId(value?: string): value is ExplorerServiceId {
  if (!value) {
    return false;
  }

  return explorerServiceIds.includes(value as ExplorerServiceId);
}

function ContactInfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-xl bg-[#f7f9fc] px-3 py-3">
      <div className="flex items-start gap-2.5">
        <span className="mt-0.5 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#e5eefb] text-[#3b82f6]">
          {icon}
        </span>
        <div>
          <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#91a0b4]">
            {label}
          </p>
          <p className="mt-0.5 text-[13px] font-semibold text-[#21324c]">
            {value}
          </p>
        </div>
      </div>
    </div>
  );
}

function serviceDetailIcon(icon?: SupportServiceRecord["cardIcon"]) {
  if (icon === "shield") return <IconShieldFilled size={23} />;
  if (icon === "phone") return <IconPhone size={23} />;
  if (icon === "community") return <IconCompassFilled size={23} />;
  if (icon === "counselling") return <IconMicrophone size={23} />;
  if (icon === "home") return <IconHomeFilled size={23} />;
  if (icon === "bell") return <IconBellFilled size={23} />;
  if (icon === "sparkles") return <IconSparkles size={23} />;
  if (icon === "scale") return <IconScale size={23} />;

  return <IconFolderFilled size={23} />;
}

export function ExplorerServiceDetailsPage({
  serviceId,
}: {
  serviceId?: string;
}) {
  const { t } = useTranslation();
  const { profile } = useSafeSpeakProfile();
  const [includeIncidentSummary, setIncludeIncidentSummary] = useState(true);
  const [isReferralPrepared, setIsReferralPrepared] = useState(false);
  const [isReferralPreviewOpen, setIsReferralPreviewOpen] = useState(false);
  const [copiedReferral, setCopiedReferral] = useState(false);
  const [serviceRecord, setServiceRecord] = useState<SupportServiceRecord | null>(null);
  const [serviceError, setServiceError] = useState<string | null>(null);
  const [pendingConsentRequirement, setPendingConsentRequirement] =
    useState<ConsentRequirement | null>(null);
  const [isGrantingConsent, setIsGrantingConsent] = useState(false);
  const [isSubmittingReferral, setIsSubmittingReferral] = useState(false);
  const [advocateCount, setAdvocateCount] = useState(0);
  const [authSession, setAuthSession] = useState<AuthSession | null>(null);
  const selectedServiceId: ExplorerServiceId = isExplorerServiceId(serviceId)
    ? serviceId
    : "community-support";

  const serviceMap: Record<ExplorerServiceId, { title: string; subtitle: string }> = {
    "legal-aid": {
      title: t("dashboard.explorer.legalAid"),
      subtitle: t("dashboard.explorer.legalAidSubtitle"),
    },
    "community-support": {
      title: t("dashboard.explorer.communitySupport"),
      subtitle: t("dashboard.explorer.communitySupportSubtitle"),
    },
    counselling: {
      title: t("dashboard.explorer.counselling"),
      subtitle: t("dashboard.explorer.counsellingSubtitle"),
    },
    "health-services": {
      title: t("dashboard.explorer.healthServices"),
      subtitle: t("dashboard.explorer.healthServicesSubtitle"),
    },
    "elder-support": {
      title: t("dashboard.explorer.elderSupport"),
      subtitle: t("dashboard.explorer.elderSupportSubtitle"),
    },
    "crisis-support": {
      title: t("dashboard.explorer.crisisSupport"),
      subtitle: t("dashboard.explorer.crisisSupportSubtitle"),
    },
    "online-safety": {
      title: t("dashboard.explorer.onlineSafety"),
      subtitle: t("dashboard.explorer.onlineSafetySubtitle"),
    },
  };
  const selectedService = serviceMap[selectedServiceId];
  const serviceTitle = serviceRecord?.name ?? selectedService.title;
  const phoneValue = serviceRecord?.phone ?? "Not provided";
  const emailValue = serviceRecord?.email ?? "Not provided";
  const userSafeContact = authSession?.user.email;
  const referralContactPreference = userSafeContact ? "email" : "in_app";
  const safeReferralContact = userSafeContact ?? "SafeSpeak in-app follow-up";
  const requestedServiceId = serviceRecord?.id ?? serviceRecord?._id ?? serviceId ?? selectedServiceId;
  const referralNotes = [
    `Warm referral request for ${serviceTitle}.`,
    includeIncidentSummary
      ? "Prepared to include: incident summary, immediate safety concerns, and preferred contact method."
      : "Prepared to include: preferred contact method only.",
    `Interpreter preference: ${profile.interpreterLanguage}.`,
    profile.shareProfileInReferral
      ? `Cultural context approved for sharing: ${profile.culturalProfile}; faith profile: ${profile.faithProfile}; community background: ${profile.communityBackground}.`
      : "Cultural profile withheld at the user's request.",
    "SafeSpeak is acting as a guidance and connection layer, not a legal or clinical provider.",
  ].join(" ");
  const emailHref = `mailto:${serviceRecord?.email ?? ""}?subject=${encodeURIComponent(
    `Warm referral request - ${serviceTitle}`
  )}&body=${encodeURIComponent(referralNotes)}`;
  const referralMinimalSummary = {
    incidentSummary: includeIncidentSummary
      ? "The user is requesting support and has approved sharing a concise incident summary prepared in SafeSpeak."
      : undefined,
    immediateSafetyConcerns: serviceRecord?.crisis
      ? "The selected support service is marked as crisis-capable. Immediate danger still requires 000."
      : undefined,
    preferredContactMethod: referralContactPreference === "email" ? "email" : "in-app",
    interpreterPreference: profile.interpreterLanguage,
    culturalContext: profile.shareProfileInReferral
      ? `${profile.culturalProfile}; ${profile.faithProfile}; ${profile.communityBackground}`
      : undefined,
    informationOnlyDisclaimer: true,
  };
  const referralIncludedFields = Object.entries(referralMinimalSummary)
    .filter(([, value]) => value !== undefined && value !== "")
    .map(([key]) => key);

  useEffect(() => {
    let isActive = true;

    void ensureValidAuthSession()
      .then((session) => {
        if (isActive) {
          setAuthSession(session);
        }
      })
      .catch(() => {
        if (isActive) {
          setAuthSession(null);
        }
      });

    void getSupportService(serviceId ?? selectedServiceId)
      .then((service) => {
        if (isActive) {
          setServiceRecord(service);
        }
      })
      .catch((error) => {
        if (isActive) {
          setServiceError(
            error instanceof Error
              ? error.message
              : "Support service details could not be loaded."
          );
        }
      });

    void listAdvocates()
      .then((catalog) => {
        if (isActive) {
          setAdvocateCount(catalog.advocates.length);
        }
      })
      .catch(() => {
        if (isActive) {
          setAdvocateCount(0);
        }
      });

    return () => {
      isActive = false;
    };
  }, [selectedServiceId, serviceId]);

  const copyReferralNotes = async () => {
    if (typeof navigator === "undefined" || !navigator.clipboard) {
      return;
    }

    await navigator.clipboard.writeText(referralNotes);
    setCopiedReferral(true);

    window.setTimeout(() => {
      setCopiedReferral(false);
    }, 1800);
  };

  const prepareWarmReferral = async () => {
    if (!isReferralPreviewOpen) {
      setIsReferralPreviewOpen(true);
      return;
    }

    setIsSubmittingReferral(true);
    setServiceError(null);

    try {
      await createWarmReferral({
        serviceId: requestedServiceId,
        contactPreference: referralContactPreference,
        safeContact: safeReferralContact,
        notes: referralNotes,
        minimalSummary: referralMinimalSummary,
        includedFields: referralIncludedFields,
        shareProfileContext: profile.shareProfileInReferral,
        metadata: {
          serviceType: serviceRecord?.type,
          source: "support_explorer",
        },
      });
      setIsReferralPrepared(true);
      setIsReferralPreviewOpen(false);
    } catch (error) {
      if (error instanceof ConsentRequiredError) {
        setPendingConsentRequirement(error.requirement);
        return;
      }

      setServiceError(
        error instanceof Error
          ? error.message
          : "Warm referral could not be prepared."
      );
    } finally {
      setIsSubmittingReferral(false);
    }
  };

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard/explorer"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconArrowLeft size={14} />
            {t("dashboard.explorer.serviceDetails.title")}
          </Link>
          <Link href="/dashboard/explorer" className="text-xs font-medium text-[#7b8798]">
            {t("common.cancel")}
          </Link>
        </div>

        <section className="mt-4 rounded-[16px] border border-[#dae3f0] bg-white px-4 py-8 sm:px-6">
          <div className="mx-auto flex max-w-[560px] flex-col items-center text-center">
            <div className="relative inline-flex h-12 w-12 items-center justify-center rounded-xl bg-[#eef3fb] text-[#24344d]">
              {serviceDetailIcon(serviceRecord?.cardIcon)}
              <span className="absolute -bottom-0.5 -right-0.5 h-3 w-3 rounded-full bg-[#35c66a] ring-2 ring-white" />
            </div>

            <h1 className="mt-4 text-[30px] font-extrabold leading-[1.05] text-[#1f2a3a] sm:text-[46px]">
              {serviceTitle}
            </h1>
            <p className="mt-1 text-sm font-medium text-[#5b79bd]">
              {serviceRecord?.description ?? selectedService.subtitle}
            </p>
            {!serviceRecord && serviceError ? (
              <p className="mt-2 rounded-full bg-[#fff7ed] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#9a5b12]">
                Local fallback service details
              </p>
            ) : null}

            <span className="mt-4 inline-flex items-center gap-1.5 rounded-full bg-[#dff4e5] px-3 py-1 text-[11px] font-semibold text-[#1a8b3c]">
              <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#2dc567]">
                <span className="h-1.5 w-1.5 rounded-full bg-white" />
              </span>
              {serviceRecord?.availabilityLabel ?? t("dashboard.explorer.serviceDetails.availableNow")}
            </span>
          </div>
        </section>

        <section className="mt-3 rounded-[16px] border border-[#dae3f0] bg-white px-4 py-4 sm:px-6">
          {serviceError ? (
            <div className="mb-3 rounded-[12px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
              {serviceError}
            </div>
          ) : null}
          <h2 className="text-sm font-bold text-[#2b3d58]">
            {t("dashboard.explorer.serviceDetails.contactInformation")}
          </h2>
          <div className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-3">
            <ContactInfoItem
              icon={<IconPhone size={13} />}
              label={t("dashboard.explorer.serviceDetails.phone")}
              value={phoneValue}
            />
            <ContactInfoItem
              icon={<IconMail size={13} />}
              label={t("dashboard.explorer.serviceDetails.email")}
              value={emailValue}
            />
            <ContactInfoItem
              icon={<IconLanguage size={13} />}
              label={t("dashboard.explorer.serviceDetails.languages")}
              value={`${serviceRecord?.languages?.join(", ") ?? "Not provided"} | ${profile.interpreterLanguage}`}
            />
          </div>
          {serviceRecord?.websiteUrl || serviceRecord?.bookingUrl || serviceRecord?.eligibility?.length ? (
            <div className="mt-4 rounded-[14px] border border-[#e1eaf4] bg-[#f8fbff] px-4 py-3 text-[11px] text-[#60728a]">
              {serviceRecord?.eligibility?.length ? (
                <p>
                  <span className="font-bold text-[#2b3d58]">Eligibility:</span>{" "}
                  {serviceRecord.eligibility.join(", ")}
                </p>
              ) : null}
              {serviceRecord?.websiteUrl ? (
                <a
                  className="mt-2 inline-flex font-bold text-[#0f5d9f]"
                  href={serviceRecord.websiteUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Visit website
                </a>
              ) : null}
              {serviceRecord?.bookingUrl ? (
                <a
                  className="mt-2 inline-flex font-bold text-[#0f5d9f]"
                  href={serviceRecord.bookingUrl}
                  rel="noreferrer"
                  target="_blank"
                >
                  Open booking link
                </a>
              ) : null}
            </div>
          ) : null}
        </section>

        <section className="mt-3 rounded-[16px] border border-[#dae3f0] bg-[#edf3fb] px-4 py-5 sm:px-6 sm:py-6">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-[560px]">
              <h3 className="inline-flex items-center gap-2 text-[29px] font-extrabold leading-none text-[#24344d]">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-[#dbe4f1] text-[13px] font-bold text-[#2b3d58]">
                  *
                </span>
                {serviceRecord?.referralTitle ?? t("dashboard.explorer.serviceDetails.warmReferral")}
              </h3>
              <p className="mt-4 text-sm leading-6 text-[#6e8099]">
                {serviceRecord?.referralDescription ??
                  t("dashboard.explorer.serviceDetails.warmReferralDescription")}
              </p>
            </div>

            <div className="w-full max-w-[292px]">
              <div className="mb-3 rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#d7deea]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8092aa]">
                  Profile context
                </p>
                <p className="mt-1 text-[12px] font-semibold text-[#273955]">
                  {profile.culturalProfile} | {profile.faithProfile}
                </p>
                <p className="mt-1 text-[10px] text-[#98a6b9]">
                  {profile.shareProfileInReferral
                    ? `Warm referral can include ${profile.communityBackground} context and ${profile.interpreterLanguage} interpreter preference.`
                    : "Warm referral will exclude profile context until you choose to share it."}
                </p>
              </div>

              <div className="rounded-xl bg-white px-3 py-2 shadow-sm ring-1 ring-[#d7deea]">
                <div className="flex items-center justify-between gap-3">
                  <div>
                    <p className="text-[10px] font-semibold text-[#273955]">
                      {t("dashboard.explorer.serviceDetails.includeIncidentSummary")}
                    </p>
                    <p className="text-[9px] text-[#98a6b9]">
                      {t("dashboard.explorer.serviceDetails.includeIncidentSummaryHelp")}
                    </p>
                  </div>
                  <button
                    type="button"
                    aria-pressed={includeIncidentSummary}
                    aria-label={t("dashboard.explorer.serviceDetails.includeIncidentSummary")}
                    onClick={() => setIncludeIncidentSummary((current) => !current)}
                    className={cn(
                      "relative h-6 w-11 rounded-full transition",
                      includeIncidentSummary ? "bg-[#3b70e8]" : "bg-[#cad4e3]"
                    )}
                  >
                    <span
                      className={cn(
                        "absolute top-0.5 h-5 w-5 rounded-full bg-white shadow-sm transition",
                        includeIncidentSummary ? "left-[22px]" : "left-0.5"
                      )}
                    />
                  </button>
                </div>
              </div>

              {isReferralPreviewOpen ? (
                <div className="mt-3 rounded-xl bg-white px-3 py-3 shadow-sm ring-1 ring-[#d7deea]">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8092aa]">
                    Sharing preview
                  </p>
                  <div className="mt-2 space-y-2 text-[11px] leading-5 text-[#42566d]">
                    <p>
                      <span className="font-bold text-[#273955]">Service:</span> {serviceTitle}
                    </p>
                    <p>
                      <span className="font-bold text-[#273955]">Safe contact:</span> {safeReferralContact}
                    </p>
                    {referralMinimalSummary.incidentSummary ? (
                      <p>
                        <span className="font-bold text-[#273955]">Summary:</span>{" "}
                        {referralMinimalSummary.incidentSummary}
                      </p>
                    ) : null}
                    <p>
                      <span className="font-bold text-[#273955]">Interpreter:</span>{" "}
                      {referralMinimalSummary.interpreterPreference}
                    </p>
                    {referralMinimalSummary.culturalContext ? (
                      <p>
                        <span className="font-bold text-[#273955]">Profile context:</span>{" "}
                        {referralMinimalSummary.culturalContext}
                      </p>
                    ) : null}
                    <p className="text-[#6e8099]">
                      No evidence files, full report payload, or hidden profile data will be shared by this request.
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsReferralPreviewOpen(false)}
                    className="mt-3 text-[11px] font-bold text-[#60728a]"
                  >
                    Edit before sending
                  </button>
                </div>
              ) : null}

              <button
                type="button"
                onClick={() => {
                  void prepareWarmReferral();
                }}
                className="mt-5 inline-flex h-[46px] w-full items-center justify-center gap-2 rounded-full bg-[#ff9800] px-5 text-sm font-extrabold text-white shadow-[0_10px_24px_rgba(255,152,0,0.36)] transition hover:bg-[#eb8d00]"
              >
                {isSubmittingReferral
                  ? "Preparing referral..."
                  : isReferralPreviewOpen
                    ? "Confirm and send referral"
                    : t("dashboard.explorer.serviceDetails.sendReferral")}
                <IconArrowRight size={16} />
              </button>
            </div>
          </div>
        </section>

        {pendingConsentRequirement ? (
          <section className="mt-3">
            <ConsentRequiredCard
              requirement={pendingConsentRequirement}
              isSubmitting={isGrantingConsent}
              onAllow={() => {
                void (async () => {
                  setIsGrantingConsent(true);

                  try {
                    await grantConsent({ warm_referral: true }, pendingConsentRequirement.source);
                    setPendingConsentRequirement(null);
                    await prepareWarmReferral();
                  } catch (error) {
                    setServiceError(
                      error instanceof Error
                        ? error.message
                        : "Consent could not be saved."
                    );
                  } finally {
                    setIsGrantingConsent(false);
                  }
                })();
              }}
              onDecline={() => {
                setPendingConsentRequirement(null);
              }}
            />
          </section>
        ) : null}

        {isReferralPrepared ? (
          <section className="mt-3 rounded-[16px] border border-[#cde7d6] bg-[#f5fff8] px-4 py-5 sm:px-6">
            <div className="flex flex-col gap-5 lg:flex-row lg:items-start lg:justify-between">
              <div className="max-w-[640px]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#15803d]">
                  Warm referral prepared
                </p>
                <h3 className="mt-2 text-2xl font-extrabold leading-tight text-[#1f2a3a]">
                  {serviceTitle} intake handoff is ready.
                </h3>
                <p className="mt-3 text-sm leading-6 text-[#587086]">
                  {includeIncidentSummary
                    ? "The referral will include a concise incident summary, immediate safety needs, and the user's preferred contact method."
                    : "The referral will include the user's preferred contact method only. Incident details can be shared later if the user decides it is safe."}
                </p>
                {advocateCount > 0 ? (
                  <p className="mt-2 text-[11px] text-[#60728a]">
                    {advocateCount} advocate options are available for follow-up support if needed.
                  </p>
                ) : null}
                <div className="mt-4 rounded-[14px] border border-[#d8ebe0] bg-white px-4 py-3">
                  <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8092aa]">
                    Referral preview
                  </p>
                  <p className="mt-2 text-[12px] leading-[1.65] text-[#42566d]">
                    {referralNotes}
                  </p>
                </div>
              </div>

              <div className="grid w-full gap-3 sm:grid-cols-3 lg:w-[360px] lg:grid-cols-1">
                <a
                  href={`tel:${phoneValue.replace(/\s+/g, "")}`}
                  className="inline-flex h-11 items-center justify-center rounded-full bg-[#0f5d9f] px-4 text-xs font-bold text-white shadow-[0_10px_22px_rgba(15,93,159,0.24)]"
                >
                  Call service
                </a>
                <a
                  href={emailHref}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#d5deea] bg-white px-4 text-xs font-bold text-[#24344d]"
                >
                  Email intro
                </a>
                <button
                  type="button"
                  onClick={() => void copyReferralNotes()}
                  className="inline-flex h-11 items-center justify-center rounded-full border border-[#d5deea] bg-white px-4 text-xs font-bold text-[#24344d]"
                >
                  {copiedReferral ? "Copied" : "Copy summary"}
                </button>
              </div>
            </div>
          </section>
        ) : null}

        <section className="mt-3 border-t border-[#d6deea] px-1 py-4">
          <button
            type="button"
            className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#2c3f5a]"
          >
            {t("dashboard.explorer.serviceDetails.relevantResources")}
            <IconChevronDown size={15} className="text-[#7e8fa6]" />
          </button>
          {serviceRecord?.resourceLinks?.length ? (
            <div className="mt-3 grid gap-2 sm:grid-cols-2">
              {serviceRecord.resourceLinks.map(link => (
                <a
                  key={`${link.label}-${link.url}`}
                  href={link.url}
                  rel="noreferrer"
                  target="_blank"
                  className="rounded-[12px] border border-[#d8e3ef] bg-white px-4 py-3 text-xs font-semibold text-[#0f5d9f]"
                >
                  {link.label}
                </a>
              ))}
            </div>
          ) : null}
        </section>
      </div>
    </div>
  );
}
