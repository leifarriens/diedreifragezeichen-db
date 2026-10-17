import { describe, expect, it } from "vitest";

import { formatFolgenSubtitle } from "./folge";

describe("formatFolgenSubtitle", () => {
  it("should return the correct subtitle for a given number", () => {
    expect(formatFolgenSubtitle(1)).toBe("Die drei ??? Folge: 1");
  });

  it("should return the correct subtitle when no number is provided", () => {
    expect(formatFolgenSubtitle()).toBe("Die drei ???");
  });
});
