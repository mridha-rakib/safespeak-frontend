import * as React from "react";

import { cn } from "@/lib/utils";

export type BadgeProps = React.HTMLAttributes<HTMLSpanElement>;

function Badge({ className, ...props }: BadgeProps) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border border-[#dbe5f0] bg-white px-3 py-1 text-[11px] font-semibold text-[#4b5563]",
        className,
      )}
      {...props}
    />
  );
}

export { Badge };

