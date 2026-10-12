import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import type { SearchResponse } from "@/features/global-search/contracts";

import { normalizeSearchQuery } from "@/features/global-search/normalize-search-query";
import { searchArchiv } from "@/server/queries/archiv";

const searchQueryParams = z.object({
  q: z.string().min(2).max(100),
});

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SearchResponse>> {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = searchQueryParams.safeParse(searchParams);

  if (!result.success) {
    return NextResponse.json({ results: [] });
  }

  const query = normalizeSearchQuery(result.data.q);

  if (query.length < 2) {
    return NextResponse.json({ results: [] });
  }

  const results = await searchArchiv(query);

  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=300, stale-while-revalidate=60",
      },
    },
  );
}
