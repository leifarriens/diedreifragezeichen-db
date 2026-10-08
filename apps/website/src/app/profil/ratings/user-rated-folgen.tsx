"use client";

import { useMemo, useState } from "react";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";
import { FolgenGridSearch } from "@/components/folgen-grid/folgen-grid-search";
import { SortSelector } from "@/components/sort-selector/sort-selector";
import { createFolgenFilter } from "@/lib/folgen-filter";
import {
  sortFolgen,
  type UserRatingSortOption,
  type UserRatingUpdatedSortOption,
} from "@/lib/folgen-sort";
import { useHydrateFolgenWithUserData } from "@/lib/use-hydrate-folgen-with-user-data";

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

  return (
    <section aria-label="Sort your ratings" className="space-y-4">
      <div>
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

      <FolgenGridSearch onChange={setSearchTerm} value={searchTerm} />

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
