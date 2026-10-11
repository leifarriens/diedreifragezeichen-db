import type { MetadataRoute } from "next";

import { getAllFolgenWithCommunityRatings } from "@/server/queries/folgen";

const baseUrl = "https://www.ddfdb.de";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const folgen = await getAllFolgenWithCommunityRatings();

  const folgenPages: MetadataRoute.Sitemap = folgen.map((folge) => ({
    changeFrequency: "monthly",
    lastModified: new Date(), // TODO: this should be either the realease_date of the folge or last modified date from the community ratings
    priority: 0.5,
    url: `${baseUrl}/folge/${folge.id.toString()}`,
  }));

  return [
    {
      changeFrequency: "monthly",
      lastModified: new Date(),
      priority: 1,
      url: baseUrl,
    },
    ...folgenPages,
  ];
}
