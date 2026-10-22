"use client";

import type { ReactNode } from "react";

import { Toggle } from "@base-ui/react/toggle";
import { ToggleGroup as ToggleGroupPrimitive } from "@base-ui/react/toggle-group";
import { cn } from "tailwind-variants";

export interface ToggleGroupProps<Value extends string = string> {
  "aria-label": string;
  className?: string;
  disabled?: boolean;
  onValueChange: (value: Value) => void;
  options: readonly ToggleGroupOption<Value>[];
  value: Value;
}

interface ToggleGroupOption<Value extends string> {
  disabled?: boolean;
  label: ReactNode;
  value: Value;
}

export function ToggleGroup<Value extends string = string>({
  "aria-label": ariaLabel,
  className,
  disabled,
  onValueChange,
  options,
  value,
}: ToggleGroupProps<Value>) {
  return (
    <ToggleGroupPrimitive
      aria-label={ariaLabel}
      className={cn("inline-flex max-w-full flex-wrap", className)}
      disabled={disabled}
      onValueChange={(values) => {
        const option = options.find((option) => option.value === values[0]);
        // ToggleGroup always needs a selection, even when the active toggle is clicked.
        if (option && option.value !== value) {
          onValueChange(option.value);
        }
      }}
      value={[value]}
    >
      {options.map((option) => (
        <Toggle
          className="min-h-10 flex-1 cursor-pointer border-x border-y border-neutral-100 px-5 text-xs font-semibold text-neutral-100 transition first-of-type:rounded-l-lg first-of-type:border-l last-of-type:rounded-r-lg last-of-type:border-r hover:not-data-disabled:not-data-pressed:bg-neutral-100 hover:not-data-disabled:not-data-pressed:text-[#001727] focus-visible:relative focus-visible:z-10 data-disabled:cursor-not-allowed data-disabled:opacity-50 data-pressed:bg-neutral-100 data-pressed:text-[#001727] sm:text-sm lg:flex-none"
          disabled={option.disabled}
          key={option.value}
          value={option.value}
        >
          {option.label}
        </Toggle>
      ))}
    </ToggleGroupPrimitive>
  );
}
