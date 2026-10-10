"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import {
  type BookmarkDateSortOption,
  createFolgenFilter,
  sortFolgen,
} from "@ddfdb/core";
import { useMemo, useState } from "react";

import { SortSelector } from "@/components/ui/sort-selector/sort-selector";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/features/folgen/folgen-grid/folgen-grid-item";
import { FolgenGridSearch } from "@/features/folgen/folgen-grid/folgen-grid-search";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

export function UserBookmarkedFolgen({
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

  const displayedFolgen = sortedFolgen;

  return (
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
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

        <FolgenGridSearch onChange={setSearchTerm} value={searchTerm} />
      </div>

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
  );
}
