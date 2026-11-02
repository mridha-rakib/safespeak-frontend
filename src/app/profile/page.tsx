"use client";

import Link from "next/link";
import type { Route } from "next";
import { useRouter } from "next/navigation";
import { type ReactNode, useEffect, useMemo, useState } from "react";

import {
  IconBell,
  IconCamera,
  IconCheck,
  IconClock,
  IconDeviceLaptop,
  IconDownload,
  IconEdit,
  IconFileText,
  IconGlobe,
  IconLock,
  IconMail,
  IconMailCheck,
  IconPhone,
  IconRefresh,
  IconSettings,
  IconShieldCheck,
  IconShieldCheckFilled,
  IconTrash,
  IconUser,
  IconUserCheck,
  IconUsers,
} from "@tabler/icons-react";

import {
  type AuthSession,
  clearAuthSession,
  ensureValidAuthSession,
  getAuthSession,
  getCurrentUser,
  logoutUser,
} from "@/lib/auth";
import { getProfile, type ProfileRecord } from "@/lib/profile-client";
import {
  deactivateAccount,
  downloadPrivacyExport,
  savePrivacyExportFile,
} from "@/lib/privacy-client";
import { listReports } from "@/lib/reports-client";
import { listSupportServices } from "@/lib/support-client";
import { cn } from "@/lib/utils";

type ActivitySummary = {
  reports: number;
  support: number;
  resources: number;
  notifications: number;
};

const defaultActivity: ActivitySummary = {
  reports: 0,
  support: 0,
  resources: 0,
  notifications: 0,
};

function formatDate(value?: string): string {
  if (!value) {
    return "-";
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return "-";
  }

  return date.toLocaleDateString(undefined, {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatRole(role: string): string {
  return role
    .split("_")
    .filter(Boolean)
    .map((segment) => segment.charAt(0).toUpperCase() + segment.slice(1))
    .join(" ");
}

function getInitials(name: string, email: string): string {
  const source = name.trim() || email.split("@")[0] || "SafeSpeak User";
  const parts = source.split(/\s+/).filter(Boolean);

  return parts
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase() ?? "")
    .join("");
}

function getTimezoneLabel(): string {
  if (typeof Intl === "undefined") {
    return "(GMT+6) Dhaka, Bangladesh";
  }

  const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;

  if (timezone === "Asia/Dhaka") {
    return "(GMT+6) Dhaka, Bangladesh";
  }

  return timezone || "(GMT+6) Dhaka, Bangladesh";
}

function CardShell({
  children,
  className,
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-[16px] border border-[#dbe5f0] bg-white shadow-[0_14px_36px_rgba(15,23,42,0.06)]",
        className
      )}
    >
      {children}
    </section>
  );
}

function ActionButton({
  icon,
  children,
  tone = "primary",
  href,
  onClick,
}: {
  icon: ReactNode;
  children: ReactNode;
  tone?: "primary" | "danger" | "neutral";
  href?: Route;
  onClick?: () => void;
}) {
  const className = cn(
    "inline-flex h-9 cursor-pointer items-center justify-center gap-2 rounded-[8px] border px-3 text-xs font-bold transition",
    tone === "primary" &&
      "border-[#9ec5fe] bg-white text-[#0b65d8] hover:bg-[#eff6ff]",
    tone === "neutral" &&
      "border-[#dbe5f0] bg-white text-[#334155] hover:bg-[#f8fafc]",
    tone === "danger" &&
      "border-[#fecaca] bg-white text-[#dc2626] hover:bg-[#fff1f2]"
  );

  if (href) {
    return (
      <Link href={href} className={className}>
        {icon}
        {children}
      </Link>
    );
  }

  return (
    <button type="button" onClick={onClick} className={className}>
      {icon}
      {children}
    </button>
  );
}

function StatusCard({
  icon,
  title,
  value,
  valueTone = "green",
  description,
}: {
  icon: ReactNode;
  title: string;
  value: string;
  valueTone?: "green" | "blue" | "red";
  description: string;
}) {
  return (
    <CardShell className="p-5">
      <div className="flex items-start gap-4">
        <span
          className={cn(
            "inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full",
            valueTone === "green" && "bg-[#dcfce7] text-[#22c55e]",
            valueTone === "blue" && "bg-[#dbeafe] text-[#3b82f6]",
            valueTone === "red" && "bg-[#fee2e2] text-[#ef4444]"
          )}
        >
          {icon}
        </span>
        <div className="min-w-0 flex-1">
          <div className="flex items-center justify-between gap-3">
            <p className="text-[12px] font-extrabold text-[#0f172a]">{title}</p>
            <span
              className={cn(
                "rounded-full px-2.5 py-1 text-[10px] font-extrabold",
                valueTone === "green" && "bg-[#dcfce7] text-[#16a34a]",
                valueTone === "blue" && "bg-[#dbeafe] text-[#2563eb]",
                valueTone === "red" && "bg-[#fee2e2] text-[#dc2626]"
              )}
            >
              {value}
            </span>
          </div>
          <p className="mt-2 text-[11px] leading-5 text-[#64748b]">
            {description}
          </p>
        </div>
      </div>
    </CardShell>
  );
}

function InfoRow({
  icon,
  label,
  value,
  action,
}: {
  icon: ReactNode;
  label: string;
  value: string;
  action?: string;
}) {
  return (
    <div className="grid grid-cols-[28px,minmax(82px,0.8fr),minmax(0,1.5fr),auto] items-center gap-3 border-b border-[#e5edf6] py-4 last:border-b-0">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#eef4fb] text-[#64748b]">
        {icon}
      </span>
      <span className="text-[11px] font-extrabold text-[#64748b]">{label}</span>
      <span className="min-w-0 break-words text-[12px] font-semibold text-[#0f172a]">
        {value || "-"}
      </span>
      {action ? (
        <button
          type="button"
          className="cursor-pointer text-[11px] font-extrabold text-[#0b65d8]"
        >
          {action}
        </button>
      ) : null}
    </div>
  );
}

function SecurityRow({
  icon,
  title,
  subtitle,
  action,
  danger = false,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  action: string;
  danger?: boolean;
}) {
  return (
    <div className="grid grid-cols-[30px,1fr,auto] items-center gap-3 border-b border-[#e5edf6] py-4 last:border-b-0">
      <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-[#eef4fb] text-[#64748b]">
        {icon}
      </span>
      <div className="min-w-0">
        <p className="text-[12px] font-extrabold text-[#0f172a]">{title}</p>
        <p
          className={cn(
            "mt-0.5 text-[11px] font-semibold",
            danger ? "text-[#ef4444]" : "text-[#64748b]"
          )}
        >
          {subtitle}
        </p>
      </div>
      <button
        type="button"
        className="cursor-pointer text-[11px] font-extrabold text-[#0b65d8]"
      >
        {action}
      </button>
    </div>
  );
}

function ActivityTile({
  icon,
  value,
  label,
  tone,
}: {
  icon: ReactNode;
  value: number;
  label: string;
  tone: "purple" | "orange" | "green" | "blue";
}) {
  return (
    <div className="rounded-[10px] border border-[#dfe8f2] bg-white p-3 shadow-[0_8px_20px_rgba(15,23,42,0.04)]">
      <span
        className={cn(
          "inline-flex h-7 w-7 items-center justify-center rounded-[8px]",
          tone === "purple" && "bg-[#ede9fe] text-[#8b5cf6]",
          tone === "orange" && "bg-[#ffedd5] text-[#fb923c]",
          tone === "green" && "bg-[#dcfce7] text-[#22c55e]",
          tone === "blue" && "bg-[#dbeafe] text-[#3b82f6]"
        )}
      >
        {icon}
      </span>
      <p className="mt-3 text-2xl font-extrabold leading-none text-[#0f172a]">
        {value}
      </p>
      <p className="mt-1 text-[10px] font-semibold leading-tight text-[#64748b]">
        {label}
      </p>
    </div>
  );
}

function ProfileAvatar({
  name,
  email,
  avatarUrl,
}: {
  name: string;
  email: string;
  avatarUrl?: string;
}) {
  return (
    <div className="relative h-[112px] w-[112px] shrink-0 rounded-full border-[5px] border-white bg-[#eaf2ff] shadow-[0_12px_26px_rgba(15,23,42,0.2)]">
      {avatarUrl ? (
        <div
          aria-label={`${name} profile photo`}
          className="h-full w-full rounded-full bg-cover bg-center"
          style={{ backgroundImage: `url(${avatarUrl})` }}
        />
      ) : (
        <div className="grid h-full w-full place-items-center rounded-full bg-[#dbeafe] text-3xl font-extrabold text-[#0b65d8]">
          {getInitials(name, email)}
        </div>
      )}
      <button
        type="button"
        aria-label="Update profile photo"
        className="absolute bottom-0 right-0 grid h-9 w-9 cursor-pointer place-items-center rounded-full border-4 border-white bg-[#f8fafc] text-[#0b65d8] shadow-sm"
      >
        <IconCamera size={16} />
      </button>
    </div>
  );
}

export default function Profile() {
  const router = useRouter();
  const [session, setSession] = useState<AuthSession | null>(null);
  const [profile, setProfile] = useState<ProfileRecord | null>(null);
  const [activity, setActivity] = useState<ActivitySummary>(defaultActivity);
  const [loaded, setLoaded] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [isDownloadingData, setIsDownloadingData] = useState(false);
  const [isDeactivating, setIsDeactivating] = useState(false);
  const [accountActionMessage, setAccountActionMessage] = useState<string | null>(null);
  const [accountActionError, setAccountActionError] = useState<string | null>(null);

  useEffect(() => {
    let isActive = true;

    void (async () => {
      try {
        const validSession = await ensureValidAuthSession();

        if (!isActive) {
          return;
        }

        if (!validSession) {
          setSession(null);
          return;
        }

        await getCurrentUser();

        if (isActive) {
          setSession(getAuthSession() ?? validSession);
        }

        const [profileResult, reportsResult, supportResult] = await Promise.allSettled([
          getProfile(),
          listReports(),
          listSupportServices(),
        ]);

        if (!isActive) {
          return;
        }

        if (profileResult.status === "fulfilled") {
          setProfile(profileResult.value);
        }

        setActivity({
          reports:
            reportsResult.status === "fulfilled" ? reportsResult.value.length : 0,
          support:
            supportResult.status === "fulfilled" ? supportResult.value.length : 0,
          resources: 0,
          notifications: 0,
        });
      } catch {
        if (isActive) {
          setSession(null);
        }
      } finally {
        if (isActive) {
          setLoaded(true);
        }
      }
    })();

    return () => {
      isActive = false;
    };
  }, []);

  const user = session?.user;
  const roleLabel = useMemo(
    () => (user ? formatRole(user.role) : "Public User"),
    [user]
  );
  const preferredLanguage =
    profile?.preferredLanguage ?? profile?.interpreterLanguage ?? "English";
  const preferredContact = profile?.referralSharingPreference ? "Email" : "In-app";

  const downloadProfileData = async () => {
    if (!session) {
      return;
    }

    setIsDownloadingData(true);
    setAccountActionError(null);
    setAccountActionMessage(null);

    try {
      const exportPayload = await downloadPrivacyExport();

      savePrivacyExportFile(exportPayload);
      setAccountActionMessage("Backend data export generated.");
    } catch (error) {
      setAccountActionError(
        error instanceof Error
          ? error.message
          : "Backend data export could not be generated."
      );
    } finally {
      setIsDownloadingData(false);
    }
  };

  const deactivateProfileAccount = async () => {
    if (!session) {
      return;
    }

    const confirmed =
      typeof window !== "undefined" &&
      window.confirm(
        "Deactivate this account now? You will be logged out and need support to reactivate it."
      );

    if (!confirmed) {
      return;
    }

    setIsDeactivating(true);
    setAccountActionError(null);
    setAccountActionMessage(null);

    try {
      await deactivateAccount();
      clearAuthSession();
      setSession(null);
      router.replace("/login");
    } catch (error) {
      setAccountActionError(
        error instanceof Error ? error.message : "Account could not be deactivated."
      );
    } finally {
      setIsDeactivating(false);
    }
  };

  if (!loaded) {
    return (
      <main className="min-h-screen bg-[#f4f8fc] px-4 pb-36 pt-8">
        <CardShell className="mx-auto max-w-5xl p-6">
          <div className="flex items-center gap-3 text-sm font-semibold text-[#64748b]">
            <IconRefresh size={18} className="animate-spin" />
            Loading profile...
          </div>
        </CardShell>
      </main>
    );
  }

  if (!session || !user) {
    return (
      <main className="min-h-screen bg-[#f4f8fc] px-4 pb-36 pt-8">
        <CardShell className="mx-auto max-w-2xl p-6">
          <p className="text-lg font-extrabold text-[#0f172a]">
            No active session found.
          </p>
          <p className="mt-2 text-sm text-[#64748b]">
            Login first to load your SafeSpeak account details.
          </p>
          <Link
            href="/login"
            className="mt-5 inline-flex h-10 cursor-pointer items-center justify-center rounded-[8px] bg-[#0b65d8] px-4 text-sm font-bold text-white transition hover:bg-[#0757bb]"
          >
            Go to Login
          </Link>
        </CardShell>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#f4f8fc] px-4 pb-40 pt-6 text-[#0f172a] sm:px-6 lg:px-8">
      <div className="mx-auto max-w-[1180px]">
        <header className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-[#0f172a] sm:text-3xl">
              My Profile
            </h1>
            <p className="mt-1 text-sm font-medium text-[#64748b]">
              Manage your account and preferences
            </p>
          </div>
          <div className="flex items-center gap-2">
            <ActionButton href="/dashboard/settings" icon={<IconEdit size={14} />}>
              Edit Profile
            </ActionButton>
            <Link
              href="/dashboard/settings"
              aria-label="Profile settings"
              className="grid h-9 w-9 cursor-pointer place-items-center rounded-[8px] border border-[#dbe5f0] bg-white text-[#64748b] transition hover:bg-[#f8fafc]"
            >
              <IconSettings size={15} />
            </Link>
          </div>
        </header>

        <section className="relative mt-6 overflow-hidden rounded-[18px] bg-[#00579f] p-6 shadow-[0_20px_50px_rgba(0,87,159,0.22)] sm:p-8">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(59,130,246,0.38),transparent_36%),linear-gradient(120deg,#073b83_0%,#00579f_48%,#006ec8_100%)]" />
          <div className="absolute right-10 top-8 hidden h-40 w-72 rounded-full border border-white/10 lg:block" />
          <div className="absolute right-20 top-24 hidden h-px w-56 bg-white/10 lg:block" />
          <span className="absolute right-[170px] top-11 hidden h-2 w-2 rounded-full bg-[#ff8f00] lg:block" />
          <span className="absolute right-[98px] top-[118px] hidden h-2 w-2 rounded-full bg-[#22c55e] lg:block" />
          <span className="absolute right-[62px] top-[72px] hidden h-2 w-2 rounded-full bg-[#f43f5e] lg:block" />

          <div className="relative flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex flex-col items-start gap-5 sm:flex-row sm:items-center">
              <ProfileAvatar
                name={user.fullName}
                email={user.email}
                avatarUrl={user.avatarUrl}
              />
              <div className="min-w-0 text-white">
                <h2 className="max-w-[560px] break-words text-2xl font-extrabold leading-tight sm:text-3xl">
                  {user.fullName}
                </h2>
                <span className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-[#dcfce7] px-2.5 py-1 text-[11px] font-extrabold text-[#15803d]">
                  <IconCheck size={12} />
                  {user.isEmailVerified ? "Verified" : "Email pending"}
                </span>
                <div className="mt-4 space-y-2 text-[12px] font-semibold text-white/90">
                  <p className="flex items-center gap-2 break-all">
                    <IconMail size={14} />
                    {user.email}
                  </p>
                  <p className="flex items-center gap-2">
                    <IconClock size={14} />
                    Member since {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
            </div>

            <div className="hidden items-center justify-center lg:flex">
              <div className="relative grid h-36 w-36 place-items-center rounded-[32px] bg-[#1d6fe8] shadow-[0_20px_44px_rgba(0,0,0,0.18)]">
                <IconShieldCheckFilled size={92} className="text-[#4d93ff]" />
                <IconUser size={42} className="absolute text-white" />
                <span className="absolute -bottom-2 -right-2 grid h-11 w-11 place-items-center rounded-full bg-[#22c55e] text-white shadow-lg">
                  <IconCheck size={22} stroke={3} />
                </span>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-6 grid gap-5 md:grid-cols-3">
          <StatusCard
            icon={<IconShieldCheck size={24} />}
            title="Account Status"
            value={user.status === "active" ? "Active" : formatRole(user.status)}
            valueTone={user.status === "active" ? "green" : "red"}
            description="Your account is active and in good standing."
          />
          <StatusCard
            icon={<IconUserCheck size={24} />}
            title="Role"
            value={roleLabel}
            valueTone="blue"
            description="You can report incidents, get support and access resources."
          />
          <StatusCard
            icon={<IconMailCheck size={24} />}
            title="Email Verified"
            value={user.isEmailVerified ? "Verified" : "Pending"}
            valueTone={user.isEmailVerified ? "green" : "red"}
            description={
              user.isEmailVerified
                ? "Your email address has been successfully verified."
                : "Verify your email to improve account recovery."
            }
          />
        </section>

        <section className="mt-6 grid gap-6 lg:grid-cols-[1.2fr,0.9fr]">
          <CardShell className="p-5 sm:p-6">
            <h2 className="text-lg font-extrabold text-[#0f172a]">
              Profile Information
            </h2>
            <div className="mt-5">
              <InfoRow
                icon={<IconUser size={14} />}
                label="Full Name"
                value={user.fullName}
              />
              <InfoRow
                icon={<IconMail size={14} />}
                label="Email"
                value={user.email}
              />
              <InfoRow
                icon={<IconPhone size={14} />}
                label="Phone"
                value="Not added"
                action="Add"
              />
              <InfoRow
                icon={<IconGlobe size={14} />}
                label="Language"
                value={preferredLanguage}
                action="Edit"
              />
              <InfoRow
                icon={<IconClock size={14} />}
                label="Timezone"
                value={getTimezoneLabel()}
                action="Edit"
              />
              <InfoRow
                icon={<IconMailCheck size={14} />}
                label="Preferred Contact"
                value={preferredContact}
                action="Edit"
              />
            </div>
          </CardShell>

          <div className="space-y-5">
            <CardShell className="p-5 sm:p-6">
              <h2 className="text-lg font-extrabold text-[#0f172a]">Security</h2>
              <div className="mt-5">
                <SecurityRow
                  icon={<IconLock size={15} />}
                  title="Password"
                  subtitle="********"
                  action="Change"
                />
                <SecurityRow
                  icon={<IconShieldCheck size={15} />}
                  title="Two-Factor Authentication"
                  subtitle="Off"
                  action="Enable"
                  danger
                />
                <SecurityRow
                  icon={<IconDeviceLaptop size={15} />}
                  title="Login Devices"
                  subtitle="2 active sessions"
                  action="Manage"
                />
              </div>
            </CardShell>

            <CardShell className="p-5 sm:p-6">
              <div className="flex items-center justify-between gap-3">
                <h2 className="text-lg font-extrabold text-[#0f172a]">
                  Activity Summary
                </h2>
                <Link
                  href="/dashboard"
                  className="cursor-pointer text-[11px] font-extrabold text-[#0b65d8]"
                >
                  View all
                </Link>
              </div>
              <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-4">
                <ActivityTile
                  icon={<IconFileText size={15} />}
                  value={activity.reports}
                  label="Reports Submitted"
                  tone="purple"
                />
                <ActivityTile
                  icon={<IconUsers size={15} />}
                  value={activity.support}
                  label="Support Requests"
                  tone="orange"
                />
                <ActivityTile
                  icon={<IconGlobe size={15} />}
                  value={activity.resources}
                  label="Resources Viewed"
                  tone="green"
                />
                <ActivityTile
                  icon={<IconBell size={15} />}
                  value={activity.notifications}
                  label="Notifications"
                  tone="blue"
                />
              </div>
            </CardShell>
          </div>
        </section>

        <CardShell className="mt-6 p-5 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div className="flex items-center gap-4">
              <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-[#eaf2ff] text-[#3b82f6]">
                <IconSettings size={24} />
              </span>
              <div>
                <h2 className="text-[14px] font-extrabold text-[#0f172a]">
                  Account Actions
                </h2>
                <p className="mt-1 text-[12px] font-medium text-[#64748b]">
                  Download a backend-generated export or deactivate your account.
                </p>
                {accountActionMessage ? (
                  <p className="mt-2 text-[11px] font-bold text-[#0b65d8]">
                    {accountActionMessage}
                  </p>
                ) : null}
                {accountActionError ? (
                  <p className="mt-2 text-[11px] font-bold text-[#b91c1c]">
                    {accountActionError}
                  </p>
                ) : null}
              </div>
            </div>
            <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:justify-end">
              <ActionButton
                icon={<IconDownload size={14} />}
                onClick={() => void downloadProfileData()}
              >
                {isDownloadingData ? "Preparing Export..." : "Download Backend Export"}
              </ActionButton>
              <ActionButton
                href="/dashboard/settings/privacy-policy"
                icon={<IconShieldCheck size={14} />}
              >
                Privacy Settings
              </ActionButton>
              <ActionButton
                tone="danger"
                icon={<IconTrash size={14} />}
                onClick={() => void deactivateProfileAccount()}
              >
                {isDeactivating ? "Deactivating..." : "Deactivate Account"}
              </ActionButton>
              <ActionButton
                tone="neutral"
                icon={<IconLock size={14} />}
                onClick={() => {
                  void (async () => {
                    setIsLoggingOut(true);

                    try {
                      await logoutUser();
                    } finally {
                      setSession(null);
                      setIsLoggingOut(false);
                      router.replace("/login");
                    }
                  })();
                }}
              >
                {isLoggingOut ? "Logging out..." : "Logout"}
              </ActionButton>
            </div>
          </div>
        </CardShell>
      </div>
    </main>
  );
}
