import type { RefObject } from "react";

const MIN_VALUE = 0.5;
const MAX_VALUE = 3;
const STEP = 0.5;

export function calcHoverValue(
  nativeEvent: MouseEvent,
  ref: RefObject<HTMLInputElement | null>,
) {
  const rect = ref.current?.getBoundingClientRect();

  if (!rect) {
    console.warn("Failed to get bounding client rect for input element");
    return;
  }

  if (rect.width <= 0) {
    return;
  }

  const offset = nativeEvent.clientX - rect.left;

  if (offset < 0 || offset > rect.width) {
    return;
  }

  const valueCount = (MAX_VALUE - MIN_VALUE) / STEP + 1;
  const valueIndex = Math.min(
    valueCount - 1,
    Math.floor((offset / rect.width) * valueCount),
  );

  return MIN_VALUE + valueIndex * STEP;
}
