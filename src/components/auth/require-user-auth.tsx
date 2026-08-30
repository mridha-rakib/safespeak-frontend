"use client";

import type { Route } from "next";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { type ReactNode, useEffect, useState } from "react";

import { ensureValidAuthSession } from "@/lib/auth";

type RequireUserAuthProps = {
  children: ReactNode;
};

function getLoginRedirect(pathname: string, searchParams: URLSearchParams): string {
  const queryString = searchParams.toString();
  const currentPath = queryString ? `${pathname}?${queryString}` : pathname;

  return `/login?next=${encodeURIComponent(currentPath)}`;
}

export function RequireUserAuth({ children }: RequireUserAuthProps) {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isAuthorized, setIsAuthorized] = useState(false);

  useEffect(() => {
    let isActive = true;

    setIsAuthorized(false);

    void ensureValidAuthSession()
      .then((session) => {
        if (!isActive) {
          return;
        }

        if (session) {
          setIsAuthorized(true);
          return;
        }

        router.replace(getLoginRedirect(pathname, searchParams) as Route);
      })
      .catch(() => {
        if (isActive) {
          router.replace(getLoginRedirect(pathname, searchParams) as Route);
        }
      });

    return () => {
      isActive = false;
    };
  }, [pathname, router, searchParams]);

  if (!isAuthorized) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#eef4fb] px-4 text-center text-[#0f172a]">
        <div>
          <p className="text-sm font-extrabold uppercase tracking-[0.18em] text-[#64748b]">
            SafeSpeak
          </p>
          <p className="mt-3 text-lg font-bold">Checking your session...</p>
        </div>
      </div>
    );
  }

  return children;
}
