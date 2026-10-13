"use client";
import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import * as React from "react";

export interface ComboboxItem<T> {
  label: string;
  value: T;
}

interface ComboboxBaseProps {
  label: string;
  placeholder: string;
}

interface ComboboxProps<T> extends ComboboxBaseProps {
  onValueChange: (value: ComboboxItem<T> | null) => void;
  options: ComboboxItem<T>[];
  value: ComboboxItem<T> | null;
}

interface MultiComboboxProps<T> extends ComboboxBaseProps {
  onValueChange: (value: ComboboxItem<T>[]) => void;
  options: ComboboxItem<T>[];
  value: ComboboxItem<T>[];
}

export function Combobox<T>({
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: ComboboxProps<T>) {
  const id = React.useId();

  return (
    <ComboboxPrimitive.Root
      items={options}
      onValueChange={onValueChange}
      value={value}
    >
      <div className="relative flex flex-col gap-1 text-sm leading-5 font-bold text-neutral-950 dark:text-white">
        <label htmlFor={id}>{label}</label>
        <ComboboxPrimitive.InputGroup className="relative h-8 w-56 border border-neutral-950 bg-white focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-neutral-950 dark:border-white dark:bg-neutral-950 dark:focus-within:outline-white [&>input]:pr-[calc(0.5rem+2rem)] has-[.combobox-clear]:[&>input]:pr-[calc(0.5rem+2rem*2)]">
          <ComboboxPrimitive.Input
            className="h-full w-full border-0 bg-white pl-2 text-sm font-normal text-neutral-950 outline-none placeholder:text-neutral-500 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-400 any-pointer-coarse:text-base"
            id={id}
            placeholder={placeholder}
          />
          <div className="absolute right-0 bottom-0 flex h-full items-center justify-center text-neutral-500 dark:text-neutral-400">
            <ComboboxPrimitive.Clear
              aria-label="Clear selection"
              className="combobox-clear flex h-full w-6 items-center justify-center border-0 bg-transparent p-0 text-neutral-950 dark:text-white"
            >
              <XIcon />
            </ComboboxPrimitive.Clear>
            <ComboboxPrimitive.Trigger
              aria-label="Open popup"
              className="flex h-full w-6 items-center justify-center border-0 bg-transparent p-0 text-neutral-950 dark:text-white"
            >
              <CaretDownIcon />
            </ComboboxPrimitive.Trigger>
          </div>
        </ComboboxPrimitive.InputGroup>
      </div>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner className="outline-none" sideOffset={4}>
          <ComboboxPrimitive.Popup className="w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] border border-neutral-950 bg-white text-neutral-950 shadow-[0.25rem_0.25rem_0_rgb(0_0_0_/_12%)] transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none">
            <ComboboxPrimitive.Empty>
              <div className="py-4 pr-4 pl-2 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                No fruits found.
              </div>
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List className="max-h-[min(22.5rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain py-1 outline-0 data-empty:p-0">
              {(item: ComboboxItem<T>) => (
                <ComboboxPrimitive.Item
                  className="grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 p-2 text-sm leading-4 outline-none select-none data-highlighted:relative data-highlighted:z-0 data-highlighted:text-white data-highlighted:before:absolute data-highlighted:before:inset-0 data-highlighted:before:z-[-1] data-highlighted:before:bg-neutral-950 dark:data-highlighted:text-neutral-950 dark:data-highlighted:before:bg-white"
                  key={JSON.stringify(item.value)}
                  value={item}
                >
                  <ComboboxPrimitive.ItemIndicator className="col-start-1">
                    <CheckIcon />
                  </ComboboxPrimitive.ItemIndicator>
                  <span className="col-start-2">{item.label}</span>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}

export default function MultiCombobox<T>({
  label,
  onValueChange,
  options,
  placeholder,
  value,
}: MultiComboboxProps<T>) {
  const id = React.useId();

  return (
    <ComboboxPrimitive.Root
      items={options}
      multiple
      onValueChange={onValueChange}
      value={value}
    >
      <div className="flex max-w-md flex-col gap-1">
        <label
          className="flex flex-col gap-1 text-sm leading-5 font-bold text-neutral-950 dark:text-white"
          htmlFor={id}
        >
          {label}
        </label>
        <ComboboxPrimitive.InputGroup className="flex min-h-8 w-64 cursor-text flex-wrap items-center gap-0.5 border border-neutral-950 bg-white px-2 py-1 focus-within:outline-2 focus-within:-outline-offset-1 focus-within:outline-neutral-950 has-[button]:px-1 min-[32rem]:w-[22rem] dark:border-white dark:bg-neutral-950 dark:focus-within:outline-white">
          <ComboboxPrimitive.Value>
            {(value: ComboboxItem<T>[]) => (
              <ComboboxPrimitive.Chips
                aria-label={value.length > 0 ? "Selected languages" : undefined}
                className="flex w-full flex-wrap items-center gap-1"
              >
                {value.map((item) => (
                  <ComboboxPrimitive.Chip
                    aria-description="Press Backspace or Delete to remove"
                    aria-label={item.label}
                    className="group flex min-h-[calc(1.5rem-2px)] cursor-default items-center gap-1 overflow-hidden bg-neutral-100 py-0 pr-[0.2rem] pl-[0.4rem] text-sm leading-none text-neutral-950 outline-none focus-within:bg-neutral-950 focus-within:text-white dark:bg-neutral-800 dark:text-white dark:focus-within:bg-white dark:focus-within:text-neutral-950 [@media(hover:hover)]:data-highlighted:bg-neutral-950 [@media(hover:hover)]:data-highlighted:text-white dark:[@media(hover:hover)]:data-highlighted:bg-white dark:[@media(hover:hover)]:data-highlighted:text-neutral-950"
                    key={JSON.stringify(item.value)}
                  >
                    {item.label}
                    <ComboboxPrimitive.ChipRemove
                      aria-label={`Remove ${item.label}`}
                      className="flex size-4 items-center justify-center border-0 bg-transparent p-0 text-inherit hover:bg-neutral-200 group-focus-within:hover:bg-neutral-700 dark:hover:bg-neutral-700 dark:group-focus-within:hover:bg-neutral-200"
                    >
                      <XIcon />
                    </ComboboxPrimitive.ChipRemove>
                  </ComboboxPrimitive.Chip>
                ))}
                <ComboboxPrimitive.Input
                  aria-description={
                    value.length > 0
                      ? `${value.length.toString()} selected. From the start of the input, press Left Arrow to focus the selected items`
                      : undefined
                  }
                  className="h-[calc(1.5rem-2px)] min-w-12 flex-1 border-0 bg-white p-0 text-sm font-normal text-neutral-950 outline-none placeholder:text-neutral-500 dark:bg-neutral-950 dark:text-white dark:placeholder:text-neutral-400 any-pointer-coarse:text-base"
                  id={id}
                  placeholder={value.length > 0 ? "" : placeholder}
                />
              </ComboboxPrimitive.Chips>
            )}
          </ComboboxPrimitive.Value>
        </ComboboxPrimitive.InputGroup>
      </div>

      <ComboboxPrimitive.Portal>
        <ComboboxPrimitive.Positioner
          className="z-50 outline-none"
          sideOffset={4}
        >
          <ComboboxPrimitive.Popup className="max-h-[min(var(--available-height),24.5rem)] w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] overflow-y-auto overscroll-contain border border-neutral-950 bg-white py-1 text-neutral-950 shadow-[0.25rem_0.25rem_0_rgb(0_0_0_/_12%)] transition-[scale,opacity] data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0 dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none">
            <ComboboxPrimitive.Empty>
              <div className="py-2 pr-4 pl-2 text-sm leading-4 text-neutral-500 dark:text-neutral-400">
                No languages found.
              </div>
            </ComboboxPrimitive.Empty>
            <ComboboxPrimitive.List>
              {(item: ComboboxItem<T>) => (
                <ComboboxPrimitive.Item
                  className="grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 p-2 text-sm leading-4 outline-none select-none data-selected:relative data-selected:z-0 data-selected:text-neutral-950 data-selected:before:absolute data-selected:before:inset-0 data-selected:before:z-[-1] dark:data-selected:text-white [@media(hover:hover)]:data-highlighted:relative [@media(hover:hover)]:data-highlighted:z-0 [@media(hover:hover)]:data-highlighted:text-white [@media(hover:hover)]:data-highlighted:before:absolute [@media(hover:hover)]:data-highlighted:before:inset-0 [@media(hover:hover)]:data-highlighted:before:z-[-1] [@media(hover:hover)]:data-highlighted:before:bg-neutral-950 dark:[@media(hover:hover)]:data-highlighted:text-neutral-950 dark:[@media(hover:hover)]:data-highlighted:before:bg-white"
                  key={JSON.stringify(item.value)}
                  value={item}
                >
                  <ComboboxPrimitive.ItemIndicator className="col-start-1">
                    <CheckIcon />
                  </ComboboxPrimitive.ItemIndicator>
                  <span className="col-start-2">{item.label}</span>
                </ComboboxPrimitive.Item>
              )}
            </ComboboxPrimitive.List>
          </ComboboxPrimitive.Popup>
        </ComboboxPrimitive.Positioner>
      </ComboboxPrimitive.Portal>
    </ComboboxPrimitive.Root>
  );
}

function CaretDownIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="currentColor"
      height="16"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="M12 6H4l4 4.5z" />
    </svg>
  );
}

function CheckIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="m2.5 8.5 4 4 7-9" />
    </svg>
  );
}

function XIcon(props: React.ComponentProps<"svg">) {
  return (
    <svg
      fill="none"
      height="16"
      stroke="currentColor"
      strokeLinecap="square"
      strokeLinejoin="round"
      viewBox="0 0 16 16"
      width="16"
      {...props}
      style={{ display: "block", ...props.style }}
    >
      <path d="m4.5 4.5 7 7m-7 0 7-7" />
    </svg>
  );
}
