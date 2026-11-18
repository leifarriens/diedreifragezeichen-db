"use client";

import Link from "next/link";

import { useToast } from "@/components/ui/toast/toast";

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
  const toastManager = useToast();

  const { isLoading: isUserRatingLoading, rating } =
    useUserFolgenRating(folgeId);

  const { isLoading, ratingMutation } = useUpdateRating();

  function handleRatingChange(score: number) {
    ratingMutation.mutate(
      { folgeId, score },
      {
        onSuccess() {
          toastManager.add({
            title: (
              <span>
                <Link className="underline" href="/profile/ratings">
                  Bewertung
                </Link>{" "}
                für &quot;<i>{folgenTitle}</i>&quot; gespeichert
              </span>
            ),
            type: "success",
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
