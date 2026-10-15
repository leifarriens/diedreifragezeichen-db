"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { useSearch } from "@ddfdb/client";
import { type BookmarkDateSortOption, sortFolgen } from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { useMemo, useState } from "react";

import { ToggleGroup } from "@/components/ui/toggle-group/toggle-group";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
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

  const searchQuery = useSearch(folgen, { term: searchTerm });

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );

  const sortedFolgen = useMemo(
    () => sortFolgen(hydratedFolgen, sortOption),
    [hydratedFolgen, sortOption],
  );

  const displayedFolgen = sortedFolgen;

  return (
    <section className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FolgenGridSearch
          onChange={setSearchTerm}
          placeholder={l.BOOKMARKS.SEARCH_PLACEHOLDER}
          value={searchTerm}
        />

        <ToggleGroup
          aria-label={l.BOOKMARKS.SORTING.LABEL}
          onValueChange={(order) => {
            setSortOption({ by: "bookmarkedAt", order });
          }}
          options={[
            { label: l.BOOKMARKS.SORTING.NEWEST_FIRST, value: "newest" },
            { label: l.BOOKMARKS.SORTING.OLDEST_FIRST, value: "oldest" },
          ]}
          value={sortOption.order}
        />
      </div>

      <FolgenGrid
        emptyMessage={{
          title:
            folgen.length === 0 ? l.BOOKMARKS.EMPTY_PLACEHOLDER : undefined,
        }}
        folgen={displayedFolgen}
      />
    </section>
  );
}
