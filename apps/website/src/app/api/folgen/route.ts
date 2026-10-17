import {
  allFolgenQuerySchema,
  buildLegacyFolge,
  getAllFolgen,
  PUBLIC_API_CACHE_CONFIG,
} from "@ddfdb/legacy-api";
import { unstable_cache } from "next/cache";
import { type NextRequest, NextResponse } from "next/server";

import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";

export async function GET(request: NextRequest) {
  const searchParams = Object.fromEntries(request.nextUrl.searchParams);
  const result = allFolgenQuerySchema.safeParse(searchParams);

  if (!result.success) {
    return NextResponse.json(
      {
        errors: Object.fromEntries(
          result.error.issues.map(({ message, path }) => [
            path.join("."),
            message,
          ]),
        ),
      },
      { status: 400 },
    );
  }

  const { limit, offset, query, sort } = result.data;

  const getCachedFolgen = unstable_cache(
    async () => {
      const legacyFolgen = await getAllFolgen(offset, limit, sort, query);

      const folgen = await getAllFolgenWithCommunityRatings();

      const folgenIds = new Map(
        folgen.map((folge) => [folge.streaming.spotify?.id, folge]),
      );

      return {
        items: legacyFolgen.folgen.map((legacyFolge) => {
          const folge = folgenIds.get(legacyFolge.spotify_id);
          if (!folge) {
            console.warn(
              `No folge found for legacy folge with Spotify ID: ${legacyFolge.spotify_id}`,
              legacyFolge.name,
            );
            return legacyFolge;
          }

          return buildLegacyFolge(legacyFolge, folge);
        }),
        limit,
        offset,
        total: legacyFolgen.total,
      };
    },
    ["folgen-list", String(offset), String(limit), sort, query ?? ""],
    {
      revalidate: PUBLIC_API_CACHE_CONFIG.server.revalidate,
      tags: ["folgen-list"],
    },
  );

  const data = await getCachedFolgen();

  return NextResponse.json(data, {
    headers: {
      "Cache-Control": PUBLIC_API_CACHE_CONFIG.cdn["Cache-Control"],
      "Content-Type": "application/json",
    },
  });
}
