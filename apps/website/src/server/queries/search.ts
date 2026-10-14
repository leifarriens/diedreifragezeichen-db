import "server-only";
import type { SearchOptions } from "@ddfdb/archiv/contracts";

import { sortFolgen } from "@ddfdb/core";
import { createSearchEngine } from "@ddfdb/core/search";
import { cacheLife, cacheTag } from "next/cache";

import type { GlobalSearchResult } from "@/features/global-search/contracts";

import { archivApi } from "../archiv-api";
import { profile } from "./cache";
import { getAllFolgenWithCommunityRatings } from "./folgen";

export async function getAllFolgenSearchOptions(): Promise<SearchOptions> {
  "use cache";

  cacheLife(profile);

  cacheTag("search-options");

  const searchOptions = await archivApi.getSearchOptions();

  return searchOptions;
}

export async function searchFolgen(
  term: string,
): Promise<GlobalSearchResult[]> {
  const folgen = await getAllFolgenWithCommunityRatings();

  const engine = await createSearchEngine(folgen);

  const searchResults = await engine.search({ term: term });

  const results: GlobalSearchResult[] = sortFolgen(searchResults.results, {
    by: "releaseDate",
    order: "newest",
  }).map(({ cover, id, number, title }) => ({ cover, id, number, title }));

  return results;
}
