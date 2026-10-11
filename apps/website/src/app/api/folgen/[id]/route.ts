import {
  buildLegacyFolge,
  getFolgeByMongoId,
  PUBLIC_API_CACHE_CONFIG,
} from "@ddfdb/legacy-api";
import { unstable_cache } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";

export async function GET(
  _: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;

  const getCachedFolge = unstable_cache(
    async (id: string) => {
      let legacyFolge = await getFolgeByMongoId(id);

      if (!legacyFolge) {
        return new NextResponse("Not Found", { status: 404 });
      }

      const folgen = await getAllFolgenWithCommunityRatings();

      const folgeWithCommunityRatings = folgen.find((folge) => {
        if (!folge.streaming.spotify) return false;

        return folge.streaming.spotify.id === legacyFolge?.spotify_id;
      });

      if (folgeWithCommunityRatings) {
        legacyFolge = buildLegacyFolge(legacyFolge, folgeWithCommunityRatings);
      }

      return legacyFolge;
    },
    ["folge", id],
    {
      revalidate: PUBLIC_API_CACHE_CONFIG.server.revalidate,
      tags: ["folgen-list", `folge-${id}`],
    },
  );

  const data = await getCachedFolge(id);

  return new NextResponse(JSON.stringify(data), {
    headers: {
      "Cache-Control": PUBLIC_API_CACHE_CONFIG.cdn["Cache-Control"],
      "Content-Type": "application/json",
    },
    status: 200,
  });
}
