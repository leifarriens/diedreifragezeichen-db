import type { FolgeListItem } from "@ddfdb/client";

import { type NextRequest, NextResponse } from "next/server";
import * as z from "zod";

import { getFolgeListItems } from "@/server/queries/folgen";

const searchParamsSchema = z
  .object({
    limit: z.coerce.number().int().min(1).optional(),
    offset: z.coerce.number().int().min(0).default(0),
    query: z.string().optional(),
  })
  .strict();

export async function GET(
  request: NextRequest,
): Promise<NextResponse<FolgeListItem[] | { errors: unknown }>> {
  const requestSearchParams = Object.fromEntries(request.nextUrl.searchParams);

  const searchParamsResult = searchParamsSchema.safeParse(requestSearchParams);

  if (!searchParamsResult.success) {
    return NextResponse.json(
      {
        errors: z.flattenError(searchParamsResult.error),
      },
      { status: 400 },
    );
  }

  const folgen = await getFolgeListItems();

  return NextResponse.json(folgen, {
    headers: {
      "Cache-Control": "public, s-maxage=43200, stale-while-revalidate=43200",
    },
  });
}
