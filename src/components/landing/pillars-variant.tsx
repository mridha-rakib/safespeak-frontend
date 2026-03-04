"use client";

import Image from "next/image";

import { IconBook2, IconLayoutCards, IconLock } from "@tabler/icons-react";

import legalText from "@/assets/Text.svg";
import landingScam from "@/assets/landing_scam.svg";

export default function PillarsVariant() {
  return (
    <section className="w-full max-w-none bg-[#E1F5FE] px-4 py-16 sm:px-8 sm:py-20 lg:h-[926px] lg:px-[32px] lg:pb-[120px] lg:pt-[120px]">
      <div className="mx-auto flex h-full w-full max-w-[1376px] flex-col">
        <div className="grid gap-4 lg:grid-cols-[1fr_1fr]">
          <div className="grid gap-4">
            <article className="relative h-[288px] w-full overflow-hidden rounded-[24px] bg-[#005691] p-8 shadow-[0_16px_30px_rgba(0,86,145,0.24)]">
              <Image
                src={landingScam}
                alt=""
                aria-hidden
                className="pointer-events-none absolute -bottom-2 left-0 w-[125%] opacity-25"
              />
              <div className="relative z-10 flex h-full flex-col justify-between text-white">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-white/90">
                    Cyber
                  </p>
                  <h3 className="mt-1 text-[48px] font-black uppercase leading-[48px] tracking-[-1.92px]">
                    Scam
                  </h3>
                  <h3 className="text-[48px] font-black uppercase leading-[48px] tracking-[-1.92px]">
                    Shield
                  </h3>
                </div>

                <div className="flex items-end justify-between">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#1B7CB8] text-white">
                    <IconLock size={14} stroke={2} />
                  </span>
                  <span className="inline-flex h-9 items-center rounded-full bg-[#0B4B7B] px-4 text-[9px] font-semibold uppercase tracking-[0.14em] text-white/95">
                    Access Tool
                  </span>
                </div>
              </div>
            </article>

            <article className="relative h-[288px] w-full overflow-hidden rounded-[24px] bg-[#FDB927] p-8 shadow-[0_14px_30px_rgba(124,92,15,0.22)]">
              <Image
                src={legalText}
                alt=""
                aria-hidden
                className="pointer-events-none absolute left-0 top-[56px] h-[200px] w-[650.78px] opacity-5"
              />
              <div className="relative z-10 flex h-full flex-col justify-between text-[#111827]">
                <div>
                  <p className="text-[8px] font-semibold uppercase tracking-[0.2em] text-[#6B4E00]">
                    Legal
                  </p>
                  <h3 className="mt-1 text-[48px] font-black uppercase leading-[0.9] tracking-[-1px] text-[#001A33]">
                    Resources
                  </h3>
                </div>

                <div className="flex items-end justify-between">
                  <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#F1AA17] text-[#1E293B]">
                    <IconBook2 size={14} stroke={2} />
                  </span>
                  <span className="text-[14px] font-bold uppercase tracking-[0.01em] text-[#111827]">
                    View Library
                  </span>
                </div>
              </div>
            </article>
          </div>

          <article className="relative h-[600px] w-full overflow-hidden rounded-[24px] bg-[#F39200] p-12 shadow-[0_16px_35px_rgba(156,92,0,0.28)]">
            <div className="pointer-events-none absolute right-12 top-[128px] flex flex-col gap-7 opacity-45">
              <span className="h-px w-28 bg-white/70" />
              <span className="h-px w-20 bg-white/70" />
            </div>
            <div className="flex h-full flex-col text-white">
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-[10px] bg-[#F8AE31] text-white">
                <IconLayoutCards size={18} stroke={2} />
              </span>

              <h3 className="mt-8 text-[72px] font-black leading-[72px] tracking-[-2.88px]">
                Micro-
                <br />
                Cards
              </h3>

              <p className="mt-8 max-w-[360px] text-sm leading-5 text-white/95">
                Educational empowerment lessons in bite-sized formats. Learn
                about your rights and safety in minutes.
              </p>

              <button
                type="button"
                className="mt-auto inline-flex h-12 w-full items-center justify-center rounded-full bg-white px-6 text-sm font-semibold text-[#F39200] shadow-[0_6px_16px_rgba(0,0,0,0.14)]"
              >
                Explore lessons
              </button>
            </div>
          </article>
        </div>

        <div className="mx-auto mt-4 flex h-[54px] w-full max-w-[1280px] items-start justify-between border-t-2 border-[#AFC7D6] pt-4">
          <p className="text-[9px] font-bold uppercase leading-[1.4] tracking-[0.16em] text-[#3A4F66]">
            Variant of
            <br />
            more of our pillars
          </p>
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[#0B5FA6]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#F59E0B]" />
            <span className="h-1.5 w-1.5 rounded-full bg-[#F7BE1A]" />
          </div>
        </div>
      </div>
    </section>
  );
}
