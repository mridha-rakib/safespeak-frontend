import Link from "next/link";
import { Plus_Jakarta_Sans } from "next/font/google";

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

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

type DashboardTab = "home" | "explorer" | "notifications" | "settings";
type MicroCardTone = "blue" | "yellow" | "teal";
type MicroCardIcon = "shield" | "folder" | "compass";

interface MicroCardItem {
  title: string;
  tone: MicroCardTone;
  icon: MicroCardIcon;
  spanClass: string;
  heightClass: string;
}

const pageFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800"],
});

const HOME_MICRO_CARDS: MicroCardItem[] = [
  {
    title: "Identifying Bullying",
    tone: "blue",
    icon: "shield",
    spanClass: "md:col-span-6",
    heightClass: "h-[118px]",
  },
  {
    title: "Documenting Evidence",
    tone: "yellow",
    icon: "folder",
    spanClass: "md:col-span-6",
    heightClass: "h-[118px]",
  },
  {
    title: "Safe Reporting",
    tone: "yellow",
    icon: "folder",
    spanClass: "md:col-span-7",
    heightClass: "h-[118px]",
  },
  {
    title: "Digital Footprints",
    tone: "blue",
    icon: "compass",
    spanClass: "md:col-span-5",
    heightClass: "h-[118px]",
  },
  {
    title: "Documenting Evidence",
    tone: "teal",
    icon: "folder",
    spanClass: "md:col-span-12",
    heightClass: "h-[132px]",
  },
  {
    title: "Digital Footprints",
    tone: "blue",
    icon: "compass",
    spanClass: "md:col-span-6",
    heightClass: "h-[118px]",
  },
  {
    title: "Safe Reporting",
    tone: "yellow",
    icon: "folder",
    spanClass: "md:col-span-6",
    heightClass: "h-[118px]",
  },
  {
    title: "Safe Reporting",
    tone: "yellow",
    icon: "folder",
    spanClass: "md:col-span-7",
    heightClass: "h-[118px]",
  },
  {
    title: "Digital Footprints",
    tone: "blue",
    icon: "compass",
    spanClass: "md:col-span-5",
    heightClass: "h-[118px]",
  },
];

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
      className={cn(
        "flex items-center gap-3 rounded-full px-4 py-3 text-sm font-semibold transition",
        active ? "bg-[#f2e9db] text-[#f59b1e]" : "text-[#64748b] hover:bg-[#eef3f8]",
      )}
    >
      <span className="inline-flex h-4 w-4 items-center justify-center">{icon}</span>
      <span>{label}</span>
    </Link>
  );
}

function EmergencyToolbar() {
  return (
    <div className="flex items-center justify-between gap-4 border-b border-[#dbe4ef] px-4 py-4">
      <div className="flex items-center gap-3">
        <div className="inline-flex items-center gap-2 rounded-full bg-[#e53935] px-5 py-2 text-xs font-bold text-white">
          <IconAlertCircleFilled size={14} />
          In case of emergency call (000)
          <span className="rounded-full bg-white/15 px-2 py-0.5 text-[10px] font-semibold">EN</span>
          <IconChevronDown size={12} />
        </div>
        <Button
          variant="default"
          size="default"
          className="h-9 rounded-full px-5 text-xs font-bold uppercase tracking-[0.08em]"
        >
          Quick Exit
          <IconFolderFilled size={12} className="ml-2" />
        </Button>
      </div>

      <div className="text-right">
        <p className="text-[10px] uppercase tracking-[0.06em] text-[#94a3b8]">Welcome Back</p>
        <p className="text-sm font-bold text-[#0f172a]">Alex Rivera</p>
      </div>
    </div>
  );
}

function SubHeader({ title }: { title: string }) {
  return (
    <div className="flex items-center justify-between border-b border-[#dbe4ef] px-4 py-3">
      <button className="inline-flex items-center gap-1.5 text-xs font-semibold text-[#1f2937]">
        <IconChevronLeft size={14} />
        {title}
      </button>
      <button className="text-xs font-medium text-[#7c8799]">Cancel</button>
    </div>
  );
}

function MicroCardIcon({ icon, tone }: { icon: MicroCardIcon; tone: MicroCardTone }) {
  const iconClass = cn("h-[14px] w-[14px]", tone === "yellow" ? "text-[#5d4a0e]" : "text-white");
  if (icon === "folder") return <IconFolderFilled className={iconClass} />;
  if (icon === "compass") return <IconCompassFilled className={iconClass} />;
  return <IconShieldFilled className={iconClass} />;
}

function MicroLessonCard({ item }: { item: MicroCardItem }) {
  const toneStyles: Record<
    MicroCardTone,
    {
      card: string;
      title: string;
      chip: string;
      read: string;
      meta: string;
    }
  > = {
    blue: {
      card: "bg-[#0f5fa2]",
      title: "text-white",
      chip: "bg-white/20",
      read: "text-[#111827]",
      meta: "text-white/75",
    },
    yellow: {
      card: "bg-[#f8b600]",
      title: "text-[#111827]",
      chip: "bg-white/35",
      read: "text-[#111827]",
      meta: "text-[#4f4b2f]",
    },
    teal: {
      card: "bg-[#1a9f96]",
      title: "text-white",
      chip: "bg-white/22",
      read: "text-[#111827]",
      meta: "text-white/75",
    },
  };

  const tone = toneStyles[item.tone];

  return (
    <Card className={cn("border-0 shadow-none", item.spanClass, item.heightClass, tone.card)}>
      <CardContent className="flex h-full flex-col justify-between p-4">
        <div className="flex items-start justify-between gap-3">
          <CardTitle className={cn("text-[29px] font-bold leading-[0.9]", tone.title)}>{item.title}</CardTitle>
          <Button
            variant="light"
            size="sm"
            className={cn(
              "h-8 rounded-full px-4 text-[11px] font-bold",
              item.tone === "yellow" ? "bg-white/88" : "bg-white/92",
              tone.read,
            )}
          >
            Read More
          </Button>
        </div>

        <div className="flex items-end justify-between">
          <span className={cn("inline-flex h-9 w-9 items-center justify-center rounded-[11px]", tone.chip)}>
            <MicroCardIcon icon={item.icon} tone={item.tone} />
          </span>
          <p className={cn("text-[10px] font-medium", tone.meta)}>{"\u25CB"} 4 min read</p>
        </div>
      </CardContent>
    </Card>
  );
}

function HomeMicroCardsPage() {
  return (
    <>
      <SubHeader title="Cyber Bullying" />
      <div className="px-4 pb-5 pt-4">
        <h1 className={`${pageFont.className} text-[56px] font-extrabold leading-[0.9] text-[#0e4f95]`}>Micro-Cards</h1>
        <p className="mt-2 text-sm text-[#5f6f86]">Cyber Bullying</p>

        <div className="relative mt-3 max-w-[650px]">
          <IconSearch size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba8bd]" />
          <Input
            type="text"
            placeholder="Search topics, laws, tips..."
            className="h-10 border-[#e2e8f2] bg-white pl-9 pr-4 text-[12px]"
          />
        </div>

        <div className="mt-4 grid grid-cols-1 gap-3 md:grid-cols-12">
          {HOME_MICRO_CARDS.map((item, index) => (
            <MicroLessonCard key={`${item.title}-${index}`} item={item} />
          ))}
        </div>
      </div>
    </>
  );
}

function ExplorerPage() {
  const chips = ["All Lessons", "Harassment", "Rights", "Safety", "Mental Health"];

  return (
    <>
      <SubHeader title="MicroEducation" />
      <div className="px-4 pb-6 pt-4">
        <h1 className={`${pageFont.className} text-[56px] font-extrabold leading-[0.9] text-[#0e4f95]`}>Learn. Protect. Thrive.</h1>
        <p className="mt-2 max-w-[660px] text-sm leading-[1.45] text-[#5f6f86]">
          Quick lessons on rights, online safety, mental health, and everyday hazards.
          <br />
          Empowering you with the knowledge to stay safe and secure.
        </p>

        <div className="relative mt-4 max-w-[650px]">
          <IconSearch size={14} className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-[#9ba8bd]" />
          <Input
            type="text"
            placeholder="Search topics, laws, tips..."
            className="h-10 border-[#e2e8f2] bg-white pl-9 pr-4 text-[12px]"
          />
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {chips.map((chip, index) => (
            <Badge
              key={chip}
              className={cn(
                "px-4 py-2 text-[11px]",
                index === 0
                  ? "border-[#3b82f6] bg-[#3b82f6] text-white"
                  : "border-[#d9e2ee] bg-[#f8fafc] text-[#4b5565]",
              )}
            >
              {chip}
            </Badge>
          ))}
        </div>

        <div className="mt-5 rounded-xl border border-dashed border-[#cbd5e1] bg-white/40 p-6 text-sm font-medium text-[#6b7280]">
          Explorer details remain available. Home now uses the new reusable micro-cards layout.
        </div>
      </div>
    </>
  );
}

function PlaceholderPage({ title }: { title: string }) {
  return (
    <>
      <SubHeader title={title} />
      <div className="px-4 pb-6 pt-6">
        <h2 className={`${pageFont.className} text-[42px] font-extrabold leading-[0.95] text-[#0e4f95]`}>{title}</h2>
        <p className="mt-2 text-sm text-[#5f6f86]">This section is ready for content.</p>
      </div>
    </>
  );
}

function DashboardShell({ activeTab, children }: { activeTab: DashboardTab; children: React.ReactNode }) {
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
          <NavLink href="/dashboard" label="Home" icon={<IconHomeFilled size={14} />} active={activeTab === "home"} />
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
        <div className="overflow-hidden rounded-2xl border border-[#dce5f0] bg-[#edf2f8]">
          <EmergencyToolbar />
          {children}
        </div>
      </section>
    </div>
  );
}

export default function DashboardScreen({ activeTab }: { activeTab: DashboardTab }) {
  let page: React.ReactNode;

  if (activeTab === "home") {
    page = <HomeMicroCardsPage />;
  } else if (activeTab === "explorer") {
    page = <ExplorerPage />;
  } else if (activeTab === "notifications") {
    page = <PlaceholderPage title="Notifications" />;
  } else {
    page = <PlaceholderPage title="Settings" />;
  }

  return <DashboardShell activeTab={activeTab}>{page}</DashboardShell>;
}

