"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { AuthShell } from "@/components/auth/auth-shell";
import { completeSocialAuth } from "@/lib/auth";

export default function AuthCallbackPage() {
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    try {
      const hashParams = new URLSearchParams(window.location.hash.slice(1));
      const encodedAuthData = hashParams.get("auth");

      if (!encodedAuthData) {
        setError("Google sign-in could not be completed.");
        return;
      }

      completeSocialAuth(encodedAuthData);
      window.history.replaceState(null, "", "/auth/callback");
      router.replace("/dashboard");
    } catch {
      setError("Google sign-in could not be completed.");
    }
  }, [router]);

  return (
    <AuthShell
      badge="User Access"
      title={error ? "Sign in failed" : "Completing sign in"}
      description={
        error
          ? "Return to login and try Google sign-in again."
          : "Please wait while SafeSpeak finishes your secure sign in."
      }
      footerPrefix="Need to use email instead?"
      footerLinkLabel="Go to login"
      footerLinkHref="/login"
    >
      {error ? (
        <div className="space-y-4">
          <p className="rounded-md border border-[#fecaca]/70 bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">
            {error}
          </p>
          <Link
            href="/login"
            className="inline-flex h-11 w-full items-center justify-center rounded-md bg-[#ff8f00] px-4 text-sm font-bold text-[#0b3152] transition hover:bg-[#f57c00]"
          >
            Back to login
          </Link>
        </div>
      ) : (
        <p className="rounded-md border border-white/20 bg-white/10 px-3 py-2 text-sm text-white/85">
          Completing Google sign-in...
        </p>
      )}
    </AuthShell>
  );
}
