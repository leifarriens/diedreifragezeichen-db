# Shared Archiv client

Import from `@ddfdb/client/archiv`. This subpath has no React dependency and can be used from Next.js server code or Expo.

```ts
import { ArchivApi, ArchivApiError } from "@ddfdb/client/archiv";

const archivApi = new ArchivApi({
  baseUrl: configuredArchiveUrl,
  // Optional: inject a platform fetch or a wrapper with app-specific policy.
  fetch: (url, options) => fetch(url, options),
});

const folgen = await archivApi.getFolgen();
const folge = await archivApi.getFolgeById(1, {
  signal: abortController.signal,
});
```

Applications own environment reads, timeout policies, caching, retries, and query lifecycles. A fetch adapter can add Next.js `next: { revalidate }` options or choose Expo's transport. Forward the supplied request options, especially the signal, when adding policy.

The client validates every field in the current `@ddfdb/archiv/contracts` contract, including streaming metadata and credits. It accepts empty collections, nullable metadata, and additional fields. It rejects incomplete or legacy responses rather than silently coercing them.

Failures use `ArchivApiError` with a `code` of `http`, `network`, or `invalid-response`. HTTP errors retain `status`; transport and JSON errors retain `cause`. Cancellation and timeout errors are rethrown unchanged.

Both applications use this client through local adapters: `apps/website/src/lib/archiv-api.ts` supplies the server URL, Next.js revalidation, and an 8-second timeout; `apps/mobile/src/api/archiv.ts` supplies the Expo public URL and uses the platform's global fetch.
