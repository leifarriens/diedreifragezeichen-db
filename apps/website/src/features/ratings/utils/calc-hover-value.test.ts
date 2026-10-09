import type { RefObject } from "react";

import { describe, expect, it } from "vitest";

import { calcHoverValue } from "./calc-hover-value";

const MIN_VALUE = 0.5;
const MAX_VALUE = 3;
const LEFT = 40;
const WIDTH = 120;

function createInputRef(left = LEFT, width = WIDTH) {
  const input = {
    getBoundingClientRect: () => ({ left, width }) as DOMRect,
  };

  return { current: input } as unknown as RefObject<HTMLInputElement | null>;
}

function createMouseEvent(clientX: number) {
  return { clientX } as MouseEvent;
}

describe("calcHoverValue", () => {
  it.each([
    [0, MIN_VALUE],
    [20, 1],
    [40, 1.5],
    [60, 2],
    [80, 2.5],
    [100, MAX_VALUE],
    [120, MAX_VALUE],
  ])("maps horizontal offset %i to rating %f", (offset, expected) => {
    expect(
      calcHoverValue(createMouseEvent(LEFT + offset), createInputRef()),
    ).toBe(expected);
  });

  it("switches values at each half-mark boundary", () => {
    expect(calcHoverValue(createMouseEvent(LEFT + 19), createInputRef())).toBe(
      MIN_VALUE,
    );
    expect(calcHoverValue(createMouseEvent(LEFT + 20), createInputRef())).toBe(
      1,
    );
    expect(calcHoverValue(createMouseEvent(LEFT + 59), createInputRef())).toBe(
      1.5,
    );
    expect(calcHoverValue(createMouseEvent(LEFT + 60), createInputRef())).toBe(
      2,
    );
  });

  it.each([LEFT - 1, LEFT + WIDTH + 1])(
    "returns undefined when the pointer is outside the input at %i",
    (clientX) => {
      expect(
        calcHoverValue(createMouseEvent(clientX), createInputRef()),
      ).toBeUndefined();
    },
  );
});
