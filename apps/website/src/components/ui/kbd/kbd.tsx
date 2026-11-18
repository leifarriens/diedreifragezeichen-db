import type { ComponentProps } from "react";

import { cn } from "tailwind-variants";

export type KbdProps = ComponentProps<"kbd">;

export function Kbd({ className, ...props }: KbdProps) {
  return (
    <kbd
      className={cn(
        "inline-flex min-h-5 min-w-5 items-center justify-center rounded border border-neutral-600 bg-white/5 px-1 font-mono text-[0.625rem] leading-none font-medium text-neutral-300",
        className,
      )}
      {...props}
    />
  );
}
