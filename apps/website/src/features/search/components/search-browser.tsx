"use client";

import type { SearchOptions } from "@ddfdb/archiv/contracts";
import type { FolgeWithCommunityRating } from "@ddfdb/core";

import {
  useSearchEngine,
  useSearchResults,
  useSearchState,
} from "@ddfdb/client";

import { CURRENT_YEAR } from "@/app/constants";
import { Wrapper } from "@/components/ui/wrapper";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";
import { SearchFilters } from "@/features/search/components/search-filter";

export function SearchBrowser({
  availableOptions,
  folgen,
}: {
  availableOptions: SearchOptions;
  folgen: FolgeWithCommunityRating[];
}) {
  const { searchCriteria, state, updateState } = useSearchState(CURRENT_YEAR);

  const { engine } = useSearchEngine(folgen);

  const searchQuery = useSearchResults(engine, searchCriteria);

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );

  const displayedFolgen = hydratedFolgen;

  return (
    <Wrapper className="w-full space-y-8">
      <SearchFilters
        availableOptions={availableOptions}
        onChange={updateState}
        state={state}
      />

      <FolgenGrid folgen={displayedFolgen} />
    </Wrapper>
  );
}
