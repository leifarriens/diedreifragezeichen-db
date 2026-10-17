import { ArchivApi } from "@ddfdb/client/archiv";

export { ArchivApiError } from "@ddfdb/client/archiv";

const DEFAULT_ARCHIV_API_URL = "http://localhost:8080";
const REQUEST_TIMEOUT_MS = 8_000;

export const CACHE_DURATION = {
  ONE_DAY: 86400,
  ONE_HOUR: 3600,
  ONE_MONTH: 2592000,
  ONE_WEEK: 604800,
  ONE_YEAR: 31536000,
} as const;

export const archivApi = new ArchivApi({
  baseUrl: process.env.DDFDB_ARCHIV_API_URL ?? DEFAULT_ARCHIV_API_URL,
  fetch: (url, options) => {
    const timeout = AbortSignal.timeout(REQUEST_TIMEOUT_MS);

    return fetch(url, {
      ...options,
      next: { revalidate: CACHE_DURATION.ONE_HOUR },
      signal: options.signal
        ? AbortSignal.any([options.signal, timeout])
        : timeout,
    });
  },
});
