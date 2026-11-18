import type { Folge } from "@ddfdb/archiv/contracts";

export type GlobalSearchResult = Pick<
  Folge,
  "cover" | "id" | "number" | "title"
>;

export interface SearchResponse {
  results: GlobalSearchResult[];
}
