"use client";

import type { ReactNode } from "react";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup } from "@base-ui/react/toggle-group";
import { cn } from "tailwind-variants";

export interface SortSelectorProps<Value extends string> {
  "aria-label": string;
  className?: string;
  disabled?: boolean;
  onValueChange: (value: Value) => void;
  options: readonly SortSelectorOption<Value>[];
  value: Value;
}

interface SortSelectorOption<Value extends string> {
  disabled?: boolean;
  label: ReactNode;
  value: Value;
}

export function SortSelector<Value extends string>({
  "aria-label": ariaLabel,
  className,
  disabled,
  onValueChange,
  options,
  value,
}: SortSelectorProps<Value>) {
  return (
    <ToggleGroup
      aria-label={ariaLabel}
      className={cn(
        "inline-flex max-w-full flex-wrap rounded-xl border border-white/15 p-1",
        className,
      )}
      disabled={disabled}
      onValueChange={(values) => {
        const option = options.find((option) => option.value === values[0]);
        // Sorting always needs a selection, even when the active toggle is clicked.
        if (option && option.value !== value) {
          onValueChange(option.value);
        }
      }}
      value={[value]}
    >
      {options.map((option) => (
        <Toggle
          className="min-h-10 flex-1 cursor-pointer rounded-lg px-4 text-sm font-semibold text-white/80 transition hover:not-data-disabled:not-data-pressed:bg-white/10 hover:not-data-disabled:not-data-pressed:text-white focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-sky-300 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:bg-white data-pressed:text-sky-700 data-pressed:shadow-sm sm:flex-none"
          disabled={option.disabled}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroup>
  );
}
