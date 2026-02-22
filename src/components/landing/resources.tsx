"use client";

import { useTranslation } from "react-i18next";

type Card = {
  title: string;
  subtitle: string;
  description: string;
  badge?: string;
  footerLeft?: string;
  footerRight?: string;
  accent: string;
  textColor: string;
  mutedBg?: string;
};

export default function ResourcesSection() {
  const { t } = useTranslation();

  const cards: Card[] = [
    {
      title: t("landing.resources.cards.domesticViolence.title"),
      subtitle: "",
      description: t("landing.resources.cards.domesticViolence.description"),
      badge: t("landing.resources.cards.domesticViolence.badge"),
      accent: "from-[#2a68ff] to-[#2f8bff]",
      textColor: "text-white",
      mutedBg: "bg-white/10",
    },
    {
      title: t("landing.resources.cards.cyberProtection.title"),
      subtitle: t("landing.resources.cards.cyberProtection.subtitle"),
      description: t("landing.resources.cards.cyberProtection.description"),
      badge: "",
      footerLeft: t("landing.resources.cards.cyberProtection.footerLeft"),
      footerRight: t("landing.resources.cards.cyberProtection.footerRight"),
      accent: "from-[#0d121c] to-[#0d121c]",
      textColor: "text-white",
      mutedBg: "bg-white/5",
    },
    {
      title: t("landing.resources.cards.empowermentLessons.title"),
      subtitle: "",
      description: t("landing.resources.cards.empowermentLessons.description"),
      badge: "",
      footerLeft: t("landing.resources.cards.empowermentLessons.footerLeft"),
      accent: "from-[#f8991d] to-[#f47a00]",
      textColor: "text-white",
      mutedBg: "bg-white/15",
    },
  ];

  return (
    <section className="bg-[#dff1ff]">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 xl:grid-cols-3 xl:gap-6">
            {cards.map((card) => (
              <article
                key={card.title + card.subtitle}
                className={`rounded-2xl bg-gradient-to-br ${card.accent} p-5 text-left shadow-[0_18px_45px_rgba(0,0,0,0.16)] sm:p-6 ${card.textColor}`}
              >
                {card.title && (
                  <p className="text-[11px] font-semibold uppercase tracking-[0.12em] opacity-90 sm:text-xs">
                    {card.title}
                  </p>
                )}
                <h3 className="mt-2 text-xl font-extrabold leading-tight sm:text-2xl">
                  {card.subtitle || card.title}
                </h3>
                <p className="mt-3 whitespace-pre-line text-sm leading-6 opacity-90 sm:text-[15px]">
                  {card.description}
                </p>

                {card.badge && (
                  <div className="mt-5 inline-flex rounded-full border border-white/35 px-3 py-1 text-[11px] font-semibold tracking-wide">
                    {card.badge}
                  </div>
                )}

                {!card.badge && card.footerLeft && (
                  <div className="mt-6 flex flex-wrap items-center gap-2 text-sm font-semibold">
                    <div className={`rounded-lg px-3 py-2 ${card.mutedBg || "bg-white/10"}`}>{card.footerLeft}</div>
                    {card.footerRight && (
                      <div className={`rounded-lg px-3 py-2 ${card.mutedBg || "bg-white/10"}`}>
                        {card.footerRight}
                      </div>
                    )}
                  </div>
                )}
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
