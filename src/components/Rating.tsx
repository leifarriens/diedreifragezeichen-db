import Axios, { AxiosError } from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from '../theme';
import RatingInput from './RatingInput';
import Toast from './Toast';

type RatingProps = {
  folge_id: string;
  folge_name: string;
};

export default function Rating({ folge_id, folge_name }: RatingProps) {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toasted, setToasted] = useState(false);

  const [userRating, setUserRating] = useState<number | null>(null);

  useEffect(() => {
    setUserRating(0);

    if (session) {
      fetchUserRating();
    }
  }, [folge_id, folge_name]);

  const fetchUserRating = async () => {
    setLoading(true);
    try {
      const {
        data: { value },
      } = await Axios(`/api/folgen/${folge_id}/rating`);
      setUserRating(value);
    } catch (error: any) {
      setUserRating(0);

      if (error.response) {
        if (error.response.status !== 404) {
          setError(error.response);
        }
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewRating = async (newRating: number) => {
    if (!session) return signIn();

    if (newRating === userRating) {
      return;
    }

    try {
      setLoading(true);
      await Axios({
        method: 'POST',
        url: `/api/folgen/${folge_id}/rating`,
        data: { rating: newRating },
      });
      setUserRating(newRating);
      setToasted(true);
    } catch (error: any) {
      if (error.response) {
        setError(error.response);
      }
    } finally {
      setLoading(false);
    }

    return;
  };

  return (
    <>
      <Title>{userRating ? 'Deine Wertung:' : 'Bewerten:'}</Title>
      <RatingInput
        defaultValue={userRating}
        onRate={handleNewRating}
        disabled={loading}
      />
      {toasted && (
        <Toast
          duration={5000}
          onFadeOut={() => setToasted(false)}
          color={colors.lightblue}
        >
          Bewertung für <i>{folge_name}</i> gespeichert
        </Toast>
      )}
      {error && (
        <Toast
          duration={3000}
          onFadeOut={() => setError(null)}
          color={colors.red}
        >
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
