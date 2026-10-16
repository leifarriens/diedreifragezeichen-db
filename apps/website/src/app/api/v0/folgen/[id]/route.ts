import { type NextRequest, NextResponse } from "next/server";

import { ArchivApiError } from "@/server/archiv-api";
import { getFolgeWithCommunityRatingById } from "@/server/queries/folgen";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  try {
    const folge = await getFolgeWithCommunityRatingById(parseInt(id, 10));
    return NextResponse.json(folge, {
      headers: {
        "Cache-Control": "public, s-maxage=28800, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    if (error instanceof ArchivApiError && error.status === 404) {
      return new Response(null, { status: 404 });
    }

    console.error(error);
    return new Response(null, { status: 500 });
  }
}
