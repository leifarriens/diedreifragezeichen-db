"use client";

import type { FolgeWithCommunityRating } from "@ddfdb/core";

import Link from "next/link";

import { FolgenGridItem } from "@/features/folgen/folgen-grid/folgen-grid-item";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

interface ProfilePreviewProps {
  count: number;
  emptyMessage: string;
  folgen: FolgeWithCommunityRating[];
  href: string;
  title: string;
}

export function ProfileFolgenPreview({
  count,
  emptyMessage,
  folgen,
  href,
  title,
}: ProfilePreviewProps) {
  const hydratedFolgen = useHydrateFolgenWithUserData(folgen);

  return (
    <section>
      <div className="flex">
        <Link href={href}>
          <h2 className="mb-7 text-2xl font-semibold">
            {title} <span className="text-xl font-light">({count})</span>
          </h2>
        </Link>
      </div>
      {hydratedFolgen.length === 0 ? (
        <p className="text-neutral-300">{emptyMessage}</p>
      ) : (
        <div className="grid grid-cols-3 gap-4">
          {hydratedFolgen.map((folge) => (
            <FolgenGridItem coverLoading="eager" folge={folge} key={folge.id} />
          ))}
        </div>
      )}
    </section>
  );
}
