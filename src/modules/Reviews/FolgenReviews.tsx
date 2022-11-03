import { useSession } from 'next-auth/react';
import React from 'react';
import { useInView } from 'react-intersection-observer';

import Card from '@/components/shared/Card';
import { Loader } from '@/components/shared/Loader';

import { FolgenReview } from './components/FolgenReview';
import { ReviewForm } from './components/ReviewForm';
import { useInfiniteFolgenReviews } from './hooks/useInfiniteFolgenReviews';

type ReviewsProps = {
  folgeId: string;
};

export default function Reviews({ folgeId }: ReviewsProps) {
  const { data: session, status: sessionStatus } = useSession();
  const { ref, inView } = useInView({ triggerOnce: true });

  const { data, status, fetchNextPage, isFetchingNextPage, hasNextPage } =
    useInfiniteFolgenReviews(folgeId, { enabled: inView });

  return (
    <Card ref={ref}>
      <h3>Reviews</h3>

      {status === 'loading' ? (
        <Loader />
      ) : status === 'error' ? (
        <div>Error :(</div>
      ) : (
        <>
          {data?.pages.map((groupe, i) => (
            <React.Fragment key={i}>
              {groupe.items.map((review) => (
                <FolgenReview
                  key={review._id.toString()}
                  isUsers={session?.user.id === review.user._id}
                  {...review}
                />
              ))}
            </React.Fragment>
          ))}

          {isFetchingNextPage && <Loader />}

          {hasNextPage && (
            <button onClick={() => fetchNextPage()}>weitere laden...</button>
          )}
        </>
      )}

      {sessionStatus === 'authenticated' && (
        <ReviewForm folgeId={folgeId} user={session.user} />
      )}
    </Card>
  );
}
