"use client";

import type { FolgeWithUserRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";

export function UserRatedFolgen({ folgen }: { folgen: FolgeWithUserRating[] }) {
  return (
    <FolgenGrid>
      {folgen.map((folge) => (
        <FolgenGridItem
          folge={folge}
          key={folge.id}
          userRating={folge.userRating}
        />
      ))}
    </FolgenGrid>
  );
}
