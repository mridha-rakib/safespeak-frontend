"use client";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type PresenceItem = {
  id: string;
  label: string;
  bgClassName: string;
  textClassName: string;
};

type UserPresenceAvatarProps = {
  className?: string;
  items?: PresenceItem[];
};

const DEFAULT_ITEMS: PresenceItem[] = [
  {
    id: "en",
    label: "EN",
    bgClassName: "bg-[#bfeee2]",
    textClassName: "text-[#04574b] font-semibold text-[14px]",
  },
  {
    id: "es",
    label: "ES",
    bgClassName: "bg-[#f86d63]",
    textClassName: "text-white font-semibold text-[14px]",
  },
  {
    id: "plus",
    label: "+",
    bgClassName: "bg-[#f5cf00]",
    textClassName: "text-[#075247] font-bold text-[14px]",
  },
];

function UserPresenceAvatar({
  className,
  items = DEFAULT_ITEMS,
}: UserPresenceAvatarProps) {
  return (
    <div className={cn("flex h-8 w-[252px] items-center gap-0", className)}>
      {items.map((item) => (
        <Avatar
          key={item.id}
          className={cn(
            "h-8 w-8 shrink-0 border-0 shadow-none",
            item.bgClassName
          )}
        >
          <AvatarFallback
            className={cn(
              "flex h-8 w-8 items-center justify-center rounded-full p-0 leading-none",
              item.bgClassName,
              item.textClassName
            )}
          >
            {item.label}
          </AvatarFallback>
        </Avatar>
      ))}
    </div>
  );
}

export { UserPresenceAvatar };
