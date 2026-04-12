export const PUBLIC_API_CACHE_CONFIG = {
  server: {
    revalidate: 300, // 5 minutes
  },
  cdn: {
    'Cache-Control': 'public, s-maxage=28800, stale-while-revalidate=43200',
  },
} as const;
