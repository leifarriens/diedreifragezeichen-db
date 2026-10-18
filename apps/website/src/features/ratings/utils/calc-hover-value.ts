import type { RefObject } from "react";

import {
  FOLGEN_RATING_MAX,
  FOLGEN_RATING_MIN,
  FOLGEN_RATING_STEP,
} from "@ddfdb/core";

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

  const valueCount =
    (FOLGEN_RATING_MAX - FOLGEN_RATING_MIN) / FOLGEN_RATING_STEP + 1;
  const valueIndex = Math.min(
    valueCount - 1,
    Math.floor((offset / rect.width) * valueCount),
  );

  return FOLGEN_RATING_MIN + valueIndex * FOLGEN_RATING_STEP;
}
