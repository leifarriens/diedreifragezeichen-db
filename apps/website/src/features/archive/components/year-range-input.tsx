import type { SearchState } from "@ddfdb/client";

import { useDebouncedCallback } from "@ddfdb/client/utils";
import { l } from "@ddfdb/core/labels";
import { useEffect, useState } from "react";

import { Slider } from "@/components/ui/slider/slider";

import { FIRST_RELEASE_YEAR } from "../archive-filters";

interface YearRangeInputProps {
  currentYear: number;
  debounceDelay?: number;
  onChange: (value: SearchState["yearRange"]) => void;
  yearRange: SearchState["yearRange"];
}

export function YearRangeInput({
  currentYear,
  debounceDelay = 200,
  onChange,
  yearRange,
}: YearRangeInputProps) {
  const [draftRange, setDraftRange] = useState<[number, number]>([
    yearRange.min,
    yearRange.max,
  ]);
  const [previousYearRange, setPreviousYearRange] = useState(yearRange);

  if (
    previousYearRange.min !== yearRange.min ||
    previousYearRange.max !== yearRange.max
  ) {
    setPreviousYearRange(yearRange);
    setDraftRange([yearRange.min, yearRange.max]);
  }

  const [updateYearRange, cancelUpdate] = useDebouncedCallback(
    ([min, max]: [number, number]) => {
      onChange({ max, min });
    },
    debounceDelay,
  );

  useEffect(() => {
    cancelUpdate();
  }, [cancelUpdate, yearRange.max, yearRange.min]);

  return (
    <Slider
      max={currentYear}
      min={FIRST_RELEASE_YEAR}
      onValueChange={(value) => {
        setDraftRange(value);
        updateYearRange(value);
      }}
      onValueCommitted={(value) => {
        cancelUpdate();
        const [min, max] = value;
        onChange({ max, min });
      }}
      step={1}
      thumbAriaLabels={[
        l.ARCHIVE.SORTING.YEAR_MIN_LABEL,
        l.ARCHIVE.SORTING.YEAR_MAX_LABEL,
      ]}
      value={draftRange}
    />
  );
}
