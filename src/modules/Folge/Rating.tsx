import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { RatingInput } from '@/components/RatingInput';
import { useUserRating } from '@/hooks';

interface UserRatingProps {
  folge_id: string;
  folge_name: string;
}

export function UserRating({ folge_id, folge_name }: UserRatingProps) {
  const { data: session, status } = useSession();

  const { userRating, isLoading, mutate } = useUserRating(folge_id, {
    onMutationSuccess() {
      toast(
        <span>
          Bewertung für <i>{folge_name}</i> gespeichert
        </span>,
      );
    },
  });

  const isDisabled = status === 'loading' || isLoading;

  function handleNewRating(newRating: number) {
    if (!session) return signIn();

    if (newRating === userRating) {
      return;
    }

    return mutate({ folgeId: folge_id, value: newRating });
  }

  return (
    <>
      <div className="text-lg">
        {userRating ? 'Deine Wertung:' : 'Bewerten:'}
      </div>
      <RatingInput
        defaultValue={userRating}
        onRate={handleNewRating}
        disabled={isDisabled}
      />
    </>
  );
}

interface ComminityRatingProps {
  numerOfRatings: number;
  rating: number;
  className?: string;
}

export function CommunityRating({
  numerOfRatings,
  rating,
  className,
}: ComminityRatingProps) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
      <span style={{ fontSize: '1.35em', fontWeight: 500 }}>
        {numerOfRatings >= 1 ? rating : '???'}
      </span>
      /10
    </div>
  );
}
