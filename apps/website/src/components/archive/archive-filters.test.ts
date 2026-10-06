import { describe, expect, it } from "vitest";

import { readArchiveFilters, writeArchiveFilters } from "./archive-filters";

const CURRENT_YEAR = 2026;

describe("archive filter query parameters", () => {
  it("uses defaults for an empty URL", () => {
    expect(readArchiveFilters("", CURRENT_YEAR)).toEqual({
      includeSpecials: false,
      searchTerm: "",
      sortOrder: "newest",
      yearRange: { max: CURRENT_YEAR, min: 1979 },
    });
  });

  it("round-trips search, sorting, specials and years", () => {
    const filters = {
      includeSpecials: true,
      searchTerm: "Geister & ??? ä",
      sortOrder: "oldest",
      yearRange: { max: 2020, min: 1990 },
    } as const;
    expect(
      readArchiveFilters(
        writeArchiveFilters("", filters, CURRENT_YEAR),
        CURRENT_YEAR,
      ),
    ).toEqual(filters);
  });

  it("removes default filters and preserves unrelated parameters", () => {
    expect(
      writeArchiveFilters(
        "?q=test&sort=oldest&specials=1&yearFrom=1990&yearTo=2000&utm_source=link",
        readArchiveFilters("", CURRENT_YEAR),
        CURRENT_YEAR,
      ),
    ).toBe("utm_source=link");
  });

  it.each(["invalid", "", "2000.5", "Infinity", "999999999999999999999"])(
    "ignores invalid years: %s",
    (year) => {
      expect(
        readArchiveFilters(
          `?yearFrom=${year}&yearTo=${year}&sort=invalid&specials=false`,
          CURRENT_YEAR,
        ),
      ).toEqual(readArchiveFilters("", CURRENT_YEAR));
    },
  );

  it("clamps out-of-bounds years", () => {
    expect(
      readArchiveFilters("?yearFrom=1900&yearTo=2100", CURRENT_YEAR).yearRange,
    ).toEqual({ max: CURRENT_YEAR, min: 1979 });
    expect(readArchiveFilters("?yearTo=1900", CURRENT_YEAR).yearRange).toEqual({
      max: 1980,
      min: 1979,
    });
  });

  it("keeps reversed or equal years one step apart", () => {
    expect(
      readArchiveFilters("?yearFrom=2020&yearTo=1990", CURRENT_YEAR).yearRange,
    ).toEqual({ max: 1990, min: 1989 });
    expect(
      readArchiveFilters("?yearFrom=2000&yearTo=2000", CURRENT_YEAR).yearRange,
    ).toEqual({ max: 2000, min: 1999 });
  });
});
