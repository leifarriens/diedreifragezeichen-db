// @vitest-environment jsdom

import type { ReactNode } from "react";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { cleanup, renderHook, waitFor } from "@testing-library/react";
import { createElement } from "react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSearch } from "./use-search";

afterEach(() => {
  cleanup();
  vi.unstubAllGlobals();
});

function createWrapper() {
  const queryClient = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });

  function Wrapper({ children }: { children: ReactNode }) {
    return createElement(
      QueryClientProvider,
      { client: queryClient },
      children,
    );
  }

  return { queryClient, wrapper: Wrapper };
}

describe("useSearch", () => {
  it("uses one normalized URL and cache entry for equivalent queries", async () => {
    const results = [{ cover: null, id: 1, title: "Geisterhaus" }];
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ results })));
    vi.stubGlobal("fetch", fetchMock);
    const { queryClient, wrapper } = createWrapper();

    const { rerender, result } = renderHook(
      ({ query }) => useSearch(query, { enabled: true }),
      { initialProps: { query: "  Geister  " }, wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledWith("/api/v0/search?q=geister", {
      signal: expect.any(AbortSignal) as AbortSignal,
    });
    expect(queryClient.getQueryData(["search", "geister"])).toEqual(results);

    rerender({ query: "GEISTER" });
    rerender({ query: "\tgeister\n" });

    expect(result.current.data).toEqual(results);
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(queryClient.getQueryCache().getAll()).toHaveLength(1);
  });

  it("URL-encodes normalized queries without changing internal whitespace", async () => {
    const fetchMock = vi
      .fn()
      .mockResolvedValue(new Response(JSON.stringify({ results: [] })));
    vi.stubGlobal("fetch", fetchMock);
    const { queryClient, wrapper } = createWrapper();
    const normalizedQuery = "ärger  & öl";

    const { result } = renderHook(
      () => useSearch("  ÄRGER  & ÖL  ", { enabled: true }),
      { wrapper },
    );

    await waitFor(() => {
      expect(result.current.isSuccess).toBe(true);
    });

    expect(fetchMock).toHaveBeenCalledWith(
      `/api/v0/search?q=${encodeURIComponent(normalizedQuery)}`,
      { signal: expect.any(AbortSignal) as AbortSignal },
    );
    expect(queryClient.getQueryData(["search", normalizedQuery])).toEqual([]);
  });

  it.each(["   ", "  A  ", "  AB  "])(
    "does not fetch a normalized query shorter than three characters: %j",
    (query) => {
      const fetchMock = vi.fn();
      vi.stubGlobal("fetch", fetchMock);
      const { wrapper } = createWrapper();

      const { result } = renderHook(() => useSearch(query, { enabled: true }), {
        wrapper,
      });

      expect(result.current.fetchStatus).toBe("idle");
      expect(fetchMock).not.toHaveBeenCalled();
    },
  );
});
