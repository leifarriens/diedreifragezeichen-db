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
      className={cn("inline-flex max-w-full flex-wrap", className)}
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
          className="min-h-10 flex-1 cursor-pointer border-x border-y border-neutral-100 px-4 text-xs font-semibold text-neutral-100 transition first-of-type:rounded-l-lg first-of-type:border-l last-of-type:rounded-r-lg last-of-type:border-r hover:not-data-disabled:not-data-pressed:bg-neutral-100 hover:not-data-disabled:not-data-pressed:text-[#001727] focus-visible:relative focus-visible:z-10 focus-visible:outline-2 focus-visible:outline-offset-2 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:bg-neutral-100 data-pressed:text-[#001727] sm:flex-none sm:text-base"
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
