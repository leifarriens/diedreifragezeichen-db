"use client";

import { useMemo, useState } from "react";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";
import { FolgenGridSearch } from "@/components/folgen-grid/folgen-grid-search";
import { createFolgenFilter } from "@/lib/folgen-filter";
import { type BookmarkDateSortOption, sortFolgen } from "@/lib/folgen-sort";
import { useHydrateFolgenWithUserData } from "@/lib/use-hydrate-folgen-with-user-data";

export function BookmarksList({
  folgen,
}: {
  folgen: FolgeWithCommunityRating[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<BookmarkDateSortOption>({
    by: "bookmarkedAt",
    order: "newest",
  });

  const hydratedFolgen = useHydrateFolgenWithUserData(folgen);

  const filteredFolgen = useMemo(
    () => createFolgenFilter(hydratedFolgen).search(searchTerm).results(),
    [hydratedFolgen, searchTerm],
  );

  const sortedFolgen = useMemo(
    () => sortFolgen(filteredFolgen, sortOption),
    [filteredFolgen, sortOption],
  );

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FolgenGridSearch onChange={setSearchTerm} value={searchTerm} />

        <div
          aria-label="Sortierung der Lesezeichen"
          className="inline-flex rounded-xl border border-white/15 p-1"
          role="group"
        >
          <button
            aria-pressed={sortOption.order === "newest"}
            className="min-h-10 rounded-lg px-4 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white aria-pressed:bg-white aria-pressed:text-sky-700 aria-pressed:shadow-sm"
            onClick={() => {
              setSortOption({ by: "bookmarkedAt", order: "newest" });
            }}
            type="button"
          >
            Neueste zuerst
          </button>
          <button
            aria-pressed={sortOption.order === "oldest"}
            className="min-h-10 rounded-lg px-4 text-sm font-semibold text-white/80 transition hover:bg-white/10 hover:text-white aria-pressed:bg-white aria-pressed:text-sky-700 aria-pressed:shadow-sm"
            onClick={() => {
              setSortOption({ by: "bookmarkedAt", order: "oldest" });
            }}
            type="button"
          >
            Älteste zuerst
          </button>
        </div>
      </div>

      <FolgenGrid>
        {sortedFolgen.map((folge) => (
          <FolgenGridItem
            folge={folge}
            isBookmarked={folge.isBookmarked}
            key={folge.id}
            userRating={folge.userRating}
          />
        ))}
      </FolgenGrid>
    </section>
  );
}
