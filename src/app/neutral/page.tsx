"use client";

import { useMemo, useState } from "react";

import { COVERT_MODE_KEY } from "@/lib/safety";

const keypadRows = [
  ["7", "8", "9", "/"],
  ["4", "5", "6", "*"],
  ["1", "2", "3", "-"],
  ["0", ".", "(", ")"],
] as const;

function safeEvaluate(expression: string): string {
  const normalized = expression.replace(/[^0-9+\-*/().]/g, "");

  if (!normalized.trim()) {
    return "0";
  }

  try {
    const result = Function(`"use strict"; return (${normalized});`)();
    if (typeof result !== "number" || Number.isNaN(result)) {
      return "Error";
    }
    return String(result);
  } catch {
    return "Error";
  }
}

export default function NeutralPage() {
  const [display, setDisplay] = useState("0");

  const helperText = useMemo(() => {
    return display === "Error" ? "Please try again." : "Utility calculator";
  }, [display]);

  const append = (value: string) => {
    setDisplay((current) => {
      if (current === "0" || current === "Error") {
        return value;
      }
      return `${current}${value}`;
    });
  };

  const reset = () => {
    setDisplay("0");
  };

  const backspace = () => {
    setDisplay((current) => {
      if (current === "Error" || current.length <= 1) return "0";
      return current.slice(0, -1);
    });
  };

  const evaluate = () => {
    setDisplay((current) => safeEvaluate(current));
  };

  const openDashboard = () => {
    window.sessionStorage.removeItem(COVERT_MODE_KEY);
    window.location.assign("/");
  };

  return (
    <main className="flex min-h-screen items-center justify-center bg-[#f3f5f7] px-4">
      <section className="w-full max-w-sm rounded-3xl border border-[#d8dde7] bg-white p-5 shadow-[0_14px_36px_rgba(0,0,0,0.14)]">
        <header className="mb-4">
          <p className="text-[10px] font-semibold uppercase tracking-[0.08em] text-[#64748b]">
            Daily Tools
          </p>
          <h1 className="text-2xl font-extrabold text-[#1f2937]">
            Calculator
          </h1>
          <p className="text-xs text-[#74859b]">{helperText}</p>
        </header>

        <div className="mb-3 rounded-2xl border border-[#dce4ef] bg-[#f7fbff] px-3 py-4 text-right">
          <p className="truncate text-3xl font-bold text-[#0f172a]">{display}</p>
        </div>

        <div className="mb-3 grid grid-cols-4 gap-2">
          {keypadRows.flat().map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => append(key)}
              className="inline-flex h-11 items-center justify-center rounded-xl border border-[#d7e1ee] bg-white text-lg font-semibold text-[#1f2937] transition hover:bg-[#f4f8fc]"
            >
              {key}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-4 gap-2">
          <button
            type="button"
            onClick={reset}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#f2cad0] bg-[#fff1f3] text-xs font-bold uppercase tracking-[0.08em] text-[#b42335]"
          >
            Clear
          </button>
          <button
            type="button"
            onClick={backspace}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d7e1ee] bg-white text-xs font-bold uppercase tracking-[0.08em] text-[#334155]"
          >
            Del
          </button>
          <button
            type="button"
            onClick={() => append("+")}
            className="inline-flex h-10 items-center justify-center rounded-xl border border-[#d7e1ee] bg-white text-xl font-semibold text-[#334155]"
          >
            +
          </button>
          <button
            type="button"
            onClick={evaluate}
            className="inline-flex h-10 items-center justify-center rounded-xl bg-[#0f5d9f] text-lg font-bold text-white"
          >
            =
          </button>
        </div>

        <button
          type="button"
          onClick={openDashboard}
          className="mt-3 inline-flex h-10 w-full items-center justify-center rounded-xl border border-[#d7e1ee] bg-[#f8fbff] text-xs font-semibold text-[#334155]"
        >
          Open Home
        </button>
      </section>
    </main>
  );
}

