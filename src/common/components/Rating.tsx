import { signIn, useSession } from 'next-auth/react';
import toast from 'react-hot-toast';

import { useUserRating } from '@/hooks';

import RatingInput from './RatingInput';

interface RatingProps {
  folge_id: string;
  folge_name: string;
}

export default function Rating({ folge_id, folge_name }: RatingProps) {
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

  const disabled = status === 'loading' || isLoading;

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
        disabled={disabled}
      />
    </>
  );
}
