"use client";

import type { ReactNode } from "react";

import { usePathname } from "next/navigation";
import {
  createContext,
  use,
  useCallback,
  useMemo,
  useSyncExternalStore,
} from "react";

import type { ArchiveFilters } from "./archive-filters";

import { readArchiveFilters, writeArchiveFilters } from "./archive-filters";

const FILTERS_CHANGED_EVENT = "archive-filters-changed";

interface ArchiveFiltersContextValue {
  currentYear: number;
  filters: ArchiveFilters;
  isArchivePage: boolean;
  updateFilters: (updates: Partial<ArchiveFilters>) => void;
}

const ArchiveFiltersContext = createContext<ArchiveFiltersContextValue | null>(
  null,
);

export function ArchiveFiltersProvider({
  children,
  currentYear,
}: {
  children: ReactNode;
  currentYear: number;
}) {
  const pathname = usePathname();
  const isArchivePage = pathname === "/";
  const getSnapshot = useCallback(
    () => (isArchivePage ? window.location.search : ""),
    [isArchivePage],
  );
  // The empty server snapshot preserves the default prerendered archive HTML.
  // React reads the browser URL after hydration, without useSearchParams/Suspense.
  const search = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );
  const filters = useMemo(
    () => readArchiveFilters(search, currentYear),
    [search, currentYear],
  );

  const updateFilters = useCallback(
    (updates: Partial<ArchiveFilters>) => {
      if (window.location.pathname !== "/") return;

      const url = new URL(window.location.href);
      const nextFilters = {
        ...readArchiveFilters(url.search, currentYear),
        ...updates,
      };
      url.search = writeArchiveFilters(url.search, nextFilters, currentYear);

      if (url.href === window.location.href) return;

      // Native history updates do not request a new Server Component payload.
      // Next.js preserves its router history metadata when given null state.
      window.history.replaceState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
      window.dispatchEvent(new Event(FILTERS_CHANGED_EVENT));
    },
    [currentYear],
  );

  const value = useMemo(
    () => ({ currentYear, filters, isArchivePage, updateFilters }),
    [currentYear, filters, isArchivePage, updateFilters],
  );

  return (
    <ArchiveFiltersContext value={value}>{children}</ArchiveFiltersContext>
  );
}

export function useArchiveFilters() {
  const context = use(ArchiveFiltersContext);
  if (!context)
    throw new Error("Archive filters require ArchiveFiltersProvider");
  return context;
}

function getServerSnapshot() {
  return "";
}

function subscribe(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  window.addEventListener(FILTERS_CHANGED_EVENT, onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
    window.removeEventListener(FILTERS_CHANGED_EVENT, onChange);
  };
}
