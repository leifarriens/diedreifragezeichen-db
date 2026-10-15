"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { useSearch } from "@ddfdb/client";
import {
  sortFolgen,
  type UserRatingSortOption,
  type UserRatingUpdatedSortOption,
} from "@ddfdb/core";
import { l } from "@ddfdb/core/labels";
import { useMemo, useState } from "react";

import { ToggleGroup } from "@/components/ui/toggle-group/toggle-group";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { FolgenGridSearch } from "@/features/folgen/folgen-grid/folgen-grid-search";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

type UserRatedFolgenSortOption =
  UserRatingSortOption | UserRatingUpdatedSortOption;

export function UserRatedFolgen({
  folgen,
}: {
  folgen: FolgeWithCommunityRating[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<UserRatedFolgenSortOption>({
    by: "userRatingUpdatedAt",
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
          placeholder={l.RATINGS.SEARCH_PLACEHOLDER}
          value={searchTerm}
        />

        <ToggleGroup
          aria-label={l.RATINGS.SORTING.LABEL}
          onValueChange={(order) => {
            setSortOption(
              order === "newest"
                ? { by: "userRatingUpdatedAt", order }
                : { by: "userRating", order },
            );
          }}
          options={[
            { label: l.RATINGS.SORTING.NEWEST_FIRST, value: "newest" },
            {
              label: l.RATINGS.SORTING.HIGHEST_RATED_FIRST,
              value: "highest",
            },
            { label: l.RATINGS.SORTING.LOWEST_RATED_FIRST, value: "lowest" },
          ]}
          value={
            sortOption.by === "userRatingUpdatedAt"
              ? "newest"
              : sortOption.order
          }
        />
      </div>

      <FolgenGrid
        emptyMessage={{
          title:
            folgen.length === 0 ? l.RATINGS.EMPTY_PLACEHOLDER : undefined,
        }}
        folgen={displayedFolgen}
      />
    </section>
  );
}
