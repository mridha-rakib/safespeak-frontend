"use client";

import Image from "next/image";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import {
  IconBook,
  IconCheck,
  IconChevronLeft,
  IconFilter,
  IconFolderFilled,
  IconMoodSmile,
  IconSearch,
  IconShieldFilled,
  IconX,
} from "@tabler/icons-react";
import {
  AnimatePresence,
  LayoutGroup,
  motion,
  useReducedMotion,
} from "framer-motion";
import { useTranslation } from "react-i18next";

import mentalHealth from "@/assets/mental_health.svg?url";
import mentalHealth2 from "@/assets/mental_health_2.svg?url";
import mentalHealthLove from "@/assets/mental_health_love.svg?url";
import { cn } from "@/lib/utils";

import { interFont } from "./dashboard-shared";

type TopicId =
  | "bullying"
  | "discrimination"
  | "onlineSafety"
  | "rights"
  | "mentalHealth"
  | "legalAid";

type TopicTone = "blue" | "orange" | "green" | "amber" | "violet" | "teal";

type LessonChipId = "all" | "harassment" | "rights" | "safety" | "mentalHealth";
type LessonDuration = "quick" | "deep";
type LessonFormat = "video" | "interactive" | "guide";

type MicroTopic = {
  id: TopicId;
  tone: TopicTone;
  tag: string;
  title: string;
  summary: string;
  cta: string;
  chips: LessonChipId[];
  duration: LessonDuration;
  format: LessonFormat;
};

type LessonFilters = {
  lessons: TopicId[];
  duration: LessonDuration | "all";
  formats: LessonFormat[];
};

function createDefaultLessonFilters(): LessonFilters {
  return {
    lessons: [],
    duration: "all",
    formats: [],
  };
}

function topicToneStyles(tone: TopicTone) {
  const styles: Record<
    TopicTone,
    { card: string; title: string; tag: string }
  > = {
    blue: {
      card: "bg-[#006699]",
      title: "text-white",
      tag: "text-white/80",
    },
    orange: {
      card: "bg-[#F48C06]",
      title: "text-white",
      tag: "text-white/85",
    },
    green: {
      card: "bg-[#10B981]",
      title: "text-white",
      tag: "text-white/80",
    },
    amber: {
      card: "bg-[#f7bd23]",
      title: "text-[#111827]",
      tag: "text-[#6f5300]",
    },
    violet: {
      card: "bg-[#8157e8]",
      title: "text-white",
      tag: "text-white/80",
    },
    teal: {
      card: "bg-[#1c9d8f]",
      title: "text-white",
      tag: "text-white/80",
    },
  };

  return styles[tone];
}

function topicIcon(topicId: TopicId) {
  if (topicId === "onlineSafety" || topicId === "bullying") {
    return <IconShieldFilled size={30} />;
  }
  if (topicId === "rights") {
    return <IconFolderFilled size={30} />;
  }
  if (topicId === "mentalHealth") {
    return <IconMoodSmile size={30} />;
  }
  return <IconBook size={30} />;
}

function topicNarrative(topic: MicroTopic) {
  return [
    `This topic focuses on practical awareness and low-friction safety habits. ${topic.summary}`,
    "Start by identifying early signs, document what matters, and choose one immediate protective step you can take today.",
    "Support options work best when used consistently. Build a small routine, keep records, and ask for trusted professional help when needed.",
  ];
}

function MicroEducationPage() {
  const { t } = useTranslation();
  const prefersReducedMotion = useReducedMotion();
  const [activeTopicId, setActiveTopicId] = useState<TopicId | null>(null);
  const [activeChipId, setActiveChipId] = useState<LessonChipId>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [appliedFilters, setAppliedFilters] = useState<LessonFilters>(
    createDefaultLessonFilters
  );
  const [draftFilters, setDraftFilters] = useState<LessonFilters>(
    createDefaultLessonFilters
  );
  const pushedHistoryRef = useRef(false);

  const topics = useMemo<MicroTopic[]>(
    () => [
      {
        id: "bullying",
        tone: "blue",
        tag: t("dashboard.home.cyber"),
        title: t("dashboard.microeducation.bullying"),
        summary: t("dashboard.microeducation.onlineSafetyBody"),
        cta: t("dashboard.microeducation.getProtected"),
        chips: ["harassment", "safety"],
        duration: "quick",
        format: "interactive",
      },
      {
        id: "discrimination",
        tone: "orange",
        tag: t("dashboard.microeducation.harassment"),
        title: t("dashboard.microeducation.discrimination"),
        summary: t("dashboard.microeducation.discriminationBody"),
        cta: t("dashboard.microeducation.startNow"),
        chips: ["harassment", "rights"],
        duration: "deep",
        format: "video",
      },
      {
        id: "onlineSafety",
        tone: "green",
        tag: t("dashboard.microeducation.protection"),
        title: t("dashboard.explorer.onlineSafety"),
        summary: t("dashboard.microeducation.onlineSafetyBody"),
        cta: t("dashboard.microeducation.getProtected"),
        chips: ["safety"],
        duration: "quick",
        format: "video",
      },
      {
        id: "rights",
        tone: "amber",
        tag: t("dashboard.home.legal"),
        title: t("dashboard.microeducation.migrantStudentRights"),
        summary: t("dashboard.microeducation.discriminationBody"),
        cta: t("dashboard.microeducation.startNow"),
        chips: ["rights"],
        duration: "deep",
        format: "guide",
      },
      {
        id: "mentalHealth",
        tone: "violet",
        tag: t("dashboard.microeducation.mental"),
        title: t("dashboard.microeducation.mentalHealthTitle"),
        summary: t("dashboard.microeducation.onlineSafetyBody"),
        cta: t("dashboard.microeducation.startNow"),
        chips: ["mentalHealth"],
        duration: "quick",
        format: "interactive",
      },
      {
        id: "legalAid",
        tone: "teal",
        tag: t("dashboard.microeducation.fundamentals"),
        title: t("dashboard.microeducation.legalAidBasics"),
        summary: t("dashboard.microeducation.discriminationBody"),
        cta: t("dashboard.microeducation.startNow"),
        chips: ["rights"],
        duration: "deep",
        format: "guide",
      },
    ],
    [t]
  );

  const activeTopic =
    topics.find((topic) => topic.id === activeTopicId) ?? null;

  const closeActiveTopic = useCallback(() => {
    if (!activeTopicId) {
      return;
    }

    setActiveTopicId(null);

    if (pushedHistoryRef.current) {
      pushedHistoryRef.current = false;
      window.history.back();
    }
  }, [activeTopicId]);

  useEffect(() => {
    if (!activeTopicId) {
      return;
    }

    pushedHistoryRef.current = true;
    window.history.pushState({ microeducationTopic: activeTopicId }, "");

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        closeActiveTopic();
      }
    };

    const handlePopState = () => {
      if (pushedHistoryRef.current) {
        pushedHistoryRef.current = false;
      }
      setActiveTopicId(null);
    };

    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("popstate", handlePopState);

    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("popstate", handlePopState);
    };
  }, [activeTopicId, closeActiveTopic]);

  const chips: Array<{ id: LessonChipId; label: string }> = [
    { id: "all", label: t("dashboard.microeducation.allLessons") },
    { id: "harassment", label: t("dashboard.microeducation.harassment") },
    { id: "rights", label: t("dashboard.microeducation.rights") },
    { id: "safety", label: t("dashboard.microeducation.safety") },
    { id: "mentalHealth", label: t("dashboard.microeducation.mentalHealth") },
  ];

  const filterDurationOptions: Array<{
    id: LessonDuration;
    label: string;
    subtitle: string;
  }> = [
    { id: "quick", label: "Quick", subtitle: "5 min" },
    { id: "deep", label: "Deep Dive", subtitle: "15 min" },
  ];

  const filterFormatOptions: Array<{ id: LessonFormat; label: string }> = [
    { id: "video", label: "Video" },
    { id: "interactive", label: "Interactive" },
    { id: "guide", label: "Guide" },
  ];

  const filteredTopics = useMemo(() => {
    const normalizedQuery = searchQuery.trim().toLowerCase();

    return topics.filter((topic) => {
      if (activeChipId !== "all" && !topic.chips.includes(activeChipId)) {
        return false;
      }

      if (
        appliedFilters.lessons.length > 0 &&
        !appliedFilters.lessons.includes(topic.id)
      ) {
        return false;
      }

      if (
        appliedFilters.duration !== "all" &&
        topic.duration !== appliedFilters.duration
      ) {
        return false;
      }

      if (
        appliedFilters.formats.length > 0 &&
        !appliedFilters.formats.includes(topic.format)
      ) {
        return false;
      }

      if (!normalizedQuery) {
        return true;
      }

      const searchBlob =
        `${topic.tag} ${topic.title} ${topic.summary}`.toLowerCase();
      return searchBlob.includes(normalizedQuery);
    });
  }, [activeChipId, appliedFilters, searchQuery, topics]);

  const appliedFilterCount =
    appliedFilters.lessons.length +
    (appliedFilters.duration === "all" ? 0 : 1) +
    appliedFilters.formats.length;

  const openFilterPanel = () => {
    setDraftFilters({
      lessons: [...appliedFilters.lessons],
      duration: appliedFilters.duration,
      formats: [...appliedFilters.formats],
    });
    setIsFilterOpen(true);
  };

  const closeFilterPanel = () => {
    setIsFilterOpen(false);
  };

  const resetDraftFilters = () => {
    setDraftFilters(createDefaultLessonFilters());
  };

  const toggleDraftLesson = (topicId: TopicId) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      lessons: currentFilters.lessons.includes(topicId)
        ? currentFilters.lessons.filter((item) => item !== topicId)
        : [...currentFilters.lessons, topicId],
    }));
  };

  const toggleDraftFormat = (formatId: LessonFormat) => {
    setDraftFilters((currentFilters) => ({
      ...currentFilters,
      formats: currentFilters.formats.includes(formatId)
        ? currentFilters.formats.filter((item) => item !== formatId)
        : [...currentFilters.formats, formatId],
    }));
  };

  const applyDraftFilters = () => {
    setAppliedFilters({
      lessons: [...draftFilters.lessons],
      duration: draftFilters.duration,
      formats: [...draftFilters.formats],
    });
    setIsFilterOpen(false);
  };

  const sharedTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 230, damping: 32, mass: 0.9 };

  const fadeTransition = prefersReducedMotion
    ? { duration: 0 }
    : { duration: 0.28, ease: "easeOut" };

  return (
    <LayoutGroup id="microeducation-morph">
      <div className="px-2 pb-4 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
        <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
          <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
            <Link
              href="/dashboard"
              className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
            >
              <IconChevronLeft size={14} />
              {t("dashboard.microeducation.title")}
            </Link>
            <button className="text-xs font-medium text-[#7b8798]">
              {t("common.cancel")}
            </button>
          </div>

          <div className="pt-4">
            <h1 className="text-4xl font-extrabold leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]">
              {t("dashboard.microeducation.headline")}
            </h1>
            <p className="mt-2 max-w-[700px] text-sm leading-[1.45] text-[#5f6f86]">
              {t("dashboard.microeducation.subtitleLine1")}
              <br />
              {t("dashboard.microeducation.subtitleLine2")}
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
                className="h-10 w-full rounded-full border border-[#dbe5f0] bg-white px-10 pr-14 text-xs text-[#1f2937] outline-none focus:border-[#3b82f6]"
              />
              <button
                type="button"
                onClick={openFilterPanel}
                className="absolute right-2 top-1/2 inline-flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full bg-[#f1f6fd] text-[#4f647f] transition hover:bg-[#e6f0fc]"
                aria-label="Filter lessons"
              >
                <IconFilter size={13} />
              </button>
              {appliedFilterCount > 0 ? (
                <span className="absolute right-[2px] top-[2px] inline-flex h-4 min-w-[16px] items-center justify-center rounded-full bg-[#0f5fa7] px-1 text-[9px] font-bold text-white">
                  {appliedFilterCount}
                </span>
              ) : null}
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip) => (
                <button
                  key={chip.id}
                  type="button"
                  onClick={() => setActiveChipId(chip.id)}
                  className={cn(
                    "inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold",
                    activeChipId === chip.id
                      ? "bg-[#3b82f6] text-white"
                      : "bg-white text-[#5f6f86]"
                  )}
                >
                  {chip.label}
                </button>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
              {filteredTopics.map((topic) => {
                const tone = topicToneStyles(topic.tone);
                const isActive = activeTopicId === topic.id;

                return (
                  <motion.button
                    key={topic.id}
                    type="button"
                    layout
                    layoutId={`microeducation-topic-${topic.id}`}
                    transition={sharedTransition}
                    onClick={() => {
                      pushedHistoryRef.current = false;
                      setActiveTopicId(topic.id);
                    }}
                    className={cn(
                      "relative min-h-[220px] w-full overflow-hidden rounded-[24px] p-5 text-left will-change-transform sm:min-h-[250px] sm:p-6 xl:h-[304px] xl:rounded-[32px] xl:p-8",
                      tone.card,
                      isActive && "pointer-events-none opacity-0"
                    )}
                    aria-label={topic.title}
                  >
                    <p
                      className={cn(
                        "text-[10px] font-semibold uppercase tracking-[0.12em]",
                        tone.tag
                      )}
                    >
                      {topic.tag}
                    </p>
                    <h3
                      className={cn(
                        `${interFont.className} mt-2 max-w-[480px] text-[30px] font-black leading-[0.95] sm:text-[36px]`,
                        tone.title
                      )}
                    >
                      {topic.title}
                    </h3>
                    <p className={cn("mt-2 max-w-[420px] text-xs", tone.tag)}>
                      {topic.summary}
                    </p>
                    <span
                      className={cn(
                        "mt-4 inline-flex rounded-full bg-white px-4 py-1.5 text-[11px] font-bold",
                        topic.tone === "amber"
                          ? "text-[#6f5300]"
                          : "text-[#1f2937]"
                      )}
                    >
                      {topic.cta}
                    </span>

                    {topic.id === "mentalHealth" ? (
                      <>
                        <div className="pointer-events-none absolute bottom-8 left-8">
                          <Image
                            src={mentalHealth}
                            alt="Mental health circle"
                            width={48}
                            height={48}
                            className="h-12 w-12 opacity-45"
                          />
                          <Image
                            src={mentalHealth2}
                            alt="Mental health circle overlap"
                            width={48}
                            height={48}
                            className="absolute left-8 top-0 h-12 w-12 opacity-45"
                          />
                        </div>
                        <Image
                          src={mentalHealthLove}
                          alt="Mental health love icon"
                          width={28}
                          height={28}
                          className="absolute bottom-8 right-8 h-7 w-7"
                        />
                      </>
                    ) : (
                      <span
                        className={cn(
                          "absolute bottom-7 right-7 inline-flex h-14 w-14 items-center justify-center rounded-2xl",
                          topic.tone === "amber"
                            ? "bg-black/10 text-[#6f5300]"
                            : "bg-white/20 text-white/90"
                        )}
                      >
                        {topicIcon(topic.id)}
                      </span>
                    )}
                  </motion.button>
                );
              })}

              {filteredTopics.length === 0 ? (
                <article className="col-span-full rounded-[20px] border border-[#dce5f1] bg-white p-6 text-center">
                  <p className="text-sm font-semibold text-[#22344a]">
                    No lessons match your filters.
                  </p>
                  <p className="mt-1 text-xs text-[#6f8197]">
                    Try changing the selected topic, duration, format, or search
                    terms.
                  </p>
                </article>
              ) : null}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {isFilterOpen ? (
          <>
            <motion.button
              type="button"
              className="fixed inset-0 z-40 bg-[#0b1728]/30"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={fadeTransition}
              onClick={closeFilterPanel}
              aria-label="Close filters"
            />

            <motion.aside
              initial={{ opacity: 0, x: 28 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 28 }}
              transition={fadeTransition}
              className="fixed left-3 right-3 top-3 z-50 sm:left-auto sm:right-4 sm:top-4 sm:w-[332px]"
            >
              <div className="overflow-hidden rounded-[12px] border border-[#dce5f1] bg-white shadow-[0_22px_40px_rgba(9,22,40,0.22)]">
                <div className="flex items-center justify-between border-b border-[#e7edf6] px-4 py-3">
                  <p className="inline-flex items-center gap-2 text-[12px] font-semibold text-[#1f2a3a]">
                    <IconFilter size={12} className="text-[#0f5fa7]" />
                    Filter Lessons
                  </p>
                  <button
                    type="button"
                    onClick={resetDraftFilters}
                    className="text-[10px] font-semibold text-[#7f90a6] hover:text-[#0f5fa7]"
                  >
                    Reset All
                  </button>
                </div>

                <div className="max-h-[calc(100vh-160px)] space-y-4 overflow-y-auto p-4">
                  <section>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8092aa]">
                      Lessons
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {topics.map((topic) => {
                        const isSelected = draftFilters.lessons.includes(
                          topic.id
                        );

                        return (
                          <button
                            key={topic.id}
                            type="button"
                            onClick={() => toggleDraftLesson(topic.id)}
                            className={cn(
                              "inline-flex h-[44px] items-center justify-between rounded-[8px] border px-2.5 text-left text-[10px] font-semibold",
                              isSelected
                                ? "border-[#0f5fa7] bg-[#eaf2ff] text-[#0f5fa7]"
                                : "border-[#dce5f1] bg-white text-[#556a82]"
                            )}
                          >
                            <span className="truncate pr-2">{topic.title}</span>
                            <span
                              className={cn(
                                "inline-flex h-4 w-4 shrink-0 items-center justify-center rounded-full border",
                                isSelected
                                  ? "border-[#0f5fa7] bg-[#0f5fa7] text-white"
                                  : "border-[#ccd8e8] text-transparent"
                              )}
                            >
                              <IconCheck size={10} stroke={2.4} />
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </section>

                  <section>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8092aa]">
                      Duration
                    </p>
                    <div className="mt-2 grid grid-cols-2 gap-2">
                      {filterDurationOptions.map((option) => {
                        const isSelected = draftFilters.duration === option.id;

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() =>
                              setDraftFilters((currentFilters) => ({
                                ...currentFilters,
                                duration: option.id,
                              }))
                            }
                            className={cn(
                              "rounded-[8px] border px-3 py-2 text-left",
                              isSelected
                                ? "border-[#0f5fa7] bg-[#eaf2ff]"
                                : "border-[#dce5f1] bg-white"
                            )}
                          >
                            <p
                              className={cn(
                                "text-[11px] font-semibold",
                                isSelected ? "text-[#0f5fa7]" : "text-[#33485f]"
                              )}
                            >
                              {option.label}
                            </p>
                            <p className="text-[9px] text-[#7e90a8]">
                              {option.subtitle}
                            </p>
                          </button>
                        );
                      })}
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        setDraftFilters((currentFilters) => ({
                          ...currentFilters,
                          duration: "all",
                        }))
                      }
                      className="mt-2 text-[10px] font-semibold text-[#7f90a6] hover:text-[#0f5fa7]"
                    >
                      Any duration
                    </button>
                  </section>

                  <section>
                    <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#8092aa]">
                      Format
                    </p>
                    <div className="mt-2 flex flex-wrap gap-2">
                      {filterFormatOptions.map((option) => {
                        const isSelected = draftFilters.formats.includes(
                          option.id
                        );

                        return (
                          <button
                            key={option.id}
                            type="button"
                            onClick={() => toggleDraftFormat(option.id)}
                            className={cn(
                              "inline-flex rounded-full px-3 py-1.5 text-[10px] font-semibold",
                              isSelected
                                ? "bg-[#0f5fa7] text-white"
                                : "bg-[#eef3fa] text-[#5f738b]"
                            )}
                          >
                            {option.label}
                          </button>
                        );
                      })}
                    </div>
                  </section>
                </div>

                <div className="border-t border-[#e7edf6] p-4">
                  <button
                    type="button"
                    onClick={applyDraftFilters}
                    className="inline-flex h-9 w-full items-center justify-center rounded-[8px] bg-[#0f5fa7] text-[11px] font-semibold text-white shadow-[0_8px_18px_rgba(15,95,167,0.3)]"
                  >
                    Apply Filters
                  </button>
                </div>
              </div>
            </motion.aside>
          </>
        ) : null}
      </AnimatePresence>

      <AnimatePresence>
        {activeTopic && (
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
              onClick={closeActiveTopic}
              aria-label={t("common.cancel")}
            />

            <div className="relative h-full w-full p-3 sm:p-4 lg:p-6">
              <motion.article
                layoutId={`microeducation-topic-${activeTopic.id}`}
                transition={sharedTransition}
                className={cn(
                  "mx-auto flex h-full w-full max-w-[1184px] flex-col overflow-hidden rounded-[26px] bg-white shadow-[0_24px_70px_rgba(15,33,59,0.25)] sm:rounded-[32px]"
                )}
              >
                <header className="flex items-center justify-between border-b border-[#e3eaf4] px-4 py-3 sm:px-6">
                  <button
                    type="button"
                    onClick={closeActiveTopic}
                    className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
                  >
                    <IconChevronLeft size={14} />
                    {t("dashboard.microeducation.title")}
                  </button>
                  <button
                    type="button"
                    onClick={closeActiveTopic}
                    className="inline-flex h-8 w-8 items-center justify-center rounded-full border border-[#d9e2ee] text-[#50627a]"
                    aria-label={t("common.cancel")}
                  >
                    <IconX size={14} />
                  </button>
                </header>

                <div className="min-h-0 flex-1 overflow-y-auto px-4 py-5 sm:px-6 sm:py-6 lg:px-8">
                  <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1.12fr_0.88fr]">
                    <section className="rounded-2xl bg-[#f6f9fd] p-4 sm:p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4f647f]">
                        {activeTopic.tag}
                      </p>
                      <h2
                        className={`${interFont.className} mt-2 text-[34px] font-black leading-[0.95] text-[#12243c] sm:text-[44px]`}
                      >
                        {activeTopic.title}
                      </h2>
                      <p className="mt-3 text-sm leading-[1.6] text-[#4f647f]">
                        {activeTopic.summary}
                      </p>
                    </section>

                    <section className="rounded-2xl border border-[#e1eaf4] p-4 sm:p-5">
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#5b6f88]">
                        {t("dashboard.microcardDetail.keyTakeaway")}
                      </p>
                      <p className="mt-2 text-sm leading-[1.6] text-[#3c4e66]">
                        {t("dashboard.microcardDetail.keyTakeawayBody")}
                      </p>
                      <button className="mt-4 inline-flex rounded-full bg-[#0f5fa7] px-4 py-2 text-xs font-semibold text-white">
                        {activeTopic.cta}
                      </button>
                    </section>
                  </div>

                  <section className="mt-4 rounded-2xl border border-[#e1eaf4] bg-white p-4 sm:p-6">
                    <h3
                      className={`${interFont.className} text-xl font-extrabold text-[#12243c]`}
                    >
                      {t("dashboard.microcardDetail.digitalHarassmentOverview")}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {topicNarrative(activeTopic).map((paragraph) => (
                        <p
                          key={paragraph}
                          className="text-sm leading-[1.7] text-[#4f6178]"
                        >
                          {paragraph}
                        </p>
                      ))}
                    </div>
                  </section>
                </div>
              </motion.article>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </LayoutGroup>
  );
}

export { MicroEducationPage };
