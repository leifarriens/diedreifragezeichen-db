import type { ComponentProps } from "react";

import { cn } from "tailwind-variants";

export function Card({ children, className, ...rest }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border-blue-900/30 bg-blue-400/10 px-10 py-8 text-lg text-neutral-200 shadow-lg backdrop-brightness-50",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
