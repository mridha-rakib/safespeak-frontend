"use client";

import Image from "next/image";
import Link from "next/link";

import { IconFolderFilled, IconShieldFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import bottomLeft from "@/assets/bottom-left.svg?url";
import bottomRight from "@/assets/bottom-right.svg?url";
import scamShield from "@/assets/scam shield icon.svg?url";
import sphereAdv from "@/assets/sphere-adv.svg?url";
import topLeft from "@/assets/top-left.svg?url";
import topMask from "@/assets/top-mask.svg?url";
import topRight from "@/assets/top-right.svg?url";

import { interFont, localIntelligenceMapSrc } from "./dashboard-shared";
import SMDasboardHome from "./sm-dashboard-home";

const SPHERE_TOP = 275;

function HomeDashboardPage() {
  const { t } = useTranslation();
  const assistantViewHref = {
    pathname: "/dashboard",
    query: { view: "assistant" },
  } as const;

  return (
    <div className="mx-auto max-w-[1130px] px-2 pb-4 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="relative mx-auto w-full [--dashboard-card-gap:12px] sm:[--dashboard-card-gap:16px] lg:[--dashboard-card-gap:20px] xl:max-w-[1120px] xl:[--dashboard-card-gap:24px] 2xl:max-w-[1184px]">
        <div className="hidden flex-col gap-[var(--dashboard-card-gap)] md:flex">
          <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2 xl:grid-cols-[1fr_2.122fr_1fr]">
            <Link
              href={assistantViewHref}
              className="xl:notch-bl duration-[250ms] group relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-1 xl:order-none xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]"
            >
              <Image
                src={topLeft}
                alt="Domestic violence"
                fill
                className="duration-[250ms] object-cover transition ease-out group-hover:brightness-110"
              />
            </Link>

            <Link
              href={assistantViewHref}
              className="xl:notch-bl duration-[250ms] group relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-3 md:col-span-2 xl:order-none xl:col-span-1 xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]"
            >
              <Image alt="dfhksdjf" fill src={topMask} />
              <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[96px] w-[96px] -translate-x-1/2 sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px] xl:hidden">
                <Image
                  src={sphereAdv}
                  alt="SafeSpeak assistant sphere"
                  fill
                  className="object-contain"
                />
              </div>
            </Link>

            <Link
              href={assistantViewHref}
              className="xl:notch-bl duration-[250ms] group relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-2 xl:order-none xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]"
            >
              <Image
                src={topRight}
                alt="Racial abuse"
                fill
                className="duration-[250ms] object-cover transition ease-out group-hover:brightness-110"
              />
            </Link>
          </div>

          <div className="w-full">
            <div className="relative xl:h-[406.2px] xl:w-full">
              <div className="flex h-full grid-cols-1 gap-[27px] md:grid-cols-2">
                <Link
                  href={assistantViewHref}
                  className="xl:notch-bl duration-[250ms] group relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform ease-out hover:scale-[1.02] sm:aspect-[5/4] xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]"
                >
                  <Image
                    alt="dfhksdjf"
                    fill
                    src={bottomLeft}
                    className="duration-[250ms] object-cover transition ease-out group-hover:brightness-110"
                  />
                </Link>

                <Link
                  href={assistantViewHref}
                  className="xl:notch-bl duration-[250ms] group relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform ease-out hover:scale-[1.02] sm:aspect-[5/4] xl:aspect-auto xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px]"
                >
                  <Image
                    alt="dfhksdjf"
                    fill
                    src={bottomRight}
                    className="duration-[250ms] object-cover transition ease-out group-hover:brightness-110"
                  />
                </Link>
              </div>
            </div>
          </div>
        </div>
        <SMDasboardHome />
        <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2 xl:grid-cols-[262px_357.34px_452.66px]">
          <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] px-2.5 md:px-0 xl:grid-rows-2">
            <Link
              href={{
                pathname: "/dashboard",
                query: { view: "scamshieldintake" },
              }}
              className="relative block min-h-[190px] w-full overflow-hidden rounded-[24px] border border-white/20 bg-[#004D73] p-5 transition hover:brightness-110 sm:min-h-[220px] sm:p-6 xl:h-[238px] xl:max-w-[262px] xl:rounded-[40px]"
            >
              <p className="text-[18px] font-semibold uppercase tracking-[0.18em] text-[#77c6df]">
                {t("dashboard.home.cyber")}
              </p>
              <h4
                className={`${interFont.className} mt-3 w-full text-[24px] font-extrabold uppercase leading-[30px] tracking-[0] text-white`}
              >
                {t("dashboard.home.scamShield")
                  .split(" ")
                  .slice(0, 1)
                  .join(" ")}
                <br />
                {t("dashboard.home.scamShield").split(" ").slice(1).join(" ")}
              </h4>
              <IconShieldFilled
                size={118}
                className="pointer-events-none absolute right-6 top-1/2 -translate-y-1/2 text-white/10"
              />
              <div className="absolute bottom-6 left-6 grid h-[54px] w-[54px] place-items-center rounded-[14px] border border-white/35 bg-white/5">
                <Image
                  src={scamShield}
                  alt="Scam Shield icon"
                  width={30}
                  height={30}
                  className="h-[30px] w-[30px]"
                />
              </div>
            </Link>

            <article className="relative min-h-[190px] w-full overflow-hidden rounded-[24px] bg-[#FFC107] p-5 sm:min-h-[220px] sm:p-6 xl:h-[238px] xl:max-w-[262px] xl:rounded-[40px]">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#171717]">
                {t("dashboard.home.legal")}
              </p>
              <h4
                className={`${interFont.className} mt-1 h-[30px] w-[214px] text-[24px] font-extrabold uppercase leading-[30px] tracking-[0] text-[#171717]`}
              >
                {t("dashboard.home.resources")}
              </h4>
              <IconFolderFilled
                size={72}
                className="absolute bottom-6 right-6 text-[#dca906]"
              />
            </article>
          </div>

          <div className="p-2.5">
            <Link
              href={{
                pathname: "/dashboard",
                query: { view: "microeducation" },
              }}
              className="relative block min-h-[280px] w-full overflow-hidden rounded-[24px] bg-[#FF8F00] px-5 pb-5 pt-5 transition hover:brightness-105 sm:min-h-[360px] sm:px-6 sm:pb-6 sm:pt-[23.25px] xl:h-[500px] xl:w-[357.34px] xl:rounded-[40px] mb-5"
            >
              <h4
                className={`${interFont.className} h-[83.75px] w-full pb-2 text-[30px] font-extrabold leading-[37.5px] tracking-[0] text-white`}
              >
                {t("dashboard.home.microCards")}
              </h4>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[11px] font-semibold text-white/90">
                  {t("dashboard.home.lessons")}
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/35">
                  <div className="h-2 w-2/3 rounded-full bg-white/95" />
                </div>
              </div>
            </Link>

            <article className="min-h-[320px] w-full overflow-hidden rounded-[24px] border border-[#cfd9e5] bg-white p-3 sm:min-h-[420px] sm:p-4 md:col-span-2 xl:col-span-1 xl:h-[500px] xl:w-[433px] xl:rounded-[40px]">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#334155]">
                  {t("dashboard.home.localIntelligence")}
                </h4>
                <span className="text-sm font-bold leading-none text-[#94a3b8]">
                  ...
                </span>
              </div>

              <div className="relative h-[240px] w-full overflow-hidden rounded-[18px] border border-[#d5dece] bg-[#d9e6d2] sm:h-[320px] sm:rounded-[24px] xl:h-[422px] xl:rounded-[32px]">
                {localIntelligenceMapSrc ? (
                  <iframe
                    title="Local Intelligence Map"
                    src={localIntelligenceMapSrc}
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="h-full w-full border-0"
                  />
                ) : (
                  <div className="absolute inset-0 bg-[linear-gradient(130deg,#cfdebf_0%,#e3edd8_45%,#cedebf_100%)]" />
                )}

                <div className="absolute bottom-4 left-4 right-4 rounded-xl bg-white/95 px-4 py-2 shadow-sm">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#f2a122]">
                        {t("dashboard.home.currentLocation")}
                      </p>
                      <p className="text-[11px] font-semibold leading-tight text-[#334155]">
                        {t("dashboard.home.activeZonesNearby")}
                      </p>
                    </div>
                    <button className="rounded-full bg-[#f59e0b] px-3 py-1 text-[10px] font-bold text-white">
                      {t("dashboard.home.details")}
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <Link
          href={assistantViewHref}
          className="absolute left-1/2 z-20 hidden -translate-x-1/2 p-10 xl:block"
          style={{
            top: `${SPHERE_TOP}px`,
            width: "270px",
            height: "270px",
          }}
        >
          <Image
            src={sphereAdv}
            alt="SafeSpeak center sphere"
            fill
            className="object-contain"
          />
        </Link>
      </div>
    </div>
  );
}

export { HomeDashboardPage };
