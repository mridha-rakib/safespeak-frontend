import Image from "next/image";
import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

import {
  IconAlertCircleFilled,
  IconBellFilled,
  IconChevronDown,
  IconCompassFilled,
  IconFolderFilled,
  IconHomeFilled,
  IconSettingsFilled,
  IconShieldFilled,
} from "@tabler/icons-react";

import abuseImage from "@/assets/abuse.png";
import domesticViolance from "@/assets/domestic-violance.jpg";
import hackerImage from "@/assets/hacker.jpg";
import migrateChallengeImage from "@/assets/migrate-challange.jpg";
import sphereAdv from "@/assets/sphere-adv.svg?url";

type DashboardTab = "home" | "explorer" | "notifications" | "settings";

const domesticCardFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
});

function NavLink({
  href,
  label,
  icon,
  active,
}: {
  href: "/dashboard" | "/dashboard/explorer" | "/dashboard/notifications" | "/dashboard/settings";
  label: string;
  icon: React.ReactNode;
  active: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition ${
        active ? "bg-[#f2e9db] text-[#f59b1e]" : "text-[#64748b] hover:bg-[#eef3f8]"
      }`}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

export default function DashboardScreen({ activeTab }: { activeTab: DashboardTab }) {
  return (
    <div className="mx-auto flex min-h-screen w-full max-w-[1830px] bg-white">
      <aside className="flex w-[256px] flex-col border-r border-[#e2e8f0] bg-white px-5 py-8">
        <div className="px-2">
          <p className="text-[34px] font-extrabold leading-[0.9] text-[#0b5fa6]">
            Safe<span className="text-[#23b26d]">{"\u2713"}</span>
            <br />
            Speak
          </p>
        </div>

        <nav className="mt-10 flex flex-col gap-2">
          <NavLink
            href="/dashboard"
            label="Home"
            icon={<IconHomeFilled size={14} />}
            active={activeTab === "home"}
          />
          <NavLink
            href="/dashboard/explorer"
            label="Explorer"
            icon={<IconCompassFilled size={14} />}
            active={activeTab === "explorer"}
          />
          <NavLink
            href="/dashboard/notifications"
            label="Notifications"
            icon={<IconBellFilled size={14} />}
            active={activeTab === "notifications"}
          />
        </nav>

        <div className="mt-auto">
          <NavLink
            href="/dashboard/settings"
            label="Settings"
            icon={<IconSettingsFilled size={14} />}
            active={activeTab === "settings"}
          />
        </div>
      </aside>

      <section className="flex-1 bg-[#f8fafc] p-4">
        <div className="rounded-2xl border border-[#e2e8f0] bg-white p-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="inline-flex items-center gap-2 rounded-full bg-[#e53935] px-5 py-2 text-xs font-bold text-white">
                <IconAlertCircleFilled size={14} />
                In case of emergency call (000)
                <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">EN</span>
                <IconChevronDown size={12} />
              </div>
              <button className="inline-flex items-center gap-2 rounded-full bg-[#e53935] px-5 py-2 text-xs font-bold uppercase tracking-[0.08em] text-white">
                Quick Exit
                <IconFolderFilled size={12} />
              </button>
            </div>

            <div className="text-right">
              <p className="text-[10px] uppercase tracking-[0.06em] text-[#94a3b8]">Welcome Back</p>
              <p className="text-sm font-bold text-[#0f172a]">Alex Rivera</p>
            </div>
          </div>

          <div className="relative mt-4 w-[1119.998px]">
            <div className="relative flex h-[390.422px] gap-[27.61px]">
              <article className="relative h-[390.42px] w-[258.31px] overflow-hidden rounded-[23.66px] border-[0.99px] border-white/20 bg-[#0034FF]">
                <Image
                  src={domesticViolance}
                  alt="Domestic violence support"
                  fill
                  sizes="258px"
                  className="object-cover object-[26%_center]"
                />
                <div className="absolute inset-0 bg-[linear-gradient(155deg,rgba(0,52,255,0.92)_0%,rgba(109,148,255,0.74)_100%)]" />
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_12%,rgba(109,148,255,0.38),transparent_46%),radial-gradient(circle_at_18%_84%,rgba(0,52,255,0.56),transparent_42%)]" />

                <div className="relative z-10 px-5 pt-[128px] text-white">
                  <h3
                    className={`${domesticCardFont.className} inline-block h-[82px] w-[218.54px] align-bottom text-[32.86px] font-bold leading-[100%] tracking-[0]`}
                  >
                    Domestic
                    <br />
                    violance
                  </h3>
                  <p
                    className={`${domesticCardFont.className} mt-4 inline-block h-[42px] w-[218.54px] align-bottom text-[16.43px] font-normal leading-[100%] tracking-[0] text-white/80`}
                  >
                    Abusive behavior used to control a partner.
                  </p>
                </div>
              </article>

              <article className="relative h-[390.422px] w-[548.168px] overflow-visible rounded-[23.66px] border-[0.99px] border-white/20 bg-[#0034FF] text-white">
                <div className="absolute inset-0 rounded-[23.66px] bg-[radial-gradient(circle_at_50%_68%,rgba(160,253,255,0.5)_0%,rgba(160,253,255,0.22)_24%,rgba(0,52,255,0.88)_63%,#0034FF_100%)]" />

                <div className="relative z-10 flex flex-col items-center gap-[3.94px] pt-[26.29px]">
                  <p
                    className={`${domesticCardFont.className} text-[10px] font-semibold uppercase tracking-[0.1em] leading-[100%] text-white/90`}
                  >
                    SafeSpeak
                  </p>
                  <h3
                    className={`${domesticCardFont.className} flex h-[100px] w-[257px] items-center justify-center border-[0.53px] border-white/0 text-center text-[39.44px] font-semibold leading-[100%] tracking-[-0.02em]`}
                  >
                    Let&apos;s talk with
                    <br />
                    SafeSpeak
                  </h3>
                </div>
              </article>

              <article className="relative h-[390.422px] w-[258.3096px] overflow-hidden rounded-[23.66px] border-[0.99px] border-white/20 bg-[#0034FF]">
                <Image
                  src={abuseImage}
                  alt="Racial abuse awareness"
                  fill
                  sizes="258px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(360deg,#6D94FF_-81.74%,#0034FF_67.63%)] opacity-90" />

                <div className="relative z-10 px-5 pt-[156px] text-white">
                  <h3
                    className={`${domesticCardFont.className} inline-block h-[41px] w-[218.5444px] align-bottom text-[32.86px] font-bold leading-[100%] tracking-[0]`}
                  >
                    Racial Abuse
                  </h3>
                  <p
                    className={`${domesticCardFont.className} mt-4 inline-block w-[218.5444px] text-[16.43px] font-normal leading-[100%] tracking-[0] text-white/85`}
                  >
                    Boost your prompt precision with keywords.
                  </p>
                </div>
              </article>
            </div>

            <div className="pointer-events-none absolute left-1/2 top-[277.04px] z-30 h-[270.14px] w-[270.14px] -translate-x-1/2 rounded-full border-[14px] border-white bg-[#1e3a8a] shadow-[0_18px_40px_rgba(2,12,27,0.45)]">
              <Image
                src={sphereAdv}
                alt="SafeSpeak orb"
                fill
                sizes="270px"
                className="rounded-full object-cover"
              />
            </div>

            <div className="mt-4 grid grid-cols-12 gap-4">
              <article className="relative col-span-6 h-[406.1967px] w-[546.1966px] overflow-hidden rounded-[31.54px] bg-[linear-gradient(153deg,#01579B_0%,#001E35_100%)] text-white">
                <Image
                  src={hackerImage}
                  alt="Cyber scam awareness"
                  fill
                  sizes="546px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-[linear-gradient(153deg,rgba(1,87,155,0.64)_0%,rgba(0,30,53,0.9)_100%)]" />
                <div className="relative z-10 px-[16.76px] pt-[234px]">
                  <h3
                    className={`${domesticCardFont.className} inline-block h-[33px] w-[512.6755px] align-bottom text-[26.29px] font-bold leading-[100%] tracking-[0]`}
                  >
                    Cyber scam
                  </h3>
                  <p
                    className={`${domesticCardFont.className} mt-4 inline-block w-[512.6755px] text-[16.43px] font-normal leading-[100%] tracking-[0] text-white/80`}
                  >
                    Explore multiple prompt directions with branching.
                  </p>
                </div>
              </article>

              <article className="relative col-span-6 h-[406.1967px] w-[546.1966px] overflow-hidden rounded-[23.66px] border-[0.99px] border-white/20 bg-[linear-gradient(153deg,#01579B_0%,#001E35_100%)] text-white">
                <Image
                  src={migrateChallengeImage}
                  alt="Migrant challenges support"
                  fill
                  sizes="546px"
                  className="object-cover object-center"
                />
                <div className="absolute inset-0 bg-[linear-gradient(153deg,rgba(1,87,155,0.64)_0%,rgba(0,30,53,0.9)_100%)]" />
                <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(1,87,155,0.2)_0%,rgba(0,30,53,0.68)_100%)]" />

                <div className="absolute left-[24px] top-[42px] h-[54px] w-[196px]">
                  <span className="absolute left-0 top-[25px] h-[2px] w-[152px] rounded-full bg-[#ff4b61]/75" />
                  <span className="absolute left-[152px] top-[12px] h-[13px] w-[2px] rounded-full bg-[#ff4b61]/75" />
                  <span className="absolute left-[66px] top-[20px] h-[8px] w-[8px] rounded-full bg-[#ff4b61]" />
                  <span className="absolute left-[66px] top-[20px] h-[8px] w-[8px] rounded-full shadow-[0_0_0_2px_rgba(255,75,97,0.24)]" />
                  <span className="absolute left-[161px] top-[29px] h-[7px] w-[7px] rounded-full bg-[#ff4b61]" />
                </div>

                <div className="absolute right-[24px] top-[38px] h-[58px] w-[20px]">
                  <span className="absolute right-[2px] top-0 h-[20px] w-[2px] rounded-full bg-[#ff4b61]/75" />
                  <span className="absolute right-[10px] top-[24px] h-[8px] w-[8px] rounded-full bg-[#ff4b61]" />
                  <span className="absolute right-0 top-[42px] h-[8px] w-[8px] rounded-full bg-[#ff4b61]" />
                </div>

                <div className="relative z-10 px-[22px] pt-[212px]">
                  <span className="inline-flex h-[31px] w-[31px] items-center justify-center rounded-full border border-white/40 bg-[#ef4444] text-white shadow-[0_0_0_3px_rgba(239,68,68,0.2)]">
                    <IconCompassFilled size={13} />
                  </span>

                  <h3
                    className={`${domesticCardFont.className} mt-4 inline-block h-[33px] w-[475.7037px] align-bottom text-[26.29px] font-bold leading-[100%] tracking-[0] text-white/95`}
                  >
                    Migrant Challenges
                  </h3>
                  <p
                    className={`${domesticCardFont.className} mt-[10px] inline-block w-[475.7037px] align-bottom text-[16.43px] font-normal leading-[100%] tracking-[0] text-white/75`}
                  >
                    International Students &amp; Migrants issue
                  </p>
                </div>
              </article>

              <div className="col-span-3 grid h-[360px] grid-rows-2 gap-4">
                <article className="rounded-2xl bg-[#0b5fa6] p-4 text-white">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-white/70">CYBER</p>
                  <h4 className="mt-1 text-[40px] font-bold leading-none">
                    SCAM
                    <br />
                    SHIELD
                  </h4>
                  <div className="mt-8 inline-flex h-8 w-8 items-center justify-center rounded-md border border-white/40">
                    <IconShieldFilled size={14} />
                  </div>
                </article>

                <article className="rounded-2xl bg-[#f5be00] p-4 text-[#111827]">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.1em] text-[#7c6110]">LEGAL</p>
                  <h4 className="mt-1 text-[34px] font-bold leading-none">RESOURCES</h4>
                  <div className="mt-10 inline-flex h-10 w-10 items-center justify-center rounded-md bg-black/10">
                    <IconFolderFilled size={18} />
                  </div>
                </article>
              </div>

              <article className="col-span-4 h-[360px] rounded-2xl bg-[#ff9800] p-4 text-white">
                <h4 className="text-[48px] font-bold leading-none">
                  Micro-
                  <br />
                  Cards
                </h4>
                <div className="mt-[180px] rounded-xl bg-white/20 p-3">
                  <p className="text-xs font-semibold">4 Lessons {"\u2022"} 12 mins</p>
                  <div className="mt-2 h-2 rounded-full bg-white/35">
                    <div className="h-2 w-[35%] rounded-full bg-white" />
                  </div>
                </div>
              </article>

              <article className="col-span-5 h-[360px] overflow-hidden rounded-2xl bg-white p-3 shadow-[inset_0_0_0_1px_#e2e8f0]">
                <div className="mb-2 flex items-center justify-between">
                  <p className="text-sm font-bold text-[#111827]">Local Intelligence</p>
                  <span className="text-[#94a3b8]">...</span>
                </div>
                <div className="relative h-[304px] overflow-hidden rounded-xl bg-[#cddbd2]">
                  <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.2),transparent_35%),radial-gradient(circle_at_65%_48%,rgba(255,255,255,0.22),transparent_40%),linear-gradient(145deg,#cdd8d3,#bfd0cb)]" />
                  <div className="absolute bottom-2 left-2 right-2 rounded-lg bg-white/90 px-3 py-2 shadow-md">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f29a1f]">
                          Current Location
                        </p>
                        <p className="text-xs font-bold text-[#111827]">3 Active Zones Nearby</p>
                      </div>
                      <button className="rounded-full bg-[#ff8f00] px-3 py-1 text-[10px] font-bold text-white">
                        Details
                      </button>
                    </div>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
