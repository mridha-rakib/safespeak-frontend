import { Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconBellFilled,
  IconChevronDown,
  IconChevronLeft,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconSearch,
  IconSettingsFilled,
  IconShieldFilled,
} from "@tabler/icons-react";

import abuseImage from "@/assets/abuse.png";
import domesticViolenceImage from "@/assets/domestic-violance.jpg";
import hackerImage from "@/assets/hacker.jpg";
import migrateImage from "@/assets/migrate.jpg";
import sphereAdv from "@/assets/sphere-adv.svg?url";
import { cn } from "@/lib/utils";

type DashboardTab = "home" | "explorer" | "notifications" | "settings";
type HomeView = "overview" | "microeducation";

const pageFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const SPHERE_SIZE = 220; // diameter in px
const SPHERE_RING = 14; // thickness of the visible ring
const SPHERE_HALO = 22; // soft glow outside the ring
const SPHERE_TOP = 264; // offset from top of the grid area

function NavItem({
  href,
  icon,
  label,
  active,
  showDot = false,
}: {
  href:
    | "/dashboard"
    | "/dashboard/explorer"
    | "/dashboard/notifications"
    | "/dashboard/settings";
  icon: React.ReactNode;
  label: string;
  active: boolean;
  showDot?: boolean;
}) {
  return (
    <Link
      href={href}
      className={cn(
        "relative flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition",
        active
          ? "bg-[#f6ebda] text-[#f39a22]"
          : "text-[#60718a] hover:bg-[#eef2f7]"
      )}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center">
        {icon}
      </span>
      <span>{label}</span>
      {showDot && (
        <span className="absolute right-3 h-1.5 w-1.5 rounded-full bg-[#f05353]" />
      )}
    </Link>
  );
}

function Sidebar({ activeTab }: { activeTab: DashboardTab }) {
  return (
    <aside className="hidden min-h-[900px] w-[176px] flex-col border-r border-[#d7dee8] bg-[#f8fafc] px-4 py-6 lg:flex xl:h-full">
      <div className="px-2">
        <p className="text-[28px] font-extrabold leading-[0.9] text-[#0b5fa6]">
          Safe<span className="text-[#2ac182]">{"\u2713"}</span>
          <br />
          Speak
        </p>
      </div>

      <nav className="mt-10 flex flex-col gap-2">
        <NavItem
          href="/dashboard"
          icon={<IconHomeFilled size={12} />}
          label="Home"
          active={activeTab === "home"}
        />
        <NavItem
          href="/dashboard/explorer"
          icon={<IconCompassFilled size={12} />}
          label="Explorer"
          active={activeTab === "explorer"}
        />
        <NavItem
          href="/dashboard/notifications"
          icon={<IconBellFilled size={12} />}
          label="Notifications"
          active={activeTab === "notifications"}
          showDot
        />
      </nav>

      <div className="mt-auto">
        <NavItem
          href="/dashboard/settings"
          icon={<IconSettingsFilled size={12} />}
          label="Settings"
          active={activeTab === "settings"}
        />
      </div>
    </aside>
  );
}

function EmergencyToolbar() {
  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#d4deea] bg-white/45 px-3 py-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#de3838] px-4 py-1.5 text-[11px] font-bold text-white">
          <IconAlertCircleFilled size={13} />
          In case of emergency call (000)
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
            EN
            <IconChevronDown size={10} />
          </span>
        </div>

        <button className="inline-flex h-8 items-center gap-1.5 rounded-full bg-[#de3838] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#cf3131]">
          Quick Exit
          <IconFolderFilled size={12} />
        </button>
      </div>

      <div className="text-right">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#93a3b8]">
          Welcome Back
        </p>
        <p className="text-sm font-bold text-[#1f2a3a]">Alex Rivera</p>
      </div>
    </div>
  );
}

function HomeDashboardPage() {
  const ringDiameter = SPHERE_SIZE + SPHERE_RING * 2;
  const haloDiameter = ringDiameter + SPHERE_HALO * 2;
  const sphereOffset = (haloDiameter - SPHERE_SIZE) / 2;
  const ringOffset = (haloDiameter - ringDiameter) / 2;

  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="relative mx-auto w-full [--dashboard-card-gap:24px] xl:h-[824.224px] xl:max-w-[1120px]">
        <div className="flex flex-col gap-[var(--dashboard-card-gap)]">
          <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] xl:grid-cols-[1fr_2.122fr_1fr]">
            <article className="relative h-[210px] overflow-hidden rounded-[20px] border border-white/25 xl:h-[390.422119140625px] xl:w-full xl:rounded-[30px] xl:border-[0.99px] xl:notch-br">
              <Image
                src={domesticViolenceImage}
                alt="Domestic violence"
                fill
                className="object-cover"
              />
              <div className="from-[#6D94FF]/88 absolute inset-0 bg-gradient-to-b to-[#0034FF]/95" />
              <div className="absolute bottom-4 left-4">
                <h3 className="max-w-[190px] text-[32.86px] font-bold leading-[100%] text-white">
                  Domestic
                  <br />
                  violence
                </h3>
                <p className="mt-2 max-w-[165px] text-xs text-white/85">
                  Abusive behaviour used to control a partner.
                </p>
              </div>
            </article>

            <article className="dashboard-safespeak-card relative h-[210px] overflow-hidden rounded-[20px] border border-white/20 xl:h-[390.422119140625px] xl:w-full xl:rounded-[32px] xl:border-[0.99px] xl:notch-bl xl:notch-br">
              <div className="absolute inset-0 z-[2] bg-[radial-gradient(95%_74%_at_50%_78%,rgba(160,253,255,0.58)_0%,rgba(160,253,255,0.18)_40%,rgba(160,253,255,0)_100%)]" />
              <div className="absolute inset-0 z-[4] flex h-full flex-col items-center justify-center text-center xl:gap-[3.94px] xl:pb-[110px] xl:pt-[26.29px]">
                <div className="flex max-w-[340px] flex-col items-center pt-1 xl:h-[140.67633056640625px] xl:w-[340px] xl:gap-[8.56px] xl:pt-[17.12px]">
                  <p className="text-[11px] font-semibold text-white/90 xl:text-[11px] xl:leading-[100%]">
                    SafeSpeak
                  </p>
                  <h3 className="mt-1 text-[48px] font-extrabold leading-[0.9] text-white xl:mt-0 xl:text-[48px] xl:leading-[100%]">
                    Let&apos;s talk with
                    <br />
                    SafeSpeak
                  </h3>
                </div>
              </div>
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(180deg,rgba(160,253,255,0.14)_0%,rgba(0,52,255,0.4)_100%)]" />
              <div className="absolute inset-0 z-[3] bg-[linear-gradient(160deg,rgba(0,52,255,0.1)_0%,rgba(0,52,255,0.35)_72%,rgba(0,52,255,0.5)_100%)]" />
              <div className="absolute inset-0 z-[0] bg-[linear-gradient(180deg,#A0FDFF_0%,#0034FF_100%)]" />
              <div className="absolute inset-0 z-[0] opacity-[0.22] mix-blend-screen">
                <Image
                  src={abuseImage}
                  alt="SafeSpeak ambient"
                  fill
                  className="object-cover"
                />
              </div>
            </article>

            <article className="group relative h-[210px] overflow-hidden rounded-[20px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] xl:h-[390.4221px] xl:w-full xl:rounded-[30px] xl:border-[0.99px] xl:notch-bl">
              <Image
                src={abuseImage}
                alt="Racial abuse"
                fill
                className="object-cover transition duration-[250ms] ease-out group-hover:brightness-110"
              />
              <div className="absolute inset-0 z-[1] bg-[linear-gradient(165deg,#6D94FF_0%,#0034FF_100%)] opacity-80 mix-blend-overlay transition-opacity duration-[250ms] ease-out group-hover:opacity-[0.88]" />
              <div className="absolute inset-x-[24px] top-[56%] z-[2] -translate-y-1/2">
                <h3 className="max-w-[190px] text-[34px] font-bold leading-[1.05] text-white xl:text-[46px]">
                  Racial
                  <br />
                  Abuse
                </h3>
                <p className="text-white/78 mt-[10px] max-w-[188px] text-[13px] font-normal leading-[1.25]">
                  Boost your prompt processing with rich keywords.
                </p>
              </div>
            </article>
          </div>

          <div>
            <div className="relative xl:h-[406.2px] xl:w-full">
              <div className="grid h-full grid-cols-1 gap-[var(--dashboard-card-gap)] xl:grid-cols-2">
                <article className="group relative h-[206px] overflow-hidden rounded-[20px] border border-white/20 xl:h-full xl:rounded-[26px] xl:notch-tr">
                  <Image
                    src={hackerImage}
                    alt="Cyber scam"
                    fill
                    className="object-cover object-center transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                  />
                  <div className="absolute inset-0 bg-[linear-gradient(145deg,rgba(16,24,40,0.26)_8%,rgba(12,18,34,0.56)_58%,rgba(8,12,24,0.82)_100%)] opacity-[0.82] transition-opacity duration-300 ease-out group-hover:opacity-[0.92]" />
                  <div className="absolute inset-0 bg-[radial-gradient(110%_90%_at_82%_18%,rgba(16,138,210,0.2)_0%,rgba(16,138,210,0)_55%)]" />
                  <div className="absolute bottom-6 left-6 pr-6">
                    <h3 className="text-[26.29px] font-bold leading-[100%] tracking-[0em] text-white">
                      Cyber scam
                    </h3>
                    <p className="mt-2 max-w-[320px] text-[13px] font-normal leading-[1.32] text-white/75">
                      Explore multiple prompt directions with branching.
                    </p>
                  </div>
                </article>

                <article className="relative h-[206px] overflow-hidden rounded-[20px] border border-white/20 xl:h-full xl:rounded-[26px] xl:notch-tl">
                  <Image
                    src={migrateImage}
                    alt="Migrant challenges"
                    fill
                    className="object-cover"
                  />
                  <div className="from-[#0e3153]/78 via-[#234464]/62 absolute inset-0 bg-gradient-to-r to-[#2f4f74]/55" />
                  <div className="absolute bottom-4 left-4">
                    <h3 className="text-[36px] font-extrabold leading-[0.92] text-white">
                      Migrant Challenges
                    </h3>
                    <p className="mt-2 text-xs text-white/80">
                      International students & migrants issue
                    </p>
                  </div>
                </article>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] xl:grid-cols-[0.82fr_1.1fr_1.05fr]">
            <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] xl:grid-rows-2">
              <article className="relative h-[132px] overflow-hidden rounded-[18px] border border-white/20 bg-[#0b5b86] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/75">
                  Cyber
                </p>
                <h4 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                  Scam
                  <br />
                  Shield
                </h4>
                <IconShieldFilled
                  size={74}
                  className="absolute bottom-2 right-2 text-white/10"
                />
              </article>

              <article className="relative h-[132px] overflow-hidden rounded-[18px] border border-white/20 bg-[#f8bd07] p-4">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#5f4c00]">
                  Legal
                </p>
                <h4 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-[#171717]">
                  Resources
                </h4>
                <IconFolderFilled
                  size={62}
                  className="absolute bottom-2 right-2 text-[#d39f04]"
                />
              </article>
            </div>

            <Link
              href={{
                pathname: "/dashboard",
                query: { view: "microeducation" },
              }}
              className="relative block h-[276px] overflow-hidden rounded-[18px] border border-white/20 bg-[#f99603] p-4 transition hover:brightness-105"
            >
              <h4 className="text-[42px] font-extrabold leading-[0.9] text-white">
                Micro-
                <br />
                Cards
              </h4>
              <div className="absolute bottom-4 left-4 right-4">
                <p className="text-[11px] font-semibold text-white/90">
                  4 Lessons - 12 mins
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/35">
                  <div className="h-2 w-2/3 rounded-full bg-white/95" />
                </div>
              </div>
            </Link>

            <article className="h-[276px] rounded-[18px] border border-white/30 bg-white p-3">
              <div className="mb-2 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#334155]">
                  Local Intelligence
                </h4>
                <span className="text-sm font-bold text-[#94a3b8]">...</span>
              </div>

              <div className="relative h-[236px] overflow-hidden rounded-[14px] bg-[#d9e6d2]">
                <div className="absolute inset-0 bg-[linear-gradient(130deg,#cfdebf_0%,#e3edd8_45%,#cedebf_100%)]" />
                <div className="absolute -left-10 top-[-8%] h-[130%] w-4 rotate-[12deg] bg-[#f2bc7d]/75" />
                <div className="absolute -top-8 left-[18%] h-[125%] w-3 rotate-[9deg] bg-white/70" />
                <div className="absolute -top-10 right-[22%] h-[130%] w-3 rotate-[-8deg] bg-white/65" />
                <div className="absolute inset-x-[-4%] top-[45%] h-2 rotate-[10deg] rounded-full bg-white/70" />
                <div className="absolute left-[58%] top-[66%] h-4 w-4 rounded-full border-2 border-white bg-[#f2a122]" />

                <div className="absolute bottom-2 left-2 right-2 rounded-xl bg-white/95 px-3 py-2 shadow-sm">
                  <p className="text-[9px] font-bold uppercase tracking-[0.08em] text-[#f2a122]">
                    Current location
                  </p>
                  <p className="text-[11px] font-semibold leading-tight text-[#334155]">
                    3 Active Zones Nearby
                  </p>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 z-20 hidden -translate-x-1/2 xl:block"
          style={{
            top: `${SPHERE_TOP}px`,
            width: `${haloDiameter}px`,
            height: `${haloDiameter}px`,
          }}
        >
          <div className="absolute inset-0 rounded-full bg-white/60 blur-[32px]" />

          <div
            className="absolute rounded-full bg-white"
            style={{
              left: `${ringOffset}px`,
              top: `${ringOffset}px`,
              width: `${ringDiameter}px`,
              height: `${ringDiameter}px`,
              boxShadow: "0 18px 30px rgba(15,23,42,0.20)",
            }}
          />

          <div
            className="absolute overflow-hidden rounded-full shadow-[0_16px_26px_rgba(15,23,42,0.35)]"
            style={{
              left: `${sphereOffset}px`,
              top: `${sphereOffset}px`,
              width: `${SPHERE_SIZE}px`,
              height: `${SPHERE_SIZE}px`,
            }}
          >
            <Image
              src={sphereAdv}
              alt="SafeSpeak center sphere"
              fill
              className="object-contain"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

function MicroEducationPage() {
  const chips = [
    "All Lessons",
    "Harassment",
    "Rights",
    "Safety",
    "Mental Health",
  ];

  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            MicroEducation
          </Link>
          <button className="text-xs font-medium text-[#7b8798]">Cancel</button>
        </div>

        <div className="pt-4">
          <h1 className="text-[56px] font-extrabold leading-[0.9] text-[#0f4f96]">
            Learn. Protect. Thrive.
          </h1>
          <p className="mt-2 max-w-[700px] text-sm leading-[1.45] text-[#5f6f86]">
            Quick lessons on rights, online safety, mental health, and everyday
            hazards.
            <br />
            Empowering you with the knowledge to stay safe and secure.
          </p>

          <div className="relative mt-4 max-w-[540px]">
            <IconSearch
              size={14}
              className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#98a6b9]"
            />
            <input
              type="text"
              placeholder="Search topics, laws, tips..."
              className="h-10 w-full rounded-full border border-[#dbe5f0] bg-white px-10 text-xs text-[#1f2937] outline-none focus:border-[#3b82f6]"
            />
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            {chips.map((chip, index) => (
              <span
                key={chip}
                className={cn(
                  "inline-flex rounded-full px-3.5 py-1.5 text-[11px] font-semibold",
                  index === 0
                    ? "bg-[#3b82f6] text-white"
                    : "bg-white text-[#5f6f86]"
                )}
              >
                {chip}
              </span>
            ))}
          </div>

          <div className="mt-4 grid grid-cols-1 gap-3 xl:grid-cols-2">
            <article className="relative h-[162px] overflow-hidden rounded-[16px] bg-[#0d6d9d] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                Cyber
              </p>
              <h3 className="mt-1 text-[40px] font-extrabold leading-[0.9] text-white">
                Bullying
              </h3>
              <IconShieldFilled
                size={70}
                className="text-white/12 absolute bottom-3 right-3"
              />
            </article>

            <article className="relative h-[162px] overflow-hidden rounded-[16px] bg-[#f89507] p-4">
              <h3 className="text-[40px] font-extrabold uppercase leading-[0.86] text-white">
                Dis-
                <br />
                crimina-
                <br />
                tion
              </h3>
              <div className="absolute bottom-4 right-4 rounded-xl bg-white/20 px-3 py-2 text-xs text-white/90">
                Discrimination occurs when employees are treated unfairly for
                personal traits.
              </div>
            </article>

            <article className="relative h-[176px] overflow-hidden rounded-[16px] bg-[#20b986] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                Protection
              </p>
              <h3 className="mt-1 text-[34px] font-extrabold uppercase leading-[0.9] text-white">
                Online
                <br />
                Safety
              </h3>
              <p className="mt-2 max-w-[300px] text-xs text-white/90">
                Protect your digital footprint & data from potential online
                threats.
              </p>
              <button className="mt-3 inline-flex rounded-full bg-white px-4 py-1.5 text-[11px] font-bold text-[#159968]">
                Get Protected
              </button>
              <div className="bg-white/22 absolute bottom-4 right-4 inline-flex h-14 w-14 items-center justify-center rounded-xl text-white">
                <IconShieldFilled size={24} />
              </div>
            </article>

            <article className="relative h-[176px] overflow-hidden rounded-[16px] bg-[#f7bd23] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5300]">
                Legal
              </p>
              <h3 className="mt-1 text-[36px] font-extrabold leading-[0.9] text-[#111827]">
                Migrant &
                <br />
                Student Rights
              </h3>
              <IconFolderFilled
                size={36}
                className="absolute bottom-4 right-4 text-[#cf9f1a]"
              />
            </article>

            <article className="relative h-[154px] overflow-hidden rounded-[16px] bg-[#8157e8] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                Mental
              </p>
              <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                Mental
                <br />
                Health
              </h3>
            </article>

            <article className="relative h-[154px] overflow-hidden rounded-[16px] bg-[#1c9d8f] p-4">
              <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                Fundamentals
              </p>
              <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                Legal Aid
                <br />
                Basics
              </h3>
              <button className="absolute bottom-4 right-4 rounded-full bg-[#0b7f73] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                Start Now
              </button>
            </article>
          </div>
        </div>
      </div>
    </div>
  );
}

function PlaceholderPanel({ title }: { title: string }) {
  return (
    <div className="p-4 sm:p-6">
      <div className="rounded-2xl border border-dashed border-[#c9d5e4] bg-white/60 p-8">
        <h2 className="text-3xl font-extrabold text-[#0b5fa6]">{title}</h2>
        <p className="mt-2 text-sm text-[#64748b]">
          This section is ready for feature content.
        </p>
      </div>
    </div>
  );
}

function DashboardShell({
  activeTab,
  children,
}: {
  activeTab: DashboardTab;
  children: React.ReactNode;
}) {
  return (
    <div
      className={`${pageFont.className} mx-auto flex min-h-[900px] w-full bg-[#eef3f8] xl:h-[1574px] xl:w-[1440px]`}
    >
      <Sidebar activeTab={activeTab} />

      <section className="flex-1 p-3 sm:p-4 xl:h-full">
        <div className="overflow-hidden rounded-[20px] border border-[#ccd8e5] bg-[#edf2f8] shadow-[0_8px_24px_rgba(15,23,42,0.08)] xl:h-full">
          <EmergencyToolbar />
          {children}
        </div>
      </section>
    </div>
  );
}

export default function DashboardScreen({
  activeTab,
  homeView = "overview",
}: {
  activeTab: DashboardTab;
  homeView?: HomeView;
}) {
  let page: React.ReactNode;

  if (activeTab === "home") {
    page =
      homeView === "microeducation" ? (
        <MicroEducationPage />
      ) : (
        <HomeDashboardPage />
      );
  } else if (activeTab === "explorer") {
    page = <PlaceholderPanel title="Explorer" />;
  } else if (activeTab === "notifications") {
    page = <PlaceholderPanel title="Notifications" />;
  } else {
    page = <PlaceholderPanel title="Settings" />;
  }

  return <DashboardShell activeTab={activeTab}>{page}</DashboardShell>;
}
