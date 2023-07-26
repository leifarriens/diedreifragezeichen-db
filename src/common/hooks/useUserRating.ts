import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

export function useUserRating(folge_id: string) {
  const { status } = useSession();
  const utils = trpc.useContext();

  const ratingsQuery = trpc.rating.userRatings.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  const userRating = ratingsQuery.data?.find(
    (rating) => rating.folge === folge_id,
  )?.value;

  const addMutation = trpc.rating.add.useMutation({
    onSuccess: async () => {
      await utils.rating.userRatings.invalidate();
      await utils.rating.userRatingsWithFolgen.invalidate(undefined, {
        type: 'all',
      });
    },
  });

  const revokeMutation = trpc.rating.revoke.useMutation({
    onSuccess: async () => {
      await utils.rating.userRatings.invalidate();
      await utils.rating.userRatingsWithFolgen.invalidate(undefined, {
        type: 'all',
      });
    },
  });

  const isLoading = ratingsQuery.isFetching || addMutation.isLoading;

  return { userRating, isLoading, revokeMutation, addMutation };
}
