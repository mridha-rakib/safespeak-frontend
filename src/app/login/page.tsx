"use client";

import { FormEvent, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { loginAgent } from "@/lib/auth";

const defaultApiBaseUrl = process.env.NEXT_PUBLIC_API_BASE_URL ?? "";

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [baseUrl, setBaseUrl] = useState(defaultApiBaseUrl);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const isDisabled = useMemo(() => {
    return isSubmitting || !email.trim() || !password.trim();
  }, [email, isSubmitting, password]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      const response = await loginAgent(
        {
          email: email.trim(),
          password,
        },
        {
          baseUrl,
          persistSession: true,
        },
      );

      setSuccess(response.message || "Login successful.");
      router.push("/profile");
    } catch (submitError) {
      const message = submitError instanceof Error ? submitError.message : "Login failed.";
      setError(message);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <section className="min-h-screen bg-[#f4f8fc] px-4 py-10 sm:px-6">
      <Card className="mx-auto w-full max-w-[520px]">
        <CardHeader>
          <CardTitle className="text-2xl font-extrabold text-[#0b5fa6]">Agent Login</CardTitle>
          <CardDescription>
            Sign in with <code>{`{{baseUrl}}/auth/login`}</code> and load your full agent profile.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="baseUrl" className="text-sm font-semibold text-[#334155]">
                API Base URL
              </label>
              <Input
                id="baseUrl"
                type="text"
                value={baseUrl}
                onChange={(event) => setBaseUrl(event.target.value)}
                placeholder="http://localhost:5000"
                autoComplete="off"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-sm font-semibold text-[#334155]">
                Email
              </label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder="agent@example.com"
                autoComplete="email"
                required
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="password" className="text-sm font-semibold text-[#334155]">
                Password
              </label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            {error && (
              <p className="rounded-lg border border-[#fecaca] bg-[#fef2f2] px-3 py-2 text-sm text-[#991b1b]">
                {error}
              </p>
            )}

            {success && (
              <p className="rounded-lg border border-[#bbf7d0] bg-[#f0fdf4] px-3 py-2 text-sm text-[#166534]">
                {success}
              </p>
            )}

            <Button
              type="submit"
              size="lg"
              disabled={isDisabled}
              className="w-full bg-[#0b5fa6] text-white hover:bg-[#0a548f]"
            >
              {isSubmitting ? "Logging in..." : "Login"}
            </Button>

            <p className="text-center text-sm text-[#64748b]">
              Go back to{" "}
              <Link href="/" className="font-semibold text-[#0b5fa6] hover:underline">
                Landing page
              </Link>
            </p>
          </form>
        </CardContent>
      </Card>
    </section>
  );
}
