import "server-only";
import type { SearchOptions } from "@ddfdb/archiv/contracts";

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

  const { results } = await engine.search({
    sort: { by: "release_date", order: "DESC" },
    term: term,
  });

  return results.map(({ cover, id, number, title }) => ({
    cover,
    id,
    number,
    title,
  }));
}
