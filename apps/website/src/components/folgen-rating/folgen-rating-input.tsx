"use client";
import { useRef, useState } from "react";
import { cn } from "tailwind-variants";

import { QSvg } from "../icons/q";
import { calcHoverValue } from "./calc-hover-value";

const MAX_RATING = 3;
const RATING_STEP = 0.5;

interface FolgenRatingInputProps {
  onValueChange: (value: number) => void;
  value: null | number;
}

export function FolgenRatingInput({
  onValueChange,
  value,
}: FolgenRatingInputProps) {
  const [previewValue, setPreviewValue] = useState<null | number>(null);
  const localValue = previewValue ?? value ?? 0;
  const inputRef = useRef<HTMLInputElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLInputElement>) {
    const nextValue = calcHoverValue(e.nativeEvent, inputRef);
    if (nextValue !== undefined) {
      setPreviewValue(nextValue);
    }
  }

  function reset() {
    setPreviewValue(null);
  }

  function handleSubmit() {
    onValueChange(localValue);
  }

  return (
    <div>
      <div className="relative w-fit focus-within:ring-1">
        <input
          className="absolute inset-0 w-full min-w-0 opacity-0"
          max={MAX_RATING}
          min={0}
          onChange={(e) => {
            setPreviewValue(Number(e.target.value));
          }}
          step={RATING_STEP}
          type="range"
          value={localValue}
        />
        <div
          className="absolute inset-0 z-10 min-w-0 cursor-pointer"
          onClick={handleSubmit}
          onMouseMove={handleMouseMove}
          onMouseOut={reset}
          ref={inputRef}
        />
        <RatingDisplay value={localValue} />
      </div>
    </div>
  );
}

function RatingDisplay({
  className,
  value,
}: {
  className?: string;
  value: number;
}) {
  const filledCount = Math.ceil(value);

  const colors = ["#ffffff", "#e10613", "#009ee1"];

  return (
    <div className={cn("h-16 w-fit", className)}>
      <div className="relative h-full w-fit">
        <div className="flex h-full items-center gap-x-1 px-[2px] py-[1px]">
          {Array.from({ length: MAX_RATING }).map((_, index) => (
            <QSvg
              className="h-full w-auto opacity-30"
              color="#ffffff"
              key={`bg-q-${index.toString()}`}
            />
          ))}
        </div>

        <div className="absolute inset-0 flex items-center gap-x-1 px-[2px] py-[1px]">
          {Array.from({ length: filledCount }).map((_, index) => {
            const isLast = filledCount - 1 === index;
            const asHalf = isLast && value % 1 !== 0;

            return (
              <QSvg
                className="h-full w-auto animate-fade-in"
                color={colors[index]}
                key={`fg-q-${index.toString()}`}
                style={{ ...(asHalf && { clipPath: "inset(0 50% 0 0)" }) }}
              />
            );
          })}
        </div>
      </div>
    </div>
  );
}
