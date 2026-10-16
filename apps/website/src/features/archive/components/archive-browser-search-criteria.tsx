import type { SearchOptions } from "@ddfdb/archiv/contracts";
import type { SearchSort, SearchState } from "@ddfdb/client";

import { l } from "@ddfdb/core/labels";

import { CURRENT_YEAR } from "@/app/constants";
import { Combobox, type ComboboxItem } from "@/components/ui/combobox/combobox";
import { MultiRangeInput } from "@/components/ui/multi-range-input/multi-range-input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup } from "@/components/ui/toggle-group/toggle-group";

import { FIRST_RELEASE_YEAR } from "../archive-filters";

interface ArchiveBrowserSearchCriteriaProps {
  availableOptions: SearchOptions;
  onChange: (updates: Partial<SearchState>) => void;
  showAdditionalFilters?: boolean;
  state: SearchState;
}

export function ArchiveBrowserSearchCriteria({
  availableOptions,
  onChange,
  showAdditionalFilters,
  state,
}: ArchiveBrowserSearchCriteriaProps) {
  const speakerOptions = toComboboxItems(availableOptions.speakers);
  const roleOptions = toComboboxItems(availableOptions.roles);
  const authorOptions = toComboboxItems(availableOptions.authors);
  const scriptAuthorOptions = toComboboxItems(availableOptions.script_authors);
  const collectionOptions = toComboboxItems(availableOptions.collections);

  const includeSpecials = state.collections.length === 0;

  return (
    <section aria-label="Archivfilter" className="mb-6">
      <div className="grid gap-5 lg:grid-cols-[auto_minmax(260px,1fr)_auto] lg:items-center">
        <ToggleGroup
          aria-label={l.ARCHIVE.SORTING.LABEL}
          className="w-full sm:w-auto"
          onValueChange={(sort) => {
            onChange({ sort });
          }}
          options={sortOptions}
          value={state.sort}
        />

        <MultiRangeInput
          debounceMs={200}
          max={CURRENT_YEAR}
          maxAriaLabel={l.ARCHIVE.SORTING.YEAR_MAX_LABEL}
          min={FIRST_RELEASE_YEAR}
          minAriaLabel={l.ARCHIVE.SORTING.YEAR_MIN_LABEL}
          onChange={(yearRange) => {
            onChange({ yearRange });
          }}
          value={state.yearRange}
        />

        <Switch
          checked={includeSpecials}
          label={l.ARCHIVE.SORTING.SHOW_SPECIALS}
          onCheckedChange={(checked) => {
            onChange({
              collections: checked ? [] : ["serie"],
            });
          }}
        />
      </div>

      {showAdditionalFilters && (
        <div className="flex gap-3">
          <Combobox
            items={speakerOptions}
            label="Sprechrollen"
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
            value={roleOptions.filter((item) =>
              state.roles.includes(item.value),
            )}
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
        </div>
      )}
    </section>
  );
}

function toComboboxItems<T extends string>(values: T[]): ComboboxItem<T>[] {
  return values.map((value) => ({ label: value, value }));
}

const sortOptions: { label: string; value: SearchSort }[] = [
  {
    label: l.ARCHIVE.SORTING.NEWEST_FIRST,
    value: "newest",
  },
  {
    label: l.ARCHIVE.SORTING.OLDEST_FIRST,
    value: "oldest",
  },
  {
    label: l.ARCHIVE.SORTING.HIGHEST_RATED_FIRST,
    value: "rating",
  },
];
