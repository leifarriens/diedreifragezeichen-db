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

  return (
    <section>
      <FolgenGrid>
        {hydratedFolgen.map((folge) => (
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
