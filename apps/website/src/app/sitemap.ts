import type { MetadataRoute } from "next";

import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";

const baseUrl = "https://www.ddfdb.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const folgen = await getAllFolgenWithCommunityRatings();

  const folgenPages: MetadataRoute.Sitemap = folgen.map((folge) => ({
    changeFrequency: "monthly",
    lastModified: folge.communityRating?.updatedAt ?? undefined,
    priority: 0.5,
    url: `${baseUrl}/folge/${folge.id.toString()}`,
  }));

  return [
    {
      changeFrequency: "monthly",
      priority: 1,
      url: baseUrl,
    },
    ...folgenPages,
  ];
}
