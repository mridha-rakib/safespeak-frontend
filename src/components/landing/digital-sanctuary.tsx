import { Plus_Jakarta_Sans } from "next/font/google";

import {
  IconAlertTriangle,
  IconBook2,
  IconCircleCheck,
  IconCircleX,
  IconLock,
  IconUsersGroup,
} from "@tabler/icons-react";

const sanctuaryHeadingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["800"],
});

function SanctuaryMeta({
  icon,
  title,
  description,
  danger = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  danger?: boolean;
}) {
  return (
    <article
      className={[
        "rounded-2xl border bg-[#f8fafc] p-4 shadow-[0_6px_16px_rgba(15,23,42,0.05)] sm:p-5",
        danger ? "border-[#f4b7b7] bg-[#fff9f9]" : "border-[#dbe5ef]",
      ].join(" ")}
    >
      <div className="flex items-center gap-3">
        <span
          className={[
            "inline-flex h-8 w-8 items-center justify-center rounded-full",
            danger
              ? "bg-[#ffe9e9] text-[#dc2626]"
              : "bg-[#e9f2fb] text-[#0b63a8]",
          ].join(" ")}
        >
          {icon}
        </span>
        <h4
          className={[
            "text-sm font-extrabold",
            danger ? "text-[#dc2626]" : "text-[#1f2937]",
          ].join(" ")}
        >
          {title}
        </h4>
      </div>
      <p
        className={[
          "mt-3 text-xs leading-5",
          danger ? "text-[#b45353]" : "text-[#66788d]",
        ].join(" ")}
      >
        {description}
      </p>
    </article>
  );
}

export default function DigitalSanctuary() {
  return (
    <section className="mx-auto w-full max-w-[1440px] bg-white px-4 py-12 sm:px-8 sm:py-16 lg:min-h-[1083px] lg:px-16 lg:py-24">
      <div className="mx-auto flex h-full w-full max-w-[1312px] flex-col">
        <header className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#20a3aa]">
            Transparency First
          </p>
          <h3
            className={`${sanctuaryHeadingFont.className} mt-2 text-center align-middle text-[48px] font-extrabold leading-[48px] tracking-[0px] text-[#101828]`}
          >
            Your Digital{" "}
            <span className="align-middle text-[48px] font-extrabold leading-[100%] tracking-[0px] text-[#0b5fa6]">
              Sanctuary
            </span>
          </h3>
          <p className="mx-auto mt-4 max-w-[760px] text-sm leading-6 text-[#708296] sm:text-base">
            We believe in absolute clarity about what we do and what we do not
            do. Your safety relies on understanding these boundaries.
          </p>
        </header>

        <div className="mt-8 grid gap-4 lg:mt-10 lg:grid-cols-[1.25fr_1fr]">
          <article className="relative h-[436px] w-full max-w-[692px] overflow-hidden rounded-[40px] border border-[#BBF7D0] bg-[#FFFFFF] p-10 shadow-[0px_4px_20px_-5px_rgba(0,0,0,0.05)]">
            <span
              aria-hidden
              className="pointer-events-none absolute left-6 right-6 top-0 h-1 rounded-b-full bg-[#0D9488]"
            />
            <div className="flex items-center gap-3">
              <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#ddf8ea] text-[#0b9d72]">
                <IconCircleCheck size={18} stroke={2} />
              </span>
              <h4 className="text-[30px] font-extrabold leading-none text-[#1f2937]">
                We Are
              </h4>
            </div>

            <p className="mt-5 max-w-[560px] text-sm leading-6 text-[#4f6478] sm:text-base">
              Your dedicated digital ally, providing a secure bridge between
              uncertainty and professional help.
            </p>

            <ul className="mt-5 space-y-2 text-sm font-medium text-[#334155] sm:text-base">
              {[
                "Confidential Reporting",
                "Community Support",
                "Resource Aggregator",
              ].map((item) => (
                <li key={item} className="flex items-center gap-2">
                  <IconCircleCheck
                    size={16}
                    className="text-[#0b9d72]"
                    stroke={2}
                  />
                  <span>{item}</span>
                </li>
              ))}
            </ul>

            <p className="mt-8 text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#16a08a]">
              Trauma-informed and privacy-first
            </p>
          </article>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SanctuaryMeta
              icon={<IconLock size={16} stroke={2} />}
              title="Secure Tool"
              description="Encrypted documentation with time-stamped evidence."
            />
            <SanctuaryMeta
              icon={<IconBook2 size={16} stroke={2} />}
              title="Education Hub"
              description="Curated resources on rights and mental health."
            />
            <SanctuaryMeta
              icon={<IconUsersGroup size={16} stroke={2} />}
              title="Professional Bridge"
              description="Direct connections to NGOs and legal aid."
            />
            <SanctuaryMeta
              icon={<IconAlertTriangle size={16} stroke={2} />}
              title="Not Emergency"
              description="We cannot replace emergency services. In immediate danger, call 000."
              danger
            />
          </div>
        </div>

        <article className="mt-4 rounded-3xl border border-[#f2a6a6] bg-[#fff9f9] p-6 shadow-[0_6px_16px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center">
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#ffe8e8] text-[#ef4444]">
              <IconCircleX size={22} stroke={2} />
            </span>

            <div>
              <h4 className="text-2xl font-extrabold leading-none text-[#1f2937]">
                We Are NOT
              </h4>
              <p className="mt-3 max-w-[760px] text-sm leading-6 text-[#7f8ea2] sm:text-base">
                We provide information, not legal representation. We document
                user reports but do not investigate crimes independently.
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <span className="rounded-full bg-[#ffe9e9] px-3 py-1 text-xs font-semibold text-[#ef4444]">
                  Not a Law Firm
                </span>
                <span className="rounded-full bg-[#ffe9e9] px-3 py-1 text-xs font-semibold text-[#ef4444]">
                  Not Investigators
                </span>
              </div>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
