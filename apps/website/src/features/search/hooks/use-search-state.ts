"use client";

import type { SearchOptions, SortOption } from "@ddfdb/core/search";

import { useCallback, useState } from "react";

export type SearchSort = "newest" | "oldest" | "rating";

export interface SearchState {
  authors: string[];
  collections: string[];
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
  const [state, setState] = useState<SearchState>(() => ({
    ...initialState,
    yearRange: { max: currentYear, min: 1979 },
  }));

  const updateState = useCallback((updates: Partial<SearchState>) => {
    setState((previous) => ({ ...previous, ...updates }));
  }, []);

  const searchOptions: SearchOptions = {
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
    setState({
      ...initialState,
      yearRange: { max: currentYear, min: 1979 },
    });
  }, [currentYear]);

  return { resetState, searchOptions, state, updateState };
}
