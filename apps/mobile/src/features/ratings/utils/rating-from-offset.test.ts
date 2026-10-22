import { describe, expect, it } from "vitest";

import { ratingFromOffset } from "./rating-from-offset";

describe("ratingFromOffset", () => {
  it("maps the control into the six half-point ratings", () => {
    expect(
      Array.from({ length: 6 }, (_, index) =>
        ratingFromOffset((index + 0.5) * 100, 600),
      ),
    ).toEqual([0.5, 1, 1.5, 2, 2.5, 3]);
  });

  it("clamps drags beyond either end to the endpoint ratings", () => {
    expect(ratingFromOffset(-20, 600)).toBe(0.5);
    expect(ratingFromOffset(620, 600)).toBe(3);
  });

  it("returns null when the control has no measurable width", () => {
    expect(ratingFromOffset(0, 0)).toBeNull();
    expect(ratingFromOffset(20, Number.NaN)).toBeNull();
  });
});
