import { Select as SelectPrimitive } from "@base-ui/react/select";

import {
  CaretDownIcon,
  CaretUpDownIcon,
  CaretUpIcon,
  CheckIcon,
} from "@/components/icons";

export function Select<Value, Multiple extends boolean | undefined = false>({
  items,
  label,
  placeholder,
  ...rest
}: SelectPrimitive.Root.Props<Value, Multiple> & {
  items: { label: string; value: Value }[];
  label: string;
  placeholder?: string;
}): React.JSX.Element {
  return (
    <SelectPrimitive.Root items={items} {...rest}>
      <div className="flex flex-col gap-1">
        <SelectPrimitive.Label className="cursor-default text-sm font-bold text-neutral-950 dark:text-white">
          {label}
        </SelectPrimitive.Label>
        <SelectPrimitive.Trigger className="flex h-8 min-w-40 items-center justify-between gap-3 border border-neutral-950 bg-white pr-1 pl-2 text-sm leading-none font-normal whitespace-nowrap text-neutral-950 select-none hover:not-data-disabled:bg-neutral-100 active:not-data-disabled:bg-neutral-200 disabled:border-neutral-500 disabled:text-neutral-500 data-disabled:border-neutral-500 data-disabled:text-neutral-500 data-pressed:bg-neutral-100 dark:border-white dark:bg-neutral-950 dark:text-white dark:hover:not-data-disabled:bg-neutral-800 dark:active:not-data-disabled:bg-neutral-700 dark:data-disabled:border-neutral-400 dark:data-disabled:text-neutral-400 dark:data-pressed:bg-neutral-800">
          <SelectPrimitive.Value
            className="data-placeholder:text-neutral-500 dark:data-placeholder:text-neutral-400"
            placeholder={placeholder}
          />
          <SelectPrimitive.Icon>
            <CaretUpDownIcon />
          </SelectPrimitive.Icon>
        </SelectPrimitive.Trigger>
      </div>

      <SelectPrimitive.Portal>
        <SelectPrimitive.Positioner className="z-10 select-none" sideOffset={4}>
          <SelectPrimitive.Popup className="group min-w-[var(--anchor-width)] origin-[var(--transform-origin)] border border-neutral-950 bg-white bg-clip-padding text-neutral-950 shadow-[0.25rem_0.25rem_0] shadow-black/12 transition-[scale,opacity] duration-100 ease-out data-ending-style:scale-[0.98] data-ending-style:opacity-0 data-starting-style:scale-[0.98] data-starting-style:opacity-0 data-[side=none]:min-w-[calc(var(--anchor-width)+1.75rem)] data-[side=none]:translate-y-px data-[side=none]:data-ending-style:transition-none data-[side=none]:data-starting-style:scale-100 data-[side=none]:data-starting-style:opacity-100 data-[side=none]:data-starting-style:transition-none dark:border-white dark:bg-neutral-950 dark:text-white dark:shadow-none">
            <SelectPrimitive.ScrollUpArrow className="top-0 z-[1] flex h-4 w-full cursor-default items-center justify-center bg-white text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:top-[-100%] dark:bg-neutral-950">
              <CaretUpIcon />
            </SelectPrimitive.ScrollUpArrow>
            <SelectPrimitive.List className="relative max-h-[var(--available-height)] scroll-py-6 overflow-y-auto py-1">
              {items.map(({ label, value }) => (
                <SelectPrimitive.Item
                  className="grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 py-1.5 pr-4 pl-2.5 text-sm select-none data-highlighted:bg-neutral-950 data-highlighted:text-white dark:data-highlighted:bg-white dark:data-highlighted:text-neutral-950"
                  key={label}
                  value={value}
                >
                  <SelectPrimitive.ItemIndicator className="col-start-1">
                    <CheckIcon />
                  </SelectPrimitive.ItemIndicator>
                  <SelectPrimitive.ItemText className="col-start-2">
                    {label}
                  </SelectPrimitive.ItemText>
                </SelectPrimitive.Item>
              ))}
            </SelectPrimitive.List>
            <SelectPrimitive.ScrollDownArrow className="bottom-0 z-[1] flex h-4 w-full cursor-default items-center justify-center bg-white text-center text-xs before:absolute before:left-0 before:h-full before:w-full before:content-[''] data-[side=none]:before:bottom-[-100%] dark:bg-neutral-950">
              <CaretDownIcon />
            </SelectPrimitive.ScrollDownArrow>
          </SelectPrimitive.Popup>
        </SelectPrimitive.Positioner>
      </SelectPrimitive.Portal>
    </SelectPrimitive.Root>
  );
}
