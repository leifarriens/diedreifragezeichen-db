# Search state URL persistence plan

## Goal

Persist the `/search` filters in query parameters so links can be shared and restored on reload or browser navigation, without slowing the text input or year range controls.

Persist `SearchState`, not the search engine instance or query results. `useSearchEngine` remains responsible for building the engine from `folgen`.

## State ownership

Use a hybrid model:

- Local React state owns the active input values and drives search options.
- The URL stores the latest persisted snapshot of those values.
- Direct visits and external navigation restore local state from the URL.
- User interactions update local state immediately and explicitly schedule persistence.

Do not implement two unrestricted effects that copy local state to the URL and URL state back to local state. Those can overwrite incoming URLs during initialization, cause feedback loops, or let pending debounced writes undo Back/Forward navigation.

Search execution and URL persistence remain independent. Keep the existing 50 ms debounce in `useSearchResults`; do not make results wait for URL writes.

## Existing implementation

Relevant files:

- `apps/website/src/features/search/hooks/use-search-state.ts`
- `apps/website/src/features/search/hooks/use-search-state.test.ts`
- `apps/website/src/features/search/hooks/use-search-engine.ts`
- `apps/website/src/features/search/components/search-filter.tsx`
- `apps/website/src/components/ui/multi-range-input/multi-range-input.tsx`

The archive already has URL parsing, serialization, native history updates, and navigation subscriptions in:

- `apps/website/src/features/archive/archive-filters.ts`
- `apps/website/src/features/archive/components/archive-filters-provider.tsx`

Follow those conventions without coupling search state to the archive provider. The archive provider intentionally ignores `/search`.

The search year control already uses `MultiRangeInput` with a 200 ms debounce and an immediate internal draft. Account for that existing debounce rather than adding another delay after it.

## 1. Define the URL contract

Add pure parsing and serialization helpers, for example in `apps/website/src/features/search/search-state-url.ts`.

| State field     | Query parameter          | Default      |
| --------------- | ------------------------ | ------------ |
| `term`          | `q`                      | Empty string |
| `sort`          | `sort`                   | `newest`     |
| `authors`       | Repeated `authors`       | Empty array  |
| `collections`   | Repeated `collections`   | Empty array  |
| `roles`         | Repeated `roles`         | Empty array  |
| `scriptAuthors` | Repeated `scriptAuthors` | Empty array  |
| `speakers`      | Repeated `speakers`      | Empty array  |
| `yearRange.min` | `yearFrom`               | 1979         |
| `yearRange.max` | `yearTo`                 | Current year |

Example:

```text
/search?q=Hugenay&sort=rating&authors=Andr%C3%A9+Marx&authors=Ben+Nevis&yearFrom=1990
```

Helper contracts:

```ts
readSearchState(search: string, currentYear: number): SearchState
writeSearchState(search: string, state: SearchState, currentYear: number): string
```

Requirements:

- Use `URLSearchParams` and `getAll` for arrays, not comma-separated values.
- Omit default values and delete cleared search-owned parameters.
- Preserve unrelated query parameters. Preserve the path and hash when writing history.
- Accept only supported sort values; fall back to `newest` otherwise.
- Validate finite integer years, clamp to supported bounds, and enforce a valid minimum/maximum interval using the archive's conventions.
- Remove empty array entries and deduplicate selections while preserving order.
- Keep parsing and serialization deterministic and independent of browser globals.
- Share state types/default construction where appropriate without creating runtime circular imports.

## 2. Restore state safely

Extend `useSearchState(currentYear)` while preserving its public interface: `state`, `searchOptions`, `updateState`, and `resetState`.

- Render the existing defaults on the server and on the initial hydration render.
- Restore URL state after hydration, before enabling any persistence.
- Never write defaults over an incoming URL on mount.
- Subscribe to Back/Forward navigation and relevant Next.js route/query navigation. Use the installed Next.js documentation to select the subscription mechanism; `popstate` alone does not cover client-side router navigation.
- If using `useSearchParams`, provide the required Suspense boundary for static rendering. If using an external-store approach, retain a stable primitive snapshot and an SSR-safe server snapshot.
- Distinguish a self-authored URL snapshot from external navigation so committing a snapshot does not overwrite a newer local draft.
- External navigation cancels scheduled writes, invalidates stale callbacks, and restores the new URL state.
- Scope persistence to the active `/search` route and cancel timers when leaving it or unmounting.

Avoid relying only on a URL-string comparison: an external navigation can arrive at a previously self-authored URL. Track navigation events and persistence generations explicitly where necessary.

## 3. Persist explicit user updates

Keep `updateState` as the entry point for interactions. Merge partial updates against the latest local state so multiple batched calls do not lose fields. Keep side effects outside React state updater functions, which can be replayed in Strict Mode.

Persistence policy:

- Text edits: update local state immediately; persist `q` after 250 ms of inactivity.
- Year edits: keep the existing immediate slider draft and 200 ms debounce in `MultiRangeInput`; persist the year range when its debounced `onChange` reaches `useSearchState`, without adding a second year debounce.
- Sort and multi-select changes: update local state and persist those fields immediately.
- Reset: cancel pending writes, restore defaults immediately, and remove all search-owned URL parameters while preserving unrelated parameters.

Use field-aware pending updates. An immediate sort or selection change must not accidentally flush a still-debounced text draft into the URL. Conversely, a delayed text write must preserve newer sort, selection, year, and unrelated parameter changes. Read the current URL at commit time and merge only the fields being committed.

Write with native `window.history.replaceState(null, "", relativeUrl)` to avoid adding a history entry for each edit or requesting a new Server Component payload. Skip no-op writes. Keep existing Next.js history metadata behavior intact, following the installed version's documented integration.

Do not call `router.refresh` or use router navigation for ordinary filter edits.

## 4. Handle draft cancellation and navigation races

Navigation must win over stale interactions:

1. Cancel pending URL timers.
2. Invalidate delayed callbacks from the previous interaction generation.
3. Restore local state from the new URL.
4. Discard pending year-control drafts, even when the restored year range equals the previous controlled value.

`MultiRangeInput` currently cancels its pending callback when its controlled range changes. That does not cover navigation that changes only the term or sort while leaving the year range unchanged. Add an explicit reset mechanism or remount the range control on external-navigation revisions so its old draft cannot fire after restoration. Do not remount it for ordinary input updates or self-authored URL writes.

Prevent pending text writes and slider callbacks from modifying another route after navigation. Clean up subscriptions and timers on unmount. Ensure setup and cleanup are safe under React Strict Mode.

## 5. Add targeted tests

### URL helpers

- Defaults for empty URLs.
- Round trips for every field, including repeated array values, Unicode, commas, and reserved characters.
- Invalid sort/year values and year-range bounds.
- Removal of defaults and empty selections.
- Preservation of unrelated parameters.

### Hook and component integration

- Existing default state and search-option mappings remain unchanged.
- Direct visits restore controls and search options without an initial URL overwrite.
- Text updates immediately; the URL changes only after the persistence debounce.
- Slider display updates immediately; its existing debounce controls the year commit without an additional delay.
- Sort and selections persist immediately without prematurely persisting a text draft.
- Multiple batched updates preserve all fields.
- Reset removes search-owned parameters and cancels pending writes.
- Back/Forward restores controls and results.
- Client-side route/query navigation restores state as well.
- Navigation during a text debounce cannot be overwritten by its old timer.
- Navigation during a slider debounce cancels the old draft, including when the destination has the same year range.
- Self-authored URL writes do not reset newer local drafts.
- Leaving `/search` or unmounting prevents later URL writes.
- History length, unrelated parameters, and hash remain unchanged by persistence.
- Strict Mode does not cause duplicate subscriptions or stale writes.

Use fake timers for debounce tests and retain the existing hook behavior tests.

## 6. Verify and review

Before implementation, read the relevant installed Next.js guides under `apps/website/node_modules/next/dist/docs/`, particularly native history integration, search parameters, navigation, and static rendering requirements.

Run focused Vitest tests for the URL helpers, search hook, and affected range control using `pnpm`, then targeted website typecheck and lint. For lint failures, run the affected package's autofix command first.

Before finishing code changes, run from the repository root:

```bash
pnpm turbo typecheck lint test build
```

Investigate failures and fix only those caused by this implementation. Report unrelated failures or checks that could not run. Do not modify existing unrelated worktree changes.

Manually check typing, continuous slider dragging, shared links, reload, reset, and Back/Forward in the browser. Confirm that persistence causes no server navigation and that controls remain responsive.

## Acceptance criteria

- Search URLs restore the persisted term, filters, sorting, and year range.
- Text and year controls remain immediately responsive.
- URL persistence is debounced where appropriate, independently of search execution.
- External navigation wins over pending drafts and timers.
- Reset produces a clean search URL while preserving unrelated URL state.
- Search engine construction and caching remain unchanged.

This document is a plan only; it does not implement URL synchronization.
