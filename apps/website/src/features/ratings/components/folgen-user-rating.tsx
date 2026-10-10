"use client";

import { useUpdateRating, useUserFolgenRating } from "../hooks/use-ratings";
import { FolgenRatingInput } from "./folgen-rating-input";

interface FolgenUserRatingProps {
  folgeId: number;
  folgenTitle: string;
}

export function FolgenUserRating({
  folgeId,
  folgenTitle,
}: FolgenUserRatingProps) {
  const { isLoading: isUserRatingLoading, rating } =
    useUserFolgenRating(folgeId);

  const { isLoading, setRating } = useUpdateRating(folgeId);

  function handleRatingChange(score: number) {
    setRating(score);
  }

  return (
    <FolgenRatingInput
      folgenTitle={folgenTitle}
      isDisabled={isUserRatingLoading || isLoading}
      onValueChange={handleRatingChange}
      value={rating?.score ?? null}
    />
  );
}
