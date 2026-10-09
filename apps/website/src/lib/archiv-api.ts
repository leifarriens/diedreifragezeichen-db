import { ArchivApi } from "@ddfdb/client/archiv";

import { CACHE_DURATION } from "@/constants/cache";

export { ArchivApiError } from "@ddfdb/client/archiv";

const DEFAULT_ARCHIV_API_URL = "http://localhost:8080";
const REQUEST_TIMEOUT_MS = 8_000;

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
