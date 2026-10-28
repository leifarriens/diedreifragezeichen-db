import { NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import type { SearchResponse } from "@/features/global-search/contracts";

import { normalizeSearchQuery } from "@/features/global-search/utils";
import { searchFolgen } from "@/server/queries/search";

const searchQueryParams = z.object({
  q: z
    .string()
    .max(100)
    .transform(normalizeSearchQuery)
    .pipe(z.string().min(2)),
});

type SearchApiResponse = SearchErrorResponse | SearchResponse;

interface SearchErrorResponse {
  errors: z.core.$ZodFlattenedError<
    z.output<typeof searchQueryParams>
  >["fieldErrors"];
}

export async function GET(
  request: NextRequest,
): Promise<NextResponse<SearchApiResponse>> {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = searchQueryParams.safeParse(searchParams);

  if (!result.success) {
    return NextResponse.json(
      {
        errors: z.flattenError(result.error).fieldErrors,
      },
      {
        headers: {
          "Cache-Control":
            "public, max-age=0, s-maxage=60, stale-while-revalidate=120",
        },
        status: 400,
      },
    );
  }

  const { q } = result.data;

  const results = await searchFolgen(q);

  return NextResponse.json(
    { results },
    {
      headers: {
        "Cache-Control":
          "public, max-age=0, s-maxage=3600, stale-while-revalidate=3600",
      },
    },
  );
}
