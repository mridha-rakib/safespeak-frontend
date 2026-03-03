"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import {
  IconBook,
  IconChevronLeft,
  IconMoodSmile,
  IconFolderFilled,
  IconSearch,
  IconShieldFilled,
  IconX,
} from "@tabler/icons-react";
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

type TopicTone =
  | "blue"
  | "orange"
  | "green"
  | "amber"
  | "violet"
  | "teal";

type MicroTopic = {
  id: TopicId;
  tone: TopicTone;
  tag: string;
  title: string;
  summary: string;
  cta: string;
};

function topicToneStyles(tone: TopicTone) {
  const styles: Record<TopicTone, { card: string; title: string; tag: string }> = {
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
      },
      {
        id: "discrimination",
        tone: "orange",
        tag: t("dashboard.microeducation.harassment"),
        title: t("dashboard.microeducation.discrimination"),
        summary: t("dashboard.microeducation.discriminationBody"),
        cta: t("dashboard.microeducation.startNow"),
      },
      {
        id: "onlineSafety",
        tone: "green",
        tag: t("dashboard.microeducation.protection"),
        title: t("dashboard.explorer.onlineSafety"),
        summary: t("dashboard.microeducation.onlineSafetyBody"),
        cta: t("dashboard.microeducation.getProtected"),
      },
      {
        id: "rights",
        tone: "amber",
        tag: t("dashboard.home.legal"),
        title: t("dashboard.microeducation.migrantStudentRights"),
        summary: t("dashboard.microeducation.discriminationBody"),
        cta: t("dashboard.microeducation.startNow"),
      },
      {
        id: "mentalHealth",
        tone: "violet",
        tag: t("dashboard.microeducation.mental"),
        title: t("dashboard.microeducation.mentalHealthTitle"),
        summary: t("dashboard.microeducation.onlineSafetyBody"),
        cta: t("dashboard.microeducation.startNow"),
      },
      {
        id: "legalAid",
        tone: "teal",
        tag: t("dashboard.microeducation.fundamentals"),
        title: t("dashboard.microeducation.legalAidBasics"),
        summary: t("dashboard.microeducation.discriminationBody"),
        cta: t("dashboard.microeducation.startNow"),
      },
    ],
    [t]
  );

  const activeTopic = topics.find((topic) => topic.id === activeTopicId) ?? null;

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

  const chips = [
    t("dashboard.microeducation.allLessons"),
    t("dashboard.microeducation.harassment"),
    t("dashboard.microeducation.rights"),
    t("dashboard.microeducation.safety"),
    t("dashboard.microeducation.mentalHealth"),
  ];

  const sharedTransition = prefersReducedMotion
    ? { duration: 0 }
    : { type: "spring", stiffness: 230, damping: 32, mass: 0.9 };

  const fadeTransition = prefersReducedMotion ? { duration: 0 } : { duration: 0.28, ease: "easeOut" };

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
                placeholder={t("dashboard.microcards.searchPlaceholder")}
                className="h-10 w-full rounded-full border border-[#dbe5f0] bg-white px-10 text-xs text-[#1f2937] outline-none focus:border-[#3b82f6]"
              />
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {chips.map((chip, index) => (
                <span
                  key={chip}
                  className={cn(
                    "inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold",
                    index === 0 ? "bg-[#3b82f6] text-white" : "bg-white text-[#5f6f86]"
                  )}
                >
                  {chip}
                </span>
              ))}
            </div>

            <div className="mt-4 grid grid-cols-1 gap-2 lg:grid-cols-2">
              {topics.map((topic) => {
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
                    <p className={cn("text-[10px] font-semibold uppercase tracking-[0.12em]", tone.tag)}>{topic.tag}</p>
                    <h3
                      className={cn(
                        `${interFont.className} mt-2 max-w-[480px] text-[30px] font-black leading-[0.95] sm:text-[36px]`,
                        tone.title
                      )}
                    >
                      {topic.title}
                    </h3>
                    <p className={cn("mt-2 max-w-[420px] text-xs", tone.tag)}>{topic.summary}</p>
                    <span
                      className={cn(
                        "mt-4 inline-flex rounded-full bg-white px-4 py-1.5 text-[11px] font-bold",
                        topic.tone === "amber" ? "text-[#6f5300]" : "text-[#1f2937]"
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
                          topic.tone === "amber" ? "bg-black/10 text-[#6f5300]" : "bg-white/20 text-white/90"
                        )}
                      >
                        {topicIcon(topic.id)}
                      </span>
                    )}
                  </motion.button>
                );
              })}
            </div>
          </div>
        </div>
      </div>

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
                      <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#4f647f]">{activeTopic.tag}</p>
                      <h2
                        className={`${interFont.className} mt-2 text-[34px] font-black leading-[0.95] text-[#12243c] sm:text-[44px]`}
                      >
                        {activeTopic.title}
                      </h2>
                      <p className="mt-3 text-sm leading-[1.6] text-[#4f647f]">{activeTopic.summary}</p>
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
                    <h3 className={`${interFont.className} text-xl font-extrabold text-[#12243c]`}>
                      {t("dashboard.microcardDetail.digitalHarassmentOverview")}
                    </h3>
                    <div className="mt-3 space-y-3">
                      {topicNarrative(activeTopic).map((paragraph) => (
                        <p key={paragraph} className="text-sm leading-[1.7] text-[#4f6178]">
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
