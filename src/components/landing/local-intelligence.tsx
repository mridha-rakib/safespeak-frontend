function Marker({ className }: { className: string }) {
  return (
    <span
      className={`absolute inline-flex h-5 w-5 items-center justify-center rounded-full border-2 border-white bg-[#f29a1f] shadow-[0_6px_12px_rgba(0,0,0,0.18)] sm:h-6 sm:w-6 sm:border-4 ${className}`}
    >
      <span className="h-2 w-2 rounded-full bg-white/90 sm:h-2.5 sm:w-2.5" />
    </span>
  );
}

export default function LocalIntelligence() {
  return (
    <section className="bg-[#d9e8f3]">
      <div className="landing-shell">
        <div className="landing-content landing-section">
          <div className="w-fit">
            <h3 className="text-3xl font-extrabold text-[#111827] sm:text-4xl lg:text-5xl 2xl:text-6xl">
              Local Intelligence
            </h3>
            <div className="mt-2 h-1 w-16 rounded-full bg-[#ff8f00]" />
          </div>

          <div className="relative mt-6 min-h-[280px] overflow-hidden rounded-2xl border-[6px] border-white/75 bg-[#c8d5d0] sm:min-h-[340px] sm:rounded-3xl lg:mt-8 lg:min-h-[420px]">
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,0.25),transparent_45%),radial-gradient(circle_at_78%_35%,rgba(255,255,255,0.2),transparent_42%),linear-gradient(145deg,#cdd8d3,#bfd0cb)]" />

            <div className="absolute -left-20 top-8 h-[120%] w-[26px] rotate-[18deg] rounded-full bg-[#ded2bc]/60" />
            <div className="absolute left-[22%] -top-14 h-[130%] w-[14px] rotate-[8deg] rounded-full bg-[#ddd0b8]/50" />
            <div className="absolute right-[12%] -top-20 h-[140%] w-[16px] rotate-[-10deg] rounded-full bg-[#ddd0b8]/40" />
            <div className="absolute inset-x-[-8%] top-[32%] h-[10px] rotate-[12deg] rounded-full bg-[#d7ccb6]/35" />
            <div className="absolute inset-x-[8%] top-[52%] h-[8px] rotate-[-6deg] rounded-full bg-[#d7ccb6]/35" />

            <Marker className="left-[25%] top-[29%]" />
            <Marker className="left-[63%] top-[56%]" />
            <Marker className="left-[78%] top-[36%]" />

            <div className="absolute bottom-4 left-4 right-4 rounded-2xl bg-white/95 px-4 py-3 shadow-[0_16px_28px_rgba(0,0,0,0.16)] sm:bottom-6 sm:left-6 sm:right-auto sm:flex sm:items-center sm:gap-5 sm:px-5 sm:py-4">
              <div>
                <p className="text-[10px] font-bold uppercase tracking-[0.12em] text-[#f29a1f]">Current Location</p>
                <p className="mt-1 text-lg font-extrabold leading-tight text-[#111827] sm:text-[26px] sm:leading-[1.05]">
                  3 Active Zones
                  <br />
                  Nearby
                </p>
              </div>
              <button className="mt-3 rounded-full bg-[#ff8f00] px-4 py-2 text-xs font-bold text-white shadow-[0_8px_16px_rgba(255,143,0,0.35)] sm:mt-0 sm:px-5 sm:text-sm">
                Details
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
