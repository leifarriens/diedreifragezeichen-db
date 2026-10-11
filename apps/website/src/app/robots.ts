import type { MetadataRoute } from "next";

const SITE_URL = "https://www.ddfdb.de";

export default function robots(): MetadataRoute.Robots {
  return {
    host: SITE_URL,
    rules: [
      {
        allow: "/",
        disallow: ["/admin/", "/api/", "/_next/"],
        userAgent: "*",
      },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
