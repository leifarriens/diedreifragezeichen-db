import type { NativeStackHeaderItem } from "expo-router";

interface HeaderSortMenuOption<Value extends string> {
  label: string;
  value: Value;
}

interface HeaderSortMenuProps<Value extends string> {
  onSortValueChange: (value: Value) => void;
  options: readonly HeaderSortMenuOption<Value>[];
  sortValue: Value;
}

export function buildHeaderSortMenu<Value extends string>({
  onSortValueChange,
  options,
  sortValue,
}: HeaderSortMenuProps<Value>): NativeStackHeaderItem[] {
  return [
    {
      icon: { name: "arrow.up.arrow.down", type: "sfSymbol" },
      label: "Sortieren",
      menu: {
        items: options.map((option) => {
          return {
            label: option.label,
            onPress: () => {
              onSortValueChange(option.value);
            },
            state:
              sortValue === option.value ? ("on" as const) : ("off" as const),
            type: "action" as const,
          };
        }),
      },
      type: "menu",
    },
  ];
}
