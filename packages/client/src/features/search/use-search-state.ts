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
  newest: { by: "releaseDate", order: "DESC" },
  oldest: { by: "releaseDate", order: "ASC" },
  rating: { by: "communityRating", order: "DESC" },
};

const initialState: Omit<SearchState, "yearRange"> = {
  authors: [],
  collections: [],
  roles: [],
  scriptAuthors: [],
  sort: "newest",
  speakers: [],
  term: "",
};

export function useSearchState(currentYear: number) {
  const defaults = useMemo<SearchState>(
    () => ({
      ...initialState,
      yearRange: { max: currentYear, min: 1979 },
    }),
    [currentYear],
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
      scriptAuthors: state.scriptAuthors,
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
