import type { SearchOptions } from "@ddfdb/archiv/contracts";
import type { SearchSort, SearchState } from "@ddfdb/client";

import { CURRENT_YEAR } from "@/app/constants";
import { MultiRangeInput } from "@/components/ui/multi-range-input/multi-range-input";
import { Select } from "@/components/ui/select/select";

import type { ComboboxItem } from "./combobox";

import MultiCombobox from "./combobox";

const sortOptions: ComboboxItem<SearchSort>[] = [
  {
    label: "Neuste zuerst",
    value: "newest",
  },
  {
    label: "Älteste zuerst",
    value: "oldest",
  },
  {
    label: "Beste zuerst",
    value: "rating",
  },
];

export function SearchFilters({
  availableOptions,
  onChange,
  state,
}: {
  availableOptions: SearchOptions;
  onChange: (updates: Partial<SearchState>) => void;
  state: SearchState;
}) {
  const speakerOptions = toComboboxItems(availableOptions.speakers);
  const roleOptions = toComboboxItems(availableOptions.roles);
  const authorOptions = toComboboxItems(availableOptions.authors);
  const scriptAuthorOptions = toComboboxItems(availableOptions.script_authors);
  const collectionOptions = toComboboxItems(availableOptions.collections);

  return (
    <div className="flex flex-wrap gap-2">
      <input
        className="rounded-xl border px-3 py-2"
        onChange={(e) => {
          onChange({ term: e.target.value });
        }}
        value={state.term}
      />
      <MultiCombobox
        label="Spechrollen"
        onValueChange={(items) => {
          onChange({ speakers: items.map((item) => item.value) });
        }}
        options={speakerOptions}
        placeholder="z.B. Dorette Hugo"
        value={speakerOptions.filter((item) =>
          state.speakers.includes(item.value),
        )}
      />
      <MultiCombobox
        label="Rollen"
        onValueChange={(items) => {
          onChange({ roles: items.map((item) => item.value) });
        }}
        options={roleOptions}
        placeholder="z.B. Hugenay"
        value={roleOptions.filter((item) => state.roles.includes(item.value))}
      />
      <MultiCombobox
        label="Autoren"
        onValueChange={(items) => {
          onChange({ authors: items.map((item) => item.value) });
        }}
        options={authorOptions}
        placeholder="z.B. André Marx"
        value={authorOptions.filter((item) =>
          state.authors.includes(item.value),
        )}
      />
      <MultiCombobox
        label="Drehbuchautoren"
        onValueChange={(items) => {
          onChange({ scriptAuthors: items.map((item) => item.value) });
        }}
        options={scriptAuthorOptions}
        placeholder="z.B. André Minninger"
        value={scriptAuthorOptions.filter((item) =>
          state.scriptAuthors.includes(item.value),
        )}
      />
      <MultiCombobox
        label="Kollektion"
        onValueChange={(items) => {
          onChange({ collections: items.map((item) => item.value) });
        }}
        options={collectionOptions}
        placeholder="z.B. Specials"
        value={collectionOptions.filter((item) =>
          state.collections.includes(item.value),
        )}
      />
      <MultiRangeInput
        debounceMs={200}
        max={CURRENT_YEAR}
        maxAriaLabel="Spätestes Erscheinungsjahr"
        min={1979}
        minAriaLabel="Frühestes Erscheinungsjahr"
        onChange={(yearRange) => {
          onChange({ yearRange });
        }}
        value={state.yearRange}
      />
      <Select
        defaultValue="newest"
        items={sortOptions}
        label="Sortieren nach"
        onValueChange={(sort) => {
          if (!sort) return;
          onChange({ sort });
        }}
        value={state.sort}
      />
    </div>
  );
}

function toComboboxItems<T extends string>(values: T[]): ComboboxItem<T>[] {
  return values.map((value) => ({ label: value, value }));
}
