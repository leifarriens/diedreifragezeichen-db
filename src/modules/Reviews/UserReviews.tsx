import React from 'react';
import { InView } from 'react-intersection-observer';

import { Loader } from '@/components/shared/Loader';

import UserReview from './components/UserReview';
import { useInfiniteUserReviews } from './hooks/useInfiniteUserReviews';

type UserReviewsProps = {
  userId: string;
};

export default function UserReviews({ userId }: UserReviewsProps) {
  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteUserReviews(userId);

  return status === 'loading' ? (
    <Loader />
  ) : status === 'error' ? (
    <div>Error :(</div>
  ) : (
    <>
      {data?.pages.map((groupe, i) => (
        <React.Fragment key={i}>
          {groupe.items.map((review) => (
            <UserReview key={review._id} review={review} />
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage && <Loader />}

      <InView onChange={(inView) => inView && hasNextPage && fetchNextPage()} />
    </>
  );
}
