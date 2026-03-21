export const PUBLIC_API_CACHE_CONFIG = {
  server: {
    revalidate: 900, // 15 minutes
  },
  cdn: {
    'Cache-Control': 'public, s-maxage=3600, stale-while-revalidate=7200',
  },
} as const;
