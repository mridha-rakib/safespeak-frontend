"use client";

import Link from "next/link";

import {
  IconBoltFilled,
  IconChevronLeft,
  IconClipboardText,
  IconClock,
  IconFolderFilled,
  IconShieldFilled,
  IconUsersGroup,
} from "@tabler/icons-react";

function ReportSubmissionDetailedExplanationsPage() {
  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=reportsubmissionrecommendations"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            Detailed Explanations
          </Link>
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full text-[#9ba8bb]">
            <IconClock size={12} />
          </span>
        </div>

        <article className="mt-3 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] p-4 shadow-[0_10px_24px_rgba(15,23,42,0.04)] sm:p-5">
          <p className="mx-auto max-w-[700px] text-center text-xs leading-[1.6] text-[#7a8ca2]">
            Please review the following information carefully. These guidelines
            are tailored to your current situation and location to ensure you
            understand your rights and the process ahead.
          </p>

          <div className="mt-4 grid grid-cols-1 gap-3 lg:grid-cols-[1.55fr_1fr]">
            <article className="rounded-[22px] border border-[#e3ebf4] bg-white p-4 shadow-[0_10px_20px_rgba(15,23,42,0.04)]">
              <div className="flex items-center gap-2">
                <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ffecd8] text-[#f97316]">
                  <IconBoltFilled size={13} />
                </span>
                <h4 className="text-base font-extrabold text-[#f97316]">
                  Legal Rights
                </h4>
              </div>

              <div className="mt-4 space-y-3 text-[#1f2a3a]">
                <div>
                  <h5 className="text-sm font-bold">Right to Silence</h5>
                  <p className="mt-1 text-[11px] leading-[1.5] text-[#7e8fa5]">
                    You have the right to remain silent. Anything you say can be
                    used in legal proceedings. It is crucial to understand that
                    silence cannot be used as an admission of guilt.
                  </p>
                </div>

                <div>
                  <h5 className="text-sm font-bold">Legal Counsel</h5>
                  <p className="mt-1 text-[11px] leading-[1.5] text-[#7e8fa5]">
                    You have the right to legal counsel immediately. If you
                    cannot afford private representation, a duty lawyer can be
                    appointed before questioning begins.
                  </p>
                </div>
              </div>

              <div className="mt-3 rounded-xl border-l-2 border-[#f97316] bg-[#f8fafc] p-3">
                <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#f97316]">
                  Interpreter Access
                </p>
                <p className="mt-1 text-[10px] leading-[1.5] text-[#7e8fa5]">
                  You can request a state-provided interpreter for official
                  interviews if you are not fluent in the primary language.
                </p>
              </div>
            </article>

            <div className="space-y-3">
              <article className="rounded-[20px] bg-[#0f5d9f] p-4 text-white shadow-[0_12px_22px_rgba(15,93,159,0.28)]">
                <span className="bg-white/16 inline-flex h-7 w-7 items-center justify-center rounded-full">
                  <IconShieldFilled size={13} />
                </span>
                <h4 className="mt-4 text-base font-extrabold">
                  Cultural Rights
                </h4>
                <p className="mt-1 text-[11px] leading-[1.5] text-white/80">
                  Universal protections for your identity and heritage.
                  Understand how your background is protected by law.
                </p>
              </article>

              <article className="rounded-[20px] bg-[#0b4e87] p-4 text-white shadow-[0_12px_22px_rgba(11,78,135,0.28)]">
                <span className="bg-white/16 inline-flex h-7 w-7 items-center justify-center rounded-full">
                  <IconUsersGroup size={13} />
                </span>
                <h4 className="mt-4 text-base font-extrabold">
                  What to Expect
                </h4>
                <p className="mt-1 text-[11px] leading-[1.5] text-white/80">
                  Step-by-step walk-through of the legal process. Know what
                  comes next and prepare accordingly.
                </p>
              </article>
            </div>
          </div>

          <div className="mt-4 rounded-2xl border border-[#e4ebf4] bg-white px-2 py-2 shadow-[0_10px_24px_rgba(15,23,42,0.04)]">
            <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#f97316] transition hover:bg-[#fff7ed]">
                <IconFolderFilled size={14} />
                Save to History
              </button>
              <button className="inline-flex h-10 items-center justify-center gap-2 rounded-xl text-xs font-semibold text-[#f97316] transition hover:bg-[#fff7ed]">
                <IconClipboardText size={14} />
                Share Report
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-[10px] text-[#a3b1c4]">
            Info saved securely to local storage.
          </p>
        </article>
      </div>
    </div>
  );
}

export { ReportSubmissionDetailedExplanationsPage };
