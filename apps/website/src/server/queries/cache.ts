import type { cacheLife } from "next/cache";

export const profile: Parameters<typeof cacheLife>[0] = {
  expire: 31536000,
  revalidate: 3600,
  stale: 300,
};
