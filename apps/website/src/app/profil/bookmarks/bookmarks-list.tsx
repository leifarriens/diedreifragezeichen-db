"use client";

import type { FolgeWithCommunityRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";
import { useHydrateFolgenWithUserData } from "@/lib/use-hydrate-folgen-with-user-data";

export function BookmarksList({
  folgen,
}: {
  folgen: FolgeWithCommunityRating[];
}) {
  const hydratedFolgen = useHydrateFolgenWithUserData(folgen);

  const sortedFolgen = [...hydratedFolgen].sort(
    (a, b) =>
      (b.bookmarkedAt ? new Date(b.bookmarkedAt).getTime() : 0) -
      (a.bookmarkedAt ? new Date(a.bookmarkedAt).getTime() : 0),
  );

  return (
    <section>
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
