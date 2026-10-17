import { Combobox as ComboboxPrimitive } from "@base-ui/react/combobox";
import * as React from "react";

import { CaretDownIcon, CheckIcon, XIcon } from "../../icons";

export interface ComboboxItem<Value> {
  label: string;
  value: Value;
}

export type ComboboxProps<Value> =
  MultiSelectComboboxProps<Value> | SingleSelectComboboxProps<Value>;

interface ComboboxBaseProps<Value> {
  items: readonly ComboboxItem<Value>[];
  label: string;
  placeholder?: string;
}

interface MultiSelectComboboxProps<Value> extends ComboboxBaseProps<Value> {
  defaultValue?: ComboboxItem<Value>[];
  multiple: true;
  onValueChange?: (value: ComboboxItem<Value>[]) => void;
  value?: ComboboxItem<Value>[];
}

interface SingleSelectComboboxProps<Value> extends ComboboxBaseProps<Value> {
  defaultValue?: ComboboxItem<Value> | null;
  multiple?: false;
  onValueChange?: (value: ComboboxItem<Value> | null) => void;
  value?: ComboboxItem<Value> | null;
}

export function Combobox<Value>(
  props: ComboboxProps<Value>,
): React.JSX.Element {
  return props.multiple ? (
    <MultiSelectCombobox {...props} />
  ) : (
    <SingleSelectCombobox {...props} />
  );
}

function ComboboxOptions<Value>({
  items,
}: {
  items: readonly ComboboxItem<Value>[];
}): React.JSX.Element {
  return (
    <ComboboxPrimitive.Portal>
      <ComboboxPrimitive.Positioner className="z-50" sideOffset={4}>
        <ComboboxPrimitive.Popup className="w-[var(--anchor-width)] max-w-[var(--available-width)] origin-[var(--transform-origin)] rounded-xl border border-ddf-blue-600 bg-ddf-blue-950 text-neutral-100 shadow-lg shadow-black/30 transition-[scale,opacity] duration-100 data-ending-style:scale-95 data-ending-style:opacity-0 data-starting-style:scale-95 data-starting-style:opacity-0">
          <ComboboxPrimitive.Empty>
            <div className="px-3 py-4 text-sm leading-4 text-neutral-400">
              Keine Optionen gefunden.
            </div>
          </ComboboxPrimitive.Empty>
          <ComboboxPrimitive.List className="max-h-[min(22.5rem,var(--available-height))] scroll-py-1 overflow-y-auto overscroll-contain p-1 data-empty:p-0">
            {items.map((item) => (
              <ComboboxPrimitive.Item
                className="grid cursor-default grid-cols-[1rem_1fr] items-center gap-2 rounded-lg p-2 text-sm leading-4 select-none data-highlighted:bg-ddf-blue-600 data-highlighted:text-white data-selected:bg-ddf-blue-700 data-selected:text-ddf-blue-100 data-selected:data-highlighted:bg-ddf-blue-600 data-selected:data-highlighted:text-white"
                key={getItemKey(item)}
                value={item}
              >
                <ComboboxPrimitive.ItemIndicator className="col-start-1 text-ddf-blue-300">
                  <CheckIcon />
                </ComboboxPrimitive.ItemIndicator>
                <span className="col-start-2">{item.label}</span>
              </ComboboxPrimitive.Item>
            ))}
          </ComboboxPrimitive.List>
        </ComboboxPrimitive.Popup>
      </ComboboxPrimitive.Positioner>
    </ComboboxPrimitive.Portal>
  );
}

function getItemKey<Value>(item: ComboboxItem<Value>): string {
  return JSON.stringify(item.value);
}

function isSameComboboxItem<Value>(
  item: ComboboxItem<Value>,
  selectedItem: ComboboxItem<Value>,
): boolean {
  return Object.is(item.value, selectedItem.value);
}

function MultiSelectCombobox<Value>({
  defaultValue,
  items,
  label,
  multiple,
  onValueChange,
  placeholder,
  value,
}: MultiSelectComboboxProps<Value>): React.JSX.Element {
  const id = React.useId();

  return (
    <ComboboxPrimitive.Root<ComboboxItem<Value>, true, ComboboxItem<Value>>
      defaultValue={defaultValue}
      isItemEqualToValue={isSameComboboxItem}
      items={items}
      multiple={multiple}
      onValueChange={onValueChange}
      value={value}
    >
      <div className="flex max-w-md flex-col gap-1 text-sm leading-5 font-bold text-neutral-100">
        <label htmlFor={id}>{label}</label>
        <ComboboxPrimitive.InputGroup className="flex min-h-8 w-full cursor-text flex-wrap items-center gap-0.5 rounded-lg border border-neutral-400 bg-transparent px-2 py-1 focus-within:[outline:auto]">
          <ComboboxPrimitive.Value>
            {(selectedItems: ComboboxItem<Value>[]) => (
              <ComboboxPrimitive.Chips
                aria-label={label}
                className="flex min-w-0 flex-1 flex-wrap items-center gap-1"
              >
                {selectedItems.map((item) => (
                  <ComboboxPrimitive.Chip
                    aria-description="Drücke die Rücktaste oder Entf, um den Eintrag zu entfernen."
                    aria-label={item.label}
                    className="flex min-h-[calc(1.5rem-2px)] cursor-default items-center gap-1 overflow-hidden rounded-md bg-ddf-blue-700 py-0 pr-[0.2rem] pl-[0.4rem] text-sm leading-none text-ddf-blue-100 data-highlighted:bg-ddf-blue-600 data-highlighted:text-white"
                    key={getItemKey(item)}
                  >
                    {item.label}
                    <ComboboxPrimitive.ChipRemove
                      aria-label={`${item.label} entfernen`}
                      className="flex size-4 items-center justify-center rounded-sm border-0 bg-transparent p-0 text-inherit hover:bg-ddf-blue-500/30"
                    >
                      <XIcon />
                    </ComboboxPrimitive.ChipRemove>
                  </ComboboxPrimitive.Chip>
                ))}
                <ComboboxPrimitive.Input
                  aria-description={
                    selectedItems.length > 0
                      ? `${selectedItems.length.toString()} ausgewählt. Drücke am Anfang des Eingabefelds die Pfeil-nach-links-Taste, um zu den ausgewählten Einträgen zu springen.`
                      : undefined
                  }
                  className="h-[calc(1.5rem-2px)] min-w-12 flex-1 border-0 bg-transparent p-0 text-sm font-normal text-neutral-100 outline-none placeholder:text-neutral-400 any-pointer-coarse:text-base"
                  id={id}
                  placeholder={selectedItems.length > 0 ? "" : placeholder}
                />
              </ComboboxPrimitive.Chips>
            )}
          </ComboboxPrimitive.Value>
          <ComboboxPrimitive.Trigger
            aria-label="Optionen öffnen"
            className="flex h-6 w-6 shrink-0 items-center justify-center rounded-md border-0 bg-transparent p-0 text-neutral-300 hover:bg-ddf-blue-700 hover:text-white"
          >
            <CaretDownIcon />
          </ComboboxPrimitive.Trigger>
        </ComboboxPrimitive.InputGroup>
      </div>

      <ComboboxOptions items={items} />
    </ComboboxPrimitive.Root>
  );
}

function SingleSelectCombobox<Value>({
  defaultValue,
  items,
  label,
  multiple,
  onValueChange,
  placeholder,
  value,
}: SingleSelectComboboxProps<Value>): React.JSX.Element {
  const id = React.useId();

  return (
    <ComboboxPrimitive.Root<ComboboxItem<Value>, false, ComboboxItem<Value>>
      defaultValue={defaultValue}
      isItemEqualToValue={isSameComboboxItem}
      items={items}
      multiple={multiple}
      onValueChange={onValueChange}
      value={value}
    >
      <div className="relative flex flex-col gap-1 text-sm leading-5 font-bold text-neutral-100">
        <label htmlFor={id}>{label}</label>
        <ComboboxPrimitive.InputGroup className="relative h-8 w-56 rounded-lg border border-neutral-400 bg-transparent focus-within:[outline:auto] [&>input]:pr-[calc(0.5rem+2rem)] has-[.combobox-clear]:[&>input]:pr-[calc(0.5rem+2rem*2)]">
          <ComboboxPrimitive.Input
            className="h-full w-full rounded-lg border-0 bg-transparent pl-2 text-sm font-normal text-neutral-100 outline-none placeholder:text-neutral-400 any-pointer-coarse:text-base"
            id={id}
            placeholder={placeholder}
          />
          <div className="absolute right-0 bottom-0 flex h-full items-center justify-center">
            <ComboboxPrimitive.Clear
              aria-label="Auswahl löschen"
              className="combobox-clear flex h-full w-6 items-center justify-center rounded-md border-0 bg-transparent p-0 text-neutral-300 hover:bg-ddf-blue-700 hover:text-white"
            >
              <XIcon />
            </ComboboxPrimitive.Clear>
            <ComboboxPrimitive.Trigger
              aria-label="Optionen öffnen"
              className="flex h-full w-6 items-center justify-center rounded-md border-0 bg-transparent p-0 text-neutral-300 hover:bg-ddf-blue-700 hover:text-white"
            >
              <CaretDownIcon />
            </ComboboxPrimitive.Trigger>
          </div>
        </ComboboxPrimitive.InputGroup>
      </div>

      <ComboboxOptions items={items} />
    </ComboboxPrimitive.Root>
  );
}
