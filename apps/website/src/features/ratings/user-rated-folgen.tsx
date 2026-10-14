"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { useSearch } from "@ddfdb/client";
import {
  sortFolgen,
  type UserRatingSortOption,
  type UserRatingUpdatedSortOption,
} from "@ddfdb/core";
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
    <section aria-label="Sort your ratings" className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FolgenGridSearch onChange={setSearchTerm} value={searchTerm} />

        <ToggleGroup
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
