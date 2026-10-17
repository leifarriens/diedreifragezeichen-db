"use client";

import type { CSSProperties } from "react";

import { useEffect, useRef, useState } from "react";
import { cn } from "tailwind-variants";

import styles from "./multi-range-input.module.css";

const THUMB_SIZE = 24;

export interface RangeChangeEvent {
  max: number;
  min: number;
}

interface MultiRangeInputProps {
  debounceMs?: number | undefined;
  max: number;
  maxAriaLabel: string;
  min: number;
  minAriaLabel: string;
  onChange: (event: RangeChangeEvent) => void;
  value: RangeChangeEvent;
}

export function MultiRangeInput({
  debounceMs = 0,
  max,
  maxAriaLabel,
  min,
  minAriaLabel,
  onChange,
  value,
}: MultiRangeInputProps) {
  const [draft, setDraft] = useState<null | {
    base: RangeChangeEvent;
    value: RangeChangeEvent;
  }>(null);
  const timeoutRef = useRef<null | ReturnType<typeof setTimeout>>(null);
  const range =
    draft && areRangesEqual(draft.base, value) ? draft.value : value;
  const { max: maxValue, min: minValue } = range;
  const minPercent = getPercent(minValue, min, max);
  const maxPercent = getPercent(maxValue, min, max);

  useEffect(() => {
    if (draft && !areRangesEqual(draft.base, value) && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
  }, [draft, value]);

  useEffect(
    () => () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    },
    [],
  );

  function handleChange(nextRange: RangeChangeEvent) {
    if (debounceMs <= 0) {
      onChange(nextRange);
      return;
    }

    setDraft({ base: value, value: nextRange });
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(() => {
      timeoutRef.current = null;
      setDraft(null);
      onChange(nextRange);
    }, debounceMs);
  }

  function handleMinChange(value: string) {
    handleChange({
      max: maxValue,
      min: Math.min(Math.max(Number(value), min), maxValue - 1),
    });
  }

  function handleMaxChange(value: string) {
    handleChange({
      max: Math.max(Math.min(Number(value), max), minValue + 1),
      min: minValue,
    });
  }

  return (
    <div
      className="relative h-16 w-full max-w-[560px]"
      style={{ "--thumb-size": `${THUMB_SIZE.toString()}px` } as CSSProperties}
    >
      <div
        aria-hidden="true"
        className="absolute top-5 right-0 left-0 z-[1] h-2 rounded bg-white/90"
      />
      <div
        aria-hidden="true"
        className="absolute top-5 z-[2] h-2 rounded bg-ddf-blue"
        style={{
          left: `${minPercent.toString()}%`,
          width: `${(maxPercent - minPercent).toString()}%`,
        }}
      />

      <input
        aria-label={minAriaLabel}
        className={cn(
          styles.rangeInput,
          "absolute inset-x-0 top-3 z-[3] h-6 w-full",
          minValue > max - 100 && "z-[5]",
        )}
        max={max}
        min={min}
        onChange={(event) => {
          handleMinChange(event.currentTarget.value);
        }}
        type="range"
        value={minValue}
      />
      <input
        aria-label={maxAriaLabel}
        className={cn(
          styles.rangeInput,
          "absolute inset-x-0 top-3 z-[4] h-6 w-full",
        )}
        max={max}
        min={min}
        onChange={(event) => {
          handleMaxChange(event.currentTarget.value);
        }}
        type="range"
        value={maxValue}
      />

      <span
        className="absolute top-10 z-[6] -translate-x-1/2 text-xs font-medium text-white tabular-nums"
        style={{ left: getThumbCenterPosition(minPercent) }}
      >
        {minValue}
      </span>
      <span
        className="absolute top-10 z-[6] -translate-x-1/2 text-xs font-medium text-white tabular-nums"
        style={{ left: getThumbCenterPosition(maxPercent) }}
      >
        {maxValue}
      </span>
    </div>
  );
}

function areRangesEqual(left: RangeChangeEvent, right: RangeChangeEvent) {
  return left.min === right.min && left.max === right.max;
}

function getPercent(value: number, min: number, max: number) {
  if (max <= min) return 0;
  return ((value - min) / (max - min)) * 100;
}

function getThumbCenterPosition(percent: number) {
  const offset = (THUMB_SIZE / 2) * (1 - (percent / 100) * 2);
  const operator = offset < 0 ? "-" : "+";
  return `calc(${percent.toString()}% ${operator} ${Math.abs(offset).toString()}px)`;
}
