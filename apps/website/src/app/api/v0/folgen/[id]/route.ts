import { type NextRequest, NextResponse } from "next/server";

import { getFolgeWithCommunityRatingById } from "@/server/queries/folgen";
import { numericFolgeIdSchema } from "@/server/validators/folge-id";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const parsedId = numericFolgeIdSchema.safeParse(id);
  if (!parsedId.success) {
    return new Response(null, { status: 400 });
  }

  try {
    const folge = await getFolgeWithCommunityRatingById(parsedId.data);
    if (folge === null) {
      return new Response(null, { status: 404 });
    }
    return NextResponse.json(folge, {
      headers: {
        "Cache-Control": "public, s-maxage=28800, stale-while-revalidate=43200",
      },
    });
  } catch (error) {
    console.error(error);
    return new Response(null, { status: 500 });
  }
}
