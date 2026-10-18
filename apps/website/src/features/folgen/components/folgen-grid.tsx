import type { FolgenListItemWithUserData } from "@ddfdb/client";

import { FolgenVisibilityProvider } from "../providers/folgen-visibility-provider";
import { FolgenCard } from "./folgen-card";
import styles from "./folgen-grid.module.css";

interface FolgenGridProps {
  /** Number of covers to load eagerly before switching to lazy loading */
  eagerCoverCount?: number;
  emptyMessage?: {
    description?: string | undefined;
    title: string | undefined;
  };
  folgen: FolgenListItemWithUserData[];
}

export function FolgenGrid({
  eagerCoverCount = 10,
  emptyMessage,
  folgen,
}: FolgenGridProps) {
  if (eagerCoverCount < 0) {
    eagerCoverCount = 0;
    console.warn("eagerCoverCount cannot be negative. Resetting to 0.");
  }

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
    <FolgenVisibilityProvider>
      <div className={styles.grid}>
        {folgen.map((folge, index) => (
          <FolgenCard
            coverLoading={index < eagerCoverCount ? "eager" : "lazy"}
            folge={folge}
            key={folge.id}
          />
        ))}
      </div>
    </FolgenVisibilityProvider>
  );
}
