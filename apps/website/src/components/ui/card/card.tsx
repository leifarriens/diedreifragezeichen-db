import type { ComponentProps } from "react";

import { cn } from "tailwind-variants";

export function Card({ children, className, ...rest }: ComponentProps<"div">) {
  return (
    <div
      className={cn(
        "rounded-xl border border-blue-900/20 bg-blue-400/10 px-6 py-4 text-lg text-neutral-200 shadow-lg backdrop-brightness-50 md:px-10 md:py-8",
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  );
}
