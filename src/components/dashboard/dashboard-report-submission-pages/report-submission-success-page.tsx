"use client";

import Link from "next/link";

import {
  IconBoltFilled,
  IconChevronDown,
  IconChevronLeft,
  IconClock,
  IconEye,
  IconFolderFilled,
  IconInfoCircleFilled,
  IconShare,
} from "@tabler/icons-react";

function ReportSubmissionSuccessPage() {
  return (
    <div className="px-6 pb-12 pt-12">
      <div className="mx-auto flex w-full max-w-[1184px] flex-col">
        <div className="flex h-[60px] items-center justify-between border-b border-[#d9e2ee] px-6 py-[10px]">
          <Link
            href="/dashboard?view=reportsubmissionreview"
            className="inline-flex items-center gap-2 text-[#111827]"
          >
            <IconChevronLeft size={18} stroke={2} />
            <span
              className="inline-block text-[13px] font-bold leading-[20px]"
              style={{ fontFamily: "Inter, sans-serif" }}
            >
              Detailed Explanations
            </span>
          </Link>
          <Link
            href="/dashboard?view=reportsubmissionhistory"
            aria-label="View report history"
            className="inline-flex h-6 w-6 items-center justify-center text-[#7f91a8] transition hover:text-[#5f728a]"
          >
            <IconClock size={14} />
          </Link>
        </div>

        <article className="mt-5 rounded-[16px] border border-[#dce5f1] bg-[#f7fafe] p-4 sm:p-6">
          <p className="mx-auto max-w-[520px] text-center text-[12px] leading-[18px] text-[#7789a1]">
            Please review the following information carefully. These guidelines
            are tailored to your current situation and location to ensure you
            understand your rights and the process ahead.
          </p>

          <div className="mt-5 grid grid-cols-1 gap-4 lg:grid-cols-[1.55fr_1fr]">
            <article className="rounded-[12px] border border-[#e3ebf4] bg-white p-4 shadow-[0_8px_18px_rgba(15,23,42,0.04)]">
              <div className="flex items-center justify-between">
                <div className="inline-flex items-center gap-2">
                  <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#ffe8d2] text-[#ff8f00]">
                    <IconBoltFilled size={11} />
                  </span>
                  <h4 className="text-[18px] font-bold text-[#ff7f1a]">
                    Legal Rights
                  </h4>
                </div>
                <button
                  type="button"
                  className="inline-flex h-5 w-5 items-center justify-center text-[#95a4b9]"
                >
                  <IconChevronDown
                    size={12}
                    stroke={1.8}
                    className="rotate-180"
                  />
                </button>
              </div>

              <div className="mt-4 space-y-4">
                <section>
                  <h5 className="text-[12px] font-bold leading-[18px] text-[#1f2a3a]">
                    Right to Silence
                  </h5>
                  <p className="mt-1 text-[10px] leading-[16px] text-[#7f90a6]">
                    You have the right to remain silent. Anything you say can be
                    used against you in legal proceedings. It is crucial to
                    understand that silence cannot be used as admission of
                    guilt.
                  </p>
                </section>

                <section>
                  <h5 className="text-[12px] font-bold leading-[18px] text-[#1f2a3a]">
                    Legal Counsel
                  </h5>
                  <p className="mt-1 text-[10px] leading-[16px] text-[#7f90a6]">
                    You have the right to legal counsel immediately. If you
                    cannot afford a private attorney, a public defender must be
                    appointed to you prior to any interrogation.
                  </p>
                </section>
              </div>

              <div className="mt-4 rounded-[10px] border border-[#edf2f8] bg-[#f6f8fc] p-3">
                <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#ff8f00]">
                  Interpreter Access
                </p>
                <p className="mt-1 text-[9px] leading-[14px] text-[#7f90a6]">
                  You are entitled to a state-provided interpreter for all
                  official questioning if you are not fluent in the primary
                  language.
                </p>
              </div>
            </article>

            <div className="space-y-4">
              <article className="relative overflow-hidden rounded-[14px] bg-[#0f5d9f] p-4 text-white shadow-[0_10px_22px_rgba(15,93,159,0.28)]">
                <span className="bg-white/18 inline-flex h-6 w-6 items-center justify-center rounded-full">
                  <IconInfoCircleFilled size={12} />
                </span>
                <h4 className="mt-6 text-[16px] font-bold leading-[22px]">
                  Cultural Rights
                </h4>
                <p className="mt-2 max-w-[220px] text-[10px] leading-[15px] text-white/85">
                  Universal protections for your identity & heritage. Understand
                  how your background is protected by law.
                </p>
              </article>

              <article className="relative overflow-hidden rounded-[14px] bg-[#0f5d9f] p-4 text-white shadow-[0_10px_22px_rgba(15,93,159,0.28)]">
                <span className="bg-white/18 inline-flex h-6 w-6 items-center justify-center rounded-full">
                  <IconEye size={12} />
                </span>
                <h4 className="mt-6 text-[16px] font-bold leading-[22px]">
                  What to Expect
                </h4>
                <p className="mt-2 max-w-[220px] text-[10px] leading-[15px] text-white/85">
                  Step-by-step walkthrough of the legal process. Know what comes
                  next and prepare accordingly.
                </p>
                <span className="bg-white/12 pointer-events-none absolute bottom-[-26px] right-[-18px] h-[90px] w-[90px] rounded-full" />
              </article>
            </div>
          </div>

          <div className="mt-4 rounded-[12px] border border-[#e5ebf4] bg-white">
            <div className="grid grid-cols-1 divide-y divide-[#edf2f8] sm:grid-cols-2 sm:divide-x sm:divide-y-0">
              <Link
                href="/dashboard?view=reportsubmissionhistory"
                className="inline-flex h-[56px] items-center justify-center gap-2 text-[11px] font-semibold text-[#ff8f00]"
              >
                <IconFolderFilled size={13} />
                Save to History
              </Link>
              <button
                type="button"
                className="inline-flex h-[56px] items-center justify-center gap-2 text-[11px] font-semibold text-[#ff8f00]"
              >
                <IconShare size={13} />
                Share Report
              </button>
            </div>
          </div>

          <p className="mt-4 text-center text-[9px] text-[#a4b1c4]">
            Info saved securely to local storage.
          </p>
        </article>
      </div>
    </div>
  );
}

export { ReportSubmissionSuccessPage };
