import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';

import { API } from '@/services/client';
import { ApiResponse, ReviewWithUser } from '@/types';

export const folgenReviewsQueryKey = (folgeId: string) => {
  return ['folge', folgeId, 'reviews'];
};

export function useInfiniteFolgenReviews(
  folgeId: string,
  options: { limit?: number } & Pick<UseInfiniteQueryOptions, 'enabled'> = {},
) {
  const { limit = 4 } = options;

  const fetchFolgenReviews = async ({ pageParam = 0 }) => {
    const { data } = await API.get<ApiResponse<ReviewWithUser[]>>(
      `/folgen/${folgeId}/reviews`,
      {
        params: { limit, offset: pageParam },
      },
    );
    return data;
  };

  return useInfiniteQuery(folgenReviewsQueryKey(folgeId), fetchFolgenReviews, {
    getNextPageParam: (lastPage) => {
      if (lastPage.offset + limit < lastPage.total)
        return lastPage.offset + limit;

      return undefined;
    },
    ...options,
  });
}
