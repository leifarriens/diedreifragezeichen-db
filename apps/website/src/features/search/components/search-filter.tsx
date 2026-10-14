import type { SearchOptions } from "@ddfdb/archiv/contracts";
import type { SearchSort, SearchState } from "@ddfdb/client";

import { CURRENT_YEAR } from "@/app/constants";
import { Combobox, type ComboboxItem } from "@/components/ui/combobox/combobox";
import { MultiRangeInput } from "@/components/ui/multi-range-input/multi-range-input";
import { Select } from "@/components/ui/select/select";

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
  navigationRevision,
  onChange,
  state,
}: {
  availableOptions: SearchOptions;
  navigationRevision: number;
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
      <Combobox
        items={speakerOptions}
        label="Spechrollen"
        multiple
        onValueChange={(items) => {
          onChange({ speakers: items.map((item) => item.value) });
        }}
        placeholder="z.B. Dorette Hugo"
        value={speakerOptions.filter((item) =>
          state.speakers.includes(item.value),
        )}
      />
      <Combobox
        items={roleOptions}
        label="Rollen"
        multiple
        onValueChange={(items) => {
          onChange({ roles: items.map((item) => item.value) });
        }}
        placeholder="z.B. Hugenay"
        value={roleOptions.filter((item) => state.roles.includes(item.value))}
      />
      <Combobox
        items={authorOptions}
        label="Autoren"
        multiple
        onValueChange={(items) => {
          onChange({ authors: items.map((item) => item.value) });
        }}
        placeholder="z.B. André Marx"
        value={authorOptions.filter((item) =>
          state.authors.includes(item.value),
        )}
      />
      <Combobox
        items={scriptAuthorOptions}
        label="Drehbuchautoren"
        multiple
        onValueChange={(items) => {
          onChange({ scriptAuthors: items.map((item) => item.value) });
        }}
        placeholder="z.B. André Minninger"
        value={scriptAuthorOptions.filter((item) =>
          state.scriptAuthors.includes(item.value),
        )}
      />
      <Combobox
        items={collectionOptions}
        label="Kollektion"
        multiple
        onValueChange={(items) => {
          onChange({ collections: items.map((item) => item.value) });
        }}
        placeholder="z.B. Specials"
        value={collectionOptions.filter((item) =>
          state.collections.includes(item.value),
        )}
      />
      <MultiRangeInput
        debounceMs={200}
        key={navigationRevision}
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
