"use client";

import type { FolgeListItem } from "@ddfdb/client";

import Link from "next/link";

import { FolgenCard } from "@/features/folgen/components/folgen-card";
import { FolgenVisibilityProvider } from "@/features/folgen/providers/folgen-visibility-provider";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

interface ProfilePreviewProps {
  count: number;
  emptyMessage: string;
  folgen: FolgeListItem[];
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
        <Link className="flex flex-row items-center" href={href}>
          <h2 className="group mb-7 text-2xl font-semibold">
            {title} <span className="text-xl font-light">({count})</span>{" "}
            <span className="text-base font-light hover:underline">
              Alle Anzeigen
            </span>
          </h2>
        </Link>
      </div>
      {hydratedFolgen.length === 0 ? (
        <p className="text-neutral-300">{emptyMessage}</p>
      ) : (
        <FolgenVisibilityProvider>
          <div className="grid grid-cols-3 gap-4">
            {hydratedFolgen.map((folge) => (
              <FolgenCard coverLoading="eager" folge={folge} key={folge.id} />
            ))}
          </div>
        </FolgenVisibilityProvider>
      )}
    </section>
  );
}
