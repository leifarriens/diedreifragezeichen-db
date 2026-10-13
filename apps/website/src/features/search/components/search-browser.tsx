"use client";

import type { SearchOptions } from "@ddfdb/archiv/contracts";
import type { FolgeWithCommunityRating } from "@ddfdb/core";

import { Wrapper } from "@/components/ui/wrapper";
import { FolgenGrid } from "@/features/folgen/folgen-grid/folgen-grid";
import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";
import { SearchFilters } from "@/features/search/components/search-filter";
import {
  useSearchEngine,
  useSearchResults,
} from "@/features/search/hooks/use-search-engine";
import { useSearchState } from "@/features/search/hooks/use-search-state";

import { CURRENT_YEAR } from "../../../app/constants";

export function SearchBrowser({
  availableOptions,
  folgen,
}: {
  availableOptions: SearchOptions;
  folgen: FolgeWithCommunityRating[];
}) {
  const { searchOptions, state, updateState } = useSearchState(CURRENT_YEAR);

  const { engine } = useSearchEngine(folgen);

  const searchMutation = useSearchResults(engine, searchOptions);

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchMutation.data?.results ?? folgen,
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
