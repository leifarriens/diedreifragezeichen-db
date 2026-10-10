"use client";

import { useToastManager } from "@/components/ui/toast/toast";

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
  const toastManager = useToastManager();

  const { isLoading: isUserRatingLoading, rating } =
    useUserFolgenRating(folgeId);

  const { isLoading, ratingMutation } = useUpdateRating();

  function handleRatingChange(score: number) {
    ratingMutation.mutate(
      { folgeId, score },
      {
        onSuccess() {
          toastManager.add({
            timeout: 300_000,
            title: "Rating updated successfully",
          });
        },
      },
    );
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
