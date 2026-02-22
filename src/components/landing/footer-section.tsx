"use client";

import Link from "next/link";
import { IconBrandFacebookFilled, IconBrandInstagram, IconBrandYoutubeFilled } from "@tabler/icons-react";
import { useTranslation } from "react-i18next";

import { SafeSpeakLogo } from "@/components/ui/safe-speak-logo";

export default function FooterSection() {
  const { t } = useTranslation();

  return (
    <footer className="bg-[#0b5fa6]">
      <div className="landing-shell">
        <div className="mx-auto w-full max-w-[1312px] py-6 sm:py-7 lg:py-8">
          <div className="grid grid-cols-1 gap-y-6 border-b border-white/35 pb-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,484px)] lg:items-start lg:gap-x-16 2xl:grid-cols-[462px_484px] 2xl:gap-x-[366px]">
            <div>
              <SafeSpeakLogo tone="light" size="lg" />
              <p className="[font-family:Inter,sans-serif] mt-3 max-w-[462px] text-[16px] font-bold leading-[24px] tracking-[0%] text-white/95">
                {t("footer.tagline")}
              </p>

              <div className="mt-5 flex items-center gap-3">
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f29a1f] text-[#f29a1f] transition hover:bg-[#f29a1f]/15"
                  aria-label={t("footer.social.facebook")}
                >
                  <IconBrandFacebookFilled size={16} />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f29a1f] text-[#f29a1f] transition hover:bg-[#f29a1f]/15"
                  aria-label={t("footer.social.instagram")}
                >
                  <IconBrandInstagram size={16} />
                </a>
                <a
                  href="#"
                  className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-[#f29a1f] text-[#f29a1f] transition hover:bg-[#f29a1f]/15"
                  aria-label={t("footer.social.youtube")}
                >
                  <IconBrandYoutubeFilled size={16} />
                </a>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:min-h-[191px] lg:w-full lg:max-w-[484px] lg:gap-8">
              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-white sm:text-sm">{t("footer.quickLinksTitle")}</h4>
                <ul className="mt-3 space-y-1.5 text-base font-semibold leading-snug text-white/95 sm:text-[18px]">
                  <li>
                    <a href="#" className="hover:text-white">
                      {t("footer.aboutUs")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      {t("footer.whatDoesItDo")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      {t("footer.testimonials")}
                    </a>
                  </li>
                  <li>
                    <a href="#" className="hover:text-white">
                      {t("footer.gallery")}
                    </a>
                  </li>
                </ul>
              </div>

              <div>
                <h4 className="text-xs font-bold uppercase tracking-[0.08em] text-white sm:text-sm">{t("footer.contactTitle")}</h4>
                <div className="mt-3 space-y-1.5 text-base font-semibold leading-snug text-white/95 sm:text-[18px]">
                  <p>
                    {t("footer.addressLine1")}
                    <br />
                    {t("footer.addressLine2")}
                  </p>
                  <p>
                    <a href="mailto:info@personaltrainer101.com" className="hover:text-white">
                      {t("footer.email")}
                    </a>
                  </p>
                  <p>
                    <a href="tel:+491773840426" className="hover:text-white">
                      {t("footer.phone")}
                    </a>
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-2.5 pt-4 text-xs font-semibold text-white/95 sm:text-sm md:flex-row md:items-center md:justify-between">
            <p>{t("footer.copyright")}</p>
            <div className="flex flex-wrap items-center gap-4 sm:gap-7">
              <Link href="/dashboard/settings/privacy-policy" className="hover:text-white">
                {t("footer.privacyPolicy")}
              </Link>
              <a href="#" className="hover:text-white">
                {t("footer.termsOfUse")}
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
