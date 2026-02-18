"use client";
import { useEffect, useMemo, useState } from "react";

import { Card, CardBody, Chip, User } from "@nextui-org/react";

import { clearAuthSession, type AuthSession, getAuthSession } from "@/lib/auth";

function ProfileRow({ label, value }: { label: string; value: string }) {
  return (
    <div className="grid grid-cols-[180px,1fr] items-start gap-2 border-b border-[#e2e8f0] py-2 text-sm">
      <span className="font-semibold text-[#334155]">{label}</span>
      <span className="break-words text-[#0f172a]">{value || "-"}</span>
    </div>
  );
}

export default function Profile() {
  const [session, setSession] = useState<AuthSession | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    setSession(getAuthSession());
    setLoaded(true);
  }, []);

  const profileRows = useMemo(() => {
    if (!session) return [];
    return [
      { label: "Email", value: session.user.email },
      { label: "Role", value: session.user.role },
      { label: "Referral Code", value: session.user.referralCode ?? "-" },
      { label: "License Number", value: session.profile.licenseNumber },
      { label: "Brokerage Name", value: session.profile.brokerageName },
      { label: "Title", value: session.profile.title },
      { label: "Active", value: session.profile.isActive ? "Yes" : "No" },
      { label: "Accepting Requests", value: session.profile.acceptingRequests ? "Yes" : "No" },
      { label: "Email Subscription", value: session.profile.emailSubscriptionEnabled ? "Enabled" : "Disabled" },
      { label: "Total Renters Referred", value: String(session.profile.totalRentersReferred) },
      { label: "Active Referrals", value: String(session.profile.activeReferrals) },
      { label: "Total Matches", value: String(session.profile.totalMatches) },
      { label: "Successful Matches", value: String(session.profile.successfulMatches) },
      { label: "Grant Access Count", value: String(session.profile.grantAccessCount) },
      { label: "Has Grant Access", value: session.profile.hasGrantAccess ? "Yes" : "No" },
      { label: "Created At", value: new Date(session.profile.createdAt).toLocaleString() },
      { label: "Updated At", value: new Date(session.profile.updatedAt).toLocaleString() },
    ];
  }, [session]);

  if (!loaded) {
    return (
      <Card className="mx-auto mt-6 max-w-3xl">
        <CardBody>
          <p className="text-sm text-default-500">Loading profile...</p>
        </CardBody>
      </Card>
    );
  }

  if (!session) {
    return (
      <Card className="mx-auto mt-6 max-w-3xl">
        <CardBody className="space-y-3">
          <p className="text-base font-semibold text-[#0f172a]">No active session found.</p>
          <p className="text-sm text-[#64748b]">
            Login first to load full agent details (license number, brokerage name, title, and more).
          </p>
          <a href="/login" className="text-sm font-semibold text-[#0b5fa6] hover:underline">
            Go to Login
          </a>
        </CardBody>
      </Card>
    );
  }

  return (
    <Card className="mx-auto mt-6 max-w-3xl">
      <CardBody className="space-y-4">
        <User
          name={session.user.fullName}
          description={session.user.email}
          avatarProps={{
            showFallback: true,
            src: session.profile.profileImageUrl || "",
          }}
        />

        <div className="flex flex-wrap items-center gap-2">
          <Chip size="sm" color="primary" variant="flat">
            {session.user.role}
          </Chip>
          <Chip size="sm" color={session.profile.isActive ? "success" : "warning"} variant="flat">
            {session.profile.isActive ? "Active" : "Inactive"}
          </Chip>
          <Chip size="sm" color="default" variant="flat">
            Expires: {session.expiresIn}
          </Chip>
        </div>

        <div className="rounded-lg border border-[#e2e8f0] px-4 py-2">
          {profileRows.map((row) => (
            <ProfileRow key={row.label} label={row.label} value={row.value} />
          ))}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-xs text-[#64748b]">Session saved at: {new Date(session.timestamp).toLocaleString()}</p>
          <button
            type="button"
            onClick={() => {
              clearAuthSession();
              setSession(null);
            }}
            className="rounded-full border border-[#dbe5f0] px-4 py-1.5 text-sm font-semibold text-[#1f2937] transition hover:bg-[#f8fafc]"
          >
            Logout
          </button>
        </div>
      </CardBody>
    </Card>
  );
}
