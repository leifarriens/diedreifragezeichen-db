"use client";
import { useRef, useState } from "react";

import { calcHoverValue } from "../utils/calc-hover-value";
import { FolgenRatingDisplay } from "./folgen-rating-display";

const MAX_RATING = 3;
const RATING_STEP = 0.5;

interface FolgenRatingInputProps {
  folgenTitle: string;
  onValueChange: (value: number) => void;
  value: null | number;
}

export function FolgenRatingInput({
  folgenTitle,
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
        <FolgenRatingDisplay
          folgenTitle={folgenTitle}
          size="lg"
          type="user"
          value={localValue}
        />
      </div>
    </div>
  );
}
