import { Inter, Plus_Jakarta_Sans } from "next/font/google";
import Image from "next/image";
import Link from "next/link";

import {
  IconAlertCircleFilled,
  IconBellFilled,
  IconChevronDown,
  IconChevronLeft,
  IconChevronRight,
  IconClock,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconMapPin,
  IconMicrophone,
  IconSearch,
  IconSettingsFilled,
  IconShieldFilled,
} from "@tabler/icons-react";

import bottomLeft from "@/assets/bottom-left.svg?url";
import bottomRight from "@/assets/bottom-right.svg?url";
import digitalFootPrint from "@/assets/digital_foot_print.svg?url";
import documentingEv from "@/assets/documentig_ev.svg?url";
import hackerImage from "@/assets/hacker.jpg";
import identifyBulling from "@/assets/identifyBulling.svg?url";
import mentalHealth from "@/assets/mental_health.svg?url";
import mentalHealth2 from "@/assets/mental_health_2.svg?url";
import mentalHealthLove from "@/assets/mental_health_love.svg?url";
import scamShield from "@/assets/scam shield icon.svg?url";
import safeReporting from "@/assets/safe_reporting.svg?url";
import sphereAdv from "@/assets/sphere-adv.svg?url";
import tickSign from "@/assets/tickSign.svg?url";
import topLeft from "@/assets/top-left.svg?url";
import topMask from "@/assets/top-mask.svg?url";
import topRight from "@/assets/top-right.svg?url";
import { cn } from "@/lib/utils";

type DashboardTab = "home" | "explorer" | "notifications" | "settings";
type HomeView =
  | "overview"
  | "microeducation"
  | "microcards"
  | "microcarddetail"
  | "assistant";

const pageFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const interFont = Inter({
  subsets: ["latin"],
  weight: ["800", "900"],
});

const SPHERE_TOP = 275; // offset from top of the grid area
// eslint-disable-next-line n/no-process-env
const googleMapsApiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
const localIntelligenceMapSrc = googleMapsApiKey
  ? `https://www.google.com/maps/embed/v1/view?key=${googleMapsApiKey}&center=-33.8688,151.2093&zoom=13&maptype=roadmap`
  : null;

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
        "relative flex items-center justify-center rounded-full px-2 py-2.5 text-sm font-semibold transition lg:justify-start lg:gap-3 lg:px-4",
        active
          ? "bg-[#f6ebda] text-[#f39a22]"
          : "text-[#60718a] hover:bg-[#eef2f7]"
      )}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center">
        {icon}
      </span>
      <span className="hidden lg:inline">{label}</span>
      {showDot && (
        <span className="absolute right-2 top-1/2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-[#f05353] lg:right-3" />
      )}
    </Link>
  );
}

function Sidebar({ activeTab }: { activeTab: DashboardTab }) {
  return (
    <aside className="sticky top-0 w-[72px] shrink-0 border-r border-[#d7dee8] bg-[#f8fafc] px-2 py-6 sm:w-[88px] sm:px-3 lg:w-56 lg:px-5 lg:py-8 xl:h-[1574px] xl:w-[256px]">
      <div className="px-1 lg:px-2">
        <div className="hidden text-[28px] font-extrabold leading-[0.9] text-[#0b5fa6] lg:block">
          <div className="flex items-start gap-0.5">
            <span>Safe</span>
            <Image
              src={tickSign}
              alt="SafeSpeak tick"
              width={23}
              height={23}
              className="h-[23px] w-[23px]"
            />
          </div>
          <p>Speak</p>
        </div>
        <div className="flex justify-center lg:hidden">
          <Image
            src={tickSign}
            alt="SafeSpeak tick"
            width={26}
            height={26}
            className="h-[26px] w-[26px]"
          />
        </div>
      </div>

      <nav className="mt-6 flex flex-col gap-2 lg:mt-10">
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
    <div className="flex flex-col gap-2 px-3 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-3 sm:px-4">
      <div className="flex flex-wrap items-center gap-2">
        <div className="inline-flex max-w-full items-center gap-2 whitespace-nowrap rounded-full bg-[#de3838] px-3 py-1.5 text-[10px] font-bold text-white sm:px-4 sm:text-[11px]">
          <IconAlertCircleFilled size={13} />
          In case of emergency call (000)
          <span className="inline-flex items-center gap-1 rounded-full bg-white/15 px-2 py-0.5 text-[10px]">
            EN
            <IconChevronDown size={10} />
          </span>
        </div>

        <button className="inline-flex h-8 items-center gap-1.5 whitespace-nowrap rounded-full bg-[#de3838] px-5 text-[11px] font-extrabold uppercase tracking-[0.08em] text-white transition hover:bg-[#cf3131]">
          Quick Exit
          <IconFolderFilled size={12} />
        </button>
      </div>

      <div className="self-end text-right">
        <p className="text-[9px] font-semibold uppercase tracking-[0.08em] text-[#93a3b8]">
          Welcome Back
        </p>
        <p className="text-sm font-bold text-[#1f2a3a]">Alex Rivera</p>
      </div>
    </div>
  );
}

function HomeDashboardPage() {
  return (
    <div className="px-2 pb-4 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="relative mx-auto w-full [--dashboard-card-gap:12px] sm:[--dashboard-card-gap:16px] lg:[--dashboard-card-gap:20px] xl:[--dashboard-card-gap:24px] xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex flex-col gap-[var(--dashboard-card-gap)]">
          <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2 xl:grid-cols-[1fr_2.122fr_1fr]">
            <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-1 xl:order-none xl:h-[390.4221px] xl:w-full xl:aspect-auto xl:rounded-[30px] xl:border-[0.99px]">
              <Image
                src={topLeft}
                alt="Domestic violence"
                fill
                className="object-cover transition duration-[250ms] ease-out group-hover:brightness-110"
              />
              {/* <div className="from-[#6D94FF]/88 absolute inset-0 bg-gradient-to-b to-[#0034FF]/95" />
              <div className="absolute bottom-4 left-4">
                <h3 className="max-w-[190px] text-[32.86px] font-bold leading-[100%] text-white">
                  Domestic
                  <br />
                  violence
                </h3>
                <p className="mt-2 max-w-[165px] text-xs text-white/85">
                  Abusive behaviour used to control a partner.
                </p>
              </div> */}
            </article>

            <Link
              href={{
                pathname: "/dashboard",
                query: { view: "assistant" },
              }}
              className="xl:notch-bl group relative block aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-3 md:col-span-2 xl:order-none xl:col-span-1 xl:h-[390.4221px] xl:w-full xl:aspect-auto xl:rounded-[30px] xl:border-[0.99px]"
            >
              <Image alt="dfhksdjf" fill src={topMask} />
              <div className="pointer-events-none absolute bottom-0 left-1/2 z-10 h-[96px] w-[96px] -translate-x-1/2 xl:hidden sm:h-[120px] sm:w-[120px] md:h-[140px] md:w-[140px]">
                <Image
                  src={sphereAdv}
                  alt="SafeSpeak assistant sphere"
                  fill
                  className="object-contain"
                />
              </div>
              {/* <div className="absolute inset-0 z-[2] bg-[radial-gradient(95%_74%_at_50%_78%,rgba(160,253,255,0.58)_0%,rgba(160,253,255,0.18)_40%,rgba(160,253,255,0)_100%)]" />
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
                </div> */}
            </Link>

            <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] md:order-2 xl:order-none xl:h-[390.4221px] xl:w-full xl:aspect-auto xl:rounded-[30px] xl:border-[0.99px]">
              <Image
                src={topRight}
                alt="Racial abuse"
                fill
                className="object-cover transition duration-[250ms] ease-out group-hover:brightness-110"
              />

              {/* <Image
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
              </div> */}
            </article>
          </div>

          <div>
            <div className="relative xl:h-[406.2px] xl:w-full">
              <div className="grid h-full grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2">
                <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] xl:h-[390.4221px] xl:w-full xl:aspect-auto xl:rounded-[30px] xl:border-[0.99px]">
                  <Image alt="dfhksdjf" fill src={bottomLeft} />
                  {/* <Image
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
                  </div> */}
                </article>

                <article className="xl:notch-bl group relative aspect-[16/10] overflow-hidden rounded-[18px] border border-[rgba(255,255,255,0.2)] transition-transform duration-[250ms] ease-out hover:scale-[1.02] sm:aspect-[5/4] xl:h-[390.4221px] xl:w-full xl:aspect-auto xl:rounded-[30px] xl:border-[0.99px]">
                  <Image alt="dfhksdjf" fill src={bottomRight} />
                  {/* <Image
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
                  </div> */}
                </article>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] md:grid-cols-2 xl:grid-cols-[262px_357.34px_452.66px]">
            <div className="grid grid-cols-1 gap-[var(--dashboard-card-gap)] xl:grid-rows-2">
              <Link
                href={{
                  pathname: "/dashboard",
                  query: { view: "microcards" },
                }}
                className="relative block min-h-[190px] w-full overflow-hidden rounded-[24px] border border-white/20 bg-[#004D73] p-5 transition hover:brightness-110 sm:min-h-[220px] sm:p-6 xl:h-[238px] xl:max-w-[262px] xl:rounded-[40px]"
              >
                <p className="text-[18px] font-semibold uppercase tracking-[0.18em] text-[#77c6df]">
                  Cyber
                </p>
                <h4
                  className={`${interFont.className} mt-3 w-full text-[24px] font-extrabold uppercase leading-[30px] tracking-[0] text-white`}
                >
                  SCAM
                  <br />
                  SHIELD
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
                  Legal
                </p>
                <h4
                  className={`${interFont.className} mt-1 h-[30px] w-[214px] text-[24px] font-extrabold uppercase leading-[30px] tracking-[0] text-[#171717]`}
                >
                  RESOURCES
                </h4>
                <IconFolderFilled
                  size={72}
                  className="absolute bottom-6 right-6 text-[#dca906]"
                />
              </article>
            </div>

            <Link
              href={{
                pathname: "/dashboard",
                query: { view: "microeducation" },
              }}
              className="relative block min-h-[280px] w-full overflow-hidden rounded-[24px] bg-[#FF8F00] px-5 pb-5 pt-5 transition hover:brightness-105 sm:min-h-[360px] sm:px-6 sm:pb-6 sm:pt-[23.25px] xl:h-[500px] xl:w-[357.34px] xl:rounded-[40px]"
            >
              <h4
                className={`${interFont.className} h-[83.75px] w-full pb-2 text-[30px] font-extrabold leading-[37.5px] tracking-[0] text-white`}
              >
                Micro-
                <br />
                Cards
              </h4>
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-[11px] font-semibold text-white/90">
                  4 Lessons - 12 mins
                </p>
                <div className="mt-2 h-2 rounded-full bg-white/35">
                  <div className="h-2 w-2/3 rounded-full bg-white/95" />
                </div>
              </div>
            </Link>

            <article className="min-h-[320px] w-full overflow-hidden rounded-[24px] border border-[#cfd9e5] bg-white p-3 sm:min-h-[420px] sm:p-4 md:col-span-2 xl:col-span-1 xl:h-[500px] xl:w-[452.66px] xl:rounded-[40px]">
              <div className="mb-4 flex items-center justify-between">
                <h4 className="text-sm font-bold text-[#334155]">
                  Local Intelligence
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
                        Current location
                      </p>
                      <p className="text-[11px] font-semibold leading-tight text-[#334155]">
                        3 Active Zones Nearby
                      </p>
                    </div>
                    <button className="rounded-full bg-[#f59e0b] px-3 py-1 text-[10px] font-bold text-white">
                      Details
                    </button>
                  </div>
                </div>
              </div>
            </article>
          </div>
        </div>

        <div
          className="pointer-events-none absolute left-1/2 z-20 hidden -translate-x-1/2 p-10 xl:block"
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
        </div>
      </div>
    </div>
  );
}

type MicroCardTone = "blue" | "yellow" | "teal";

function MicroCardLesson({
  title,
  iconSrc,
  tone,
  className,
  readMoreHref = "/dashboard?view=microcarddetail",
}: {
  title: string;
  iconSrc: string;
  tone: MicroCardTone;
  className?: string;
  readMoreHref?: string;
}) {
  const toneStyles: Record<
    MicroCardTone,
    {
      card: string;
      title: string;
      meta: string;
      iconWrap: string;
      button: string;
    }
  > = {
    blue: {
      card: "bg-[#0f5fa7]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/20",
      button: "bg-white text-[#0d4d85]",
    },
    yellow: {
      card: "bg-[#f7b500]",
      title: "text-[#111827]",
      meta: "text-[#5f4b00]",
      iconWrap: "bg-white/35",
      button: "bg-white text-[#312600]",
    },
    teal: {
      card: "bg-[#1f9f97]",
      title: "text-white",
      meta: "text-white/80",
      iconWrap: "bg-white/22",
      button: "bg-white text-[#0e6e67]",
    },
  };

  const currentTone = toneStyles[tone];

  return (
    <article
      className={cn(
        "relative overflow-hidden rounded-2xl p-4 sm:p-5",
        currentTone.card,
        className
      )}
    >
      <div className="flex h-full flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="flex h-full min-w-0 flex-col">
          <h3
            className={cn(
              `${interFont.className} text-[22px] font-extrabold leading-[0.95] sm:text-[28px]`,
              currentTone.title
            )}
          >
            {title}
          </h3>
          <div
            className={cn(
              "mt-3 inline-flex h-9 w-9 items-center justify-center rounded-xl",
              currentTone.iconWrap
            )}
          >
            <Image
              src={iconSrc}
              alt={title}
              width={18}
              height={18}
              className="h-[18px] w-[18px]"
            />
          </div>
          <div className="mt-auto inline-flex items-center gap-1.5">
            <IconClock size={10} className={currentTone.meta} />
            <span className={cn("text-[10px] font-semibold", currentTone.meta)}>
              4 min read
            </span>
          </div>
        </div>

        <Link
          href={readMoreHref}
          className={cn(
            "self-start rounded-full px-4 py-2 text-[11px] font-bold leading-none sm:mt-1 sm:self-auto",
            currentTone.button
          )}
        >
          Read More
        </Link>
      </div>
    </article>
  );
}

function MicroCardsPage() {
  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            Cyber Bullying
          </Link>
          <Link href="/dashboard" className="text-xs font-medium text-[#7b8798]">
            Cancel
          </Link>
        </div>

        <div className="pt-4">
          <h1 className={`${interFont.className} text-4xl font-black leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]`}>
            Micro-Cards
          </h1>
          <p className="mt-1 text-sm text-[#5f6f86]">Cyber Bullying</p>

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

          <div className="mt-4 flex flex-col gap-3">
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title="Identifying Bullying"
                iconSrc={identifyBulling}
                tone="blue"
                className="min-h-[132px] xl:h-[140px]"
              />
              <MicroCardLesson
                title="Documenting Evidence"
                iconSrc={documentingEv}
                tone="yellow"
                className="min-h-[132px] xl:h-[140px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-[1.05fr_0.95fr]">
              <MicroCardLesson
                title="Safe Reporting"
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title="Digital Footprints"
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>

            <MicroCardLesson
              title="Documenting Evidence"
              iconSrc={documentingEv}
              tone="teal"
              className="min-h-[132px] xl:h-[140px]"
            />

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title="Digital Footprints"
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title="Safe Reporting"
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
              <MicroCardLesson
                title="Safe Reporting"
                iconSrc={safeReporting}
                tone="yellow"
                className="min-h-[124px] xl:h-[130px]"
              />
              <MicroCardLesson
                title="Digital Footprints"
                iconSrc={digitalFootPrint}
                tone="blue"
                className="min-h-[124px] xl:h-[130px]"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function MicroCardDetailPage() {
  return (
    <div className="px-3 pb-4 pt-3 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard?view=microcards"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            SafeSpeak Education
          </Link>
          <Link
            href="/dashboard?view=microcards"
            className="text-xs font-medium text-[#7b8798]"
          >
            Cancel
          </Link>
        </div>

        <div className="mt-4 rounded-[12px] border border-[#dce4ef] bg-white p-3">
          <div className="relative aspect-[16/10] overflow-hidden rounded-[10px] sm:h-[330px] sm:aspect-auto">
            <Image
              src={hackerImage}
              alt="Internet hoax awareness"
              fill
              className="object-cover"
            />
            <div className="absolute inset-0 bg-[linear-gradient(170deg,rgba(16,132,220,0.14)_0%,rgba(10,49,91,0.62)_62%,rgba(4,26,51,0.88)_100%)]" />
            <p
              className={`${interFont.className} absolute right-8 top-8 rotate-[-10deg] text-[42px] font-black uppercase leading-[0.84] text-[#d42828] sm:text-[52px]`}
            >
              Internet
              <br />
              Hoax
              <br />!
            </p>
            <div className="absolute inset-x-0 bottom-0 bg-[linear-gradient(180deg,rgba(0,0,0,0)_0%,rgba(0,17,43,0.78)_100%)] px-4 pb-4 pt-10">
              <p className="text-[8px] font-bold uppercase tracking-[0.14em] text-white/95">
                Safety Essentials
              </p>
              <h2
                className={`${interFont.className} mt-1 text-[34px] font-extrabold leading-[0.95] text-white sm:text-[40px]`}
              >
                Staying Safe Online
              </h2>
            </div>
          </div>

          <div className="px-3 pb-3 pt-5 sm:px-4 sm:pb-4">
            <h3 className={`${interFont.className} text-[20px] font-extrabold text-[#0f1f35]`}>
              Digital Harassment Overview
            </h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-[#4e5f76]">
              Digital harassment includes a wide range of behaviors intended to
              threaten, intimidate, or harm individuals through electronic
              means. Recognizing these patterns is the first and most critical
              step toward regaining your peace of mind and establishing a
              secure digital environment.
            </p>

            <div className="mt-4 rounded-[8px] bg-[#e9eef5] px-4 py-3">
              <div className="flex items-start gap-3">
                <span className="mt-0.5 inline-flex h-6 w-6 items-center justify-center rounded-full border border-[#3b82f6]/40 text-[#2d74d7]">
                  <IconAlertCircleFilled size={12} />
                </span>
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.08em] text-[#1f63c9]">
                    Key Takeaway
                  </p>
                  <p className="mt-0.5 text-[12px] leading-[1.45] text-[#4e5f76]">
                    Understanding the nature of online threats empowers you to
                    take actionable steps to protect your identity and mental
                    well-being.
                  </p>
                </div>
              </div>
            </div>

            <p className="mt-4 text-[13px] leading-[1.6] text-[#4e5f76]">
              Your safety is the highest priority. Whether it involves blocking
              suspicious accounts, adjusting privacy settings, or documenting
              incidents for potential reporting, small, consistent steps lead
              to significant protection. Remember that you have the right to a
              safe online experience.
            </p>

            <div className="mt-6 flex items-center justify-between gap-3">
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full border border-[#dbe5f2] bg-white px-4 py-2 text-[11px] font-semibold text-[#334155] transition hover:bg-[#f8fafc]"
              >
                <IconChevronLeft size={12} />
                Previous Micro-Cards
              </Link>
              <Link
                href="/dashboard?view=microcards"
                className="inline-flex items-center gap-1.5 rounded-full bg-[#0c5aa4] px-4 py-2 text-[11px] font-semibold text-white transition hover:bg-[#0b4f90]"
              >
                Next Micro-Cards
                <IconChevronRight size={12} />
              </Link>
            </div>

            <p className="mt-4 text-center text-[9px] text-[#9aa7b8]">
              This is educational information only. Always follow professional
              advice.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SafeSpeakAssistantPage() {
  return (
    <div className="px-2 pb-3 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto flex w-full flex-col xl:max-w-[1120px] 2xl:max-w-[1184px]">
        <div className="flex items-center justify-between border-b border-[#d9e2ee] px-1 py-2">
          <Link
            href="/dashboard"
            className="inline-flex items-center gap-2 text-xs font-semibold text-[#1f2937]"
          >
            <IconChevronLeft size={14} />
            Timeline Builder
          </Link>
          <Link href="/dashboard" className="text-xs font-medium text-[#7b8798]">
            Cancel
          </Link>
        </div>

        <div className="flex flex-1 flex-col items-center px-2 pb-2 pt-6 sm:px-4 sm:pb-4 sm:pt-7">
          <div className="relative h-[128px] w-[128px] sm:h-[148px] sm:w-[148px]">
            <Image
              src={sphereAdv}
              alt="SafeSpeak assistant sphere"
              fill
              className="object-contain"
            />
          </div>

          <p className="mt-4 max-w-[380px] text-center text-base font-semibold leading-tight text-[#24364f]">
            Hi Raihan, can you remind me, how can I help you today?
          </p>

          <div className="mt-6 w-full max-w-[430px] rounded-[14px] border border-[#e0e7f2] bg-white px-4 py-4 text-center shadow-[0_8px_18px_rgba(15,23,42,0.04)] sm:px-5 sm:py-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#253f6f]">
              Real-Time Transcript
            </p>
            <p className="mt-1 text-[11px] leading-[1.45] text-[#60728a]">
              Speech-to-text appears here while recording.
            </p>
          </div>

          <div className="mt-6 w-full max-w-[1120px] sm:mt-auto">
            <div className="rounded-[20px] border border-[#dbe6f2] bg-white p-2">
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  placeholder="Type your response..."
                  className="h-10 flex-1 rounded-full border border-transparent bg-[#f6f9fc] px-4 text-xs text-[#1f2937] outline-none placeholder:text-[#95a3b8] focus:border-[#d3deea]"
                />
                <button
                  aria-label="Toggle microphone"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full text-[#8b97a8]"
                >
                  <IconMicrophone size={14} />
                </button>
                <button
                  aria-label="Send"
                  className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#f59e0b] text-white"
                >
                  <IconChevronRight size={14} />
                </button>
              </div>
            </div>

            <div className="mt-3 flex flex-col gap-2 sm:flex-row sm:items-center">
              <div className="flex h-[54px] flex-1 items-center justify-between rounded-full bg-white px-4">
                <div className="inline-flex items-center gap-2.5">
                  <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-[#e9f1ff] text-[#3f7de0]">
                    <IconMapPin size={12} />
                  </span>
                  <div>
                    <p className="text-[11px] font-semibold leading-none text-[#1f2a3a]">
                      Metadata Capture
                    </p>
                    <p className="mt-1 text-[8px] font-semibold uppercase tracking-[0.08em] text-[#8b97a8]">
                      GPS & Device Intelligence
                    </p>
                  </div>
                </div>
                <button
                  aria-label="Toggle metadata capture"
                  className="inline-flex h-5 w-8 items-center rounded-full bg-[#d4dbe4] p-[2px]"
                >
                  <span className="h-4 w-4 rounded-full bg-white" />
                </button>
              </div>

              <button className="h-[54px] rounded-full bg-[#f59e0b] px-8 text-[11px] font-bold text-white">
                <span className="mr-1" aria-hidden>
                  &bull;
                </span>
                Tap to start recording
              </button>
            </div>
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
    <div className="px-2 pb-4 pt-2 sm:px-4 sm:pb-5 sm:pt-4">
      <div className="mx-auto w-full xl:max-w-[1120px] 2xl:max-w-[1184px]">
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
          <h1 className="text-4xl font-extrabold leading-[0.9] text-[#0f4f96] sm:text-5xl xl:text-[56px]">
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

          <div className="mt-4 flex flex-col gap-2">
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[400px_712px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#006699] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Cyber
                </p>
                <h3 className="mt-1 text-[40px] font-extrabold leading-[0.9] text-white">
                  Bullying
                </h3>
                <IconShieldFilled
                  size={70}
                  className="absolute bottom-8 right-8 text-white/12"
                />
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#F48C06] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <h3
                  className={`${interFont.className} w-full max-w-[448px] text-[30px] font-black uppercase leading-[1] tracking-[0] text-white sm:text-[36px] sm:leading-[36px]`}
                >
                  Dis-
                  <br />
                  crimina-
                  <br />
                  tion
                </h3>
                <div className="absolute bottom-5 left-5 max-w-[448px] rounded-xl bg-white/20 px-4 py-3 text-[11px] leading-[1.25] text-white/95 sm:bottom-6 sm:left-6 xl:bottom-8 xl:left-8">
                  Discrimination occurs when employees are treated unfairly for
                  personal traits.
                </div>
              </article>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[712px_400px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#10B981] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
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
                <div className="bg-white/22 absolute right-8 top-1/2 inline-flex h-20 w-20 -translate-y-1/2 items-center justify-center rounded-2xl text-white">
                  <IconShieldFilled size={34} />
                </div>
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#f7bd23] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-[#6f5300]">
                  Legal
                </p>
                <h3 className="mt-1 w-full max-w-[336px] text-[36px] font-extrabold leading-[0.9] text-[#111827]">
                  Migrant &
                  <br />
                  Student Rights
                </h3>
                <IconFolderFilled
                  size={36}
                  className="absolute bottom-8 right-8 text-[#cf9f1a]"
                />
              </article>
            </div>

            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2 xl:grid-cols-[656px_456px]">
              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#8157e8] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Mental
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                  Mental
                  <br />
                  Health
                </h3>
                <div className="pointer-events-none absolute bottom-8 left-8">
                  <Image
                    src={mentalHealth}
                    alt="Mental health circle"
                    width={48}
                    height={48}
                    className="h-12 w-12 opacity-45"
                  />
                  <Image
                    src={mentalHealth2}
                    alt="Mental health circle overlap"
                    width={48}
                    height={48}
                    className="absolute left-8 top-0 h-12 w-12 opacity-45"
                  />
                </div>
                <Image
                  src={mentalHealthLove}
                  alt="Mental health love icon"
                  width={28}
                  height={28}
                  className="absolute bottom-8 right-8 h-7 w-7"
                />
              </article>

              <article className="relative min-h-[220px] w-full overflow-hidden rounded-[24px] bg-[#1c9d8f] p-5 sm:min-h-[260px] sm:p-6 xl:h-[320px] xl:rounded-[32px] xl:p-8">
                <p className="text-[10px] font-semibold uppercase tracking-[0.12em] text-white/80">
                  Fundamentals
                </p>
                <h3 className="mt-1 text-[34px] font-extrabold leading-[0.9] text-white">
                  Legal Aid
                  <br />
                  Basics
                </h3>
                <button className="absolute bottom-8 right-8 rounded-full bg-[#0b7f73] px-5 py-1.5 text-[10px] font-bold uppercase tracking-[0.08em] text-white">
                  Start Now
                </button>
              </article>
            </div>
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
  homeView,
  children,
}: {
  activeTab: DashboardTab;
  homeView?: HomeView;
  children: React.ReactNode;
}) {
  const sectionSizeClass =
    activeTab === "home" && homeView === "assistant"
      ? "xl:min-h-[952.68px] xl:w-[1184px]"
      : "xl:min-h-[1498px] xl:w-[1184px]";

  return (
    <div
      className={`${pageFont.className} mx-auto flex min-h-screen w-full overflow-x-hidden bg-[#eef3f8] xl:max-w-[1440px] 2xl:max-w-[1536px]`}
    >
      <Sidebar activeTab={activeTab} />

      <section
        className={cn("flex-1 p-2 sm:p-3 md:p-4 xl:flex-none", sectionSizeClass)}
      >
        <div className="overflow-hidden rounded-[16px] bg-[#edf2f8] sm:rounded-[20px] xl:h-full">
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
      ) : homeView === "microcards" ? (
        <MicroCardsPage />
      ) : homeView === "microcarddetail" ? (
        <MicroCardDetailPage />
      ) : homeView === "assistant" ? (
        <SafeSpeakAssistantPage />
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

  return (
    <DashboardShell activeTab={activeTab} homeView={homeView}>
      {page}
    </DashboardShell>
  );
}

