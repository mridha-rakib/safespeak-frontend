"use client";

const HOTSPOTS = [
  { left: "41%", top: "55%", size: "h-20 w-20" },
  { left: "56%", top: "38%", size: "h-16 w-16" },
  { left: "67%", top: "62%", size: "h-14 w-14" },
];

function Hotspot({
  left,
  top,
  size,
}: {
  left: string;
  top: string;
  size: string;
}) {
  return (
    <span
      className={`absolute ${size} -translate-x-1/2 -translate-y-1/2 rounded-full border-[3px] border-white bg-[#f29a1f]/85 shadow-[0_10px_24px_rgba(242,154,31,0.35)]`}
      style={{ left, top }}
      aria-hidden
    >
      <span className="absolute left-1/2 top-1/2 h-4 w-4 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white" />
    </span>
  );
}

function MapLine({ className }: { className: string }) {
  return <span className={`absolute rounded-full bg-white/40 ${className}`} />;
}

export default function LocalIntelligenceMap() {
  return (
    <div
      className="relative h-full w-full overflow-hidden bg-[linear-gradient(145deg,#b9d4cc_0%,#d7e4df_45%,#b8c9c4_100%)]"
      aria-label="Stylized local intelligence map with active nearby zones"
      role="img"
    >
      <div className="absolute inset-0 opacity-70">
        <MapLine className="left-[-8%] top-[20%] h-7 w-[62%] rotate-12" />
        <MapLine className="left-[34%] top-[18%] h-6 w-[80%] -rotate-[24deg]" />
        <MapLine className="left-[-6%] top-[70%] h-8 w-[74%] -rotate-[18deg]" />
        <MapLine className="left-[54%] top-[62%] h-7 w-[58%] rotate-[18deg]" />
        <MapLine className="left-[20%] top-[-10%] h-[120%] w-7 rotate-[18deg]" />
        <MapLine className="left-[76%] top-[-8%] h-[118%] w-6 -rotate-[12deg]" />
      </div>

      <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(255,255,255,0.16)_1px,transparent_1px),linear-gradient(0deg,rgba(255,255,255,0.16)_1px,transparent_1px)] bg-[size:72px_72px]" />

      {HOTSPOTS.map((hotspot) => (
        <Hotspot
          key={`${hotspot.left}-${hotspot.top}`}
          left={hotspot.left}
          top={hotspot.top}
          size={hotspot.size}
        />
      ))}

      <span
        className="absolute left-[50%] top-[50%] h-5 w-5 -translate-x-1/2 -translate-y-1/2 rounded-full border-4 border-white bg-[#01579b] shadow-[0_8px_18px_rgba(1,87,155,0.35)]"
        aria-hidden
      />
    </div>
  );
}
