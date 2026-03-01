"use client";

import Image from "next/image";
import { useTranslation } from "react-i18next";

import phoneHand from "@/assets/Hand and iPhone 16 Pro.svg";

export default function ProblemSection() {
  const { t } = useTranslation();
  const bullets = [
    t("landing.problem.bullets.0"),
    t("landing.problem.bullets.1"),
    t("landing.problem.bullets.2"),
    t("landing.problem.bullets.3"),
  ];

  return (
    <section className="mx-auto w-full max-w-screen bg-[#E1F5FE] lg:min-h-[1200px]">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <div className="w-full">
            <p className="text-xs font-semibold tracking-[0.18em] text-gray-700">
              {t("landing.problem.label")}
            </p>
            <h2 className="mt-3 text-3xl font-extrabold leading-tight text-[#0f172a] sm:text-4xl lg:text-5xl 2xl:text-6xl">
              {t("landing.problem.titleLine1")}
              <br />
              {t("landing.problem.titleLine2")}
            </h2>
          </div>

          <div className="mt-10 grid w-full gap-8 md:mt-14 md:grid-cols-2 md:items-center lg:gap-12">
            <div className="flex items-center justify-center md:justify-start">
              <Image
                src={phoneHand}
                alt={t("landing.problem.imageAlt")}
                width={420}
                height={420}
                className="h-auto w-full max-w-[260px] drop-shadow-[0_10px_30px_rgba(0,0,0,0.12)] sm:max-w-[320px] lg:max-w-[380px]"
                priority
              />
            </div>

            <div className="text-[#0f172a]">
              <p className="text-sm font-semibold leading-6 sm:text-base">
                {t("landing.problem.description")}
              </p>
              <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-6 sm:text-base">
                {bullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
              <p className="mt-4 text-sm leading-6 sm:text-base">
                {t("landing.problem.conclusion")}
              </p>
              <div className="mt-6">
                <button className="rounded-full bg-[#0b6fb2] px-5 py-2 text-sm font-semibold text-white shadow-md transition hover:-translate-y-[1px] hover:shadow-lg">
                  {t("landing.problem.reportNow")}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
