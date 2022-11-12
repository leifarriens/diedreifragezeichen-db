import { useSession } from 'next-auth/react';
import { trpc } from 'utils/trpc';

type QueryOptions = {
  onMutationSuccess: () => void;
};

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
    onSuccess: () => {
      utils.user.rating.invalidate();
      onMutationSuccess();
    },
  });

  const isLoading = query.isFetching || mutation.isLoading;
  const error = query.error || mutation.error;

  return { userRating: query.data, isLoading, error, mutate: mutation.mutate };
}
