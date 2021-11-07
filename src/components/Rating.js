import Axios from 'axios';
import { signIn, useSession } from 'next-auth/react';
import { useEffect, useState } from 'react';
import { mutate } from 'swr';

import RatingInput from './RatingInput';
import Toast from './Toast';

// FIXME: Pls fix this damn input
const Rating = ({ folge_id, folge_name }) => {
  const { data: session, state } = useSession();
  const [toasted, setToasted] = useState(false);

  const [userRating, setUserRating] = useState(0);

  useEffect(() => {
    setUserRating(0);

    if (session) {
      fetchUserRating();
    }
  }, [folge_id, folge_name]);

  const fetchUserRating = async () => {
    try {
      const {
        data: { value },
      } = await Axios(`/api/folgen/${folge_id}/rating`);
      setUserRating(value);
    } catch (error) {
      setUserRating(0);
    }
  };

  const handleNewRating = (newRating) => {
    if (!session) return signIn();

    mutate(`/api/folgen/`, async () => {
      await fetch(`/api/folgen/${folge_id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });
      setToasted(true);
    });
  };

  return (
    <>
      <div style={{ fontSize: '18px', marginBottom: '6px' }}>
        {userRating ? 'Deine Wertung:' : 'Bewerten:'}
      </div>
      <RatingInput
        defaultValue={userRating}
        onRate={(newRating) => handleNewRating(newRating)}
      />
      {toasted && (
        <Toast duration={5000} onFadeOut={() => setToasted(false)}>
          Bewertung für <i>{folge_name}</i> abgegeben
        </Toast>
      )}
    </>
  );
};

export default Rating;
