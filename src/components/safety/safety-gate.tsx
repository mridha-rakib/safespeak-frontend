"use client";

import { useEffect, useState } from "react";

import { usePathname } from "next/navigation";

import {
  EMERGENCY_NUMBER,
  SAFETY_GATE_ACK_KEY,
  SUPPORT_NUMBER_DIAL,
  SUPPORT_NUMBER_DISPLAY,
  triggerQuickExit,
} from "@/lib/safety";

function isHiddenRoute(pathname: string): boolean {
  return pathname.startsWith("/neutral");
}

export function SafetyGate() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [isSafeToContinue, setIsSafeToContinue] = useState(false);

  useEffect(() => {
    if (isHiddenRoute(pathname)) {
      setIsOpen(false);
      return;
    }

    const hasAcknowledged =
      window.sessionStorage.getItem(SAFETY_GATE_ACK_KEY) === "1";
    setIsOpen(!hasAcknowledged);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) return;

    const { overflow } = document.body.style;
    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = overflow;
    };
  }, [isOpen]);

  const continueSafely = () => {
    if (!isSafeToContinue) return;
    window.sessionStorage.setItem(SAFETY_GATE_ACK_KEY, "1");
    setIsOpen(false);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[120] bg-[#0b1725]/80 p-4 backdrop-blur-[2px]">
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="safety-gate-title"
        className="mx-auto mt-8 w-full max-w-xl rounded-2xl border border-[#ffcf99] bg-white p-5 text-[#172233] shadow-[0_20px_48px_rgba(0,0,0,0.35)] sm:mt-12 sm:p-6"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.1em] text-[#0f5d9f]">
          Safety Gate
        </p>
        <h2
          id="safety-gate-title"
          className="mt-1 text-2xl font-extrabold leading-tight text-[#1f2a3a]"
        >
          Before you continue
        </h2>

        <div className="mt-4 space-y-3 rounded-xl border border-[#f2dae0] bg-[#fff7f7] p-4">
          <p className="text-sm font-semibold text-[#8b2131]">
            If you are in immediate danger, call {EMERGENCY_NUMBER} now.
          </p>
          <p className="text-sm text-[#334155]">
            If it is safe, contact {SUPPORT_NUMBER_DISPLAY} (24/7) for support.
          </p>

          <div className="flex flex-wrap gap-2">
          <a
            href={`tel:${EMERGENCY_NUMBER}`}
            className="inline-flex h-11 items-center rounded-full bg-[#dc2626] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            Emergency {EMERGENCY_NUMBER}
          </a>
          <a
            href={`tel:${SUPPORT_NUMBER_DIAL}`}
            className="inline-flex h-11 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            {SUPPORT_NUMBER_DISPLAY}
          </a>
          <button
            type="button"
            onClick={triggerQuickExit}
            className="inline-flex h-11 items-center rounded-full bg-[#111827] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white"
          >
            Quick Exit
          </button>
          </div>
        </div>

        <label className="mt-4 flex items-start gap-2 rounded-xl border border-[#d9e2ee] bg-[#f8fbff] p-3 text-sm text-[#334155]">
          <input
            type="checkbox"
            checked={isSafeToContinue}
            onChange={(event) => setIsSafeToContinue(event.target.checked)}
            className="mt-0.5 h-4 w-4 rounded border-[#c6d0df] accent-[#0f5d9f]"
          />
          I am in a safe place and want to continue.
        </label>

        <div className="mt-4 flex flex-wrap justify-end gap-2">
          <button
            type="button"
            onClick={triggerQuickExit}
            className="inline-flex h-11 items-center rounded-full border border-[#d6deea] bg-white px-5 text-xs font-semibold text-[#334155]"
          >
            Exit to neutral screen
          </button>
          <button
            type="button"
            onClick={continueSafely}
            disabled={!isSafeToContinue}
            className="inline-flex h-11 items-center rounded-full bg-[#0f5d9f] px-5 text-xs font-bold uppercase tracking-[0.08em] text-white disabled:cursor-not-allowed disabled:opacity-50"
          >
            Continue safely
          </button>
        </div>
      </div>
    </div>
  );
}
