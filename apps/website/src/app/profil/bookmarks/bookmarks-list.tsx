"use client";

import { useMemo, useState } from "react";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";
import { FolgenGridSearch } from "@/components/folgen-grid/folgen-grid-search";
import { SortSelector } from "@/components/sort-selector/sort-selector";
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

        <SortSelector
          aria-label="Sortierung der Lesezeichen"
          onValueChange={(order) => {
            setSortOption({ by: "bookmarkedAt", order });
          }}
          options={[
            { label: "Neueste zuerst", value: "newest" },
            { label: "Älteste zuerst", value: "oldest" },
          ]}
          value={sortOption.order}
        />
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
