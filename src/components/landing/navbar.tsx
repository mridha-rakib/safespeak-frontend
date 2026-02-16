import Link from "next/link";

const links = [
  { label: "What is SafeSpeak", href: "#" },
  { label: "What You Can Do with SafeSpeak", href: "#" },
  { label: "Contact Us", href: "#" },
];

export default function LandingNavbar() {
  return (
    <header className="bg-[#01579B]">
      <div className="w-full px-4 sm:px-6 md:px-8 lg:px-10 xl:px-[150px]">
        <div className="flex h-16 items-center justify-between gap-3 sm:h-20 lg:h-24 xl:h-[112px] xl:gap-8">
          <Link href="/" className="inline-flex items-center gap-2 text-white">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[#ff8f00] text-xs font-black text-[#0b3152]">
              S
            </span>
            <span className="flex flex-col text-sm font-semibold leading-tight sm:text-base">
              <span>Safe</span>
              <span>Speak</span>
            </span>
          </Link>

          <nav className="hidden md:flex md:items-center md:gap-4 lg:gap-6 xl:gap-10">
            {links.map((item) => (
              <a key={item.label} href={item.href} className="nav-link text-xs lg:text-sm xl:text-[15px]">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-2 sm:gap-3 xl:gap-4">
            <Link href="/dashboard" className="cta-pill px-4 py-2 text-xs sm:text-sm xl:px-7 xl:py-2.5">
              Login
            </Link>
            <button className="hidden items-center gap-1 rounded-full border border-white/25 px-3 py-1 text-xs text-white/90 lg:inline-flex xl:px-4 xl:py-1.5">
              English
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
