import { describe, expect, it } from "vitest";

import { calcHoverValue } from "./calc-hover-value";

const WIDTH = 120;

describe("calcHoverValue", () => {
  it.each([
    [0, 0.5],
    [20, 1],
    [40, 1.5],
    [60, 2],
    [80, 2.5],
    [100, 3],
    [120, 3],
  ])("maps horizontal offset %i to rating %f", (offset, expected) => {
    expect(calcHoverValue(offset, WIDTH)).toBe(expected);
  });

  it("switches values at each half-mark boundary", () => {
    expect(calcHoverValue(19, WIDTH)).toBe(0.5);
    expect(calcHoverValue(20, WIDTH)).toBe(1);
    expect(calcHoverValue(59, WIDTH)).toBe(1.5);
    expect(calcHoverValue(60, WIDTH)).toBe(2);
  });

  it.each([-1, WIDTH + 1])(
    "returns undefined when the pointer is outside the input at %i",
    (offset) => {
      expect(calcHoverValue(offset, WIDTH)).toBeUndefined();
    },
  );

  it.each([0, -1, Number.NaN, Number.POSITIVE_INFINITY])(
    "returns undefined when the input width is invalid: %s",
    (width) => {
      expect(calcHoverValue(0, width)).toBeUndefined();
    },
  );
});
