export const PUBLIC_API_CACHE_CONFIG = {
  cdn: {
    "Cache-Control": "public, s-maxage=28800, stale-while-revalidate=43200",
  },
  server: {
    revalidate: 300, // 5 minutes
  },
} as const;
