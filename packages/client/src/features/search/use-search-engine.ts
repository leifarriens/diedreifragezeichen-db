import { useDebouncedValue } from "@ddfdb/client/utils";
import {
  createSearchEngine,
  type SearchableFolge,
  type SearchCriteria,
  type SearchEngine,
} from "@ddfdb/core/search";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useSearchEngine<T extends SearchableFolge>(
  folgen: T[],
  {
    shouldInitialize = true,
  }: {
    shouldInitialize?: boolean;
  } = {},
) {
  const engineQuery = useQuery({
    enabled: shouldInitialize,
    queryFn: () => createSearchEngine<T>(folgen),
    queryKey: ["searchEngine", Object.keys(folgen).length],
    staleTime: Infinity,
  });

  return {
    engine: engineQuery.data,
    isLoading: engineQuery.isLoading,
  };
}

export function useSearchResults<T extends SearchableFolge>(
  engine: SearchEngine<T> | undefined,
  criteria: SearchCriteria,
) {
  const debouncedSearchOptions = useDebouncedValue(criteria, 50);

  return useQuery({
    enabled: !!engine,
    placeholderData: keepPreviousData,
    queryFn: () => {
      if (!engine) {
        throw new Error("Engine not ready");
        return;
      }

      return engine.search(debouncedSearchOptions);
    },
    queryKey: ["search", debouncedSearchOptions],
  });
}
