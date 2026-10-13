import type { SearchCriteria } from "@ddfdb/core/search";

import { type SearchState, useSearchState } from "@ddfdb/client";
import { createContext, type PropsWithChildren, use, useMemo } from "react";

export interface ArchiveFilters {
  endDate: null | string;
  showSpecials: boolean;
  startDate: null | string;
}

interface ArchiveFilterContextValue {
  resetState: () => void;
  searchCriteria: SearchCriteria;
  state: SearchState;
  updateState: (updates: Partial<SearchState>) => void;
}

const ArchiveFilterContext = createContext<ArchiveFilterContextValue | null>(
  null,
);

const CURRENT_YEAR = new Date().getFullYear();

export function ArchiveFilterProvider({ children }: PropsWithChildren) {
  const { resetState, searchCriteria, state, updateState } =
    useSearchState(CURRENT_YEAR);

  const value = useMemo(
    () => ({ resetState, searchCriteria, state, updateState }),
    [resetState, searchCriteria, state, updateState],
  );

  return <ArchiveFilterContext value={value}>{children}</ArchiveFilterContext>;
}

export function useArchiveFilters() {
  const context = use(ArchiveFilterContext);

  if (!context) {
    throw new Error(
      "useArchiveFilters must be used within an ArchiveFilterProvider",
    );
  }

  return context;
}
