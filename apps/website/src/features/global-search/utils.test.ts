import { describe, expect, it } from "vitest";

import { normalizeSearchQuery } from "./utils";

describe("normalizeSearchQuery", () => {
  it.each([
    ["Geister", "geister"],
    ["  GEISTER\t", "geister"],
    ["\nÄRGER ÜBER ÖL\u00a0", "ärger über öl"],
    ["Straße", "straße"],
    ["Geister  Schloss", "geister  schloss"],
    ["  \t\n", ""],
    ["", ""],
  ])("normalizes %j to %j", (query, expected) => {
    expect(normalizeSearchQuery(query)).toBe(expected);
    expect(normalizeSearchQuery(expected)).toBe(expected);
  });
});
