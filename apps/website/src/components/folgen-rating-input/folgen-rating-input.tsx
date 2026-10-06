"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";

import { Button } from "../button/button";

interface FolgenRatingInputProps {
  folgeId: number;
}

export function FolgenRatingInput({ folgeId }: FolgenRatingInputProps) {
  const [localValue, setLocalValue] = useState(1);
  const queryClient = useQueryClient();
  const { data: session } = authClient.useSession();
  const trpc = useTRPC();
  const rating = useQuery(
    trpc.ratings.getForFolge.queryOptions(
      { folgeId },
      {
        enabled: !!session,
      },
    ),
  );
  const setRating = useMutation(trpc.ratings.set.mutationOptions());
  const deleteRating = useMutation(trpc.ratings.remove.mutationOptions());

  function handleSetRating() {
    const score = localValue * 2;
    setRating.mutate(
      { folgeId, score },
      {
        onSuccess: (savedRating) => {
          queryClient.setQueryData(
            trpc.ratings.getForFolge.queryKey({ folgeId }),
            savedRating,
          );
          queryClient.setQueryData(trpc.ratings.getMine.queryKey(), (prev) =>
            prev
              ? [...prev.filter((r) => r.folgeId !== folgeId), savedRating]
              : [savedRating],
          );
        },
      },
    );
  }

  function handleDeleteRating() {
    deleteRating.mutate({ folgeId });
    queryClient.setQueryData(
      trpc.ratings.getForFolge.queryKey({ folgeId }),
      undefined,
    );
    queryClient.setQueryData(trpc.ratings.getMine.queryKey(), (prev) => {
      return prev ? prev.filter((r) => r.folgeId !== folgeId) : [];
    });
  }

  return (
    <div>
      {rating.data ? <p>Current rating: {rating.data.score / 2}</p> : null}
      <input
        max={3}
        min={0.5}
        onChange={(e) => {
          setLocalValue(Number(e.target.value));
        }}
        step={0.5}
        type="number"
        value={localValue}
      />
      <Button onClick={handleSetRating}>Save</Button>
      <Button onClick={handleDeleteRating}>Delete</Button>
    </div>
  );
}
