// @vitest-environment jsdom

import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";

import { useSearchState } from "./use-search-state";

const CURRENT_YEAR = 2026;

function restoreUrl(result: ReturnType<typeof useSearchState>, url: string) {
  setUrl(url);
  act(() => {
    result.onExternalNavigation(
      window.location.pathname,
      window.location.search,
    );
  });
}

function setUrl(url: string) {
  window.history.replaceState(null, "", url);
}

afterEach(() => {
  cleanup();
  vi.useRealTimers();
  vi.restoreAllMocks();
  setUrl("/");
});

describe("website useSearchState", () => {
  it("renders defaults first, then restores a direct search URL", () => {
    setUrl(
      "/search?q=Hugenay&sort=rating&authors=Andr%C3%A9+Marx&yearFrom=1990",
    );
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));

    expect(result.current.state).toEqual({
      authors: [],
      collections: [],
      roles: [],
      scriptAuthors: [],
      sort: "newest",
      speakers: [],
      term: "",
      yearRange: { max: CURRENT_YEAR, min: 1979 },
    });

    act(() => {
      result.current.onExternalNavigation(
        window.location.pathname,
        window.location.search,
      );
    });

    expect(result.current.state).toEqual({
      authors: ["André Marx"],
      collections: [],
      roles: [],
      scriptAuthors: [],
      sort: "rating",
      speakers: [],
      term: "Hugenay",
      yearRange: { max: CURRENT_YEAR, min: 1990 },
    });
    expect(result.current.searchCriteria.term).toBe("Hugenay");
    expect(result.current.searchCriteria.sort).toEqual({
      by: "communityRating",
      order: "DESC",
    });
  });

  it("updates text immediately and persists it after 250 ms", () => {
    vi.useFakeTimers();
    setUrl("/search?utm_source=shared#results");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(result.current, "/search?utm_source=shared#results");

    act(() => {
      result.current.updateState({ term: "Geister" });
    });

    expect(result.current.state.term).toBe("Geister");
    expect(new URLSearchParams(window.location.search).has("q")).toBe(false);
    act(() => {
      vi.advanceTimersByTime(249);
    });
    expect(new URLSearchParams(window.location.search).has("q")).toBe(false);

    act(() => {
      vi.advanceTimersByTime(1);
    });
    expect(new URLSearchParams(window.location.search).get("q")).toBe(
      "Geister",
    );
    expect(window.location.hash).toBe("#results");
    expect(new URLSearchParams(window.location.search).get("utm_source")).toBe(
      "shared",
    );
  });

  it("persists immediate fields without flushing a pending term draft", () => {
    vi.useFakeTimers();
    setUrl("/search?utm_source=shared");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(result.current, "/search?utm_source=shared");
    const replace = vi.spyOn(window.history, "replaceState");
    const push = vi.spyOn(window.history, "pushState");

    act(() => {
      result.current.updateState({ term: "draft" });
      result.current.updateState({ sort: "rating" });
    });

    expect(new URLSearchParams(window.location.search).get("sort")).toBe(
      "rating",
    );
    expect(new URLSearchParams(window.location.search).has("q")).toBe(false);
    expect(replace).toHaveBeenCalledTimes(1);
    expect(push).not.toHaveBeenCalled();
    act(() => {
      result.current.onExternalNavigation(
        window.location.pathname,
        window.location.search,
      );
    });
    expect(result.current.state.term).toBe("draft");

    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(new URLSearchParams(window.location.search).get("q")).toBe("draft");
    expect(new URLSearchParams(window.location.search).get("sort")).toBe(
      "rating",
    );
  });

  it("merges batched updates while preserving existing state and criteria", () => {
    setUrl("/search");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(result.current, "/search");

    act(() => {
      result.current.updateState({ authors: ["André Marx"] });
      result.current.updateState({ roles: ["Hugenay"], sort: "oldest" });
    });

    expect(result.current.state.authors).toEqual(["André Marx"]);
    expect(result.current.searchCriteria.filters?.roles).toEqual(["Hugenay"]);
    expect(result.current.searchCriteria.sort).toEqual({
      by: "release_date",
      order: "ASC",
    });
    expect(
      new URLSearchParams(window.location.search).getAll("authors"),
    ).toEqual(["André Marx"]);
    expect(new URLSearchParams(window.location.search).getAll("roles")).toEqual(
      ["Hugenay"],
    );
  });

  it("reset cancels text persistence and removes only search-owned parameters", () => {
    vi.useFakeTimers();
    setUrl("/search?utm_source=shared&q=old&authors=Andr%C3%A9+Marx#results");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(
      result.current,
      "/search?utm_source=shared&q=old&authors=Andr%C3%A9+Marx#results",
    );
    const historyLength = window.history.length;
    const push = vi.spyOn(window.history, "pushState");

    act(() => {
      result.current.updateState({ term: "pending" });
      result.current.resetState();
    });

    expect(result.current.state.term).toBe("");
    expect(result.current.state.authors).toEqual([]);
    expect(window.location.search).toBe("?utm_source=shared");
    expect(window.location.hash).toBe("#results");
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(window.location.search).toBe("?utm_source=shared");
    expect(push).not.toHaveBeenCalled();
    expect(window.history.length).toBe(historyLength);
  });

  it("lets external Back/Forward navigation win over a pending text write", () => {
    vi.useFakeTimers();
    setUrl("/search");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(result.current, "/search");

    act(() => {
      result.current.updateState({ term: "stale draft" });
    });
    setUrl("/search?q=restored&sort=oldest");
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current.state.term).toBe("restored");
    expect(result.current.state.sort).toBe("oldest");
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(new URLSearchParams(window.location.search).get("q")).toBe(
      "restored",
    );
  });

  it("restores on a navigation event even when the URL snapshot is unchanged", () => {
    vi.useFakeTimers();
    setUrl("/search");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(result.current, "/search");

    act(() => {
      result.current.updateState({ term: "unsaved draft" });
    });
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });

    expect(result.current.state.term).toBe("");
    act(() => {
      vi.advanceTimersByTime(250);
    });
    expect(window.location.search).toBe("");
  });

  it("invalidates range drafts on external query navigation even if years are unchanged", () => {
    setUrl("/search?yearFrom=1990");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(result.current, "/search?yearFrom=1990");
    const originalRevision = result.current.navigationRevision;

    setUrl("/search?q=external&yearFrom=1990");
    act(() => {
      result.current.onExternalNavigation(
        window.location.pathname,
        window.location.search,
      );
    });

    expect(result.current.navigationRevision).toBe(originalRevision + 1);
    expect(result.current.state.yearRange).toEqual({
      max: CURRENT_YEAR,
      min: 1990,
    });
  });

  it("does not persist stale callbacks after leaving the search route", () => {
    vi.useFakeTimers();
    setUrl("/search");
    const { result } = renderHook(() => useSearchState(CURRENT_YEAR));
    restoreUrl(result.current, "/search");

    act(() => {
      result.current.updateState({ term: "draft" });
    });
    setUrl("/folge/1");
    act(() => {
      window.dispatchEvent(new PopStateEvent("popstate"));
    });
    act(() => {
      vi.advanceTimersByTime(250);
    });

    expect(window.location.pathname).toBe("/folge/1");
    expect(window.location.search).toBe("");
  });
});
