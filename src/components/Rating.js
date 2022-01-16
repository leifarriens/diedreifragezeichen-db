import Axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import styled from 'styled-components';

import { colors } from '../theme';
import RatingInput from './RatingInput';
import Toast from './Toast';

// FIXME: Pls fix this damn input
const Rating = ({ folge_id, folge_name }) => {
  const { data: session } = useSession();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [toasted, setToasted] = useState(false);

  const [userRating, setUserRating] = useState('');

  useEffect(() => {
    console.log('user Rating', userRating);
  }, [userRating]);

  useEffect(() => {
    setUserRating(0);

    // if (session) {
    fetchUserRating();
    // }
  }, [folge_id, folge_name]);

  const fetchUserRating = async () => {
    setLoading(true);
    try {
      const {
        data: { value },
      } = await Axios(`/api/folgen/${folge_id}/rating`);
      setUserRating(value);
    } catch (error) {
      setUserRating(0);
      if (error.response.status !== 404) {
        setError(error.response);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNewRating = async (newRating) => {
    if (!session) return signIn();

    if (newRating === userRating) {
      console.log('no new value');
      return;
    }

    setUserRating(newRating);

    try {
      setLoading(true);
      await Axios({
        method: 'POST',
        url: `/api/folgen/${folge_id}/rating`,
        data: { rating: newRating },
      });
      setToasted(true);
    } catch (error) {
      setError(error.response);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Title>{userRating ? 'Deine Wertung:' : 'Bewerten:'}</Title>
      <RatingInput
        defaultValue={userRating}
        onRate={(newRating) => handleNewRating(newRating)}
        disabled={loading}
      />
      {toasted && (
        <Toast
          duration={5000}
          onFadeOut={() => setToasted(false)}
          color={colors.lightblue}
        >
          Bewertung für <i>{folge_name}</i> abgegeben
        </Toast>
      )}
      {error && (
        <Toast
          duration={3000}
          onFadeOut={() => setError(null)}
          color={colors.red}
        >
          {/* {error.data} */}
          Ein Fehler ist aufgetreten
        </Toast>
      )}
    </>
  );
};

const Title = styled.div`
  font-size: 1.05em;
  color: #eee;
  margin-bottom: 6px;
`;

export default Rating;
