import type { Metadata } from "next";
import { Suspense } from "react";

import { I18nProvider } from "@/components/providers/i18n-provider";

import "./globals.css";
import "leaflet/dist/leaflet.css";

export const metadata: Metadata = {
  title: "Next.js Starter App",
  description: "A basic starter for next.js",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link
          rel="icon"
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>📦</text></svg>"
        />
      </head>
      <body className="min-h-screen w-screen bg-white text-black">
        <I18nProvider>
          <main>
            <Suspense>{children}</Suspense>
          </main>
        </I18nProvider>
      </body>
    </html>
  );
}
