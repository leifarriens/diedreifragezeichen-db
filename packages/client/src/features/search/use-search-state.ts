"use client";

import type { Collection } from "@ddfdb/archiv/contracts";
import type { SearchCriteria, SortOption } from "@ddfdb/core/search";

import { useCallback, useMemo, useState } from "react";

export type SearchSort = "newest" | "oldest" | "rating";

export interface SearchState {
  authors: string[];
  collections: Collection[];
  roles: string[];
  scriptAuthors: string[];
  sort: SearchSort;
  speakers: string[];
  term: string;
  yearRange: { max: number; min: number };
}

const searchSortOptions: Record<SearchSort, SortOption> = {
  newest: { by: "release_date", order: "DESC" },
  oldest: { by: "release_date", order: "ASC" },
  rating: { by: "communityRating", order: "DESC" },
};

const DEFAULT_COLLECTIONS: Collection[] = [];

const initialState: Omit<SearchState, "yearRange"> = {
  authors: [],
  collections: [],
  roles: [],
  scriptAuthors: [],
  sort: "newest",
  speakers: [],
  term: "",
};

export function useSearchState(
  currentYear: number,
  defaultCollections: Collection[] = DEFAULT_COLLECTIONS,
) {
  const defaults = useMemo<SearchState>(
    () => ({
      ...initialState,
      collections: [...defaultCollections],
      yearRange: { max: currentYear, min: 1979 },
    }),
    [currentYear, defaultCollections],
  );
  const [state, setState] = useState<SearchState>(() => defaults);

  const updateState = useCallback((updates: Partial<SearchState>) => {
    setState((previous) => ({ ...previous, ...updates }));
  }, []);

  // Translation of internal state to search criteria
  const searchCriteria: SearchCriteria = {
    filters: {
      authors: state.authors,
      collections: state.collections,
      roles: state.roles,
      script_authors: state.scriptAuthors,
      speakers: state.speakers,
      yearRange: state.yearRange,
    },
    sort: searchSortOptions[state.sort],
    term: state.term,
  };

  const resetState = useCallback(() => {
    setState(defaults);
  }, [defaults]);

  return { initialState, resetState, searchCriteria, state, updateState };
}
