"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { createFolgenFilter } from "@ddfdb/core";
import { useMemo } from "react";

import { MultiRangeInput } from "@/components/ui/multi-range-input/multi-range-input";
import { SortSelector } from "@/components/ui/sort-selector/sort-selector";
import { Switch } from "@/components/ui/switch";
import { Wrapper } from "@/components/ui/wrapper";
import { FIRST_RELEASE_YEAR } from "@/features/archive/archive-filters";
import { useArchiveFilters } from "@/features/archive/components/archive-filters-provider";
import { sortArchiveFolgen } from "@/features/archive/sort-archive-folgen";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { FolgenGridEmpty } from "@/features/folgen/folgen-grid/folgen-grid-empty";
import { FolgenGridItem } from "@/features/folgen/folgen-grid/folgen-grid-item";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

interface ArchiveBrowserProps {
  folgen: FolgeWithCommunityRating[];
}

export default function ArchiveBrowser({ folgen }: ArchiveBrowserProps) {
  const { currentYear, filters, updateFilters } = useArchiveFilters();
  const { includeSpecials, searchTerm, sortOrder, yearRange } = filters;

  const hydratedFolgen = useHydrateFolgenWithUserData(folgen);

  const filteredFolgen = useMemo(() => {
    const includesAllReleaseYears =
      yearRange.min === FIRST_RELEASE_YEAR && yearRange.max === currentYear;

    return createFolgenFilter(hydratedFolgen)
      .search(searchTerm)
      .showSpecials(includeSpecials)
      .yearRange({
        endYear: includesAllReleaseYears ? null : yearRange.max,
        startYear: includesAllReleaseYears ? null : yearRange.min,
      })
      .results();
  }, [
    currentYear,
    hydratedFolgen,
    includeSpecials,
    searchTerm,
    yearRange.max,
    yearRange.min,
  ]);

  const sortedFolgen = useMemo(
    () => sortArchiveFolgen(filteredFolgen, sortOrder),
    [filteredFolgen, sortOrder],
  );

  const displayedFolgen = sortedFolgen;

  return (
    <Wrapper>
      <section aria-label="Archivfilter" className="mb-6">
        <div className="grid gap-5 lg:grid-cols-[auto_minmax(260px,1fr)_auto] lg:items-center">
          <SortSelector
            aria-label="Sortierung im Archiv"
            className="w-full sm:w-auto"
            onValueChange={(sortOrder) => {
              updateFilters({ sortOrder });
            }}
            options={[
              { label: "Neueste", value: "newest" },
              { label: "Älteste", value: "oldest" },
              { label: "Beste", value: "rating" },
              { label: "Beliebteste", value: "popularity" },
            ]}
            value={sortOrder}
          />

          <MultiRangeInput
            debounceMs={200}
            max={currentYear}
            maxAriaLabel="Spätestes Erscheinungsjahr"
            min={FIRST_RELEASE_YEAR}
            minAriaLabel="Frühestes Erscheinungsjahr"
            onChange={(yearRange) => {
              updateFilters({ yearRange });
            }}
            value={yearRange}
          />

          <Switch
            checked={includeSpecials}
            label="Specials anzeigen"
            onCheckedChange={(checked) => {
              updateFilters({ includeSpecials: checked });
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
        {searchTerm && (
          <button
            className="text-sm font-medium text-sky-300 transition hover:text-sky-200"
            onClick={() => {
              updateFilters({ searchTerm: "" });
            }}
            type="button"
          >
            Suche zurücksetzen
          </button>
        )}
      </div>

      {displayedFolgen.length === 0 ? (
        <FolgenGridEmpty
          description="Ändere deine Suche oder passe die Filter an."
          title="Keine Folgen gefunden"
        />
      ) : (
        <section aria-label="Folgen im Archiv">
          <FolgenGrid>
            {displayedFolgen.map((folge) => (
              <FolgenGridItem
                folge={folge}
                hasListened={folge.hasListened}
                isBookmarked={folge.isBookmarked}
                key={folge.id}
                userRating={folge.userRating}
              />
            ))}
          </FolgenGrid>
        </section>
      )}
    </Wrapper>
  );
}
