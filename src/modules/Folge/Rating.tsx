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

  const { userRating, isLoading, addMutation, revokeMutation } =
    useUserRating(folge_id);

  const isDisabled = status === 'loading' || isLoading;

  function handleNewRating(newRating: number) {
    if (!session) return signIn();

    if (newRating === userRating) {
      return;
    }

    return addMutation.mutate(
      { folgeId: folge_id, value: newRating },
      {
        onSuccess() {
          toast(
            <span>
              Bewertung für <i>{folge_name}</i> gespeichert
            </span>,
          );
        },
      },
    );
  }

  function handleRevokeRating() {
    revokeMutation.mutate(
      { folgeId: folge_id },
      {
        onSuccess() {
          toast(
            <span>
              Bewertung für <i>{folge_name}</i> entfernt
            </span>,
          );
        },
      },
    );
  }

  return (
    <>
      <div className="group mb-1 inline-block text-lg">
        <span>{userRating ? 'Deine Wertung:' : 'Bewerten:'}</span>
        <button
          type="button"
          className="ml-2 hidden text-sm group-hover:inline hover:underline"
          onClick={handleRevokeRating}
        >
          Entfernen
        </button>
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
  rating: number | null;
  className?: string;
}

export function CommunityRating({ rating, className }: ComminityRatingProps) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
      <span style={{ fontSize: '1.35em', fontWeight: 500 }}>
        {rating !== null ? rating : '???'}
      </span>
      /10
    </div>
  );
}
