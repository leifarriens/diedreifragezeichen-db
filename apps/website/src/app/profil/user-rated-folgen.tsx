"use client";

import { type ReactNode, useMemo, useState } from "react";
import { cn } from "tailwind-variants";

import type { FolgeWithUserRating } from "@/lib/types";

import { FolgenGrid } from "@/components/folgen-grid/folgen-grid";
import { FolgenGridItem } from "@/components/folgen-grid/folgen-grid-item";

import {
  sortUserRatedFolgen,
  type UserRatedFolgenSortOrder,
} from "./user-rated-folgen-sort";

export function UserRatedFolgen({ folgen }: { folgen: FolgeWithUserRating[] }) {
  const [sortOrder, setSortOrder] =
    useState<UserRatedFolgenSortOrder>("recent");

  const sortedFolgen = useMemo(
    () => sortUserRatedFolgen(folgen, sortOrder),
    [folgen, sortOrder],
  );

  return (
    <section aria-label="Sort your ratings" className="space-y-4">
      <div>
        <span className="mb-2 block text-xs font-semibold tracking-wide text-slate-400 uppercase">
          Sort by
        </span>
        <div className="inline-flex max-w-full flex-wrap rounded-xl border border-white/15 p-1">
          <SortButton
            active={sortOrder === "worst"}
            onClick={() => {
              setSortOrder("worst");
            }}
          >
            Worst rating
          </SortButton>
          <SortButton
            active={sortOrder === "best"}
            onClick={() => {
              setSortOrder("best");
            }}
          >
            Best rating
          </SortButton>
          <SortButton
            active={sortOrder === "recent"}
            onClick={() => {
              setSortOrder("recent");
            }}
          >
            Rating date (newest first)
          </SortButton>
        </div>
      </div>
      <FolgenGrid>
        {sortedFolgen.map((folge) => (
          <FolgenGridItem
            folge={folge}
            key={folge.id}
            userRating={folge.userRating}
          />
        ))}
      </FolgenGrid>
    </section>
  );
}

function SortButton({
  active,
  children,
  onClick,
}: {
  active: boolean;
  children: ReactNode;
  onClick: () => void;
}) {
  return (
    <button
      aria-pressed={active}
      className={cn(
        "min-h-10 flex-1 rounded-lg px-4 text-sm font-semibold transition",
        active
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
