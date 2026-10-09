import { useDebouncedValue } from "@ddfdb/client/utils";
import { useQuery } from "@tanstack/react-query";

import type { SearchResponse } from "@/app/api/v0/search/route";

export function useSearch(
  searchQuery: string,
  { enabled }: { enabled: boolean },
) {
  const debouncedSearchDraft = useDebouncedValue(searchQuery, 300);

  return useQuery({
    enabled: enabled && debouncedSearchDraft.length > 2,
    queryFn: ({ signal }) => search(debouncedSearchDraft, signal),
    queryKey: ["search", debouncedSearchDraft],
    staleTime: 1000 * 60 * 5, // 5 minutes
  });
}

async function search(query: string, signal: AbortSignal) {
  const res = await fetch(
    `/api/v0/search?q=${encodeURIComponent(query.trim())}`,
    {
      cache: "force-cache",
      signal,
    },
  );

  if (!res.ok) {
    throw new Error("Failed to fetch search results");
  }

  const data = (await res.json()) as Partial<SearchResponse>;

  return Array.isArray(data.results) ? data.results : [];
}
