import { useQuery } from "@tanstack/react-query";

import { archivApi } from "./archiv";

export const folgenSearchOptionsQueryKey = ["folgen-search-options"] as const;

export function useFolgenSearchOptions() {
  const query = useQuery({
    gcTime: Infinity,
    queryFn: async () => {
      const searchOptions = await archivApi.getSearchOptions();

      return searchOptions;
    },
    queryKey: folgenSearchOptionsQueryKey,
    staleTime: 1000 * 60 * 60 * 24, // 24 hour
  });

  return query;
}
