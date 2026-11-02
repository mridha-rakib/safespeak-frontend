"use client";

import type { Route } from "next";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

import {
  IconAlertCircle,
  IconArrowRight,
  IconBook2,
  IconChartBar,
  IconChevronLeft,
  IconExternalLink,
  IconFilter,
  IconLoader2,
  IconLock,
  IconMap2,
  IconPhoneFilled,
  IconRefresh,
  IconShieldFilled,
  IconTrendingUp,
} from "@tabler/icons-react";

import { ConsentRequiredCard } from "@/components/consent/consent-required-card";
import { useConsentGate } from "@/hooks/use-consent-gate";
import { useSafeSpeakProfile } from "@/hooks/use-safespeak-profile";
import {
  getContentResourceDownloadUrl,
  getContentResourceImageUrl,
  listPublishedContentResources,
  type ContentResourceItem,
} from "@/lib/content-resources";
import { listPublishedMicroEducation, type MicroEducationItem } from "@/lib/microeducation";
import {
  getLocalIntelligence,
  type LocalIntelligenceResponse,
  type LocalIntelligenceTimeframe,
} from "@/lib/local-intelligence-client";
import { listPublishedResources, type ResourceItem } from "@/lib/resources";
import {
  buildSmartDialerScript,
  smartDialerContacts,
  type SmartDialerContactId,
} from "@/lib/smart-dialer";
import {
  createSafetyPlan,
  listSafetyPlans,
  updateSafetyPlan,
  type SafetyPlanInput,
  type SafetyPlanRecord,
  type TrustedContactInput,
} from "@/lib/support-client";

const splitLines = (value: string): string[] =>
  value
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

const joinLines = (values: string[] | undefined): string =>
  (values ?? []).join("\n");

const getSafetyPlanId = (plan: SafetyPlanRecord): string | undefined =>
  plan._id ?? plan.id;

function getMicroCardSurface(card: MicroEducationItem): {
  backgroundColor: string;
  color: string;
  borderColor: string;
} {
  if (card.category?.backgroundColor && card.category?.textColor) {
    return {
      backgroundColor: card.category.backgroundColor,
      color: card.category.textColor,
      borderColor: "rgba(255,255,255,0.18)",
    };
  }

  const toneMap: Record<
    MicroEducationItem["tone"],
    { backgroundColor: string; color: string; borderColor: string }
  > = {
    blue: {
      backgroundColor: "#01579B",
      color: "#FFFFFF",
      borderColor: "rgba(255,255,255,0.18)",
    },
    orange: {
      backgroundColor: "#E67E22",
      color: "#FFFFFF",
      borderColor: "rgba(255,255,255,0.18)",
    },
    green: {
      backgroundColor: "#0D9488",
      color: "#FFFFFF",
      borderColor: "rgba(255,255,255,0.18)",
    },
    amber: {
      backgroundColor: "#FFB300",
      color: "#1F2937",
      borderColor: "rgba(31,41,55,0.12)",
    },
    violet: {
      backgroundColor: "#6D28D9",
      color: "#FFFFFF",
      borderColor: "rgba(255,255,255,0.18)",
    },
    teal: {
      backgroundColor: "#0F766E",
      color: "#FFFFFF",
      borderColor: "rgba(255,255,255,0.18)",
    },
  };

  return toneMap[card.tone];
}

function getMicroCardHref(card: MicroEducationItem): Route {
  const categoryId = card.categoryId ?? card.category?.id;

  if (!categoryId) {
    return "/dashboard?view=microcards" as Route;
  }

  return `/dashboard?view=microcards&categoryId=${encodeURIComponent(categoryId)}&cardId=${encodeURIComponent(card.id)}` as Route;
}

function ResourcesPage() {
  const [resources, setResources] = useState<ContentResourceItem[]>([]);
  const [microCards, setMicroCards] = useState<MicroEducationItem[]>([]);
  const [directoryResources, setDirectoryResources] = useState<ResourceItem[]>([]);
  const [loadError, setLoadError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    void Promise.all([
      listPublishedContentResources(),
      listPublishedMicroEducation(),
      listPublishedResources(),
    ])
      .then(([nextResources, nextMicroCards, nextDirectoryResources]) => {
        if (!isActive) {
          return;
        }

        setResources(nextResources.slice(0, 6));
        setMicroCards(nextMicroCards.slice(0, 4));
        setDirectoryResources(nextDirectoryResources.slice(0, 6));
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Learn and resource content could not be loaded."
        );
      });

    return () => {
      isActive = false;
    };
  }, []);

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px] space-y-4">

        <section className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
            Learn safely
          </p>
          <h1 className="mt-2 text-[32px] font-extrabold leading-[1.02] text-[#1f2a3a]">
            Resource Library
          </h1>
          <p className="mt-2 max-w-[760px] text-sm leading-[1.65] text-[#60728a]">
            Browse practical guidance, downloadable resources, and micro-education without starting a report or AI flow.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href="/dashboard?view=microcards"
              className="inline-flex h-10 items-center rounded-full border border-[#d7e1ee] px-5 text-xs font-semibold text-[#FFFFFF]  bg-[#0f5d9f]"
            >
              Browse micro-cards
            </Link>
          </div>
        </section>

        {loadError ? (
          <div className="rounded-[16px] border border-[#fde2e2] bg-[#fff5f5] px-4 py-3 text-[11px] text-[#b45353]">
            {loadError}
          </div>
        ) : null}

        <section className="grid gap-4 xl:grid-cols-[1.4fr_0.9fr]">
          <article className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-xl font-bold text-[#1f2a3a]">Downloadable resources</h2>
                <p className="mt-1 text-xs text-[#60728a]">
                  Backend resources appear here when available.
                </p>
              </div>
              <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                Library
              </span>
            </div>

            <div className="mt-4 space-y-3">
              {resources.length > 0 ? (
                resources.map((resource) => {
                  const imageUrl = getContentResourceImageUrl(resource);

                  return (
                    <article
                      key={resource.id}
                      className="rounded-[18px] border border-[#e3ebf5] bg-[#f8fbff] p-4"
                    >
                      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="flex min-w-0 gap-3">
                          {imageUrl ? (
                            <span
                              aria-hidden="true"
                              style={{ backgroundImage: `url(${imageUrl})` }}
                              className="h-14 w-14 shrink-0 rounded-[14px] border border-[#dce5f1] bg-cover bg-center"
                            />
                          ) : null}
                          <div className="min-w-0">
                            <p className="text-sm font-bold text-[#1f2a3a]">{resource.name}</p>
                            <p className="mt-1 text-[11px] text-[#60728a]">
                              {resource.category} | {resource.language} | {resource.jurisdiction}
                            </p>
                          </div>
                        </div>
                        <a
                          href={getContentResourceDownloadUrl(resource)}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex h-9 items-center gap-1 rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white"
                        >
                          Download
                          <IconExternalLink size={12} />
                        </a>
                      </div>
                    </article>
                  );
                })
              ) : (
                <div className="rounded-[18px] border border-dashed border-[#d8e2ee] bg-[#fbfdff] p-4 text-[11px] text-[#60728a]">
                  Resource library items are not available yet. Safe placeholders stay visible until backend content is ready.
                </div>
              )}
            </div>
          </article>

          <aside className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#eef4ff] text-[#0f5d9f]">
                <IconBook2 size={18} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#1f2a3a]">Micro-education</h2>
                <p className="text-[11px] text-[#60728a]">
                  Short guidance cards for quick learning.
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-3">
              {microCards.length > 0 ? (
                microCards.map((card) => {
                  const surface = getMicroCardSurface(card);

                  return (
                    <Link
                      key={card.id}
                      href={getMicroCardHref(card)}
                      className="block rounded-[18px] border p-4 shadow-[0_10px_24px_rgba(15,23,42,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_14px_30px_rgba(15,23,42,0.12)]"
                      style={{
                        backgroundColor: surface.backgroundColor,
                        color: surface.color,
                        borderColor: surface.borderColor,
                      }}
                    >
                      <p className="text-[10px] font-bold uppercase tracking-[0.08em] opacity-80">
                        {card.category?.name || card.tag}
                      </p>
                      <p className="mt-1 text-sm font-bold">{card.title}</p>
                      <p className="mt-1 text-[11px] leading-[1.55] opacity-85">
                        {card.summary}
                      </p>
                    </Link>
                  );
                })
              ) : (
                <div className="rounded-[18px] border border-dashed border-[#d8e2ee] bg-[#fbfdff] p-4 text-[11px] text-[#60728a]">
                  Micro-education content will appear here when published.
                </div>
              )}
            </div>

            <Link
              href="/dashboard?view=microcards"
              className="mt-4 inline-flex h-10 items-center rounded-full border border-[#d7e1ee] px-5 text-xs font-semibold text-[#334155]"
            >
              Browse micro-card categories
              <IconArrowRight size={13} className="ml-1" />
            </Link>
          </aside>
        </section>

        <section className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                Support directory
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#1f2a3a]">Banks, legal aid, and counseling services</h2>
              <p className="mt-1 text-xs text-[#60728a]">
                Published admin directory entries appear here for quick contact and availability checks.
              </p>
            </div>
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
              {directoryResources.length} listed
            </span>
          </div>

          <div className="mt-4 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
            {directoryResources.length > 0 ? (
              directoryResources.map((resource) => (
                <article
                  key={resource.id}
                  className="rounded-[18px] border border-[#e3ebf5] bg-[#f8fbff] p-4"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <span className="rounded-full bg-[#e6f7ef] px-2 py-0.5 text-[10px] font-bold text-[#0f766e]">
                        {resource.category}
                      </span>
                      <h3 className="mt-2 text-sm font-bold text-[#1f2a3a]">{resource.name}</h3>
                    </div>
                    <IconShieldFilled size={16} className="shrink-0 text-[#0f5d9f]" />
                  </div>
                  <p className="mt-3 text-[11px] font-semibold text-[#60728a]">
                    {resource.region}
                  </p>
                  <p className="mt-1 text-[11px] leading-[1.55] text-[#60728a]">
                    {resource.contact}
                  </p>
                </article>
              ))
            ) : (
              <div className="col-span-full rounded-[18px] border border-dashed border-[#d8e2ee] bg-[#fbfdff] p-4 text-[11px] text-[#60728a]">
                Directory resources are not available yet. Published admin entries will appear here.
              </div>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}

function SafetyPlanManager() {
  const [plans, setPlans] = useState<SafetyPlanRecord[]>([]);
  const [selectedPlanId, setSelectedPlanId] = useState<string | null>(null);
  const [title, setTitle] = useState("My safety plan");
  const [trustedContact, setTrustedContact] = useState<TrustedContactInput>({
    name: "",
    relationship: "",
    phone: "",
    email: "",
    safeToContact: true,
    notes: "",
  });
  const [safePlaces, setSafePlaces] = useState("");
  const [warningSigns, setWarningSigns] = useState("");
  const [copingStrategies, setCopingStrategies] = useState("");
  const [emergencySteps, setEmergencySteps] = useState(
    "Call 000 if there is immediate danger.\nContact 1800RESPECT if it is safe to do so."
  );
  const [isActive, setIsActive] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);
  const [isLoadingPlans, setIsLoadingPlans] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const {
    pendingConsentRequirement,
    isGrantingConsent,
    captureConsentError,
    clearPendingConsent,
    grantPendingConsent,
  } = useConsentGate();

  const loadPlans = async () => {
    setIsLoadingPlans(true);
    setLoadError(null);

    try {
      const nextPlans = await listSafetyPlans();

      setPlans(nextPlans);
    } catch (error) {
      setLoadError(
        error instanceof Error
          ? error.message
          : "Safety plans could not be loaded."
      );
    } finally {
      setIsLoadingPlans(false);
    }
  };

  useEffect(() => {
    void loadPlans();
  }, []);

  const selectedPlan = useMemo(
    () => plans.find((plan) => getSafetyPlanId(plan) === selectedPlanId) ?? null,
    [plans, selectedPlanId]
  );

  const resetForm = () => {
    setSelectedPlanId(null);
    setTitle("My safety plan");
    setTrustedContact({
      name: "",
      relationship: "",
      phone: "",
      email: "",
      safeToContact: true,
      notes: "",
    });
    setSafePlaces("");
    setWarningSigns("");
    setCopingStrategies("");
    setEmergencySteps(
      "Call 000 if there is immediate danger.\nContact 1800RESPECT if it is safe to do so."
    );
    setIsActive(true);
    setSaveError(null);
    setStatusMessage(null);
  };

  const selectPlan = (plan: SafetyPlanRecord) => {
    const firstContact = plan.trustedContacts[0] ?? {};

    setSelectedPlanId(getSafetyPlanId(plan) ?? null);
    setTitle(plan.title);
    setTrustedContact({
      name: firstContact.name ?? "",
      relationship: firstContact.relationship ?? "",
      phone: firstContact.phone ?? "",
      email: firstContact.email ?? "",
      safeToContact: firstContact.safeToContact ?? true,
      notes: firstContact.notes ?? "",
    });
    setSafePlaces(joinLines(plan.safePlaces));
    setWarningSigns(joinLines(plan.warningSigns));
    setCopingStrategies(joinLines(plan.copingStrategies));
    setEmergencySteps(joinLines(plan.emergencySteps));
    setIsActive(plan.isActive);
    setSaveError(null);
    setStatusMessage(null);
  };

  const buildSafetyPlanInput = (): SafetyPlanInput => {
    const trustedContacts = [
      trustedContact.name,
      trustedContact.relationship,
      trustedContact.phone,
      trustedContact.email,
      trustedContact.notes,
    ].some((value) => String(value ?? "").trim())
      ? [trustedContact]
      : [];

    return {
      title: title.trim(),
      trustedContacts,
      safePlaces: splitLines(safePlaces),
      warningSigns: splitLines(warningSigns),
      copingStrategies: splitLines(copingStrategies),
      emergencySteps: splitLines(emergencySteps),
      isActive,
    };
  };

  const savePlan = async () => {
    const payload = buildSafetyPlanInput();

    if (!payload.title) {
      setSaveError("Add a title before saving the safety plan.");
      return;
    }

    setIsSaving(true);
    setSaveError(null);
    setStatusMessage(null);

    try {
      const savedPlan =
        selectedPlan && getSafetyPlanId(selectedPlan)
          ? await updateSafetyPlan(getSafetyPlanId(selectedPlan)!, payload)
          : await createSafetyPlan(payload);

      const savedPlanId = getSafetyPlanId(savedPlan);

      setPlans((currentPlans) => {
        const existingIndex = currentPlans.findIndex(
          (plan) => getSafetyPlanId(plan) === savedPlanId
        );

        if (existingIndex === -1) {
          return [savedPlan, ...currentPlans];
        }

        return currentPlans.map((plan, index) =>
          index === existingIndex ? savedPlan : plan
        );
      });
      setSelectedPlanId(savedPlanId ?? null);
      setStatusMessage("Safety plan saved. Review it regularly and update it when circumstances change.");
    } catch (error) {
      if (captureConsentError(error)) {
        return;
      }

      setSaveError(
        error instanceof Error ? error.message : "Safety plan could not be saved."
      );
    } finally {
      setIsSaving(false);
    }
  };

  const handleAllowConsent = async () => {
    try {
      await grantPendingConsent();
      void savePlan();
    } catch (error) {
      setSaveError(
        error instanceof Error ? error.message : "Consent could not be saved."
      );
    }
  };

  const storagePreview = buildSafetyPlanInput();

  return (
    <section className="space-y-4">
      <article className="rounded-[22px] border border-[#f2d8b0] bg-[#fffaf2] p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#b45309]">
          Emergency guidance
        </p>
        <h2 className="mt-2 text-[24px] font-extrabold leading-tight text-[#1f2a3a]">
          If there is immediate danger, call 000 now.
        </h2>
        <p className="mt-2 text-sm leading-[1.65] text-[#60728a]">
          Safety plans are preparation tools, not emergency response. If it is
          safe, you can also contact 1800RESPECT for domestic and family violence
          support.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          <a
            href="tel:000"
            className="inline-flex h-10 items-center rounded-full bg-[#b91c1c] px-5 text-xs font-bold text-white"
          >
            Call 000
          </a>
          <a
            href="tel:1800737732"
            className="inline-flex h-10 items-center rounded-full border border-[#f2d8b0] bg-white px-5 text-xs font-bold text-[#8a4b10]"
          >
            Call 1800RESPECT
          </a>
        </div>
      </article>

      {pendingConsentRequirement ? (
        <ConsentRequiredCard
          requirement={pendingConsentRequirement}
          isSubmitting={isGrantingConsent || isSaving}
          onAllow={() => {
            void handleAllowConsent();
          }}
          onDecline={clearPendingConsent}
        />
      ) : null}

      <div className="grid gap-4 xl:grid-cols-[0.8fr_1.2fr]">
        <aside className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex items-center justify-between gap-3">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                Saved plans
              </p>
              <p className="mt-1 text-xs text-[#60728a]">
                Backend-backed list for this account or session.
              </p>
            </div>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex h-9 items-center rounded-full border border-[#d7e1ee] px-3 text-[10px] font-bold text-[#334155]"
            >
              New plan
            </button>
          </div>

          {loadError ? (
            <div className="mt-3 rounded-[14px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
              <span className="inline-flex items-center gap-1.5">
                <IconAlertCircle size={12} />
                {loadError}
              </span>
            </div>
          ) : null}

          {isLoadingPlans ? (
            <div className="mt-3 inline-flex items-center gap-2 text-[11px] text-[#60728a]">
              <IconLoader2 size={14} className="animate-spin" />
              Loading safety plans...
            </div>
          ) : null}

          <div className="mt-4 space-y-2">
            {plans.map((plan) => {
              const planId = getSafetyPlanId(plan);
              const isSelected = planId === selectedPlanId;

              return (
                <button
                  key={planId ?? plan.title}
                  type="button"
                  onClick={() => selectPlan(plan)}
                  className={`w-full rounded-[16px] border px-4 py-3 text-left transition ${
                    isSelected
                      ? "border-[#0f5d9f] bg-[#f7fbff]"
                      : "border-[#e3ebf5] bg-[#fbfdff]"
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-[#1f2a3a]">
                        {plan.title}
                      </p>
                      <p className="mt-1 text-[10px] text-[#60728a]">
                        {plan.trustedContacts.length} trusted contact
                        {plan.trustedContacts.length === 1 ? "" : "s"} |{" "}
                        {plan.emergencySteps.length} emergency step
                        {plan.emergencySteps.length === 1 ? "" : "s"}
                      </p>
                    </div>
                    <span
                      className={`rounded-full px-2 py-1 text-[9px] font-bold uppercase tracking-[0.08em] ${
                        plan.isActive
                          ? "bg-[#e6f7ef] text-[#0f766e]"
                          : "bg-[#eef2f7] text-[#64748b]"
                      }`}
                    >
                      {plan.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                </button>
              );
            })}
            {!isLoadingPlans && plans.length === 0 ? (
              <div className="rounded-[16px] border border-dashed border-[#d8e2ee] bg-[#fbfdff] p-4 text-[11px] leading-[1.6] text-[#60728a]">
                No safety plans are stored yet. Create one when it is safe to
                prepare trusted contacts and next steps.
              </div>
            ) : null}
          </div>
        </aside>

        <article className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                Safety plan editor
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#1f2a3a]">
                {selectedPlan ? "Edit safety plan" : "Create safety plan"}
              </h2>
            </div>
            <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#60728a]">
              <input
                type="checkbox"
                checked={isActive}
                onChange={(event) => setIsActive(event.target.checked)}
                className="h-4 w-4 rounded border-[#cbd8e8]"
              />
              Active plan
            </label>
          </div>

          {saveError ? (
            <div className="mt-3 rounded-[14px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
              <span className="inline-flex items-center gap-1.5">
                <IconAlertCircle size={12} />
                {saveError}
              </span>
            </div>
          ) : null}
          {statusMessage ? (
            <div className="mt-3 rounded-[14px] border border-[#d8e4f2] bg-[#f8fbff] px-3 py-2 text-[11px] font-semibold text-[#0f5d9f]">
              {statusMessage}
            </div>
          ) : null}

          <div className="mt-4 grid gap-4">
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Plan title
              </span>
              <input
                value={title}
                onChange={(event) => setTitle(event.target.value)}
                className="h-10 rounded-[10px] border border-[#d7e1ee] bg-white px-3 text-sm font-semibold text-[#1f2a3a] outline-none"
              />
            </label>

            <div className="rounded-[16px] border border-[#e3ebf5] bg-[#f8fbff] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Trusted contact
              </p>
              <div className="mt-3 grid gap-3 sm:grid-cols-2">
                {[
                  ["name", "Name"],
                  ["relationship", "Relationship"],
                  ["phone", "Phone"],
                  ["email", "Email"],
                ].map(([key, label]) => (
                  <label key={key} className="flex flex-col gap-1">
                    <span className="text-[10px] font-semibold text-[#7f90a6]">
                      {label}
                    </span>
                    <input
                      value={String(trustedContact[key as keyof TrustedContactInput] ?? "")}
                      onChange={(event) =>
                        setTrustedContact((currentContact) => ({
                          ...currentContact,
                          [key]: event.target.value,
                        }))
                      }
                      className="h-9 rounded-[8px] border border-[#dce5f1] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none"
                    />
                  </label>
                ))}
                <label className="flex flex-col gap-1 sm:col-span-2">
                  <span className="text-[10px] font-semibold text-[#7f90a6]">
                    Contact notes
                  </span>
                  <input
                    value={trustedContact.notes ?? ""}
                    onChange={(event) =>
                      setTrustedContact((currentContact) => ({
                        ...currentContact,
                        notes: event.target.value,
                      }))
                    }
                    className="h-9 rounded-[8px] border border-[#dce5f1] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none"
                  />
                </label>
                <label className="inline-flex items-center gap-2 text-[11px] font-semibold text-[#60728a] sm:col-span-2">
                  <input
                    type="checkbox"
                    checked={Boolean(trustedContact.safeToContact)}
                    onChange={(event) =>
                      setTrustedContact((currentContact) => ({
                        ...currentContact,
                        safeToContact: event.target.checked,
                      }))
                    }
                    className="h-4 w-4 rounded border-[#cbd8e8]"
                  />
                  Safe to contact this person
                </label>
              </div>
            </div>

            {[
              {
                label: "Safe places",
                value: safePlaces,
                onChange: setSafePlaces,
                placeholder: "One safe place per line",
              },
              {
                label: "Warning signs",
                value: warningSigns,
                onChange: setWarningSigns,
                placeholder: "One warning sign per line",
              },
              {
                label: "Coping strategies",
                value: copingStrategies,
                onChange: setCopingStrategies,
                placeholder: "One coping strategy per line",
              },
              {
                label: "Emergency steps",
                value: emergencySteps,
                onChange: setEmergencySteps,
                placeholder: "One emergency step per line",
              },
            ].map((field) => (
              <label key={field.label} className="flex flex-col gap-1">
                <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {field.label}
                </span>
                <textarea
                  value={field.value}
                  onChange={(event) => field.onChange(event.target.value)}
                  rows={3}
                  placeholder={field.placeholder}
                  className="resize-none rounded-[10px] border border-[#d7e1ee] bg-white px-3 py-2 text-[12px] leading-[1.55] text-[#1f2a3a] outline-none"
                />
              </label>
            ))}

            <div className="rounded-[16px] border border-[#e3ebf5] bg-[#fbfdff] p-4">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Storage preview
              </p>
              <p className="mt-2 text-[11px] leading-[1.6] text-[#60728a]">
                SafeSpeak will store: title, active status, trusted contact
                details you entered, {storagePreview.safePlaces?.length ?? 0} safe
                place(s), {storagePreview.warningSigns?.length ?? 0} warning sign(s),{" "}
                {storagePreview.copingStrategies?.length ?? 0} coping strategy item(s),
                and {storagePreview.emergencySteps?.length ?? 0} emergency step(s).
              </p>
            </div>

            <button
              type="button"
              onClick={() => {
                void savePlan();
              }}
              disabled={isSaving}
              className="inline-flex h-11 items-center justify-center rounded-full bg-[#0f5d9f] px-6 text-xs font-bold text-white shadow-[0_10px_24px_rgba(15,93,159,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
            >
              {isSaving ? (
                <IconLoader2 size={14} className="mr-1 animate-spin" />
              ) : null}
              {selectedPlan ? "Update safety plan" : "Create safety plan"}
            </button>
          </div>
        </article>
      </div>
    </section>
  );
}

const localIntelligenceTimeframes: Array<{
  value: LocalIntelligenceTimeframe;
  label: string;
}> = [
  { value: "30d", label: "30 days" },
  { value: "90d", label: "90 days" },
  { value: "12m", label: "12 months" },
  { value: "all", label: "All time" },
];

function formatLocalIntelligenceLabel(value: string): string {
  return value
    .replace(/_/g, " ")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function mergeSelectedOption(options: string[], selected: string): string[] {
  if (!selected || options.includes(selected)) {
    return options;
  }

  return [selected, ...options];
}

function LocalIntelligencePage() {
  const [timeframe, setTimeframe] = useState<LocalIntelligenceTimeframe>("90d");
  const [selectedJurisdiction, setSelectedJurisdiction] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [data, setData] = useState<LocalIntelligenceResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [refreshNonce, setRefreshNonce] = useState(0);

  useEffect(() => {
    let isActive = true;

    setIsLoading(true);
    setLoadError(null);

    void getLocalIntelligence({
      timeframe,
      jurisdiction: selectedJurisdiction || undefined,
      region: selectedRegion || undefined,
      category: selectedCategory || undefined,
    })
      .then((nextData) => {
        if (!isActive) {
          return;
        }

        setData(nextData);
      })
      .catch((error) => {
        if (!isActive) {
          return;
        }

        setLoadError(
          error instanceof Error
            ? error.message
            : "Local intelligence could not be loaded."
        );
        setData(null);
      })
      .finally(() => {
        if (isActive) {
          setIsLoading(false);
        }
      });

    return () => {
      isActive = false;
    };
  }, [refreshNonce, selectedCategory, selectedJurisdiction, selectedRegion, timeframe]);

  const jurisdictionOptions = mergeSelectedOption(
    data?.availableFilters.jurisdictions ?? [],
    selectedJurisdiction
  );
  const regionOptions = mergeSelectedOption(
    data?.availableFilters.regions ?? [],
    selectedRegion
  );
  const categoryOptions = mergeSelectedOption(
    data?.availableFilters.categories ?? [],
    selectedCategory
  );
  const visibleAreas = data?.areas.filter((area) => !area.suppressed) ?? [];
  const suppressedAreas = data?.areas.filter((area) => area.suppressed) ?? [];
  const visibleCategories =
    data?.categories.filter((category) => !category.suppressed) ?? [];
  const suppressedCategories =
    data?.categories.filter((category) => category.suppressed) ?? [];
  const visibleTrends = data?.trends.filter((trend) => !trend.suppressed) ?? [];
  const suppressedTrends = data?.trends.filter((trend) => trend.suppressed) ?? [];
  const maxCategoryCount = Math.max(
    1,
    ...visibleCategories.map((category) => category.count ?? 0)
  );
  const maxTrendCount = Math.max(1, ...visibleTrends.map((trend) => trend.count ?? 0));

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px] space-y-4">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            Local Intelligence
          </Link>
          <Link href="/dashboard" className="text-xs font-medium text-[#7b8798]">
            Home
          </Link>
        </div>

        <section className="rounded-[22px] border border-[#dce5f1] bg-white p-6 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                Public aggregate intelligence
              </p>
              <h1 className="mt-2 text-[32px] font-extrabold leading-[1.02] text-[#1f2a3a]">
                Local intelligence
              </h1>
              <p className="mt-3 max-w-[760px] text-sm leading-[1.7] text-[#60728a]">
                Anonymised, consented reports are shown only when the privacy
                threshold is met. Low-count cells stay hidden and no person-level
                report data is exposed.
              </p>
            </div>
            <div className="rounded-[16px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3">
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Minimum cell size
              </p>
              <p className="mt-1 text-2xl font-extrabold text-[#1f2a3a]">
                {data?.privacy.minimumCellSize ?? 5}
              </p>
              <p className="mt-1 text-[11px] text-[#60728a]">
                Counts below this are privacy protected.
              </p>
            </div>
          </div>

          <div className="mt-5 grid gap-3 lg:grid-cols-4">
            <label className="flex flex-col gap-1">
              <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                <IconFilter size={12} />
                Timeframe
              </span>
              <select
                value={timeframe}
                onChange={(event) =>
                  setTimeframe(event.target.value as LocalIntelligenceTimeframe)
                }
                className="h-10 rounded-[10px] border border-[#d7e1ee] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none"
              >
                {localIntelligenceTimeframes.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Jurisdiction
              </span>
              <select
                value={selectedJurisdiction}
                onChange={(event) => {
                  setSelectedJurisdiction(event.target.value);
                  setSelectedRegion("");
                }}
                className="h-10 rounded-[10px] border border-[#d7e1ee] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none"
              >
                <option value="">All jurisdictions</option>
                {jurisdictionOptions.map((jurisdiction) => (
                  <option key={jurisdiction} value={jurisdiction}>
                    {jurisdiction}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                LGA / region
              </span>
              <select
                value={selectedRegion}
                onChange={(event) => setSelectedRegion(event.target.value)}
                className="h-10 rounded-[10px] border border-[#d7e1ee] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none"
              >
                <option value="">All threshold-safe regions</option>
                {regionOptions.map((region) => (
                  <option key={region} value={region}>
                    {region}
                  </option>
                ))}
              </select>
            </label>
            <label className="flex flex-col gap-1">
              <span className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                Category
              </span>
              <select
                value={selectedCategory}
                onChange={(event) => setSelectedCategory(event.target.value)}
                className="h-10 rounded-[10px] border border-[#d7e1ee] bg-white px-3 text-[12px] text-[#1f2a3a] outline-none"
              >
                <option value="">All threshold-safe categories</option>
                {categoryOptions.map((category) => (
                  <option key={category} value={category}>
                    {formatLocalIntelligenceLabel(category)}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-5 grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {[
              {
                icon: <IconLock size={16} />,
                label: "Anonymised only",
                value: data?.privacy.anonymisedOnly ? "Enabled" : "Required",
              },
              {
                icon: <IconShieldFilled size={16} />,
                label: "Consented reports",
                value: data?.privacy.consentedReportsOnly ? "Only" : "Only",
              },
              {
                icon: <IconMap2 size={16} />,
                label: "Visible areas",
                value: String(data?.summary.visibleAreaCount ?? 0),
              },
              {
                icon: <IconChartBar size={16} />,
                label: "Report count",
                value: data?.summary.reports.label ?? "Loading",
              },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-[16px] border border-[#e3ebf5] bg-[#f8fbff] p-4"
              >
                <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#e8f2ff] text-[#0f5d9f]">
                  {item.icon}
                </div>
                <p className="mt-3 text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                  {item.label}
                </p>
                <p className="mt-1 text-sm font-extrabold text-[#1f2a3a]">
                  {item.value}
                </p>
              </article>
            ))}
          </div>

          {loadError ? (
            <div className="mt-4 rounded-[14px] border border-[#fde2e2] bg-[#fff5f5] px-3 py-2 text-[11px] text-[#b45353]">
              <span className="inline-flex items-center gap-1.5">
                <IconAlertCircle size={12} />
                {loadError}
              </span>
            </div>
          ) : null}
          {isLoading ? (
            <div className="mt-4 inline-flex items-center gap-2 text-[11px] text-[#60728a]">
              <IconLoader2 size={14} className="animate-spin" />
              Loading threshold-safe aggregates...
            </div>
          ) : null}
          {data && data.summary.status === "insufficient_data" ? (
            <div className="mt-4 rounded-[16px] border border-dashed border-[#d8e2ee] bg-[#fbfdff] p-4 text-[12px] leading-[1.65] text-[#60728a]">
              Aggregate data is below the public threshold for the current
              filters. The backend returned privacy-protected cells instead of
              exact low counts.
            </div>
          ) : null}
        </section>

        <div className="grid gap-4 xl:grid-cols-[1fr_0.95fr]">
          <section className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                  Threshold-safe areas
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#1f2a3a]">
                  Area signals
                </h2>
              </div>
              <IconMap2 size={24} className="text-[#0f5d9f]" />
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              {visibleAreas.map((area) => (
                <article
                  key={`${area.jurisdiction}-${area.region}`}
                  className="rounded-[16px] border border-[#e3ebf5] bg-[#f8fbff] p-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#7c8da3]">
                    {area.jurisdiction}
                  </p>
                  <p className="mt-1 text-base font-extrabold text-[#1f2a3a]">
                    {area.region}
                  </p>
                  <p className="mt-2 text-sm font-bold text-[#0f5d9f]">
                    {area.label} reports
                  </p>
                </article>
              ))}
              {suppressedAreas.slice(0, 4).map((area) => (
                <article
                  key={`suppressed-${area.jurisdiction}-${area.region}`}
                  className="rounded-[16px] border border-dashed border-[#d8e2ee] bg-white p-4"
                >
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#9a5b12]">
                    Privacy protected
                  </p>
                  <p className="mt-1 text-sm font-bold text-[#1f2a3a]">
                    {area.jurisdiction} | {area.region}
                  </p>
                  <p className="mt-2 text-[11px] text-[#60728a]">
                    {area.label}
                  </p>
                </article>
              ))}
              {!isLoading && data && data.areas.length === 0 ? (
                <div className="rounded-[16px] border border-dashed border-[#d8e2ee] bg-[#fbfdff] p-4 text-[12px] leading-[1.6] text-[#60728a] sm:col-span-2">
                  No threshold-safe area aggregates are available for these
                  filters.
                </div>
              ) : null}
            </div>
          </section>

          <section className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                  Threshold-safe categories
                </p>
                <h2 className="mt-1 text-xl font-bold text-[#1f2a3a]">
                  Category mix
                </h2>
              </div>
              <IconChartBar size={24} className="text-[#0f5d9f]" />
            </div>

            <div className="mt-4 space-y-3">
              {visibleCategories.map((category) => {
                const width = `${Math.max(
                  8,
                  ((category.count ?? 0) / maxCategoryCount) * 100
                )}%`;

                return (
                  <div key={category.category}>
                    <div className="flex items-center justify-between gap-3 text-[12px] font-bold text-[#1f2a3a]">
                      <span>{formatLocalIntelligenceLabel(category.category)}</span>
                      <span>{category.label}</span>
                    </div>
                    <div className="mt-2 h-2 rounded-full bg-[#e8eef7]">
                      <div
                        className="h-2 rounded-full bg-[#0f5d9f]"
                        style={{ width }}
                      />
                    </div>
                  </div>
                );
              })}
              {suppressedCategories.slice(0, 4).map((category) => (
                <div
                  key={`suppressed-${category.category}`}
                  className="rounded-[14px] border border-dashed border-[#d8e2ee] px-3 py-2 text-[11px] text-[#60728a]"
                >
                  <span className="font-bold text-[#1f2a3a]">
                    {formatLocalIntelligenceLabel(category.category)}
                  </span>{" "}
                  is privacy protected.
                </div>
              ))}
              {!isLoading && data && data.categories.length === 0 ? (
                <div className="rounded-[16px] border border-dashed border-[#d8e2ee] bg-[#fbfdff] p-4 text-[12px] leading-[1.6] text-[#60728a]">
                  No threshold-safe category aggregates are available for these
                  filters.
                </div>
              ) : null}
            </div>
          </section>
        </div>

        <section className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
                Threshold-safe trend
              </p>
              <h2 className="mt-1 text-xl font-bold text-[#1f2a3a]">
                Monthly signals
              </h2>
            </div>
            <button
              type="button"
              onClick={() => setRefreshNonce((current) => current + 1)}
              className="inline-flex h-9 items-center justify-center gap-2 rounded-full border border-[#d7e1ee] px-4 text-[11px] font-bold text-[#334155]"
            >
              <IconRefresh size={13} />
              Refresh
            </button>
          </div>

          <div className="mt-5 flex min-h-[160px] items-end gap-2 overflow-x-auto rounded-[16px] border border-[#e3ebf5] bg-[#f8fbff] p-4">
            {visibleTrends.map((trend) => {
              const height = `${Math.max(
                12,
                ((trend.count ?? 0) / maxTrendCount) * 100
              )}%`;

              return (
                <div
                  key={trend.period}
                  className="flex min-w-[76px] flex-1 flex-col items-center justify-end gap-2"
                >
                  <div className="flex h-[104px] w-full items-end">
                    <div
                      className="w-full rounded-t-[8px] bg-[#0f5d9f]"
                      style={{ height }}
                    />
                  </div>
                  <p className="text-[10px] font-bold text-[#1f2a3a]">
                    {trend.period}
                  </p>
                  <p className="text-[10px] text-[#60728a]">{trend.label}</p>
                </div>
              );
            })}
            {!isLoading && visibleTrends.length === 0 ? (
              <div className="flex w-full flex-col items-center justify-center gap-2 py-8 text-center text-[12px] leading-[1.6] text-[#60728a]">
                <IconTrendingUp size={24} className="text-[#9aaabe]" />
                Monthly cells are below the public threshold for these filters.
              </div>
            ) : null}
          </div>

          {suppressedTrends.length > 0 ? (
            <p className="mt-3 text-[11px] leading-[1.6] text-[#60728a]">
              {suppressedTrends.length} month
              {suppressedTrends.length === 1 ? "" : "s"} returned privacy
              protected cells.
            </p>
          ) : null}

          <div className="mt-4 rounded-[16px] border border-[#dce5f1] bg-[#fbfdff] p-4 text-[11px] leading-[1.65] text-[#60728a]">
            Backend privacy contract: consented reports only, anonymised
            aggregates only, no admin analytics route, no raw report rows, no
            PII, and no exact low counts.
          </div>
        </section>
      </div>
    </div>
  );
}

function SmartDiallerPage() {
  const router = useRouter();
  const { profile } = useSafeSpeakProfile();
  const [selectedContactId, setSelectedContactId] =
    useState<SmartDialerContactId>("respect");
  const [scriptDraft, setScriptDraft] = useState("");
  const selectedContact =
    smartDialerContacts.find((contact) => contact.id === selectedContactId) ??
    smartDialerContacts[0];

  const suggestedScript = useMemo(
    () =>
      buildSmartDialerScript(
        selectedContact.id,
        profile.interpreterLanguage,
        "en"
      ).join("\n"),
    [profile.interpreterLanguage, selectedContact.id]
  );

  useEffect(() => {
    setScriptDraft(suggestedScript);
  }, [suggestedScript]);

  return (
    <div className="px-2 pb-5 pt-2 sm:px-4 sm:pb-8 sm:pt-4">
      <div className="mx-auto w-full max-w-[1184px] space-y-4">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <button
            type="button"
            onClick={() => router.back()}
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937] hover:underline"
          >
            <IconChevronLeft size={14} />
            Smart Dialler
          </button>
          <Link href="/dashboard/explorer" className="text-xs font-medium text-[#7b8798]">
            Get Support
          </Link>
        </div>

        <section className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
          <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
            Safe call planning
          </p>
          <h1 className="mt-2 text-[32px] font-extrabold leading-[1.02] text-[#1f2a3a]">
            Smart Dialler
          </h1>
          <p className="mt-2 max-w-[760px] text-sm leading-[1.65] text-[#60728a]">
            Use verified numbers, interpreter prompts, and a short call-prep script. SafeSpeak does not place calls automatically.
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            <span className="rounded-full bg-[#eef4ff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#0f5d9f]">
              You can ask for an interpreter in your language.
            </span>
            <span className="rounded-full bg-[#fff7ed] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#b45309]">
              Silent or covert help guidance only
            </span>
          </div>
        </section>

        <div className="grid gap-4 xl:grid-cols-[1.05fr_0.95fr]">
          <section className="space-y-3">
            {smartDialerContacts
              .filter((contact) =>
                [
                  "emergency",
                  "respect",
                  "lifeline",
                  "policeAssistance",
                  "tisNational",
                ].includes(contact.id)
              )
              .map((contact) => {
                const isSelected = contact.id === selectedContactId;

                return (
                  <button
                    key={contact.id}
                    type="button"
                    onClick={() => setSelectedContactId(contact.id)}
                    className={`w-full rounded-[20px] border p-4 text-left transition ${
                      isSelected
                        ? "border-[#0f5d9f] bg-[#eef6ff]"
                        : "border-[#dce5f1] bg-white"
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-lg font-bold text-[#1f2a3a]">
                          {contact.label}
                        </p>
                        <p className="mt-1 text-sm font-semibold text-[#0f5d9f]">
                          {contact.numberDisplay}
                        </p>
                        <p className="mt-2 text-[12px] leading-[1.6] text-[#60728a]">
                          {contact.description}
                        </p>
                      </div>
                      <span className="rounded-full bg-[#f8fbff] px-3 py-1 text-[10px] font-bold uppercase tracking-[0.08em] text-[#60728a]">
                        {contact.availability}
                      </span>
                    </div>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <a
                        href={`tel:${contact.numberDial}`}
                        className="inline-flex h-9 items-center gap-1 rounded-full bg-[#0f5d9f] px-4 text-[11px] font-bold text-white"
                        aria-label={`Call ${contact.label}`}
                        onClick={(event) => event.stopPropagation()}
                      >
                        <IconPhoneFilled size={12} />
                        Call now
                      </a>
                      <a
                        href={contact.sourceUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex h-9 items-center gap-1 rounded-full border border-[#d7e1ee] px-4 text-[11px] font-semibold text-[#334155]"
                        onClick={(event) => event.stopPropagation()}
                      >
                        Source
                        <IconExternalLink size={12} />
                      </a>
                    </div>
                  </button>
                );
              })}
          </section>

          <aside className="rounded-[22px] border border-[#dce5f1] bg-white p-5 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="flex items-center gap-2">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#eef4ff] text-[#0f5d9f]">
                <IconShieldFilled size={18} />
              </span>
              <div>
                <h2 className="text-lg font-bold text-[#1f2a3a]">
                  Call prep script
                </h2>
                <p className="text-[11px] text-[#60728a]">
                  Edit before calling if you want to shorten or simplify it.
                </p>
              </div>
            </div>

            <textarea
              value={scriptDraft}
              onChange={(event) => setScriptDraft(event.target.value)}
              rows={12}
              className="mt-4 w-full rounded-[18px] border border-[#dce5f1] bg-[#f8fbff] px-4 py-3 text-[12px] leading-[1.6] text-[#334155] outline-none"
              aria-label="Editable call preparation script"
            />

            <div className="mt-4 rounded-[18px] border border-[#e3ebf5] bg-[#f8fbff] p-4 text-[12px] leading-[1.65] text-[#50627a]">
              <p className="font-bold text-[#1f2a3a]">Covert help guidance</p>
              <p className="mt-2">
                If it is not safe to speak for long, say that first. You can ask the service to slow down, keep questions short, or connect an interpreter through TIS National.
              </p>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

export { LocalIntelligencePage, ResourcesPage, SafetyPlanManager, SmartDiallerPage };
