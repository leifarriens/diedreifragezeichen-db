import { useSession } from 'next-auth/react';

import { trpc } from '@/utils/trpc';

interface QueryOptions {
  onMutationSuccess: () => void;
}

export function useUserRating(
  folge_id: string,
  { onMutationSuccess }: QueryOptions,
) {
  const { status } = useSession();
  const utils = trpc.useContext();

  const ratingsQuery = trpc.rating.userRatings.useQuery(undefined, {
    enabled: status === 'authenticated',
  });

  const userRating = ratingsQuery.data?.find(
    (rating) => rating.folge === folge_id,
  )?.value;

  const mutation = trpc.rating.add.useMutation({
    onSuccess: async () => {
      await utils.rating.userRatings.invalidate();
      await utils.rating.userRatingsWithFolgen.invalidate(undefined, {
        type: 'all',
      });
      onMutationSuccess();
    },
  });

  const isLoading = ratingsQuery.isFetching || mutation.isLoading;

  return { userRating, isLoading, mutate: mutation.mutate };
}
