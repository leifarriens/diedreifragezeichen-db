import { useSession } from 'next-auth/react';
import { trpc } from 'utils/trpc';

interface QueryOptions {
  onMutationSuccess: () => void;
}

export function useUserRating(
  folge_id: string,
  { onMutationSuccess }: QueryOptions,
) {
  const { status } = useSession();
  const utils = trpc.useContext();

  const query = trpc.user.rating.useQuery(
    { folgeId: folge_id },
    {
      enabled: status === 'authenticated',
      retry: false,
    },
  );

  const mutation = trpc.folge.addRating.useMutation({
    onSuccess: async () => {
      await utils.user.rating.invalidate();
      onMutationSuccess();
    },
  });

  const isLoading = query.isFetching || mutation.isLoading;

  return { userRating: query.data, isLoading, mutate: mutation.mutate };
}
