import { IconBrandFacebookFilled, IconBrandInstagram, IconBrandYoutubeFilled } from "@tabler/icons-react";

export default function FooterSection() {
  return (
    <footer className="bg-[#0b5fa6]">
      <div className="landing-shell">
        <div className="landing-content py-10 sm:py-12">
          <div className="grid grid-cols-1 gap-8 border-b border-white/35 pb-8 sm:grid-cols-2 lg:grid-cols-[1.6fr,1fr,1fr] 2xl:gap-10">
            <div>
              <h3 className="text-3xl font-bold leading-none text-white sm:text-4xl 2xl:text-5xl">SafeSpeak</h3>
              <p className="mt-4 max-w-[32ch] text-base font-semibold leading-relaxed text-white/95 sm:text-lg lg:text-xl 2xl:text-2xl">
                Helps you build strength, lose fat, and stay fit with expert guidance and science-backed training
                designed for lasting results.
              </p>

              <div className="mt-6 flex items-center gap-3">
                <a
                  href="#"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#f29a1f] text-[#f29a1f] transition hover:bg-[#f29a1f]/15"
                  aria-label="Facebook"
                >
                  <IconBrandFacebookFilled size={20} />
                </a>
                <a
                  href="#"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#f29a1f] text-[#f29a1f] transition hover:bg-[#f29a1f]/15"
                  aria-label="Instagram"
                >
                  <IconBrandInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[#f29a1f] text-[#f29a1f] transition hover:bg-[#f29a1f]/15"
                  aria-label="YouTube"
                >
                  <IconBrandYoutubeFilled size={20} />
                </a>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-white sm:text-base">Quick Links</h4>
              <ul className="mt-4 space-y-2 text-lg font-semibold leading-snug text-white/95 sm:text-xl">
                <li>
                  <a href="#" className="hover:text-white">
                    About us
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    What does it do
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Testimonials
                  </a>
                </li>
                <li>
                  <a href="#" className="hover:text-white">
                    Gallery
                  </a>
                </li>
              </ul>
            </div>

            <div>
              <h4 className="text-sm font-bold uppercase tracking-[0.08em] text-white sm:text-base">Contact</h4>
              <div className="mt-4 space-y-2 text-lg font-semibold leading-snug text-white/95 sm:text-xl">
                <p>
                  Pure Training West,
                  <br />
                  SolmsstraBe 18, 60486
                </p>
                <p>
                  <a href="mailto:info@personaltrainer101.com" className="hover:text-white">
                    info@personaltrainer101.com
                  </a>
                </p>
                <p>
                  <a href="tel:+491773840426" className="hover:text-white">
                    +49177-384-0426
                  </a>
                </p>
              </div>
            </div>
          </div>

          <div className="flex flex-col gap-3 pt-5 text-sm font-semibold text-white/95 sm:text-base md:flex-row md:items-center md:justify-between">
            <p>(c) 2025 SafeSpeak. All rights reserved.</p>
            <div className="flex flex-wrap items-center gap-5 sm:gap-8">
              <a href="#" className="hover:text-white">
                Privacy Policy
              </a>
              <a href="#" className="hover:text-white">
                Terms of Use
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
