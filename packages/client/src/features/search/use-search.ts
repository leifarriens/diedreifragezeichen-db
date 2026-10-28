import { useDebouncedValue } from "@ddfdb/client/utils";
import {
  createSearchEngine,
  type SearchableFolge,
  type SearchCriteria,
} from "@ddfdb/core/search";
import { keepPreviousData, useQuery } from "@tanstack/react-query";
import { useEffect } from "react";

export function useSearch<T extends SearchableFolge>(
  folgen: T[],
  criteria: SearchCriteria,
) {
  const folgenKey = folgen.map((folge) => folge.id);

  const engineQuery = useQuery({
    enabled: folgen.length > 0,
    queryFn: () => createSearchEngine<T>(folgen),
    queryKey: ["search-engine", folgenKey],
  });

  useEffect(() => {
    if (engineQuery.error) {
      console.error("Error initializing search engine:", engineQuery.error);
    }
  }, [engineQuery.error]);

  const engine = engineQuery.data;

  const debouncedSearchOptions = useDebouncedValue(criteria, 50);

  const searchQuery = useQuery({
    enabled: !!engine,
    placeholderData: keepPreviousData,
    queryFn: () => {
      if (!engine) {
        throw new Error("Engine not ready");
        return;
      }

      return engine.search(debouncedSearchOptions);
    },
    queryKey: ["search", folgenKey, debouncedSearchOptions],
  });

  return searchQuery;
}
