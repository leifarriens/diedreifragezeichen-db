"use client";

import type { SearchOptions } from "@ddfdb/archiv/contracts";
import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { useSearch } from "@ddfdb/client";
import { Suspense } from "react";

import { CURRENT_YEAR } from "@/app/constants";
import { Wrapper } from "@/components/ui/wrapper";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";
import { SearchFilters } from "@/features/search/components/search-filter";
import { SearchUrlNavigationObserver } from "@/features/search/components/search-url-navigation-observer";
import { useSearchState } from "@/features/search/hooks/use-search-state";

export function SearchBrowser({
  availableOptions,
  folgen,
}: {
  availableOptions: SearchOptions;
  folgen: FolgeWithCommunityRating[];
}) {
  const {
    navigationRevision,
    onExternalNavigation,
    searchCriteria,
    state,
    updateState,
  } = useSearchState(CURRENT_YEAR);

  const searchQuery = useSearch(folgen, searchCriteria);

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );

  const displayedFolgen = hydratedFolgen;

  return (
    <Wrapper className="w-full space-y-8">
      <Suspense fallback={null}>
        <SearchUrlNavigationObserver onNavigate={onExternalNavigation} />
      </Suspense>
      <SearchFilters
        availableOptions={availableOptions}
        navigationRevision={navigationRevision}
        onChange={updateState}
        state={state}
      />

      <FolgenGrid folgen={displayedFolgen} />
    </Wrapper>
  );
}
