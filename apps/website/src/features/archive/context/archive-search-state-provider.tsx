"use client";

import type { Collection } from "@ddfdb/archiv/contracts";
import type { SearchState } from "@ddfdb/client";
import type { ReactNode } from "react";

import { useSearchState } from "@ddfdb/client";
import { usePathname } from "next/navigation";
import {
  createContext,
  use,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useSyncExternalStore,
} from "react";

import type { ArchiveFilters } from "../archive-filters";

import {
  FIRST_RELEASE_YEAR,
  readArchiveFilters,
  writeArchiveFilters,
} from "../archive-filters";

const ARCHIVE_ROUTE = "/";
const ARCHIVE_DEFAULT_COLLECTIONS: Collection[] = ["serie"];
const SEARCH_STATE_FIELDS: readonly (keyof SearchState)[] = [
  "term",
  "sort",
  "collections",
  "yearRange",
];

const ArchiveSearchStateContext =
  createContext<ArchiveSearchStateContextValue | null>(null);

interface ArchiveSearchStateContextValue {
  resetState: () => void;
  searchCriteria: ReturnType<typeof useSearchState>["searchCriteria"];
  state: SearchState;
  updateState: (updates: Partial<SearchState>) => void;
}

export function ArchiveSearchStateProvider({
  children,
  currentYear,
}: {
  children: ReactNode;
  currentYear: number;
}) {
  const pathname = usePathname();
  const isArchivePage = pathname === ARCHIVE_ROUTE;
  const {
    initialState,
    resetState: resetSearchState,
    searchCriteria,
    state,
    updateState: updateSearchState,
  } = useSearchState(currentYear, ARCHIVE_DEFAULT_COLLECTIONS);
  const stateRef = useRef(state);

  const getSearchSnapshot = useCallback(
    () => (isArchivePage ? window.location.search : ""),
    [isArchivePage],
  );
  const search = useSyncExternalStore(
    subscribeToNavigation,
    getSearchSnapshot,
    getServerSearchSnapshot,
  );

  const restoreFromUrl = useCallback(
    (query: string) => {
      const filters = readArchiveFilters(query, currentYear);
      const nextState = stateFromFilters(filters);
      stateRef.current = nextState;
      updateSearchState(nextState);
    },
    [currentYear, updateSearchState],
  );

  useEffect(() => {
    if (!isArchivePage) return;
    restoreFromUrl(search);
  }, [isArchivePage, restoreFromUrl, search]);

  useEffect(() => {
    if (!isArchivePage) return;

    function handlePopState() {
      restoreFromUrl(window.location.search);
    }

    window.addEventListener("popstate", handlePopState);
    return () => {
      window.removeEventListener("popstate", handlePopState);
    };
  }, [isArchivePage, restoreFromUrl]);

  const commitFields = useCallback(
    (fields: readonly (keyof SearchState)[], nextState = stateRef.current) => {
      if (
        typeof window === "undefined" ||
        window.location.pathname !== ARCHIVE_ROUTE
      ) {
        return;
      }

      const url = new URL(window.location.href);
      const nextFilters = filtersWithStateFields(
        readArchiveFilters(url.search, currentYear),
        nextState,
        fields,
      );
      url.search = writeArchiveFilters(url.search, nextFilters, currentYear);
      if (url.href === window.location.href) return;

      window.history.replaceState(
        null,
        "",
        `${url.pathname}${url.search}${url.hash}`,
      );
    },
    [currentYear],
  );

  const updateState = useCallback(
    (updates: Partial<SearchState>) => {
      if (window.location.pathname !== ARCHIVE_ROUTE) return;

      const nextState = { ...stateRef.current, ...updates };
      stateRef.current = nextState;
      updateSearchState(updates);

      const changedFields = Object.keys(updates) as (keyof SearchState)[];
      if (changedFields.length > 0) {
        commitFields(changedFields, nextState);
      }
    },
    [commitFields, updateSearchState],
  );

  const resetArchiveState = useCallback(() => {
    const defaultState: SearchState = {
      ...initialState,
      collections: ARCHIVE_DEFAULT_COLLECTIONS,
      yearRange: { max: currentYear, min: FIRST_RELEASE_YEAR },
    };
    stateRef.current = defaultState;
    resetSearchState();
    commitFields(SEARCH_STATE_FIELDS, defaultState);
  }, [
    commitFields,
    currentYear,
    initialState,
    resetSearchState,
  ]);

  const value = useMemo(
    () => ({
      resetState: resetArchiveState,
      searchCriteria,
      state,
      updateState,
    }),
    [resetArchiveState, searchCriteria, state, updateState],
  );

  return (
    <ArchiveSearchStateContext value={value}>
      {children}
    </ArchiveSearchStateContext>
  );
}

export function useArchiveSearchState() {
  const context = use(ArchiveSearchStateContext);
  if (!context) {
    throw new Error(
      "useArchiveSearchState must be used within an ArchiveSearchStateProvider",
    );
  }
  return context;
}

function filtersWithStateFields(
  filters: ArchiveFilters,
  state: SearchState,
  fields: readonly (keyof SearchState)[],
): ArchiveFilters {
  return {
    ...filters,
    ...(fields.includes("term") && { searchTerm: state.term }),
    ...(fields.includes("sort") && { sortOrder: state.sort }),
    ...(fields.includes("collections") && {
      includeSpecials: state.collections.length === 0,
    }),
    ...(fields.includes("yearRange") && { yearRange: state.yearRange }),
  };
}

function getServerSearchSnapshot() {
  return "";
}

function stateFromFilters(filters: ArchiveFilters): SearchState {
  return {
    authors: [],
    collections: filters.includeSpecials ? [] : ARCHIVE_DEFAULT_COLLECTIONS,
    roles: [],
    scriptAuthors: [],
    sort:
      filters.sortOrder === "oldest" || filters.sortOrder === "rating"
        ? filters.sortOrder
        : "newest",
    speakers: [],
    term: filters.searchTerm,
    yearRange: filters.yearRange,
  };
}

function subscribeToNavigation(onChange: () => void) {
  window.addEventListener("popstate", onChange);
  return () => {
    window.removeEventListener("popstate", onChange);
  };
}
