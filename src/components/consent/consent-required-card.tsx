"use client";

import { IconLock, IconShieldCheck } from "@tabler/icons-react";

import type { ConsentRequirement } from "@/lib/consent";

export function ConsentRequiredCard({
  requirement,
  isSubmitting = false,
  onAllow,
  onDecline,
}: {
  requirement: ConsentRequirement;
  isSubmitting?: boolean;
  onAllow: () => void;
  onDecline?: () => void;
}) {
  return (
    <article className="rounded-[18px] border border-[#d8e4f2] bg-white p-4 shadow-[0_12px_26px_rgba(15,23,42,0.06)]">
      <div className="flex items-start gap-3">
        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-[#edf4ff] text-[#0f5d9f]">
          <IconShieldCheck size={18} />
        </span>
        <div className="min-w-0">
          <p className="text-[13px] font-bold text-[#1f2a3a]">
            {requirement.title}
          </p>
          <p className="mt-1 text-[11px] leading-[1.55] text-[#60728a]">
            {requirement.description}
          </p>
          <div className="mt-2 flex flex-wrap gap-2">
            {requirement.flags.map((flag) => (
              <span
                key={flag}
                className="inline-flex items-center gap-1 rounded-full border border-[#dbe7f4] bg-[#f8fbff] px-2.5 py-1 text-[9px] font-bold uppercase tracking-[0.08em] text-[#5f738d]"
              >
                <IconLock size={10} />
                {flag.replace(/_/g, " ")}
              </span>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={onAllow}
          disabled={isSubmitting}
          className="inline-flex h-10 items-center justify-center rounded-full bg-[#0f5d9f] px-5 text-[11px] font-bold text-white shadow-[0_10px_18px_rgba(15,93,159,0.24)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {isSubmitting
            ? "Saving consent..."
            : requirement.allowLabel ?? "Allow and continue"}
        </button>
        {onDecline ? (
          <button
            type="button"
            onClick={onDecline}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#d8e4f2] px-5 text-[11px] font-semibold text-[#5f738d]"
          >
            {requirement.declineLabel ?? "Not now"}
          </button>
        ) : null}
        {requirement.settingsHref ? (
          <a
            href={requirement.settingsHref}
            className="inline-flex h-10 items-center justify-center rounded-full border border-[#d8e4f2] px-5 text-[11px] font-semibold text-[#5f738d]"
          >
            Review consent settings
          </a>
        ) : null}
      </div>
    </article>
  );
}
