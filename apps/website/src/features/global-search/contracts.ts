import type { Folge } from "@ddfdb/archiv/contracts";

export interface SearchResponse {
  results: SearchResult[];
}

export type SearchResult = Pick<Folge, "cover" | "id" | "title">;
