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
  const inputBoundsRef = useRef<null | Pick<DOMRect, "left" | "width">>(null);

  function handleMouseEnter(e: React.MouseEvent<HTMLDivElement>) {
    const { left, width } = e.currentTarget.getBoundingClientRect();
    inputBoundsRef.current = { left, width };
  }

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    const bounds = inputBoundsRef.current;
    if (!bounds) return;

    const nextValue = calcHoverValue(
      e.nativeEvent.clientX - bounds.left,
      bounds.width,
    );
    if (
      nextValue !== undefined &&
      nextValue >= FOLGEN_RATING_MIN &&
      nextValue <= FOLGEN_RATING_MAX
    ) {
      setPreviewValue(nextValue);
    }
  }

  function reset() {
    inputBoundsRef.current = null;
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

    if (localValue === value) {
      return;
    }

    onValueChange(localValue);
  }

  return (
    <div>
      {/* The transparent input needs its browser-style focus outline on the visible wrapper. */}
      <div className="relative w-fit has-[input:focus-visible]:[outline:auto]">
        <input
          aria-label={`Deine Bewertung für ${folgenTitle}`}
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
          onMouseEnter={handleMouseEnter}
          onMouseMove={handleMouseMove}
          onMouseOut={reset}
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
