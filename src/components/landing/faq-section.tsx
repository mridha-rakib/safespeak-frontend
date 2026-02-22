"use client";

import { useState } from "react";
import { useTranslation } from "react-i18next";

import { IconMinus, IconPlus } from "@tabler/icons-react";

type FaqItem = {
  question: string;
  answer: string;
};

export default function FaqSection() {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState(0);
  const faqItems: FaqItem[] = [0, 1, 2, 3, 4].map((index) => ({
    question: t(`landing.faq.items.${index}.question`),
    answer: t(`landing.faq.items.${index}.answer`),
  }));

  return (
    <section className="bg-[#d9e8f3]">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <div className="w-full">
            <h3 className="text-3xl font-extrabold text-[#ff8f00] sm:text-4xl lg:text-5xl 2xl:text-6xl">
              {t("landing.faq.title")}
            </h3>
          </div>

          <div className="mx-auto mt-8 w-full max-w-4xl sm:mt-10">
            {faqItems.map((item, idx) => {
              const isOpen = openIndex === idx;
              return (
                <div key={item.question + idx} className="border-b border-[#c6d1dc] py-4 sm:py-5">
                  <button
                    type="button"
                    onClick={() => setOpenIndex(isOpen ? -1 : idx)}
                    className="flex w-full items-start justify-between gap-4 text-left sm:gap-6"
                  >
                    <span className="text-xl font-semibold leading-tight text-[#111827] sm:text-2xl lg:text-3xl">
                      {item.question}
                    </span>
                    <span className="mt-1 inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-[#0b5fa6] text-white">
                      {isOpen ? <IconMinus size={18} stroke={2.5} /> : <IconPlus size={18} stroke={2.5} />}
                    </span>
                  </button>

                  {isOpen && (
                    <div className="mt-4 rounded-[10px] bg-[#0b5fa6] p-4">
                      <p className="text-sm leading-[1.55] text-white/95">{item.answer}</p>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
