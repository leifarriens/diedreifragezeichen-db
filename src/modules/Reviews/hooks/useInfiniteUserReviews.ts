import { useInfiniteQuery, UseInfiniteQueryOptions } from 'react-query';

import { API } from '@/services/client';
import { ApiResponse, RatingWithFolge } from '@/types';

export const userReviewsQueryKey = (userId: string) => {
  return ['user', userId, 'reviews'];
};

export function useInfiniteUserReviews(
  userId: string,
  options: { limit?: number } & Pick<UseInfiniteQueryOptions, 'enabled'> = {},
) {
  const { limit = 4 } = options;

  const fetchUserReviews = async ({ pageParam = 0 }) => {
    const { data } = await API.get<ApiResponse<RatingWithFolge[]>>(
      `/users/${userId}/reviews`,
      {
        params: { limit, offset: pageParam },
      },
    );
    return data;
  };

  return useInfiniteQuery(userReviewsQueryKey(userId), fetchUserReviews, {
    getNextPageParam: (lastPage) => {
      if (lastPage.offset + limit < lastPage.total)
        return lastPage.offset + limit;

      return undefined;
    },
    ...options,
  });
}
