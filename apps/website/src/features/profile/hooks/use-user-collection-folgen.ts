import {
  type FolgeListItem,
  type FolgenListItemWithUserData,
  useSearch,
} from "@ddfdb/client";
import { sortFolgen, type UserDataSortOption } from "@ddfdb/core";
import { useMemo } from "react";

import { useHydrateFolgenWithUserData } from "@/features/folgen/use-hydrate-folgen-with-user-data";

export function useCollectionFolgen(
  folgen: FolgeListItem[],
  searchTerm: string,
  sortOption: UserDataSortOption,
): FolgenListItemWithUserData[] {
  const searchQuery = useSearch(folgen, { term: searchTerm });

  const hydratedFolgen = useHydrateFolgenWithUserData(
    searchQuery.data?.results ?? folgen,
  );

  return useMemo(
    () => sortFolgen(hydratedFolgen, sortOption),
    [hydratedFolgen, sortOption],
  );
}
