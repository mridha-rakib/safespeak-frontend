"use client";

import { useEffect, useRef, useState } from "react";

import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconSearch,
  IconX,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  type Transition,
  useReducedMotion,
} from "framer-motion";
import { useTranslation } from "react-i18next";

import digitalFootPrint from "@/assets/digital_foot_print.svg?url";
import documentingEv from "@/assets/documentig_ev.svg?url";
import hackerImage from "@/assets/hacker.jpg";
import identifyBulling from "@/assets/identifyBulling.svg?url";
import safeReporting from "@/assets/safe_reporting.svg?url";
import { cn } from "@/lib/utils";

import { interFont } from "./dashboard-shared";

type MicroCardTone = "blue" | "yellow" | "teal";
type MicroCardTheme = "identify" | "document" | "report" | "footprint";

type MicroCardItem = {
  id: string;
  title: string;
  iconSrc: string;
  tone: MicroCardTone;
  theme: MicroCardTheme;
  className?: string;
};

const detailContentByTheme: Record<
  MicroCardTheme,
  {
    eyebrow: string;
    headline: string;
    summary: string;
    paragraphs: string[];
    checklist: string[];
    takeaway: string;
    cta: string;
  }
> = {
  identify: {
    eyebrow: "Recognize the pattern",
    headline: "Spot harm early before it becomes normalized.",
    summary:
      "Bullying and harassment often escalate through repetition, isolation, and shifts in power. Early recognition helps users respond before the situation gets harder to describe.",
    paragraphs: [
      "A useful first step is naming the pattern. Repeated humiliation, exclusion, intimidation, threats, or targeted comments can all signal abuse even when each moment feels small in isolation.",
      "Users should not have to prove the full story before they are allowed to seek help. A frontend flow can support this by validating uncertainty, offering examples, and guiding people into a safer next step.",
    ],
    checklist: [
      "Note who was involved and where it happened.",
      "Record repeated phrases, gestures, or actions.",
      "Mark whether the behavior affected work, study, housing, or safety.",
    ],
    takeaway:
      "If a behavior is repeated, targeted, or makes someone feel unsafe, treat it as a pattern worth documenting.",
    cta: "Open a safety checklist",
  },
  document: {
    eyebrow: "Preserve the details",
    headline: "Capture evidence in a way that stays usable later.",
    summary:
      "Documentation becomes much stronger when users record facts close to the event and keep files organized without adding friction during a stressful moment.",
    paragraphs: [
      "Useful evidence can include screenshots, dates, voice notes, photos, or a short written description of what happened. Frontend guidance should make these options feel flexible rather than mandatory.",
      "The most helpful UI pattern is small, direct prompts: what happened, when it happened, and whether anything needs urgent follow-up. That keeps users moving without forcing a long narrative up front.",
    ],
    checklist: [
      "Save screenshots before messages disappear.",
      "Keep a short timeline with dates and locations.",
      "Separate what you saw directly from what someone else told you.",
    ],
    takeaway:
      "Simple, consistent notes usually matter more than a perfect statement written all at once.",
    cta: "Review evidence tips",
  },
  report: {
    eyebrow: "Report with control",
    headline: "Give users options without making the flow feel risky.",
    summary:
      "Reporting works better when the interface clearly explains what happens next, what is optional, and how privacy controls affect visibility.",
    paragraphs: [
      "A trauma-aware reporting flow should explain each step in plain language. Users need to know whether they can stay anonymous, whether follow-up is optional, and what kind of organization may receive the report.",
      "Frontend can reduce abandonment by breaking the process into small decisions: share now, save for later, or seek guidance first. That preserves agency and improves completion rates.",
    ],
    checklist: [
      "Show which fields are optional before users start typing.",
      "Explain referral pathways before the final submit action.",
      "Keep Quick Exit visible throughout the reporting flow.",
    ],
    takeaway:
      "Users are more likely to report when the interface makes privacy and next steps explicit.",
    cta: "View reporting steps",
  },
  footprint: {
    eyebrow: "Reduce digital exposure",
    headline: "Help users understand the trail they may be leaving behind.",
    summary:
      "Shared devices, browser history, screenshots, and location metadata can all create risk. Good frontend patterns reduce that exposure without blocking access.",
    paragraphs: [
      "Digital safety guidance should stay short and actionable. Users may need to switch devices, clear traces, or avoid storing sensitive drafts locally if their environment is not private.",
      "Covert affordances work best when paired with plain-language explanations. A Quick Exit button helps, but users also benefit from reminders about browser history, notifications, and shared accounts.",
    ],
    checklist: [
      "Use a private device when possible.",
      "Avoid saving sensitive screenshots in public albums.",
      "Check notification previews and shared browser sessions.",
    ],
    takeaway:
      "Privacy tools are strongest when users also understand the risks around the device they are using.",
    cta: "Review privacy steps",
  },
};

function MicroCardLesson({
  id,
  title,
  iconSrc,
  tone,
  onOpen,
  isActive,
  className,
}: {
  id: string;
  title: string;
  iconSrc: string;
  tone: MicroCardTone;
  onOpen: () => void;
  isActive: boolean;
  className?: string;
}) {
  const { t } = useTranslation();
  const toneStyles: Record<
    MicroCardTone,
    {
      card: string;
      title: string;
      meta: string;
      iconWrap: string;
      button: string;
    }
  > = {
    blue: {
      card: "bg-[#0f5fa7]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/20",
      button: "bg-white text-[#0d4d85]",
    },
    yellow: {
      card: "bg-[#f7b500]",
      title: "text-[#111827]",
      meta: "text-[#5f4b00]",
      iconWrap: "bg-white/35",
      button: "bg-white text-[#312600]",
    },
    teal: {
      card: "bg-[#1f9f97]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/22",
      button: "bg-white text-[#0e6e67]",
    },
  };

  const currentTone = toneStyles[tone];

  return (
    <motion.button
      type="button"
      layout
      layoutId={`microcard-${id}`}
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 text-left sm:p-5",
        currentTone.card,
        isActive && "pointer-events-none opacity-0",
        className
      )}
      onClick={onOpen}
      aria-label={title}
    >
      <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex h-full min-w-0 flex-col">
          <h3
            className={cn(
              `${interFont.className} text-[22px] font-extrabold leading-[0.95] sm:text-[28px]`,
              currentTone.title
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              "mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl",
              currentTone.iconWrap
            )}
          >
            <Image
              src={iconSrc}
              alt={title}
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </div>
          <div className="mt-auto inline-flex items-center gap-1.5">
            <IconClock size={10} className={currentTone.meta} />
            <span className={cn("text-[10px] font-semibold", currentTone.meta)}>
              {t("dashboard.microcards.fourMinRead")}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "self-start rounded-full px-4 py-2 text-[11px] font-bold leading-none sm:mt-1 sm:self-auto",
            currentTone.button
          )}
        >
          {t("dashboard.microcards.readMore")}
        </span>
      </div>
    </motion.button>
  );
}

function MicroCardsPage() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCardId, setActiveCardId] = useState<string | null>(null);
  const pushedHistoryRef = useRef(false);

  const cards: MicroCardItem[] = [
    {
      id: "identify-1",
      title: t("dashboard.microcards.identifyingBullying"),
      iconSrc: identifyBulling,
      tone: "blue",
      theme: "identify",
      className: "min-h-[132px] xl:h-[140px]",
    },
    {
      id: "document-1",
      title: t("dashboard.microcards.documentingEvidence"),
      iconSrc: documentingEv,
      tone: "yellow",
      theme: "document",
      className: "min-h-[132px] xl:h-[140px]",
    },
    {
      id: "report-1",
      title: t("dashboard.microcards.safeReporting"),
      iconSrc: safeReporting,
      tone: "yellow",
      theme: "report",
      className: "min-h-[124px] xl:h-[130px]",
    },
    {
      id: "footprint-1",
      title: t("dashboard.microcards.digitalFootprints"),
      iconSrc: digitalFootPrint,
      tone: "blue",
      theme: "footprint",
      className: "min-h-[124px] xl:h-[130px]",
    },
    {
      id: "document-2",
      title: t("dashboard.microcards.documentingEvidence"),
      iconSrc: documentingEv,
      tone: "teal",
      theme: "document",
      className: "min-h-[132px] md:col-span-2 xl:h-[140px]",
    },
    {
      id: "footprint-2",
      title: t("dashboard.microcards.digitalFootprints"),
      iconSrc: digitalFootPrint,
      tone: "blue",
      theme: "footprint",
      className: "min-h-[124px] xl:h-[130px]",
    },
    {
      id: "report-2",
      title: t("dashboard.microcards.safeReporting"),
      iconSrc: safeReporting,
      tone: "yellow",
      theme: "report",
      className: "min-h-[124px] xl:h-[130px]",
    },
    {
      id: "report-3",
      title: t("dashboard.microcards.safeReporting"),
      iconSrc: safeReporting,
      tone: "yellow",
      theme: "report",
      className: "min-h-[124px] xl:h-[130px]",
    },
    {
      id: "footprint-3",
      title: t("dashboard.microcards.digitalFootprints"),
      iconSrc: digitalFootPrint,
      tone: "blue",
      theme: "footprint",
      className: "min-h-[124px] xl:h-[130px]",
    },
  ];

  const activeCard = cards.find((card) => card.id === activeCardId) ?? null;
  const activeCardDetail = activeCard
    ? detailContentByTheme[activeCard.theme]
    : null;

  const sharedTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 240, damping: 30, mass: 0.92 };

  const fadeTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: "easeOut" };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCards = cards.filter((card) => {
    if (!normalizedQuery) return true;

    const detailCopy = detailContentByTheme[card.theme];
    return (
      card.title.toLowerCase().includes(normalizedQuery) ||
      detailCopy.eyebrow.toLowerCase().includes(normalizedQuery) ||
      detailCopy.headline.toLowerCase().includes(normalizedQuery)
    );
  });

  useEffect(() => {
    if (!activeCardId) {
      return;
    }

    pushedHistoryRef.current = true;
    window.history.pushState({ microcardId: activeCardId }, "");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveCardId(null);

        if (pushedHistoryRef.current) {
          pushedHistoryRef.current = false;
          window.history.back();
        }
      }
    };

    const handlePopState = () => {
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
      }

      setActiveCardId(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeCardId]);

  const closeActiveCard = () => {
    if (!activeCardId) {
      return;
    }

    setActiveCardId(null);

    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      window.history.back();
    }
  };

  return (
    <LayoutGroup id="microcards-morph">
      <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
        <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
          <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
            >
              <IconChevronLeft size={14} />
              {t("dashboard.microcards.cyberBullying")}
            </Link>
            <Link
              href="/dashboard"
              className="text-xs font-medium text-[#7b8798]"
            >
              {t("common.cancel")}
            </Link>
          </div>

          <div className="pt-4">
            <h1
              className={`${interFont.className} text-4xl font-black leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]`}
            >
              {t("dashboard.microcards.title")}
            </h1>
            <p className="mt-1 text-sm text-[#5f6f86]">
              {t("dashboard.microcards.cyberBullying")}
            </p>

            <div className="relative mt-4 max-w-[540px]">
              <IconSearch
                size={14}
                className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a6b9]"
              />
              <input
                type="text"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder={t("dashboard.microcards.searchPlaceholder")}
                className="h-10 w-full rounded-full border border-[#dbe5f0] bg-white px-10 text-xs text-[#1f2937] outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-2">
              {filteredCards.map((card) => (
                <MicroCardLesson
                  key={card.id}
                  id={card.id}
                  title={card.title}
                  iconSrc={card.iconSrc}
                  tone={card.tone}
                  className={card.className}
                  isActive={activeCardId === card.id}
                  onOpen={() => {
                    pushedHistoryRef.current = false;
                    setActiveCardId(card.id);
                  }}
                />
              ))}

              {filteredCards.length === 0 ? (
                <article className="rounded-2xl border border-[#dce5f1] bg-white p-6 text-center md:col-span-2">
                  <p className="text-sm font-semibold text-[#22344a]">
                    No micro-cards match that search.
                  </p>
                  <p className="mt-1 text-xs text-[#6f8197]">
                    Try searching by topic, safety, evidence, or privacy.
                  </p>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {activeCard && activeCardDetail ? (
          <motion.div
            className="fixed inset-0 z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            <motion.button
              type="button"
              className="absolute inset-0 bg-[#0b1728]/35 backdrop-blur-[1px]"
              onClick={closeActiveCard}
              aria-label={t("common.cancel")}
            />

            <div className="relative h-full w-full p-3 sm:p-4 lg:p-6">
              <motion.article
                layoutId={`microcard-${activeCard.id}`}
                transition={sharedTransition}
                className="mx-auto flex h-full w-full max-w-[1184px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_24px_70px_rgba(15,33,59,0.25)] sm:rounded-[32px]"
              >
                <header className="flex items-center justify-between border-b border-[#e3eaf4] px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    onClick={closeActiveCard}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
                  >
                    <IconChevronLeft size={14} />
                    {t("dashboard.microcards.title")}
                  </button>
                  <button
                    type="button"
                    onClick={closeActiveCard}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d9e2ee] text-[#50627a]"
                    aria-label={t("common.cancel")}
                  >
                    <IconX size={14} />
                  </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                  <section
                    className={cn(
                      "rounded-[24px] p-5 sm:p-6",
                      activeCard.tone === "yellow"
                        ? "bg-[#fff4cf]"
                        : activeCard.tone === "teal"
                          ? "bg-[#e4f8f5]"
                          : "bg-[#eaf2ff]"
                    )}
                  >
                    <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[#4f647f]">
                      {activeCardDetail.eyebrow}
                    </p>
                    <div className="mt-3 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                      <div className="max-w-[720px]">
                        <h2
                          className={`${interFont.className} text-[34px] font-black leading-[0.95] text-[#12243c] sm:text-[44px]`}
                        >
                          {activeCard.title}
                        </h2>
                        <p className="mt-3 text-sm leading-[1.65] text-[#4f647f] sm:text-base">
                          {activeCardDetail.summary}
                        </p>
                      </div>
                      <div className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 shadow-[0_10px_24px_rgba(15,23,42,0.08)]">
                        <Image
                          src={activeCard.iconSrc}
                          alt={activeCard.title}
                          width={24}
                          height={24}
                          className="h-6 w-6"
                        />
                      </div>
                    </div>
                  </section>

                  <div className="mt-4 grid grid-cols-1 gap-4 lg:grid-cols-[1.06fr_0.94fr]">
                    <section className="rounded-2xl border border-[#e1eaf4] bg-white p-4 sm:p-6">
                      <h3
                        className={`${interFont.className} text-[22px] font-extrabold text-[#12243c]`}
                      >
                        {activeCardDetail.headline}
                      </h3>
                      {activeCardDetail.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mt-3 text-sm leading-[1.7] text-[#4f647f]"
                        >
                          {paragraph}
                        </p>
                      ))}

                      <div className="mt-5 rounded-[18px] border border-[#dbe5f2] bg-[#f7fbff] p-4">
                        <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1f63c9]">
                          Checklist
                        </p>
                        <ul className="mt-3 space-y-2">
                          {activeCardDetail.checklist.map((item) => (
                            <li
                              key={item}
                              className="flex items-start gap-2 text-sm leading-6 text-[#42566d]"
                            >
                              <span className="mt-2 h-1.5 w-1.5 rounded-full bg-[#0f5fa7]" />
                              <span>{item}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </section>

                    <section className="rounded-2xl border border-[#e1eaf4] p-4 sm:p-6">
                      <div className="relative aspect-[16/10] overflow-hidden rounded-[18px]">
                        <Image
                          src={hackerImage}
                          alt={t("dashboard.microcardDetail.internetHoaxAwareness")}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(16,132,220,0.14)_0%,rgba(10,49,91,0.62)_62%,rgba(4,26,51,0.88)_100%)]" />
                      </div>

                      <div className="mt-4 rounded-[18px] bg-[#e9eef5] px-4 py-3">
                        <div className="flex items-start gap-3">
                          <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3b82f6]/40 text-[#2d74d7]">
                            <IconAlertCircleFilled size={12} />
                          </span>
                          <div>
                            <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1f63c9]">
                              {t("dashboard.microcardDetail.keyTakeaway")}
                            </p>
                            <p className="mt-0.5 text-[12px] leading-[1.55] text-[#4e5f76]">
                              {activeCardDetail.takeaway}
                            </p>
                          </div>
                        </div>
                      </div>

                      <button className="mt-4 inline-flex rounded-full bg-[#0c5aa4] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0b4f90]">
                        {activeCardDetail.cta}
                      </button>

                      <p className="mt-4 text-[12px] leading-[1.65] text-[#5f6f86]">
                        {t("dashboard.microcardDetail.educationalDisclaimer")}
                      </p>
                    </section>
                  </div>
                </div>
              </motion.article>
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </LayoutGroup>
  );
}

function MicroCardDetailPage() {
  const { t } = useTranslation();

  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=microcards"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            {t("dashboard.microcardDetail.safeSpeakEducation")}
          </Link>
          <Link
            href="/dashboard?view=microcards"
            className="text-xs font-medium text-[#7b8798]"
          >
            {t("common.cancel")}
          </Link>
        </div>

        <div className="mt-4 rounded-[12px] border border-[#dce4ef] bg-white p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] sm:aspect-auto sm:h-[330px]">
            <Image
              src={hackerImage}
              alt={t("dashboard.microcardDetail.internetHoaxAwareness")}
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(16,132,220,0.14)_0%,rgba(10,49,91,0.62)_62%,rgba(4,26,51,0.88)_100%)]" />
            <p
              className={`${interFont.className} absolute right-8 top-8 rotate-[-10deg] text-[42px] font-black uppercase leading-[0.84] text-[#d42828] sm:text-[52px]`}
            >
              {t("dashboard.microcardDetail.internet")}
              <br />
              {t("dashboard.microcardDetail.hoax")}
              <br />!
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,17,43,0.78)_100%)] px-4 pb-4 pt-10">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/95">
                {t("dashboard.microcardDetail.safetyEssentials")}
              </p>
              <h2
                className={`${interFont.className} mt-1 text-[34px] font-extrabold leading-[0.95] text-white sm:text-[40px]`}
              >
                {t("dashboard.microcardDetail.stayingSafeOnline")}
              </h2>
            </div>
          </div>

          <div className="px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
            <h3
              className={`${interFont.className} text-[20px] font-extrabold text-[#0f1f35]`}
            >
              {t("dashboard.microcardDetail.digitalHarassmentOverview")}
            </h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#4e5f76]">
              {t("dashboard.microcardDetail.overviewParagraph1")}
            </p>

            <div className="mt-4 rounded-[8px] bg-[#e9eef5] px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3b82f6]/40 text-[#2d74d7]">
                  <IconAlertCircleFilled size={12} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1f63c9]">
                    {t("dashboard.microcardDetail.keyTakeaway")}
                  </p>
                  <p className="mt-0.5 text-[12px] leading-[1.45] text-[#4e5f76]">
                    {t("dashboard.microcardDetail.keyTakeawayBody")}
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-[1.6] text-[#4e5f76]">
              {t("dashboard.microcardDetail.overviewParagraph2")}
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe5f2] bg-white px-4 py-2 text-[11px] font-semibold text-[#334155] transition hover:bg-[#f8fafc]"
              >
                <IconChevronLeft size={12} />
                {t("dashboard.microcardDetail.previousMicrocards")}
              </Link>
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0c5aa4] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0b4f90]"
              >
                {t("dashboard.microcardDetail.nextMicrocards")}
                <IconChevronRight size={12} />
              </Link>
            </div>

            <p className="mt-4 text-center text-[9px] text-[#9aa7b8]">
              {t("dashboard.microcardDetail.educationalDisclaimer")}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { MicroCardDetailPage, MicroCardsPage };
