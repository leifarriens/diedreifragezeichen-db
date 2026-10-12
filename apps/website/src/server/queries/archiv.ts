import { createFolgenFilter, sortFolgen } from "@ddfdb/core";

import type { SearchResult } from "@/features/global-search/contracts";

import { archivApi } from "../archiv-api";

export async function searchArchiv(query: string): Promise<SearchResult[]> {
  const folgen = await archivApi.getFolgen();

  const results: SearchResult[] = sortFolgen(
    createFolgenFilter(folgen).search(query).results(),
    { by: "releaseDate", order: "newest" },
  )
    .slice(0, 6)
    .map(({ cover, id, number, title }) => ({ cover, id, number, title }));

  return results;
}
