import { createFolgenFilter } from "@ddfdb/core";
import { NextResponse } from "next/server";

import type {
  SearchResponse,
  SearchResult,
} from "@/features/global-search/contracts";

import { archivApi } from "@/server/archiv-api";

export async function GET(
  request: Request,
): Promise<NextResponse<SearchResponse>> {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim() ?? "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const folgen = await archivApi.getFolgen();

  const results: SearchResult[] = createFolgenFilter(folgen)
    .search(query)
    .results()
    .map(({ cover, id, title }) => ({ cover, id, title }));

  return NextResponse.json({ results });
}
