import { useSession } from 'next-auth/react';
import { useCallback, useMemo } from 'react';

import { trpc } from '@/utils/trpc';

export function useUserRating(folge_id: string) {
  const { status } = useSession();
  const utils = trpc.useUtils();

  const ratingsQuery = trpc.rating.userRatings.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  const userRating = useMemo(
    () => ratingsQuery.data?.find((rating) => rating.folge === folge_id)?.value,
    [ratingsQuery.data, folge_id],
  );

  const invalidateRatings = useCallback(async () => {
    await utils.rating.userRatings.invalidate();
    await utils.rating.userRatingsWithFolgen.invalidate(undefined, {
      type: 'all',
    });
  }, [utils.rating]);

  const addMutation = trpc.rating.add.useMutation({
    onSuccess: async () => {
      await invalidateRatings();
    },
  });

  const revokeMutation = trpc.rating.revoke.useMutation({
    onSuccess: async () => {
      await invalidateRatings();
    },
  });

  const isLoading = ratingsQuery.isFetching || addMutation.isLoading;

  return { userRating, isLoading, revokeMutation, addMutation };
}
