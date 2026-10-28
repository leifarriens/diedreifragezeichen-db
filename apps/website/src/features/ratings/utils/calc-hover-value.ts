import {
  FOLGEN_RATING_MAX,
  FOLGEN_RATING_MIN,
  FOLGEN_RATING_STEP,
} from "@ddfdb/core";

export function calcHoverValue(offset: number, width: number) {
  if (
    !Number.isFinite(offset) ||
    !Number.isFinite(width) ||
    width <= 0 ||
    offset < 0 ||
    offset > width
  ) {
    return;
  }

  const valueCount =
    (FOLGEN_RATING_MAX - FOLGEN_RATING_MIN) / FOLGEN_RATING_STEP + 1;
  const valueIndex = Math.min(
    valueCount - 1,
    Math.floor((offset / width) * valueCount),
  );

  return FOLGEN_RATING_MIN + valueIndex * FOLGEN_RATING_STEP;
}
