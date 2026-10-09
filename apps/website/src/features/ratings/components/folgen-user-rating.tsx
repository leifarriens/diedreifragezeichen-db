"use client";

import { useUserFolgenRating } from "@/features/ratings/hooks/use-user-folgen-rating";

import { useUpdateRating } from "../hooks/use-ratings";
import { FolgenRatingInput } from "./folgen-rating-input";

interface FolgenUserRatingProps {
  folgeId: number;
  folgenTitle: string;
}

export function FolgenUserRating({
  folgeId,
  folgenTitle,
}: FolgenUserRatingProps) {
  const rating = useUserFolgenRating(folgeId);

  const { isLoading, setRating } = useUpdateRating(folgeId);

  function handleRatingChange(score: number) {
    setRating(score);
  }

  return (
    <FolgenRatingInput
      folgenTitle={folgenTitle}
      isDisabled={isLoading}
      onValueChange={handleRatingChange}
      value={rating?.score ?? null}
    />
  );
}
