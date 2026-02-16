"use client";

import { useState } from "react";

import { IconMinus, IconPlus } from "@tabler/icons-react";

type FaqItem = {
  question: string;
  answer: string;
};

const faqItems: FaqItem[] = [
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer:
      "Lorem ipsum dolor sit amet consectetur. Rutrum auctor posuere sed congue consectetur eget sit convallis. Arcu mauris ornare ut id eget amet sed nulla. Posuere pulvinar id malesuada sagittis magna in. Magna justo et pharetra risus penatibus nulla. A eget sem penatibus rutrum id diam. Aliquet lectus faucibus senectus in sagittis in viverra. Vitae at amet id sem. Cursus hendrerit netus massa tellus in volutpat faucibus. Justus metus platea eget leo dolor. Ante placerat vel est.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur. Justo risus mi cursus mi massa.",
    answer:
      "Lorem ipsum dolor sit amet consectetur adipiscing elit. Quis donec in in faucibus risus urna dignissim lectus.",
  },
  {
    question: "Lorem ipsum dolor sit amet",
    answer: "Vestibulum euismod nibh in risus bibendum, sit amet pretium sem pellentesque.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer: "Integer lacinia vitae turpis id varius. Sed sit amet ex risus. Donec malesuada bibendum nibh.",
  },
  {
    question: "Lorem ipsum dolor sit amet consectetur.",
    answer:
      "In viverra congue mauris, sed fermentum justo ultrices sed. Curabitur luctus ante ut mauris suscipit cursus.",
  },
];

export default function FaqSection() {
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section className="bg-[#d9e8f3]">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <div className="w-full">
            <h3 className="text-3xl font-extrabold text-[#ff8f00] sm:text-4xl lg:text-5xl 2xl:text-6xl">FAQ</h3>
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
