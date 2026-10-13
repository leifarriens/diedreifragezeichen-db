import type { FolgeUserData, FolgeWithCommunityRating } from "@ddfdb/core";

import { FolgenGridItem } from "./folgen-grid-item";
import styles from "./folgen-grid.module.css";

interface FolgenGridProps {
  emptyMessage?: {
    description?: string;
    title: string;
  };
  folgen: (FolgeUserData & FolgeWithCommunityRating)[];
}

export function FolgenGrid({ emptyMessage, folgen }: FolgenGridProps) {
  if (folgen.length === 0) {
    <section className="rounded-xl border border-white/10 bg-white/[0.03] px-6 py-14 text-center">
      <p className="text-lg font-semibold">
        {emptyMessage?.title ?? "Keine Folgen gefunden"}
      </p>
      {emptyMessage?.description && (
        <p className="mt-2 text-sm text-slate-400">
          {emptyMessage.description}
        </p>
      )}
    </section>;
  }

  return (
    <div className={styles.grid}>
      {folgen.map((folge, index) => (
        <FolgenGridItem
          coverLoading={index <= 20 ? "eager" : "lazy"}
          folge={folge}
          key={folge.id}
        />
      ))}
    </div>
  );
}
