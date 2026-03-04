"use client";

import {
  IconCircleCheck,
  IconMicrophone,
  IconShield,
  IconUsers,
} from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

type Step = {
  number: string;
  title: string;
  duration: string;
  description: string;
  icon: "mic" | "shield" | "users" | "check";
};

function StepIcon({ icon }: { icon: Step["icon"] }) {
  const common = "h-5 w-5 text-[#0b5fa6]";
  if (icon === "mic") return <IconMicrophone className={common} stroke={2} />;
  if (icon === "shield") return <IconShield className={common} stroke={2} />;
  if (icon === "users") return <IconUsers className={common} stroke={2} />;
  return <IconCircleCheck className={common} stroke={2} />;
}

function StepNumber({ number }: { number: string }) {
  return (
    <span className="select-none text-[72px] font-extrabold leading-none text-[#0b5fa6]">
      {number}
    </span>
  );
}

function StepContent({ step, side }: { step: Step; side: "left" | "right" }) {
  const alignmentClassName =
    side === "left" ? "items-end text-right" : "items-start text-left";

  return (
    <div className={`flex w-full max-w-[320px] flex-col ${alignmentClassName}`}>
      <h4 className="text-[34px] font-semibold leading-[1.05] text-[#1f2937]">
        {step.title}
      </h4>
      <span className="mt-2 inline-flex rounded-full bg-[#cfe9ff] px-3 py-1 text-sm font-semibold text-[#0b5fa6]">
        {step.duration}
      </span>
      <p className="mt-3 text-sm leading-6 text-[#5f6f84] sm:text-base">
        {step.description}
      </p>
    </div>
  );
}

export default function HowItWorks() {
  const { t } = useTranslation();

  const steps: Step[] = [
    {
      number: "01",
      title: t("landing.howItWorks.steps.capture.title"),
      duration: t("landing.howItWorks.steps.capture.duration"),
      description: t("landing.howItWorks.steps.capture.description"),
      icon: "mic",
    },
    {
      number: "02",
      title: t("landing.howItWorks.steps.understand.title"),
      duration: t("landing.howItWorks.steps.understand.duration"),
      description: t("landing.howItWorks.steps.understand.description"),
      icon: "shield",
    },
    {
      number: "03",
      title: t("landing.howItWorks.steps.connect.title"),
      duration: t("landing.howItWorks.steps.connect.duration"),
      description: t("landing.howItWorks.steps.connect.description"),
      icon: "users",
    },
    {
      number: "04",
      title: t("landing.howItWorks.steps.takeAction.title"),
      duration: t("landing.howItWorks.steps.takeAction.duration"),
      description: t("landing.howItWorks.steps.takeAction.description"),
      icon: "check",
    },
  ];

  return (
    <section className="bg-[#f3f5f7]">
      <div className="mx-auto w-full max-w-[1440px] px-4 py-12 sm:px-8 sm:py-16 lg:px-20 lg:py-20 min-[1440px]:h-[1184px] min-[1440px]:px-[220px] min-[1440px]:py-[80px]">
        <div className="mx-auto flex h-full w-full max-w-[1000px] flex-col gap-12 sm:gap-14 min-[1440px]:gap-16">
          <h3 className="text-center text-4xl font-semibold text-[#1f2937] sm:text-5xl">
            {t("landing.howItWorks.title")}
          </h3>

          <div className="space-y-4 md:hidden">
            {steps.map((step) => (
              <article
                key={step.number}
                className="rounded-2xl border border-[#d9e4ef] bg-[#f8fbff] p-5 shadow-[0_8px_20px_rgba(15,23,42,0.06)] sm:p-6"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#0b5fa6]/30 bg-white">
                    <StepIcon icon={step.icon} />
                  </div>
                  <span className="text-4xl font-extrabold leading-none text-[#0b5fa6]/20 sm:text-5xl">
                    {step.number}
                  </span>
                </div>

                <h4 className="mt-4 text-2xl font-semibold text-[#1f2937]">
                  {step.title}
                </h4>
                <span className="mt-2 inline-block rounded-full bg-[#d9efff] px-3 py-1 text-sm font-semibold text-[#0b5fa6]">
                  {step.duration}
                </span>
                <p className="mt-3 text-sm leading-6 text-[#5f6f84] sm:text-base">
                  {step.description}
                </p>
              </article>
            ))}
          </div>

          <div className="relative hidden flex-1 md:block">
            <div className="pointer-events-none absolute inset-y-7 left-1/2 w-px -translate-x-1/2 bg-[#d8dde4]" />

            <div className="grid gap-y-16">
              {steps.map((step, index) => {
                const contentOnLeft = index % 2 === 0;

                return (
                  <article
                    key={step.number}
                    className="grid grid-cols-[1fr_64px_1fr] items-start gap-x-8 lg:gap-x-10"
                  >
                    <div
                      className={`flex ${contentOnLeft ? "justify-end" : "justify-start"}`}
                    >
                      {contentOnLeft ? (
                        <StepContent step={step} side="left" />
                      ) : (
                        <StepNumber number={step.number} />
                      )}
                    </div>

                    <div className="relative z-10 flex h-14 w-14 items-center justify-center rounded-full border border-[#0b5fa6]/35 bg-white shadow-[0_6px_16px_rgba(11,95,166,0.28)]">
                      <StepIcon icon={step.icon} />
                    </div>

                    <div
                      className={`flex ${contentOnLeft ? "justify-end" : "justify-start"}`}
                    >
                      {contentOnLeft ? (
                        <StepNumber number={step.number} />
                      ) : (
                        <StepContent step={step} side="right" />
                      )}
                    </div>
                  </article>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
