"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { authClient } from "@/lib/auth-client";
import { useTRPC } from "@/trpc/client";

import { FolgenRatingInput } from "./folgen-rating-input";

interface FolgenUserRatingProps {
  folgeId: number;
}

export function FolgenUserRating({ folgeId }: FolgenUserRatingProps) {
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

  const setRating = useMutation(
    trpc.ratings.set.mutationOptions({
      onMutate({ folgeId, score }) {
        queryClient.setQueryData(
          trpc.ratings.getForFolge.queryKey({ folgeId }),
          () => ({ folgeId, score, updatedAt: new Date().toISOString() }),
        );
      },
      onSuccess(data) {
        queryClient.setQueryData(trpc.ratings.getMine.queryKey(), (prev) =>
          prev ? [...prev.filter((r) => r.folgeId !== folgeId), data] : [data],
        );
      },
    }),
  );

  // TODO: Implement
  // const deleteRating = useMutation(
  //   trpc.ratings.remove.mutationOptions({
  //     onSuccess() {
  //       queryClient.setQueryData(
  //         trpc.ratings.getForFolge.queryKey({ folgeId }),
  //         undefined,
  //       );
  //       queryClient.setQueryData(trpc.ratings.getMine.queryKey(), (prev) => {
  //         return prev ? prev.filter((r) => r.folgeId !== folgeId) : [];
  //       });
  //     },
  //   }),
  // );

  function handleRatingChange(score: number) {
    setRating.mutate({ folgeId, score });
  }

  return (
    <FolgenRatingInput
      onValueChange={handleRatingChange}
      value={rating.data?.score ?? null}
    />
  );
}
