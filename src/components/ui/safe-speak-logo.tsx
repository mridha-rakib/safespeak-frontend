import Image from "next/image";

import tickSign from "@/assets/tickSign.svg?url";
import { cn } from "@/lib/utils";

type LogoVariant = "full" | "mark";
type LogoTone = "brand" | "light";
type LogoSize = "sm" | "md" | "lg";

const logoSizeMap: Record<
  LogoSize,
  {
    text: string;
    tick: number;
  }
> = {
  sm: {
    text: "text-[1.5rem]",
    tick: 20,
  },
  md: {
    text: "text-[1.75rem]",
    tick: 23,
  },
  lg: {
    text: "text-[2rem]",
    tick: 26,
  },
};

export function SafeSpeakLogo({
  variant = "full",
  tone = "brand",
  size = "md",
  className,
  textClassName,
}: {
  variant?: LogoVariant;
  tone?: LogoTone;
  size?: LogoSize;
  className?: string;
  textClassName?: string;
}) {
  const { tick, text } = logoSizeMap[size];
  const toneClass = tone === "brand" ? "text-[#0b5fa6]" : "text-white";

  if (variant === "mark") {
    return (
      <Image
        src={tickSign}
        alt="SafeSpeak tick"
        width={tick}
        height={tick}
        className={cn("shrink-0", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        "inline-flex flex-col font-extrabold leading-none tracking-normal",
        text,
        toneClass,
        className,
        textClassName
      )}
    >
      <div className="flex items-start gap-0.5 leading-none">
        <span>Safe</span>
        <Image
          src={tickSign}
          alt="SafeSpeak tick"
          width={tick}
          height={tick}
          className="shrink-0"
        />
      </div>
      <span className="leading-none">Speak</span>
    </div>
  );
}
