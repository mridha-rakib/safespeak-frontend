"use client";

import Image, { type StaticImageData } from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useRef, useState } from "react";

import {
  IconAlertCircleFilled,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconSearch,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  LayoutGroup,
  type Transition,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useTranslation } from "react-i18next";

import digitalFootPrint from "@/assets/digital_foot_print.svg?url";
import documentingEv from "@/assets/documentig_ev.svg?url";
import hackerImage from "@/assets/hacker.jpg";
import identifyBulling from "@/assets/identifyBulling.svg?url";
import safeReporting from "@/assets/safe_reporting.svg?url";
import {
  type MicroEducationCategory,
  type MicroEducationItem,
  type MicroEducationTone,
  getMicroEducationImageUrl,
  listPublishedMicroEducationByCategory,
  listPublishedMicroEducationCategories,
} from "@/lib/microeducation";
import { cn } from "@/lib/utils";

import { interFont } from "./dashboard-shared";

type MicroCardTone = MicroEducationTone;
type MicroCardTheme =
  | "identify"
  | "document"
  | "report"
  | "footprint"
  | "rights"
  | "wellbeing";

type MicroCardItem = {
  id: string;
  title: string;
  tag: string;
  summary: string;
  cta: string;
  readTimeLabel: string;
  detailHeading: string;
  detailSummary: string;
  detailBody: string;
  detailTakeaway: string;
  imageUrl?: string;
  imageAlt: string;
  iconSrc: string;
  tone: MicroCardTone;
  theme: MicroCardTheme;
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
  rights: {
    eyebrow: "Know your options",
    headline: "Understand rights, records, and safer next steps.",
    summary:
      "Rights guidance works best when it is practical, plain-language, and paired with options for trusted follow-up.",
    paragraphs: [
      "Start by identifying which setting is involved: work, school, housing, online spaces, or public services. The right pathway often depends on where the harm occurred.",
      "Keep notes, dates, names, and copies of relevant messages. A short record can help a support service understand what happened without asking you to retell everything at once.",
    ],
    checklist: [
      "Write down the setting and people involved.",
      "Keep copies of messages, policies, or documents.",
      "Ask a trusted service which reporting pathway fits.",
    ],
    takeaway:
      "You do not need to choose a formal report immediately to start preserving useful information.",
    cta: "Review rights guidance",
  },
  wellbeing: {
    eyebrow: "Support your wellbeing",
    headline:
      "Use short steps that lower pressure while you decide what comes next.",
    summary:
      "Wellbeing support should make the next action feel smaller, safer, and easier to complete.",
    paragraphs: [
      "Stress can make it harder to organize details or decide what to do. A small stabilizing step, such as writing one note or contacting one trusted person, can still move things forward.",
      "If the situation feels urgent or unsafe, prioritize immediate safety and professional support before continuing with any learning content.",
    ],
    checklist: [
      "Pause and move to a safer place if possible.",
      "Choose one trusted person or service to contact.",
      "Keep the next action small and specific.",
    ],
    takeaway: "A useful first step is the one you can take safely right now.",
    cta: "Open wellbeing tips",
  },
};

function inferMicroCardTheme(item: MicroEducationItem): MicroCardTheme {
  const searchableText =
    `${item.title} ${item.tag} ${item.summary}`.toLowerCase();

  if (
    item.chips.includes("rights") ||
    searchableText.includes("right") ||
    searchableText.includes("legal") ||
    searchableText.includes("migrant")
  ) {
    return "rights";
  }

  if (
    item.chips.includes("mentalHealth") ||
    searchableText.includes("mental") ||
    searchableText.includes("wellbeing")
  ) {
    return "wellbeing";
  }

  if (
    searchableText.includes("evidence") ||
    searchableText.includes("document") ||
    searchableText.includes("record")
  ) {
    return "document";
  }

  if (searchableText.includes("report") || searchableText.includes("submit")) {
    return "report";
  }

  if (
    searchableText.includes("digital") ||
    searchableText.includes("online") ||
    searchableText.includes("privacy") ||
    searchableText.includes("footprint")
  ) {
    return "footprint";
  }

  return "identify";
}

function iconForTheme(theme: MicroCardTheme) {
  if (theme === "document") {
    return documentingEv;
  }

  if (theme === "report") {
    return safeReporting;
  }

  if (theme === "footprint") {
    return digitalFootPrint;
  }

  return identifyBulling;
}

function toMicroCardItem(item: MicroEducationItem): MicroCardItem {
  const theme = inferMicroCardTheme(item);
  const imageUrl = getMicroEducationImageUrl(item);

  return {
    id: item.id,
    title: item.title,
    tag: item.tag,
    summary: item.summary,
    cta: item.cta,
    readTimeLabel: item.readTimeLabel || "4 min read",
    detailHeading: item.detailHeading || item.title,
    detailSummary: item.detailSummary || item.summary,
    detailBody: item.detailBody || item.summary,
    detailTakeaway: item.detailTakeaway || item.summary,
    imageUrl,
    imageAlt: item.imageAlt || item.title,
    iconSrc: iconForTheme(theme),
    tone: item.tone,
    theme,
  };
}

function getMicroCardDetail(card: MicroCardItem) {
  const baseDetail = detailContentByTheme[card.theme];

  return {
    ...baseDetail,
    eyebrow: card.tag || baseDetail.eyebrow,
    headline: card.detailHeading || baseDetail.headline,
    summary: card.detailSummary || card.summary || baseDetail.summary,
    paragraphs: [
      card.detailSummary || card.summary || baseDetail.summary,
      card.detailBody || baseDetail.paragraphs[1],
    ],
    takeaway: card.detailTakeaway || baseDetail.takeaway,
    cta: card.cta || baseDetail.cta,
  };
}

type MicroCardRowVariant = "narrow-wide" | "wide-narrow" | "full";

function buildMicroCardRows(cards: MicroCardItem[]) {
  const rows: Array<{ variant: MicroCardRowVariant; cards: MicroCardItem[] }> =
    [];
  let cursor = 0;

  while (cursor < cards.length) {
    const variantIndex = rows.length % 3;

    if (variantIndex === 2) {
      rows.push({ variant: "full", cards: [cards[cursor]] });
      cursor += 1;
      continue;
    }

    rows.push({
      variant: variantIndex === 0 ? "narrow-wide" : "wide-narrow",
      cards: cards.slice(cursor, cursor + 2),
    });
    cursor += 2;
  }

  return rows;
}

function toneForMicroCardRow(
  rowVariant: MicroCardRowVariant,
  cardIndex: number
): MicroCardTone {
  if (rowVariant === "full") {
    return "teal";
  }

  if (rowVariant === "narrow-wide") {
    return cardIndex === 0 ? "blue" : "amber";
  }

  return cardIndex === 0 ? "amber" : "blue";
}

function MicroCardLesson({
  id,
  title,
  iconSrc,
  tone,
  readTimeLabel,
  onOpen,
  isActive,
  className,
}: {
  id: string;
  title: string;
  iconSrc: string;
  tone: MicroCardTone;
  readTimeLabel: string;
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
      card: "bg-[#01579B]",
      title: "text-white",
      meta: "text-[#E1F5FE]",
      iconWrap: "bg-white/30",
      button: "bg-white text-[#111827]",
    },
    orange: {
      card: "bg-[#FFB300]",
      title: "text-[#111827]",
      meta: "text-[#1F2937]",
      iconWrap: "bg-white/30",
      button: "bg-white text-[#111827]",
    },
    amber: {
      card: "bg-[#FFB300]",
      title: "text-[#111827]",
      meta: "text-[#1F2937]",
      iconWrap: "bg-white/30",
      button: "bg-white text-[#111827]",
    },
    green: {
      card: "bg-[#0D9488]",
      title: "text-white",
      meta: "text-white/85",
      iconWrap: "bg-white/30",
      button: "bg-white text-[#111827]",
    },
    violet: {
      card: "bg-[#01579B]",
      title: "text-white",
      meta: "text-[#E1F5FE]",
      iconWrap: "bg-white/30",
      button: "bg-white text-[#111827]",
    },
    teal: {
      card: "bg-[#0D9488]",
      title: "text-white",
      meta: "text-white/85",
      iconWrap: "bg-white/30",
      button: "bg-white text-[#111827]",
    },
  };

  const currentTone = toneStyles[tone];

  return (
    <motion.button
      type="button"
      layout
      layoutId={`microcard-${id}`}
      className={cn(
        "relative overflow-hidden rounded-[24px] p-5 text-left shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.024)] sm:p-6 xl:rounded-[32px] xl:p-8",
        currentTone.card,
        isActive && "pointer-events-none opacity-0",
        className
      )}
      onClick={onOpen}
      aria-label={title}
    >
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/10 blur-[12px]" />
      <div className="relative flex h-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex h-full min-w-0 flex-col">
          <h3
            className={cn(
              `${interFont.className} text-[22px] font-bold leading-[1.08] tracking-normal sm:text-2xl sm:leading-8`,
              currentTone.title
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              "mt-4 inline-flex h-12 w-12 items-center justify-center rounded-[18px] backdrop-blur-sm sm:h-14 sm:w-14 xl:h-16 xl:w-16 xl:rounded-[24px]",
              currentTone.iconWrap
            )}
          >
            <Image
              src={iconSrc}
              alt={title}
              width={30}
              height={30}
              className="h-6 w-6 sm:h-7 sm:w-7 xl:h-[30px] xl:w-[30px]"
            />
          </div>
          <div className="mt-auto inline-flex items-center gap-1.5">
            <IconClock size={12} className={currentTone.meta} />
            <span className={cn("text-xs font-semibold", currentTone.meta)}>
              {readTimeLabel || t("dashboard.microcards.fourMinRead")}
            </span>
          </div>
        </div>

        <span
          className={cn(
            "inline-flex h-10 shrink-0 items-center justify-center self-start whitespace-nowrap rounded-full px-5 text-xs font-bold leading-none sm:mt-1 sm:self-auto xl:h-[54px] xl:px-6 xl:text-lg",
            currentTone.button
          )}
        >
          {t("dashboard.microcards.readMore")}
        </span>
      </div>
    </motion.button>
  );
}

function MicroCategoryCard({
  category,
  onOpen,
}: {
  category: MicroEducationCategory;
  onOpen: () => void;
}) {
  const iconLabel = (category.iconName || category.name).slice(0, 2).toUpperCase();

  return (
    <motion.button
      type="button"
      layout
      className="relative min-h-[164px] overflow-hidden rounded-[24px] p-5 text-left shadow-[0_10px_15px_-3px_rgba(0,0,0,0.05),0_4px_6px_-2px_rgba(0,0,0,0.024)] sm:p-6 md:h-[192px] xl:rounded-[32px] xl:p-8"
      style={{
        backgroundColor: category.backgroundColor,
        color: category.textColor,
        backgroundImage: category.imageUrl
          ? `linear-gradient(90deg, rgba(8, 29, 48, 0.62), rgba(8, 29, 48, 0.24)), url(${category.imageUrl})`
          : undefined,
        backgroundSize: category.imageUrl ? "cover" : undefined,
        backgroundPosition: category.imageUrl ? "center" : undefined,
      }}
      onClick={onOpen}
      aria-label={category.name}
    >
      <div className="absolute bottom-0 left-0 h-24 w-24 rounded-full bg-white/10 blur-[12px]" />
      <div className="relative flex h-full flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold uppercase tracking-[0.12em] opacity-80">
            {category.cardCount ?? 0} cards
          </p>
          <h3
            className={`${interFont.className} mt-2 text-[26px] font-bold leading-[1.05] tracking-normal sm:text-3xl`}
          >
            {category.name}
          </h3>
          {category.description ? (
            <p className="mt-2 max-w-[420px] text-xs leading-5 opacity-85">
              {category.description}
            </p>
          ) : null}
        </div>
        <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-[18px] bg-white/25 text-sm font-bold backdrop-blur-sm sm:h-14 sm:w-14 xl:h-16 xl:w-16 xl:rounded-[24px]">
          {iconLabel}
        </span>
      </div>
    </motion.button>
  );
}

function MicroCardArticle({
  title,
  badge,
  sectionTitle,
  summary,
  paragraph,
  takeaway,
  imageSrc,
  imageAlt,
  onPrevious,
  onNext,
}: {
  title: string;
  badge: string;
  sectionTitle: string;
  summary: string;
  paragraph: string;
  takeaway: string;
  imageSrc?: string | StaticImageData;
  imageAlt?: string;
  onPrevious?: () => void;
  onNext?: () => void;
}) {
  const { t } = useTranslation();

  const previousContent = (
    <>
      <IconChevronLeft size={18} />
      <span>{t("dashboard.microcardDetail.previousMicrocards")}</span>
    </>
  );
  const nextContent = (
    <>
      <span>{t("dashboard.microcardDetail.nextMicrocards")}</span>
      <IconChevronRight size={18} />
    </>
  );

  return (
    <article className="overflow-hidden rounded-2xl border border-[#E5E7EB] bg-white shadow-[0_1px_3px_rgba(0,0,0,0.1),0_1px_2px_rgba(0,0,0,0.06)]">
      <section className="relative h-[280px] overflow-hidden sm:h-[360px] lg:h-[466px]">
        {typeof imageSrc === "string" ? (
          <img
            src={imageSrc}
            alt={imageAlt ?? t("dashboard.microcardDetail.internetHoaxAwareness")}
            className="h-full w-full object-cover"
          />
        ) : (
          <Image
            src={imageSrc ?? hackerImage}
            alt={imageAlt ?? t("dashboard.microcardDetail.internetHoaxAwareness")}
            fill
            priority
            className="object-cover"
          />
        )}
        <div className="absolute inset-0 bg-[#0A6FAF]/35 mix-blend-multiply" />
        <div className="absolute inset-0 bg-[linear-gradient(0deg,rgba(0,0,0,0.64)_0%,rgba(0,0,0,0)_55%)]" />
        <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
          <span className="inline-flex rounded-lg bg-[#01579B] px-2 py-1 text-[10px] font-bold uppercase leading-[15px] tracking-[0.05em] text-white">
            {badge}
          </span>
          <h2
            className={`${interFont.className} mt-2 text-[28px] font-bold leading-9 text-white sm:text-[30px]`}
          >
            {title}
          </h2>
        </div>
      </section>

      <div className="p-6 sm:p-8 lg:p-10">
        <div className="space-y-6">
          <section className="space-y-4">
            <h3
              className={`${interFont.className} text-xl font-semibold leading-7 text-[#111827]`}
            >
              {sectionTitle}
            </h3>
            <p className="text-base leading-[1.62] text-[#4B5563] sm:text-lg">
              {summary}
            </p>

            <div className="rounded-r-md border-l-4 border-[#01579B] bg-[#EFF6FF] px-4 py-4 sm:py-[22px]">
              <div className="flex items-start gap-3">
                <IconAlertCircleFilled
                  size={20}
                  className="mt-0.5 shrink-0 text-[#01579B]"
                />
                <div className="min-w-0 pt-1">
                  <p className="text-sm font-bold uppercase leading-5 tracking-[0.025em] text-[#01579B]">
                    {t("dashboard.microcardDetail.keyTakeaway")}
                  </p>
                  <p className="mt-1 text-sm leading-5 text-[#111827]">
                    {takeaway}
                  </p>
                </div>
              </div>
            </div>

            <p className="pt-2 text-base leading-[1.62] text-[#4B5563] sm:text-lg">
              {paragraph}
            </p>
          </section>

          <section className="flex flex-col gap-4 border-t border-[#E5E7EB] pt-8 sm:flex-row sm:items-center sm:justify-between">
            {onPrevious ? (
              <button
                type="button"
                onClick={onPrevious}
                className="inline-flex items-center justify-center gap-2 text-sm font-medium leading-5 text-[#4B5563] transition hover:text-[#111827]"
              >
                {previousContent}
              </button>
            ) : (
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center justify-center gap-2 text-sm font-medium leading-5 text-[#4B5563] transition hover:text-[#111827]"
              >
                {previousContent}
              </Link>
            )}

            {onNext ? (
              <button
                type="button"
                onClick={onNext}
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#01579B] px-8 text-base font-semibold leading-6 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-[#014681]"
              >
                {nextContent}
              </button>
            ) : (
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-[#01579B] px-8 text-base font-semibold leading-6 text-white shadow-[0_4px_6px_-1px_rgba(0,0,0,0.1),0_2px_4px_-2px_rgba(0,0,0,0.1)] transition hover:bg-[#014681]"
              >
                {nextContent}
              </Link>
            )}
          </section>

          <p className="text-center text-xs italic leading-4 text-[#9CA3AF]">
            {t("dashboard.microcardDetail.educationalDisclaimer")}
          </p>
        </div>
      </div>
    </article>
  );
}

function MicroCardsPage() {
  const router = useRouter();
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const prefersReducedMotion = useReducedMotion();
  const [routeCategoryId] = useState(() => searchParams.get("categoryId"));
  const [routeCardId] = useState(() => searchParams.get("cardId"));
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState<string | null>(
    () => routeCategoryId
  );
  const [activeCardId, setActiveCardId] = useState<string | null>(
    () => routeCardId
  );
  const [categories, setCategories] = useState<MicroEducationCategory[]>([]);
  const [adminCards, setAdminCards] = useState<MicroEducationItem[]>([]);
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingCards, setIsLoadingCards] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const pushedHistoryRef = useRef(false);
  const appliedRouteCategoryRef = useRef(false);
  const appliedRouteCardRef = useRef(false);

  useEffect(() => {
    let isMounted = true;

    const loadCategories = async () => {
      setIsLoadingCategories(true);
      setLoadError(null);

      try {
        const items = await listPublishedMicroEducationCategories();

        if (isMounted) {
          setCategories(items);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Micro-card categories could not be loaded."
          );
          setCategories([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCategories(false);
        }
      }
    };

    void loadCategories();

    return () => {
      isMounted = false;
    };
  }, []);

  useEffect(() => {
    if (
      !routeCategoryId ||
      appliedRouteCategoryRef.current ||
      isLoadingCategories ||
      categories.length === 0
    ) {
      return;
    }

    if (categories.some((category) => category.id === routeCategoryId)) {
      setActiveCategoryId(routeCategoryId);
    }

    appliedRouteCategoryRef.current = true;
  }, [categories, isLoadingCategories, routeCategoryId]);

  useEffect(() => {
    let isMounted = true;

    const loadCards = async () => {
      if (!activeCategoryId) {
        setAdminCards([]);
        setIsLoadingCards(false);
        return;
      }

      setIsLoadingCards(true);
      setLoadError(null);

      try {
        const items = await listPublishedMicroEducationByCategory(activeCategoryId);

        if (isMounted) {
          setAdminCards(items);
        }
      } catch (error) {
        if (isMounted) {
          setLoadError(
            error instanceof Error
              ? error.message
              : "Micro-card content could not be loaded."
          );
          setAdminCards([]);
        }
      } finally {
        if (isMounted) {
          setIsLoadingCards(false);
        }
      }
    };

    void loadCards();

    return () => {
      isMounted = false;
    };
  }, [activeCategoryId]);

  const cards = adminCards.map(toMicroCardItem);
  const activeCategory =
    categories.find((category) => category.id === activeCategoryId) ?? null;

  const activeCard = cards.find((card) => card.id === activeCardId) ?? null;
  const activeCardDetail = activeCard ? getMicroCardDetail(activeCard) : null;

  useEffect(() => {
    if (
      !routeCardId ||
      appliedRouteCardRef.current ||
      !activeCategoryId ||
      isLoadingCards ||
      cards.length === 0
    ) {
      return;
    }

    if (cards.some((card) => card.id === routeCardId)) {
      setActiveCardId(routeCardId);
    }

    appliedRouteCardRef.current = true;
  }, [activeCategoryId, cards, isLoadingCards, routeCardId]);

  const sharedTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 240, damping: 30, mass: 0.92 };

  const fadeTransition: Transition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.24, ease: "easeOut" };

  const normalizedQuery = searchQuery.trim().toLowerCase();
  const filteredCategories = categories.filter((category) => {
    if (!normalizedQuery) return true;

    return (
      category.name.toLowerCase().includes(normalizedQuery) ||
      (category.description ?? "").toLowerCase().includes(normalizedQuery)
    );
  });
  const filteredCards = cards.filter((card) => {
    if (!normalizedQuery) return true;

    const detailCopy = detailContentByTheme[card.theme];
    return (
      card.title.toLowerCase().includes(normalizedQuery) ||
      card.summary.toLowerCase().includes(normalizedQuery) ||
      card.detailHeading.toLowerCase().includes(normalizedQuery) ||
      card.detailSummary.toLowerCase().includes(normalizedQuery) ||
      card.detailBody.toLowerCase().includes(normalizedQuery) ||
      detailCopy.eyebrow.toLowerCase().includes(normalizedQuery) ||
      detailCopy.headline.toLowerCase().includes(normalizedQuery)
    );
  });
  const microCardRows = buildMicroCardRows(filteredCards);

  useEffect(() => {
    if (!activeCardId) {
      return;
    }

    if (!pushedHistoryRef.current) {
      pushedHistoryRef.current = true;
      window.history.pushState({ microcardId: activeCardId }, "");
    }

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

  const closeActiveCategory = () => {
    setActiveCategoryId(null);
    setActiveCardId(null);
    setAdminCards([]);
    setSearchQuery("");
  };

  const openAdjacentCard = (direction: -1 | 1) => {
    if (!activeCard) {
      return;
    }

    const navigableCards = filteredCards.length > 0 ? filteredCards : cards;

    if (navigableCards.length === 0) {
      return;
    }

    const currentIndex = navigableCards.findIndex(
      (card) => card.id === activeCard.id
    );
    const nextIndex =
      ((currentIndex >= 0 ? currentIndex : 0) +
        direction +
        navigableCards.length) %
      navigableCards.length;

    setActiveCardId(navigableCards[nextIndex].id);
  };

  return (
    <LayoutGroup id="microcards-morph">
      <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
        <div className="mx-auto w-full max-w-[1136px]">
          <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
            <Link
              href={activeCategoryId ? "#" : "/dashboard"}
              onClick={(event) => {
                if (activeCategoryId) {
                  event.preventDefault();
                  closeActiveCategory();
                } else {
                  event.preventDefault();
                  router.back();
                }
              }}
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
            >
              <IconChevronLeft size={14} />
              {activeCategoryId
                ? t("dashboard.microcards.title")
                : t("dashboard.microcards.cyberBullying")}
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
              {activeCategory?.name ?? t("dashboard.microcards.cyberBullying")}
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

            <div className="mt-6 flex flex-col gap-5 xl:gap-6">
              {!activeCategoryId ? (
                <div className="grid grid-cols-1 gap-5 md:grid-cols-2 md:gap-6">
                  {filteredCategories.map((category) => (
                    <MicroCategoryCard
                      key={category.id}
                      category={category}
                      onOpen={() => {
                        setSearchQuery("");
                        setActiveCategoryId(category.id);
                      }}
                    />
                  ))}
                </div>
              ) : (
                <>
                  {microCardRows.map((row) =>
                    row.variant === "full" ? (
                      row.cards.map((card, cardIndex) => (
                        <MicroCardLesson
                          key={card.id}
                          id={card.id}
                          title={card.title}
                          iconSrc={card.iconSrc}
                          tone={toneForMicroCardRow(row.variant, cardIndex)}
                          readTimeLabel={card.readTimeLabel}
                          className="min-h-[164px] md:min-h-[220px] xl:h-[240px]"
                          isActive={activeCardId === card.id}
                          onOpen={() => {
                            pushedHistoryRef.current = false;
                            setActiveCardId(card.id);
                          }}
                        />
                      ))
                    ) : (
                      <div
                        key={row.cards.map((card) => card.id).join("-")}
                        className={cn(
                          "grid grid-cols-1 gap-5 md:gap-6",
                          row.variant === "narrow-wide"
                            ? "md:grid-cols-[minmax(0,467fr)_minmax(0,645fr)]"
                            : "md:grid-cols-[minmax(0,645fr)_minmax(0,467fr)]"
                        )}
                      >
                        {row.cards.map((card, cardIndex) => (
                          <MicroCardLesson
                            key={card.id}
                            id={card.id}
                            title={card.title}
                            iconSrc={card.iconSrc}
                            tone={toneForMicroCardRow(row.variant, cardIndex)}
                            readTimeLabel={card.readTimeLabel}
                            className="min-h-[164px] md:h-[192px]"
                            isActive={activeCardId === card.id}
                            onOpen={() => {
                              pushedHistoryRef.current = false;
                              setActiveCardId(card.id);
                            }}
                          />
                        ))}
                      </div>
                    )
                  )}
                </>
              )}

              {!activeCategoryId && filteredCategories.length === 0 ? (
                <article className="rounded-2xl border border-[#dce5f1] bg-white p-6 text-center">
                  <p className="text-sm font-semibold text-[#22344a]">
                    {isLoadingCategories
                      ? "Loading categories..."
                      : loadError
                        ? "Micro-card categories could not be loaded."
                        : categories.length === 0
                          ? "No published micro-card categories are available yet."
                          : "No categories match that search."}
                  </p>
                  <p className="mt-1 text-xs text-[#6f8197]">
                    {isLoadingCategories
                      ? "Please wait while published categories load."
                      : (loadError ??
                        (categories.length === 0
                          ? "Publish categories and assign cards from the admin dashboard to show them here."
                          : "Try searching by category name or description."))}
                  </p>
                </article>
              ) : null}

              {activeCategoryId && filteredCards.length === 0 ? (
                <article className="rounded-2xl border border-[#dce5f1] bg-white p-6 text-center">
                  <p className="text-sm font-semibold text-[#22344a]">
                    {isLoadingCards
                      ? "Loading micro-cards..."
                      : loadError
                        ? "Micro-cards could not be loaded."
                        : adminCards.length === 0
                          ? "No published micro-cards are available yet."
                          : "No micro-cards match that search."}
                  </p>
                  <p className="mt-1 text-xs text-[#6f8197]">
                    {isLoadingCards
                      ? "Please wait while published admin content loads."
                      : (loadError ??
                        (adminCards.length === 0
                          ? "Publish micro-education cards from the admin dashboard to show them here."
                          : "Try searching by topic, safety, evidence, or privacy."))}
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
            className="fixed inset-0 z-50 overflow-y-auto bg-[#EEF4FB]/95"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={fadeTransition}
          >
            <div className="min-h-full">
              <header className="sticky top-0 z-10 border-b border-[#E5E7EB] bg-white/80 backdrop-blur-md">
                <div className="mx-auto flex h-[61px] w-full max-w-[1184px] items-center justify-between px-6 lg:px-20">
                  <button
                    type="button"
                    onClick={closeActiveCard}
                    className="inline-flex h-10 items-center gap-4 text-lg font-bold leading-7 text-[#111827]"
                  >
                    <span className="inline-flex h-10 w-10 items-center justify-center rounded-full">
                      <IconChevronLeft size={24} />
                    </span>
                    {t("dashboard.microcardDetail.safeSpeakEducation")}
                  </button>
                  <button
                    type="button"
                    onClick={closeActiveCard}
                    className="text-base font-medium leading-6 text-[#64748B]"
                  >
                    {t("common.cancel")}
                  </button>
                </div>
              </header>

              <main className="mx-auto w-full max-w-[1184px] px-6 py-8 sm:py-10 lg:py-12">
                <motion.div
                  layoutId={`microcard-${activeCard.id}`}
                  transition={sharedTransition}
                >
                  <MicroCardArticle
                    title={activeCard.title}
                    badge={activeCardDetail.eyebrow}
                    sectionTitle={activeCardDetail.headline}
                    summary={activeCardDetail.summary}
                    paragraph={
                      activeCardDetail.paragraphs[1] ??
                      t("dashboard.microcardDetail.overviewParagraph2")
                    }
                    takeaway={activeCardDetail.takeaway}
                    imageSrc={activeCard.imageUrl}
                    imageAlt={activeCard.imageAlt}
                    onPrevious={() => openAdjacentCard(-1)}
                    onNext={() => openAdjacentCard(1)}
                  />
                </motion.div>
              </main>
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

        <main className="py-8 sm:py-10 lg:py-12">
          <MicroCardArticle
            title={t("dashboard.microcardDetail.stayingSafeOnline")}
            badge={t("dashboard.microcardDetail.safetyEssentials")}
            sectionTitle={t(
              "dashboard.microcardDetail.digitalHarassmentOverview"
            )}
            summary={t("dashboard.microcardDetail.overviewParagraph1")}
            paragraph={t("dashboard.microcardDetail.overviewParagraph2")}
            takeaway={t("dashboard.microcardDetail.keyTakeawayBody")}
            imageSrc={hackerImage}
            imageAlt={t("dashboard.microcardDetail.internetHoaxAwareness")}
          />
        </main>
      </div>
    </div>
  );
}

export { MicroCardDetailPage, MicroCardsPage };
