import type { Metadata } from "next";
import { Suspense } from "react";

import "leaflet/dist/leaflet.css";

import { I18nProvider } from "@/components/providers/i18n-provider";
import { SafetyExperience } from "@/components/safety/safety-experience";

import "./globals.css";

export const metadata: Metadata = {
  title: "SafeSpeak",
  description: "Report racism safely and anonymously with trauma-informed support.",
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
          href="data:image/svg+xml,<svg xmlns=%22http://www.w3.org/2000/svg%22 viewBox=%220 0 100 100%22><text y=%22.9em%22 font-size=%2290%22>S</text></svg>"
        />
      </head>
      <body className="min-h-screen w-full bg-white text-black">
        <I18nProvider>
          <a href="#main-content" className="skip-link">
            Skip to content
          </a>
          <main id="main-content" className="site-shell pb-24">
            <Suspense>{children}</Suspense>
          </main>
          <SafetyExperience />
        </I18nProvider>
      </body>
    </html>
  );
}
