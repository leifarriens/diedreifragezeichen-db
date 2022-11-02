import { AxiosError } from 'axios';
import { useSession } from 'next-auth/react';
import { useMutation, useQuery, useQueryClient } from 'react-query';

import { RatingWithId } from '@/models/rating';
import { getUserRating, postUserRating } from '@/services/client';

type QueryOptions = {
  onMutationSuccess?: (rating: RatingWithId) => void;
};

export function useUserRating(
  folge_id: string,
  { onMutationSuccess }: QueryOptions = {},
) {
  const { data: session, status } = useSession();
  const queryClient = useQueryClient();

  const queryKey = [folge_id, session?.user.id, 'rating'];

  const rating = useQuery(queryKey, () => getUserRating(folge_id), {
    enabled: status === 'authenticated',
    retry: false,
  });

  const mutation = useMutation<
    RatingWithId,
    AxiosError,
    { folgeId: string; value: number; body?: string }
  >(postUserRating, {
    onSuccess: (newRating) => {
      queryClient.setQueryData(queryKey, newRating);
      onMutationSuccess && onMutationSuccess(newRating);
    },
  });

  const isLoading = rating.isLoading || mutation.isLoading;
  const error = rating.error || mutation.error;

  return { rating, isLoading, error, mutation };
}
