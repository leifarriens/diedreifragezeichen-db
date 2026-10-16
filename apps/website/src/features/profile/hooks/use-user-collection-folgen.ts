import { useSearch } from "@ddfdb/client";
import {
  type FolgeWithCommunityRating,
  sortFolgen,
  type UserDataSortOption,
} from "@ddfdb/core";
import { useMemo } from "react";

import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

export function useCollectionFolgen(
  folgen: FolgeWithCommunityRating[],
  searchTerm: string,
  sortOption: UserDataSortOption,
) {
  const searchQuery = useSearch(folgen, { term: searchTerm });

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );

  return useMemo(
    () => sortFolgen(hydratedFolgen, sortOption),
    [hydratedFolgen, sortOption],
  );
}
