# Website React Performance Review

## Scope and method

Reviewed `apps/website/src` against the Vercel React Best Practices skill, focusing on App Router server/client boundaries, archive rendering, data fetching, re-renders, and scroll/image behavior. This is a source review, not a runtime profile: I did not run a production build or collect bundle, payload, Core Web Vitals, or catalog-size measurements. Priorities below are therefore potential impact and should be validated against production measurements.

No application code was changed for this review. Existing worktree changes were left untouched.

## Summary

The site already uses several sound patterns: independent archive/community data requests run concurrently with `Promise.all`, archive data is cached, archive cards lazy-load covers and defer artwork until visible, and expensive archive filtering is memoized. The main opportunity is reducing the amount of data and UI work sent to and hydrated by the browser, especially for the full archive.

## Findings

### 1. The archive sends full Folge records across a client boundary

**Priority: High, subject to payload measurement**

`apps/website/src/app/page.tsx` passes the complete result of `getAllFolgenWithCommunityRatings()` to `ArchiveBrowser`, which is a Client Component. The archive browser and its card grid need a small subset of each record, but the full objects also include fields such as descriptions, streaming links, duration, and external links. This makes the RSC/HTML response larger than the archive view needs and increases client-side serialization and hydration work.

**Potential improvement:** define a small archive-card DTO and project records to only the fields required for filtering and rendering (for example ID, title, number, collection, release date, cover, artwork, and community rating). Apply the same principle to the bookmark and rating list boundaries. Keep full records for detail pages where those fields are displayed.

**Validate:** compare initial HTML/RSC response bytes and route transfer size before and after projection. Confirm all archive card and filter behavior still works.

### 2. The archive mounts and hydrates every matching card

**Priority: High if the production catalog is large**

`apps/website/src/app/archive-browser.tsx` maps every filtered Folge to a `FolgenGridItem`. Each card contains client-side behavior and its own `useIntersectionObserver` hook. Lazy image loading reduces image work, but it does not avoid creating every card, hydrating its component tree, or maintaining an observer for each mounted card. The archive also filters and sorts the full collection as search and filter state changes.

**Potential improvement:** measure the catalog size and initial DOM/hydration cost. If material, add pagination or virtualization while preserving URL-backed filters and accessible result navigation. As a smaller step, consider `content-visibility: auto` for off-screen cards, with an intrinsic size to reduce layout shifts. Reuse an observer rather than creating one per card if the card count warrants it. CSS content visibility alone will not reduce React hydration or DOM node count.

**Validate:** profile initial render and typing at representative catalog sizes; compare DOM node count, scripting time, and interaction latency. Check keyboard navigation and direct links to filtered results.

### 3. Search changes trigger a full filter and sort pass

**Priority: Medium, workload-dependent**

In `archive-browser.tsx`, each search term change invalidates `filteredFolgen`, which filters and then sorts all matches. Sort order does not change on every keystroke, so the sort work is repeated even when only the search term changes. The current `useMemo` avoids unrelated recomputation but does not avoid this search-driven work.

**Potential improvement:** maintain a sorted source list that changes only when the data or sort order changes, then filter it while preserving order. If profiling still shows input lag, defer the search value or apply a short debounce to expensive filtering while keeping the input responsive and URL behavior predictable.

**Validate:** measure typing latency with a production-sized dataset, including slow mobile hardware. Add or update tests for sort order, empty searches, and combined filters.

### 4. Profile pages can repeat personal-data reads on the client

**Priority: Medium**

`apps/website/src/app/profil/bookmarks/page.tsx` and `ratings/page.tsx` fetch the user's bookmarks or ratings on the server to select Folgen. Their client list components then call `useHydrateFolgenWithUserData` (`apps/website/src/lib/use-hydrate-folgen-with-user-data.ts`), which independently uses React Query for both personal ratings and bookmarks. Unless those queries are already fresh in the browser cache, the client can fetch data the server page just read, and the list components also serialize and process personal data again.

**Potential improvement:** pass the already-fetched bookmark/rating information into the list view, or seed the relevant React Query cache from server-fetched data. Ensure the mutation paths continue to update the same cache and do not introduce stale bookmark or rating indicators.

**Validate:** inspect the browser network panel for first navigation to each profile list and verify that each personal-data query is not redundantly fetched. Test mutations and navigation between the archive, bookmarks, and ratings pages.

### 5. Scroll work is handled by separate global listeners

**Priority: Low**

`apps/website/src/components/layout/header-nav.tsx` subscribes to `scroll` with a passive listener. `apps/website/src/components/layout/scroll-to-top.tsx` registers another listener without the passive option and reads `document.body.offsetHeight` on every scroll event. This duplicates global event work and can make layout reads more expensive during scrolling.

**Potential improvement:** make the scroll-to-top listener passive and, if profiling warrants it, coalesce its work with `requestAnimationFrame` or a shared scroll state. Avoid a shared abstraction unless it demonstrably reduces work without making the behavior harder to maintain.

**Validate:** profile scrolling on a long archive page and confirm the button still updates correctly near the page bottom.

## Existing strengths to preserve

- `apps/website/src/services/folgen.service.ts` fetches archive Folgen and community ratings concurrently.
- The archive API request has revalidation caching and a timeout in `apps/website/src/lib/archiv-api.ts`.
- Archive filtering is memoized, and the result grid uses stable IDs and memoized card components.
- Covers use `next/image` with lazy loading, while card artwork is only rendered after a card enters view.
- Profile page data requests that are independent are started together with `Promise.all`.
- `next.config.ts` enables React Compiler, so avoid adding manual memoization without profiling and a clear need.

## Suggested improvement plan

1. **Establish a baseline.** Build the website in production mode and record route transfer/RSC bytes, JS chunk sizes, archive item count, initial DOM nodes, and interaction timings for search and scroll. Record mobile and desktop results.
2. **Trim server-to-client props.** Introduce card-specific data projections for the archive and profile grids. Compare transfer size and retain full data only in server-rendered detail views.
3. **Remove profile data duplication.** Reuse server-fetched personal data in the client list or hydrate the React Query cache. Confirm query and mutation cache consistency.
4. **Scale the archive rendering path if measurements justify it.** Prefer pagination or virtualization to avoid mounting the full catalog; consider `content-visibility` as an incremental paint/layout optimization. Reuse visibility observers if observer count is significant.
5. **Reduce repeated search work.** Keep the selected sort order as a separately derived sorted source, filter without re-sorting for each query, and add deferred input processing only if measured input latency remains high.
6. **Tune scroll handling.** Make the scroll listener passive and profile before deciding whether shared state or animation-frame throttling adds meaningful benefit.
7. **Re-measure and verify.** Compare with the baseline, run the website lint/typecheck/tests, and verify archive URL/filter behavior, profile mutations, image loading, accessibility, and production route output.
