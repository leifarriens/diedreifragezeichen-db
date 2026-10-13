import "server-only";
import type { SearchOptions } from "@ddfdb/archiv/contracts";

import { cacheLife, cacheTag } from "next/cache";

import { archivApi } from "../archiv-api";
import { profile } from "./cache";

export async function getAllFolgenSearchOptions(): Promise<SearchOptions> {
  "use cache";

  cacheLife(profile);

  cacheTag("search-options");

  const searchOptions = await archivApi.getSearchOptions();

  return searchOptions;
}
