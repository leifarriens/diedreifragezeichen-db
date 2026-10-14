import { describe, expect, it } from "vitest";

import {
  createDefaultSearchState,
  readSearchState,
  writeSearchState,
} from "./search-state-url";

describe("search state URL helpers", () => {
  const defaults = createDefaultSearchState(2026);

  it("reads defaults from an empty URL", () => {
    expect(readSearchState("", 2026)).toEqual(defaults);
  });

  it("round trips every field, repeated selections, and reserved Unicode values", () => {
    const state = {
      ...defaults,
      authors: ["André Marx", "Ben, Nevis", "author & writer"],
      collections: ["spezial" as const, "serie" as const],
      roles: ["Hugenay", "Dorette + Hugo"],
      scriptAuthors: ["André Minninger"],
      sort: "rating" as const,
      speakers: ["Inspector / Jones", ""],
      term: "Hugenay? #1 & friends",
      yearRange: { max: 2020, min: 1990 },
    };

    const search = writeSearchState("", state, 2026);

    expect(new URLSearchParams(search).getAll("authors")).toEqual(
      state.authors,
    );
    expect(readSearchState(search, 2026)).toEqual({
      ...state,
      speakers: ["Inspector / Jones"],
    });
  });

  it("removes defaults, empty values, and duplicate selections", () => {
    const search = writeSearchState(
      "?q=old&sort=rating&authors=old&authors=old&yearFrom=1990&yearTo=2000",
      {
        ...defaults,
        authors: ["André Marx", "", "André Marx"],
        speakers: [""],
      },
      2026,
    );

    expect(new URLSearchParams(search).has("q")).toBe(false);
    expect(new URLSearchParams(search).has("sort")).toBe(false);
    expect(new URLSearchParams(search).has("yearFrom")).toBe(false);
    expect(new URLSearchParams(search).has("yearTo")).toBe(false);
    expect(new URLSearchParams(search).getAll("authors")).toEqual([
      "André Marx",
    ]);
    expect(new URLSearchParams(search).has("speakers")).toBe(false);
  });

  it("ignores unsupported sort values and clamps invalid years to a valid interval", () => {
    expect(
      readSearchState(
        "?sort=popular&yearFrom=999999999999999999999&yearTo=invalid",
        2026,
      ),
    ).toEqual(defaults);
    expect(
      readSearchState("?yearFrom=2025&yearTo=1980", 2026).yearRange,
    ).toEqual({ max: 1980, min: 1979 });
    expect(
      readSearchState("?yearFrom=1900&yearTo=3000", 2026).yearRange,
    ).toEqual({ max: 2026, min: 1979 });
  });

  it("preserves unrelated parameters while committing only selected fields", () => {
    const search = writeSearchState(
      "?utm_source=shared&q=old&authors=Andr%C3%A9+Marx&yearTo=2020",
      { ...defaults, sort: "oldest", term: "new" },
      2026,
      ["term"],
    );

    const params = new URLSearchParams(search);
    expect(params.get("utm_source")).toBe("shared");
    expect(params.get("q")).toBe("new");
    expect(params.get("sort")).toBeNull();
    expect(params.getAll("authors")).toEqual(["André Marx"]);
    expect(params.get("yearTo")).toBe("2020");
  });
});
