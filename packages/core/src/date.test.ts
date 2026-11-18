import { afterEach, describe, expect, it, vi } from "vitest";

import {
  formatDateOnly,
  getDateTimestamp,
  getDateYear,
  isDateBefore,
  isDateWithinRange,
  isReleasDateInThePast,
  isValidDate,
} from "./date";

afterEach(() => {
  vi.useRealTimers();
});

describe("date utilities", () => {
  it("formats date-only values without exposing the date library", () => {
    expect(formatDateOnly("2024-02-03T12:30:00")).toBe("2024-02-03");
  });

  it("returns timestamps and years for valid dates", () => {
    expect(getDateTimestamp("2024-02-03")).toBe(new Date(2024, 1, 3).getTime());
    expect(getDateTimestamp(null)).toBe(Number.NaN);
    expect(getDateYear("2024-02-03")).toBe(2024);
    expect(isValidDate("2024-02-03")).toBe(true);
    expect(isValidDate("not a date")).toBe(false);
  });

  it("treats release dates up to and including today as released", () => {
    vi.useFakeTimers();
    vi.setSystemTime(new Date(2024, 1, 3, 12));
    expect(isReleasDateInThePast("2024-02-02")).toBe(true);
    expect(isReleasDateInThePast("2024-02-03T23:59:59")).toBe(true);
    expect(isReleasDateInThePast("2024-02-04")).toBe(false);
    expect(isReleasDateInThePast(null)).toBe(false);
  });

  it("compares exact instants and inclusive calendar-day ranges", () => {
    expect(isDateBefore("2024-02-03T11:59:59", "2024-02-03T12:00:00")).toBe(
      true,
    );
    expect(
      isDateWithinRange("2024-02-03T23:59:59", "2024-02-03", "2024-02-04"),
    ).toBe(true);
    expect(isDateWithinRange("not a date", null, null)).toBe(false);
    expect(isDateWithinRange("2024-02-03", "invalid", null)).toBe(false);
  });
});
