import { sortFolgen } from "@ddfdb/core";
import { createSearchEngine } from "@ddfdb/core/search";

import type { SearchResult } from "@/features/global-search/contracts";

import { getAllFolgenWithCommunityRatings } from "./folgen";

export async function searchArchiv(query: string): Promise<SearchResult[]> {
  const folgen = await getAllFolgenWithCommunityRatings();

  const engine = await createSearchEngine(folgen);

  const searchResults = await engine.search({ term: query });

  const results: SearchResult[] = sortFolgen(searchResults.results, {
    by: "releaseDate",
    order: "newest",
  }).map(({ cover, id, number, title }) => ({ cover, id, number, title }));

  return results;
}
