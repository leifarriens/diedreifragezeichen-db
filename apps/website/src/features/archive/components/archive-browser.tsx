"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { type SearchSort, useSearch } from "@ddfdb/client";
import { useMemo } from "react";

import { CURRENT_YEAR } from "@/app/constants";
import { MultiRangeInput } from "@/components/ui/multi-range-input/multi-range-input";
import { Switch } from "@/components/ui/switch";
import { ToggleGroup } from "@/components/ui/toggle-group/toggle-group";
import { Wrapper } from "@/components/ui/wrapper";
import { FIRST_RELEASE_YEAR } from "@/features/archive/archive-filters";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

import { useArchiveSearchState } from "../context/archive-search-state-provider";

interface ArchiveBrowserProps {
  folgen: FolgeWithCommunityRating[];
}

export default function ArchiveBrowser({ folgen }: ArchiveBrowserProps) {
  const { searchCriteria, state, updateState } = useArchiveSearchState();

  const searchQuery = useSearch(folgen, searchCriteria);
  const initialResults = useMemo(
    () => filterArchiveFolgen(folgen, searchCriteria),
    [folgen, searchCriteria],
  );

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? initialResults,
  );

  const displayedFolgen = hydratedFolgen;

  const includeSpecials = state.collections.length === 0;

  return (
    <Wrapper>
      <section aria-label="Archivfilter" className="mb-6">
        <div className="grid gap-5 lg:grid-cols-[auto_minmax(260px,1fr)_auto] lg:items-center">
          <ToggleGroup
            aria-label="Sortierung im Archiv"
            className="w-full sm:w-auto"
            onValueChange={(sort) => {
              updateState({ sort });
            }}
            options={sortOptions}
            value={state.sort}
          />

          <MultiRangeInput
            debounceMs={200}
            max={CURRENT_YEAR}
            maxAriaLabel="Spätestes Erscheinungsjahr"
            min={FIRST_RELEASE_YEAR}
            minAriaLabel="Frühestes Erscheinungsjahr"
            onChange={(yearRange) => {
              updateState({ yearRange });
            }}
            value={state.yearRange}
          />

          <Switch
            checked={includeSpecials}
            label="Specials anzeigen"
            onCheckedChange={(checked) => {
              updateState({
                collections: checked ? [] : ["serie"],
              });
            }}
          />
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-slate-300">
          <span className="font-semibold text-white">
            {displayedFolgen.length}
          </span>{" "}
          {displayedFolgen.length === 1 ? "Folge" : "Folgen"}
          {includeSpecials && (
            <span className="text-slate-400"> inklusive Specials</span>
          )}
        </p>
        {state.term && (
          <button
            className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
            onClick={() => {
              updateState({ term: "" });
            }}
            type="button"
          >
            Suche zurücksetzen
          </button>
        )}
      </div>

      <FolgenGrid
        emptyMessage={{
          description: "Ändere deine Suche oder passe die Filter an.",
          title: "Keine Folgen gefunden",
        }}
        folgen={displayedFolgen}
      />
    </Wrapper>
  );
}

function filterArchiveFolgen(
  folgen: FolgeWithCommunityRating[],
  criteria: ReturnType<typeof useArchiveSearchState>["searchCriteria"],
) {
  const filters = criteria.filters;
  const term = criteria.term?.trim().toLocaleLowerCase("de-DE") ?? "";
  const matches = folgen.filter((folge) => {
    if (
      filters?.collections?.length &&
      !filters.collections.includes(folge.collection)
    ) {
      return false;
    }

    const releaseYear = folge.release_date
      ? Number(folge.release_date.slice(0, 4))
      : null;
    if (filters?.yearRange) {
      const coversAllYears =
        filters.yearRange.min === FIRST_RELEASE_YEAR &&
        filters.yearRange.max === CURRENT_YEAR;
      if (
        releaseYear === null
          ? !coversAllYears
          : releaseYear < filters.yearRange.min ||
            releaseYear > filters.yearRange.max
      ) {
        return false;
      }
    }

    if (term) {
      const searchableValues = [
        folge.title,
        folge.number?.toString() ?? "",
        releaseYear?.toString() ?? "",
      ];
      if (
        !searchableValues.some((value) =>
          value.toLocaleLowerCase("de-DE").includes(term),
        )
      ) {
        return false;
      }
    }

    return true;
  });

  return matches.toSorted((left, right) => {
    if (criteria.sort?.by === "communityRating") {
      const leftRating =
        left.communityRating?.score ?? Number.NEGATIVE_INFINITY;
      const rightRating =
        right.communityRating?.score ?? Number.NEGATIVE_INFINITY;
      return rightRating - leftRating;
    }

    const leftDate = left.release_date ?? "";
    const rightDate = right.release_date ?? "";
    return criteria.sort?.order === "ASC"
      ? leftDate.localeCompare(rightDate)
      : rightDate.localeCompare(leftDate);
  });
}

const sortOptions: { label: string; value: SearchSort }[] = [
  {
    label: "Neuste",
    value: "newest",
  },
  {
    label: "Älteste",
    value: "oldest",
  },
  {
    label: "Beste",
    value: "rating",
  },
];
