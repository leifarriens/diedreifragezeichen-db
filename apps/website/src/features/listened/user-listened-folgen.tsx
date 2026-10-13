"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { useSearch } from "@ddfdb/client";
import { type ListenedDateSortOption, sortFolgen } from "@ddfdb/core";
import { useMemo, useState } from "react";

import { SortSelector } from "@/components/ui/sort-selector/sort-selector";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { FolgenGridSearch } from "@/features/folgen/folgen-grid/folgen-grid-search";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

export function UserListenedFolgen({
  folgen,
}: {
  folgen: FolgeWithCommunityRating[];
}) {
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOption, setSortOption] = useState<ListenedDateSortOption>({
    by: "listenedAt",
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
    <section className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <FolgenGridSearch onChange={setSearchTerm} value={searchTerm} />

        <SortSelector
          aria-label="Sortierung der gehörten Folgen"
          onValueChange={(order) => {
            setSortOption({ by: "listenedAt", order });
          }}
          options={[
            { label: "Neueste zuerst", value: "newest" },
            { label: "Älteste zuerst", value: "oldest" },
          ]}
          value={sortOption.order}
        />
      </div>

      <FolgenGrid folgen={displayedFolgen} />
    </section>
  );
}
