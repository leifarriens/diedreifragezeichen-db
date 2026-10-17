// @vitest-environment jsdom

import { act, cleanup, renderHook } from "@testing-library/react";
import { afterEach, describe, expect, it } from "vitest";

import { type SearchSort, useSearchState } from "./use-search-state";

afterEach(cleanup);

describe("useSearchState", () => {
  it("initializes the existing defaults without UI presentation data", () => {
    const { result } = renderHook(() => useSearchState(2026));

    expect(result.current.state).toEqual({
      authors: [],
      collections: [],
      roles: [],
      scriptAuthors: [],
      sort: "newest",
      speakers: [],
      term: "",
      yearRange: { max: 2026, min: 1979 },
    });
    expect(result.current.searchCriteria).toEqual({
      filters: {
        authors: [],
        collections: [],
        roles: [],
        script_authors: [],
        speakers: [],
        yearRange: { max: 2026, min: 1979 },
      },
      sort: { by: "release_date", order: "DESC" },
      term: "",
    });
  });

  it("merges batched partial updates without losing unrelated fields", () => {
    const { result } = renderHook(() => useSearchState(2026));
    const updateState = result.current.updateState;
    const previousState = result.current.state;

    act(() => {
      updateState({ speakers: ["Dorette Hugo"], term: "Hugenay" });
      updateState({ authors: ["André Marx"], roles: ["Hugenay"] });
      updateState({
        collections: ["specials"],
        scriptAuthors: ["André Minninger"],
        yearRange: { max: 2020, min: 1990 },
      });
    });

    expect(result.current.searchCriteria).toEqual({
      filters: {
        authors: ["André Marx"],
        collections: ["specials"],
        roles: ["Hugenay"],
        script_authors: ["André Minninger"],
        speakers: ["Dorette Hugo"],
        yearRange: { max: 2020, min: 1990 },
      },
      sort: { by: "release_date", order: "DESC" },
      term: "Hugenay",
    });
    expect(result.current.updateState).toBe(updateState);
    expect(previousState.term).toBe("");
    expect(previousState.authors).toEqual([]);
  });

  it.each<{ by: string; order: string; sort: SearchSort }>([
    { by: "release_date", order: "DESC", sort: "newest" },
    { by: "release_date", order: "ASC", sort: "oldest" },
    { by: "communityRating", order: "DESC", sort: "rating" },
  ])("maps $sort to the engine sort option", ({ by, order, sort }) => {
    const { result } = renderHook(() => useSearchState(2026));

    act(() => {
      result.current.updateState({ sort });
    });

    expect(result.current.state.sort).toBe(sort);
    expect(result.current.searchCriteria.sort).toEqual({ by, order });
  });

  it("clears selections and restores the default sort without clearing the term", () => {
    const { result } = renderHook(() => useSearchState(2026));

    act(() => {
      result.current.updateState({
        authors: ["André Marx"],
        sort: "rating",
        term: "Hugenay",
      });
    });
    act(() => {
      result.current.updateState({ authors: [], sort: "newest" });
    });

    expect(result.current.state.authors).toEqual([]);
    expect(result.current.state.sort).toBe("newest");
    expect(result.current.searchCriteria.sort).toEqual({
      by: "release_date",
      order: "DESC",
    });
    expect(result.current.state.term).toBe("Hugenay");
  });
});
