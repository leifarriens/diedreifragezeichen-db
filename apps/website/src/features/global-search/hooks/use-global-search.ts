import { useDebouncedValue } from "@ddfdb/client/utils";
import { useQuery } from "@tanstack/react-query";

import type { SearchResponse } from "../contracts";

import { normalizeSearchQuery } from "../utils";

export function useGlobalSearch(
  searchQuery: string,
  { enabled }: { enabled: boolean },
) {
  const normalizedQuery = useDebouncedValue(
    normalizeSearchQuery(searchQuery),
    300,
  );

  return useQuery({
    enabled: enabled && normalizedQuery.length > 2,
    queryFn: ({ signal }) => search(normalizedQuery, signal),
    queryKey: ["search", normalizedQuery],
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
}

async function search(query: string, signal: AbortSignal) {
  const res = await fetch(`/api/v0/search?q=${encodeURIComponent(query)}`, {
    signal,
  });

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = (await res.json()) as Partial<SearchResponse>;

  return Array.isArray(data.results) ? data.results : [];
}
