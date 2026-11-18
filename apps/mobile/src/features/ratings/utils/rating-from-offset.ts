import {
  FOLGEN_RATING_MAX,
  FOLGEN_RATING_MIN,
  FOLGEN_RATING_STEP,
} from "@ddfdb/core";

export function ratingFromOffset(offset: number, width: number): null | number {
  if (!Number.isFinite(offset) || !Number.isFinite(width) || width <= 0) {
    return null;
  }

  const valueCount =
    (FOLGEN_RATING_MAX - FOLGEN_RATING_MIN) / FOLGEN_RATING_STEP + 1;
  const clampedOffset = Math.max(0, Math.min(offset, width));
  const valueIndex = Math.min(
    valueCount - 1,
    Math.floor((clampedOffset / width) * valueCount),
  );

  return FOLGEN_RATING_MIN + valueIndex * FOLGEN_RATING_STEP;
}
