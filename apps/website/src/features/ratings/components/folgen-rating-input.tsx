"use client";

import {
  FOLGEN_RATING_MAX,
  FOLGEN_RATING_MIN,
  FOLGEN_RATING_STEP,
} from "@ddfdb/core";
import { useRouter } from "next/navigation";
import { useRef, useState } from "react";

import { useAuth } from "@/features/auth/hooks/use-auth";

import { calcHoverValue } from "../utils/calc-hover-value";
import { FolgenRatingDisplay } from "./folgen-rating-display";

interface FolgenRatingInputProps {
  folgenTitle: string;
  isDisabled?: boolean;
  onValueChange: (value: number) => void;
  value: null | number;
}

export function FolgenRatingInput({
  folgenTitle,
  isDisabled,
  onValueChange,
  value,
}: FolgenRatingInputProps) {
  const { isAuthenticated, isPending } = useAuth();
  const router = useRouter();
  const [previewValue, setPreviewValue] = useState<null | number>(null);
  const localValue = previewValue ?? value ?? 0;
  const inputRef = useRef<HTMLInputElement>(null);

  function handleMouseMove(e: React.MouseEvent<HTMLInputElement>) {
    const nextValue = calcHoverValue(e.nativeEvent, inputRef);
    if (
      nextValue !== undefined &&
      nextValue >= FOLGEN_RATING_MIN &&
      nextValue <= FOLGEN_RATING_MAX
    ) {
      setPreviewValue(nextValue);
    }
  }

  function reset() {
    setPreviewValue(null);
  }

  function handleSubmit() {
    if (isPending) {
      return;
    }

    if (!isAuthenticated) {
      router.push("/login");
      return;
    }

    onValueChange(localValue);
  }

  return (
    <div>
      <div className="relative w-fit focus-within:ring-1">
        <input
          className="absolute inset-0 w-full min-w-0 opacity-0"
          disabled={isDisabled ?? isPending}
          max={FOLGEN_RATING_MAX}
          min={0} // Using 0 instead of FOLGEN_RATING_MIN to allow for a "no rating" state
          onChange={(e) => {
            setPreviewValue(Number(e.target.value));
          }}
          step={FOLGEN_RATING_STEP}
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
