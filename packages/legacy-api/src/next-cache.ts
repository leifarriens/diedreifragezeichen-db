export const PUBLIC_API_CACHE_CONFIG = {
  cdn: {
    "Cache-Control": "public, s-maxage=28800, stale-while-revalidate=43200",
  },
  cdnNotFound: {
    "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=3600",
  },
  server: {
    revalidate: 300, // 5 minutes
  },
} as const;
