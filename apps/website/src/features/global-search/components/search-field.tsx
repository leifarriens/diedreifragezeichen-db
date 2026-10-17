import type { ReactNode } from "react";

import { cn } from "tailwind-variants";

import { Kbd } from "@/components/ui/kbd/kbd";

export const SEARCH_FIELD_CONTROL_CLASS_NAME =
  "h-full w-full rounded-xl border border-neutral-500 bg-transparent py-2 any-pointer-coarse:pr-4 pr-22 focus:pr-4 pl-10 text-base placeholder-gray-500 transition-colors hover:border-neutral-200 group-hover:border-neutral-200";

interface SearchFieldProps {
  children: ReactNode;
  className?: string | undefined;
  onClick?: () => void;
  platform: "macos" | "other";
}

export function SearchField({
  children,
  className,
  onClick,
  platform,
}: SearchFieldProps) {
  return (
    <div className={cn("group relative block", className)} onClick={onClick}>
      <span className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-neutral-500 transition-colors">
        <svg
          aria-hidden="true"
          className="size-6"
          fill="currentColor"
          height="32"
          viewBox="0 0 256 256"
          width="32"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path d="M229.66,218.34l-50.07-50.06a88.11,88.11,0,1,0-11.31,11.31l50.06,50.07a8,8,0,0,0,11.32-11.32ZM40,112a72,72,0,1,1,72,72A72.08,72.08,0,0,1,40,112Z" />
        </svg>
      </span>

      {children}

      <span
        aria-hidden="true"
        className="pointer-events-none absolute top-1/2 right-3 flex -translate-y-1/2 items-center gap-1 text-neutral-500 select-none group-focus-within:hidden any-pointer-coarse:hidden"
      >
        <Kbd>{platform === "macos" ? "⌘" : "Strg"}</Kbd>
        <span>+</span>
        <Kbd>K</Kbd>
      </span>
    </div>
  );
}
