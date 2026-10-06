"use client";

import type { Folge } from "@ddfdb/archiv/contracts";
import type { ReactNode } from "react";

import { useMemo } from "react";
import { cn } from "tailwind-variants";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { FIRST_RELEASE_YEAR } from "@/components/archive/archive-filters";
import { useArchiveFilters } from "@/components/archive/archive-filters-provider";
import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";
import { Wrapper } from "@/components/layout/wrapper";
import { MultiRangeInput } from "@/components/multi-range-input/multi-range-input";
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
    const query = searchTerm.trim().toLocaleLowerCase("de-DE");
    const includeUnknownDates =
      yearRange.min === FIRST_RELEASE_YEAR && yearRange.max === currentYear;

    return hydratedFolgen
      .filter((folge) => {
        if (!includeSpecials && folge.collection === "spezial") return false;

        if (folge.release_date) {
          const year = Number(folge.release_date.slice(0, 4));
          if (year < yearRange.min || year > yearRange.max) return false;
        } else if (!includeUnknownDates) {
          return false;
        }

        if (!query) return true;

        return (
          folge.title.toLocaleLowerCase("de-DE").includes(query) ||
          (folge.number?.toString().includes(query) ?? false) ||
          (folge.release_date?.slice(0, 4).includes(query) ?? false)
        );
      })
      .sort((left, right) => compareReleaseDates(left, right, sortOrder));
  }, [
    currentYear,
    hydratedFolgen,
    includeSpecials,
    searchTerm,
    sortOrder,
    yearRange,
  ]);

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
            <div className="inline-flex w-full rounded-xl border border-white/15 p-1 sm:w-auto">
              <SortButton
                active={sortOrder === "newest"}
                onClick={() => {
                  updateFilters({ sortOrder: "newest" });
                }}
              >
                Neueste
              </SortButton>
              <SortButton
                active={sortOrder === "oldest"}
                onClick={() => {
                  updateFilters({ sortOrder: "oldest" });
                }}
              >
                Älteste
              </SortButton>
            </div>
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

          <label className="flex cursor-pointer items-center gap-3 self-end rounded-xl border border-white/10 px-3 py-3 transition hover:border-white/20 hover:bg-white/[0.03] lg:mb-0">
            <input
              checked={includeSpecials}
              className="peer sr-only"
              onChange={(event) => {
                updateFilters({ includeSpecials: event.target.checked });
              }}
              type="checkbox"
            />
            <span
              aria-hidden="true"
              className="relative h-6 w-11 rounded-full bg-white/20 transition peer-checked:bg-sky-500 peer-focus-visible:ring-2 peer-focus-visible:ring-sky-300 peer-focus-visible:ring-offset-2 peer-focus-visible:ring-offset-[#001727] after:absolute after:top-0.5 after:left-0.5 after:h-5 after:w-5 after:rounded-full after:bg-white after:shadow-sm after:transition peer-checked:after:translate-x-5"
            />
            <span className="text-sm font-medium">Specials anzeigen</span>
          </label>
        </div>
      </section>

      <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
        <p aria-live="polite" className="text-sm text-slate-300">
          <span className="font-semibold text-white">
            {filteredFolgen.length}
          </span>{" "}
          {filteredFolgen.length === 1 ? "Folge" : "Folgen"}
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
      ) : filteredFolgen.length === 0 ? (
        <section className="rounded-2xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
          <p className="text-lg font-semibold">Keine Folgen gefunden</p>
          <p className="mt-2 text-sm text-slate-400">
            Ändere deine Suche oder passe die Filter an.
          </p>
        </section>
      ) : (
        <section aria-label="Folgen im Archiv">
          <FolgenGrid>
            {filteredFolgen.map((folge) => (
              <FolgenGridItem
                folge={folge}
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

function compareReleaseDates(
  left: Folge,
  right: Folge,
  order: "newest" | "oldest",
) {
  const leftDate = left.release_date?.slice(0, 10) ?? "";
  const rightDate = right.release_date?.slice(0, 10) ?? "";

  if (leftDate !== rightDate) {
    if (!leftDate) return 1;
    if (!rightDate) return -1;
    return order === "newest"
      ? rightDate.localeCompare(leftDate)
      : leftDate.localeCompare(rightDate);
  }

  return left.title.localeCompare(right.title, "de");
}

function SortButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition sm:flex-none",
        active
          ? "bg-white text-sky-700 shadow-sm"
          : "text-white/80 hover:bg-white/10 hover:text-white",
      )}
      onClick={onClick}
      type="button"
    >
      {children}
    </button>
  );
}
