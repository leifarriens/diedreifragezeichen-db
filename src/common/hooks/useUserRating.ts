import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { getUserRating, postUserRating } from '@/services/client';

type QueryOptions = {
  onMutationSuccess: () => void;
};

export function useUserRating(
  folge_id: string,
  { onMutationSuccess }: QueryOptions,
) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const queryKey = [folge_id, session?.user.id];

  const query = useQuery(queryKey, () => getUserRating(folge_id), {
    enabled: status === 'authenticated',
    retry: false,
  });

  const mutation = useMutation(postUserRating, {
    onSuccess: (newRating) => {
      queryClient.setQueryData(queryKey, newRating);
      onMutationSuccess();
    },
  });

  const isLoading = query.isLoading || mutation.isLoading;

  return { userRating: query.data, isLoading, mutate: mutation.mutate };
}
