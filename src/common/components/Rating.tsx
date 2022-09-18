import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from '@/constants/theme';
import { useUserRating } from '@/hooks';

import RatingInput from './RatingInput';
import Toast from './shared/Toast';

type RatingProps = {
  folge_id: string;
  folge_name: string;
};

export default function Rating({ folge_id, folge_name }: RatingProps) {
  const { data: session } = useSession();
  const [toasted, setToasted] = useState(false);

  const { userRating, isLoading, mutate, error } = useUserRating(folge_id, {
    onMutationSuccess() {
      setToasted(true);
    },
  });

  useEffect(() => {
    setToasted(false);
  }, [folge_id]);

  function handleNewRating(newRating: number) {
    if (!session) return signIn();

    if (newRating === userRating) {
      return;
    }

    return mutate({ folgeId: folge_id, rating: newRating });
  }

  return (
    <>
      <Title>{userRating ? 'Deine Wertung:' : 'Bewerten:'}</Title>
      <RatingInput
        defaultValue={userRating}
        onRate={handleNewRating}
        disabled={isLoading}
      />
      {toasted && (
        <Toast
          duration={3000}
          onFadeOut={() => setToasted(false)}
          color={colors.lightblue}
        >
          Bewertung für <i>{folge_name}</i> gespeichert
        </Toast>
      )}
      {error && error.response?.status !== 404 && (
        <Toast duration={3000} color={colors.red}>
          Ein Fehler ist aufgetreten
        </Toast>
      )}
    </>
  );
}

const Title = styled.div`
  font-size: 1.05em;
  color: #eee;
  margin-bottom: 6px;
`;
