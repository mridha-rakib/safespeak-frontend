"use client";

import { useTranslation } from "react-i18next";

import { LegalDocumentPage } from "@/components/legal/legal-document-page";

export default function TermsConditionsPage() {
  const { t } = useTranslation();

  return (
    <main className="min-h-screen bg-[#f3f8fd] px-4 py-8 sm:px-6 sm:py-10">
      <div className="mx-auto w-full max-w-[980px]">
        <LegalDocumentPage
          pageKey="terms-conditions"
          title={t("footer.termsOfUse")}
          intro={t("dashboard.settings.termsIntro")}
          backHref="/"
          backLabel={t("dashboard.nav.home")}
        />
      </div>
    </main>
  );
}
