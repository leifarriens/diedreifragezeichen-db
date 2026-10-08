import type { Folge } from "@ddfdb/archiv/contracts";

import { NextResponse } from "next/server";

import { archivApi } from "@/lib/archiv-api";

export interface SearchResponse {
  results: SearchResult[];
}

export type SearchResult = Pick<Folge, "cover" | "id" | "title">;

export async function GET(
  request: Request,
): Promise<NextResponse<SearchResponse>> {
  const { searchParams } = new URL(request.url);

  const query = searchParams.get("q")?.trim() ?? "";

  if (!query || query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const folgen = await archivApi.getFolgen();

  const results: SearchResult[] = folgen
    .filter((folge) => folge.title.toLowerCase().includes(query.toLowerCase()))
    .map(({ cover, id, title }) => ({ cover, id, title }));

  return NextResponse.json({ results });
}
