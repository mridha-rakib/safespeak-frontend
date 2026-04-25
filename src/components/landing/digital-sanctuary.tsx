import {
  IconAlertTriangle,
  IconBook2,
  IconCircleCheck,
  IconCircleX,
  IconLock,
  IconUsersGroup,
  IconWorld,
} from "@tabler/icons-react";

import {
  EMERGENCY_NUMBER,
  SUPPORT_NUMBER_DIAL,
  SUPPORT_NUMBER_DISPLAY,
} from "@/lib/safety";

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
  const weAreItems = [
    "A triage and guidance platform for discrimination and abuse incidents",
    "A connection hub to verified local legal aid, counseling, and community organizations",
    "A safety planning tool with trauma-informed resources",
    "A multilingual, culturally responsive support system",
  ];

  const weAreNotItems = [
    `A crisis hotline (emergency? Call ${EMERGENCY_NUMBER})`,
    "A legal advice service",
    "A counseling platform",
  ];

  return (
    <section
      id="what-is-safespeak"
      className="mx-auto w-full max-w-[1440px] bg-white px-4 py-12 sm:px-8 sm:py-16 lg:px-16 lg:py-24"
    >
      <div className="mx-auto flex h-full w-full max-w-[1312px] flex-col">
        <header className="text-center">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-[#20a3aa]">
            Transparency First
          </p>
          <h3
            className="mt-2 text-center align-middle text-[48px] font-extrabold leading-[48px] tracking-[0px] text-[#101828]"
          >
            What SafeSpeak{" "}
            <span className="align-middle text-[48px] font-extrabold leading-[100%] tracking-[0px] text-[#0b5fa6]">
              Actually Does
            </span>
          </h3>
          <p className="mx-auto mt-4 max-w-[760px] text-sm leading-6 text-[#708296] sm:text-base">
            SafeSpeak helps people document harm, understand next steps, and
            reach verified support without confusing the platform for emergency,
            legal, or clinical care.
          </p>
        </header>

        <article className="mt-8 rounded-[32px] border border-[#f4d8b4] bg-[#fff8ee] p-6 shadow-[0_10px_30px_rgba(15,23,42,0.06)] sm:p-8">
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-[760px]">
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#c15f00]">
                In an Emergency
              </p>
              <h4 className="mt-2 text-2xl font-extrabold leading-tight text-[#1f2937] sm:text-[30px]">
                Crisis-aware information should be visible, not buried.
              </h4>
              <p className="mt-3 text-sm leading-6 text-[#5d6e81] sm:text-base">
                SafeSpeak is a triage and intelligence platform. It is not a
                substitute for legal or medical advice.
              </p>
            </div>

            <div className="grid gap-3 sm:grid-cols-2">
              <a
                href={`tel:${EMERGENCY_NUMBER}`}
                className="inline-flex min-h-[72px] min-w-[220px] flex-col justify-center rounded-[24px] bg-[#b91c1c] px-5 py-4 text-left text-white shadow-[0_14px_24px_rgba(185,28,28,0.22)]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                  Emergency Services
                </span>
                <span className="mt-1 text-2xl font-extrabold leading-none">
                  {EMERGENCY_NUMBER}
                </span>
              </a>
              <a
                href={`tel:${SUPPORT_NUMBER_DIAL}`}
                className="inline-flex min-h-[72px] min-w-[220px] flex-col justify-center rounded-[24px] bg-[#0f5d9f] px-5 py-4 text-left text-white shadow-[0_14px_24px_rgba(15,93,159,0.18)]"
              >
                <span className="text-[11px] font-bold uppercase tracking-[0.08em] text-white/80">
                  Domestic Violence Support
                </span>
                <span className="mt-1 text-lg font-extrabold leading-none">
                  {SUPPORT_NUMBER_DISPLAY} (24/7)
                </span>
              </a>
            </div>
          </div>
        </article>

        <div className="mt-6 grid gap-4 lg:grid-cols-[1.25fr_1fr]">
          <article className="relative w-full overflow-hidden rounded-[40px] border border-[#BBF7D0] bg-[#FFFFFF] p-8 shadow-[0px_4px_20px_-5px_rgba(0,0,0,0.05)] sm:p-10">
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
              A clear, privacy-first front door that helps users make safer
              decisions and connect to the right support.
            </p>

            <ul className="mt-5 space-y-2 text-sm font-medium text-[#334155] sm:text-base">
              {weAreItems.map((item) => (
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
              Trauma-informed, privacy-first, and culturally responsive
            </p>
          </article>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <SanctuaryMeta
              icon={<IconWorld size={16} stroke={2} />}
              title="Multilingual Support"
              description="Responsive language access and culturally aware framing that reduce barriers to asking for help."
            />
            <SanctuaryMeta
              icon={<IconBook2 size={16} stroke={2} />}
              title="Safety Planning"
              description="Trauma-informed resources that help users organize next steps without overwhelming them."
            />
            <SanctuaryMeta
              icon={<IconUsersGroup size={16} stroke={2} />}
              title="Verified Referrals"
              description="A connection point to local legal aid, counseling, and community organizations."
            />
            <SanctuaryMeta
              icon={<IconLock size={16} stroke={2} />}
              title="Privacy Controls"
              description="Safety-focused UX patterns like discreet navigation and quick-exit behavior that support vulnerable users."
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
                These boundaries stay visible so users can move quickly without
                mistaking the platform for emergency, therapeutic, or legal
                representation.
              </p>

              <ul className="mt-5 space-y-2 text-sm font-medium text-[#7a3b3b] sm:text-base">
                {weAreNotItems.map((item) => (
                  <li key={item} className="flex items-center gap-2">
                    <IconCircleX size={16} className="text-[#ef4444]" stroke={2} />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </article>

        <article className="mt-4 rounded-3xl border border-[#d9e6f2] bg-[#f7fbff] p-6 shadow-[0_6px_16px_rgba(15,23,42,0.04)] sm:p-8">
          <div className="flex items-start gap-3">
            <span className="mt-1 inline-flex h-9 w-9 items-center justify-center rounded-full bg-[#e6f1fb] text-[#0b63a8]">
              <IconAlertTriangle size={18} stroke={2} />
            </span>
            <div>
              <p className="text-[11px] font-extrabold uppercase tracking-[0.18em] text-[#0b63a8]">
                Disclaimer
              </p>
              <p className="mt-2 text-sm leading-6 text-[#4f6478] sm:text-base">
                Information provided is educational only. Always prioritize your
                immediate safety and seek professional guidance.
              </p>
              <p className="mt-2 text-xs leading-5 text-[#708296] sm:text-sm">
                Essential safety information stays prominent here, while more
                detailed legal context can appear deeper in the relevant user
                flow without blocking access.
              </p>
            </div>
          </div>
        </article>
      </div>
    </section>
  );
}
