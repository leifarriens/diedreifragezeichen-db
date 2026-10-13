import { useDebouncedValue } from "@ddfdb/client/utils";
import {
  createSearchEngine,
  type SearchableFolge,
  type SearchEngine,
  type SearchOptions,
} from "@ddfdb/core/search";
import { keepPreviousData, useQuery } from "@tanstack/react-query";

export function useSearchEngine<T extends SearchableFolge>(folgen: T[]) {
  const engineQuery = useQuery({
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
  options: SearchOptions,
) {
  const debouncedSearchOptions = useDebouncedValue(options, 50);

  return useQuery({
    enabled: !!engine,
    placeholderData: keepPreviousData,
    queryFn: () => {
      if (!engine) {
        throw new Error("Engine not ready");
        return;
      }

      return engine.searchDb(debouncedSearchOptions);
    },
    queryKey: ["search", debouncedSearchOptions],
  });
}
