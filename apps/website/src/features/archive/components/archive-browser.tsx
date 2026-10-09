"use client";

import { createFolgenFilter } from "@ddfdb/core";
import { useMemo } from "react";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";
import { Wrapper } from "@/components/layout/wrapper";
import { MultiRangeInput } from "@/components/multi-range-input/multi-range-input";
import { SortSelector } from "@/components/sort-selector/sort-selector";
import { Switch } from "@/components/ui/switch";
import { FIRST_RELEASE_YEAR } from "@/features/archive/archive-filters";
import { useArchiveFilters } from "@/features/archive/components/archive-filters-provider";
import { sortArchiveFolgen } from "@/features/archive/sort-archive-folgen";
import { useHydrateFolgenWithUserData } from "@/lib/use-hydrate-folgen-with-user-data";

interface ArchiveBrowserProps {
  archiveUnavailable: boolean;
  folgen: FolgeWithCommunityRating[];
}

export default function ArchiveBrowser({
  archiveUnavailable,
  folgen,
}: ArchiveBrowserProps) {
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
      <section
        aria-label="Archivfilter"
        className="mb-6 rounded-2xl border border-white/10 bg-white/[0.04] p-4 shadow-xl shadow-black/10 sm:p-5"
      >
        <div className="grid gap-5 lg:grid-cols-[auto_minmax(260px,1fr)_auto] lg:items-center">
          <div>
            <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Sortierung
            </span>
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
              ]}
              value={sortOrder}
            />
          </div>

          <div className="min-w-0">
            <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
              Erscheinungsjahr
            </span>
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
          </div>

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

      {archiveUnavailable ? (
        <section
          aria-labelledby="archive-error-title"
          className="rounded-2xl border border-amber-300/20 bg-amber-300/[0.06] px-6 py-12 text-center"
          role="alert"
        >
          <h2 className="text-xl font-semibold" id="archive-error-title">
            Das Archiv ist gerade nicht erreichbar
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm leading-6 text-slate-300">
            Die Folgen konnten nicht geladen werden. Bitte versuche es in einem
            Moment noch einmal.
          </p>
          <button
            className="mt-5 rounded-full border border-white/15 px-4 py-2 text-sm font-semibold transition hover:bg-white/10"
            onClick={() => {
              window.location.reload();
            }}
            type="button"
          >
            Erneut laden
          </button>
        </section>
      ) : displayedFolgen.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
          <p className="text-lg font-semibold">Keine Folgen gefunden</p>
          <p className="mt-2 text-sm text-slate-400">
            Ändere deine Suche oder passe die Filter an.
          </p>
        </section>
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
