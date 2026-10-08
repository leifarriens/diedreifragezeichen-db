"use client";

import { type ReactNode, useMemo, useState } from "react";
import { cn } from "tailwind-variants";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";
import { FolgenGridSearch } from "@/components/folgen-grid/folgen-grid-search";
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
        <div className="inline-flex max-w-full flex-wrap rounded-xl border border-white/15 p-1">
          <SortButton
            isActive={
              sortOption.by === "userRatingUpdatedAt" &&
              sortOption.order === "newest"
            }
            onClick={() => {
              setSortOption({ by: "userRatingUpdatedAt", order: "newest" });
            }}
          >
            Neueste Wertung
          </SortButton>

          <SortButton
            isActive={
              sortOption.by === "userRating" && sortOption.order === "highest"
            }
            onClick={() => {
              setSortOption({ by: "userRating", order: "highest" });
            }}
          >
            Deine beste Wertung
          </SortButton>
          <SortButton
            isActive={
              sortOption.by === "userRating" && sortOption.order === "lowest"
            }
            onClick={() => {
              setSortOption({ by: "userRating", order: "lowest" });
            }}
          >
            Deine schlechteste Wertung
          </SortButton>
        </div>
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

function SortButton({
  children,
  isActive,
  onClick,
}: {
  children: ReactNode;
  isActive: boolean;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={isActive}
      className={cn(
        "min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition",
        isActive
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
