import Link from "next/link";
import * as React from "react";
import type { Route } from "next";

import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { SafeSpeakLogo } from "@/components/ui/safe-speak-logo";

type AuthShellProps = {
  badge?: string;
  title: string;
  description: string;
  footerPrefix: string;
  footerLinkLabel: string;
  footerLinkHref: Route;
  children: React.ReactNode;
};

export function AuthShell({
  badge = "User Access",
  title,
  description,
  footerPrefix,
  footerLinkLabel,
  footerLinkHref,
  children,
}: AuthShellProps) {
  return (
    <section className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#f3f8fd] px-4 py-10 sm:px-6">
      <div className="pointer-events-none absolute -left-20 top-[-140px] h-[340px] w-[340px] rounded-full bg-[#4ba3d9]/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-[-180px] h-[380px] w-[380px] rounded-full bg-[#ff8f00]/20 blur-3xl" />

      <Card className="relative w-full max-w-[540px] rounded-[26px] border border-white/20 bg-[#01579b] text-white shadow-[0_34px_70px_rgba(1,87,155,0.38)]">
        <CardHeader className="items-center space-y-5 px-6 pb-4 pt-8 text-center sm:px-10 sm:pt-10">
          <span className="inline-flex rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-white/90">
            {badge}
          </span>
          <SafeSpeakLogo tone="light" size="lg" />
          <div className="space-y-2">
            <h1 className="text-3xl font-bold leading-tight sm:text-[2.1rem]">{title}</h1>
            <p className="mx-auto max-w-[34ch] text-sm text-white/85">{description}</p>
          </div>
        </CardHeader>

        <CardContent className="px-6 pb-8 pt-4 sm:px-10 sm:pb-10">
          {children}
          <p className="mt-6 text-center text-sm text-white/85">
            {footerPrefix}
            {" "}
            <Link
              href={footerLinkHref}
              className="font-semibold text-[#ffb54a] underline-offset-4 transition hover:underline"
            >
              {footerLinkLabel}
            </Link>
          </p>
        </CardContent>
      </Card>
    </section>
  );
}
