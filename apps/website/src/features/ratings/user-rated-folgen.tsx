"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import {
  createFolgenFilter,
  sortFolgen,
  type UserRatingSortOption,
  type UserRatingUpdatedSortOption,
} from "@ddfdb/core";
import { useMemo, useState } from "react";

import { SortSelector } from "@/components/ui/sort-selector/sort-selector";
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
    <section aria-label="Sort your ratings" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FolgenGridSearch onChange={setSearchTerm} value={searchTerm} />

        <SortSelector
          aria-label="Sortierung deiner Wertungen"
          onValueChange={(order) => {
            setSortOption(
              order === "newest"
                ? { by: "userRatingUpdatedAt", order }
                : { by: "userRating", order },
            );
          }}
          options={[
            { label: "Neueste Wertung", value: "newest" },
            { label: "Deine beste Wertung", value: "highest" },
            { label: "Deine schlechteste Wertung", value: "lowest" },
          ]}
          value={
            sortOption.by === "userRatingUpdatedAt"
              ? "newest"
              : sortOption.order
          }
        />
      </div>

      <FolgenGrid folgen={displayedFolgen} />
    </section>
  );
}
