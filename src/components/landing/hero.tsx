"use client";

import Image from "next/image";

import { useTranslation } from "react-i18next";

import phoneRight from "@/assets/Rectangle-2.svg?url";
import phoneLeft from "@/assets/Rectangle.svg?url";
import androidLink from "@/assets/android-link.svg";
import appleLink from "@/assets/apple-link.svg";
import indicator from "@/assets/indicator.svg";
import qrCode from "@/assets/qrcode.svg";
import sphere from "@/assets/sphere.svg?url";

export default function Hero() {
  const { t } = useTranslation();

  return (
    <section className="relative overflow-hidden bg-[#01579B]">
      <div className="pointer-events-none absolute inset-x-[-30%] bottom-[-46%] h-[95%] sm:inset-x-[-20%] sm:bottom-[-42%] lg:inset-x-[-12%] lg:bottom-[-35%] xl:hidden">
        <Image
          src={sphere}
          alt={t("hero.alt.sphere")}
          fill
          priority
          sizes="100vw"
          className="object-contain object-bottom"
        />
      </div>

      <div
        className="pointer-events-none absolute hidden xl:block"
        style={{
          width: "1039px",
          height: "1039px",
          top: "209.58px",
          left: "calc(50% - 600px + 88px)",
        }}
      >
        <Image
          src={sphere}
          alt={t("hero.alt.sphere")}
          width={1039}
          height={1039}
          priority
          className="h-full w-full object-contain"
        />
      </div>

      <div className="firstfold-container relative z-10 pb-16 pt-6 sm:pb-20 lg:pb-24 xl:h-[906px] 2xl:pb-28">
        <div className="grid items-center gap-10 md:grid-cols-[1fr,0.95fr] lg:gap-12 xl:grid-cols-1 2xl:gap-16">
          <div className="space-y-4">
            <h1 className="max-w-[860px] text-[34px] font-extrabold uppercase leading-[1.25] tracking-[-0.5px] text-white sm:text-[40px] sm:leading-[1.35] xl:text-[48.6px] xl:leading-[84px]">
              <span className="block xl:whitespace-nowrap">
                <span className="text-[var(--safe-orange)]">
                  {t("hero.titleAccent")}
                </span>{" "}
                <span>{t("hero.titleMain")}</span>
              </span>
              <span className="block">{t("hero.titleSecondLine")}</span>
            </h1>
            <p className="text-sm font-semibold text-white/85 sm:text-base xl:whitespace-nowrap">
              {t("hero.subtitle")}
            </p>

            <div className="flex flex-col gap-3 pt-2 sm:gap-4 sm:pt-3">
              <div className="flex w-[188px] flex-col items-start gap-2.5">
                <Image
                  src={indicator}
                  alt={t("hero.alt.indicator")}
                  className="h-9 w-auto self-center sm:h-11 xl:translate-x-1"
                />
                <Image
                  src={appleLink}
                  alt={t("hero.alt.appStore")}
                  className="h-11 w-[188px] sm:h-[50px]"
                />
                <Image
                  src={androidLink}
                  alt={t("hero.alt.googlePlay")}
                  className="h-11 w-[188px] sm:h-[50px]"
                />
                <Image
                  src={qrCode}
                  alt={t("hero.alt.qr")}
                  className="h-[60px] w-[60px]"
                />
              </div>
            </div>
          </div>

          <div className="relative flex justify-center md:justify-end xl:static">
            <div className="flex items-end gap-2 drop-shadow-[var(--shadow-card)] sm:gap-4 lg:gap-6 xl:absolute xl:left-[430px] xl:top-[98px] xl:h-[672px] xl:w-[610px] xl:items-end xl:gap-6">
              <Image
                src={phoneLeft}
                alt={t("hero.alt.appPreview")}
                width={308}
                height={640}
                className="h-[290px] w-auto sm:h-[360px] md:h-[430px] lg:h-[500px] xl:h-[520px] 2xl:h-[560px]"
                priority
              />
              <Image
                src={phoneRight}
                alt={t("hero.alt.voicePreview")}
                width={308}
                height={640}
                className="h-[300px] w-auto sm:h-[370px] md:h-[440px] lg:h-[520px] xl:h-[540px] 2xl:h-[580px]"
                priority
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
