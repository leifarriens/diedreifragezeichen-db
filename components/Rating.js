import { signIn, useSession } from 'next-auth/client';
import { useState } from 'react';
import { mutate } from 'swr';

import RatingInput from './RatingInput';
import Toast from './Toast';

const Rating = ({ folge_id, userRating, folge_name }) => {
  const [session] = useSession();
  const [toasted, setToasted] = useState(false);

  const handleNewRating = (newRating) => {
    console.log(newRating);
    if (!session) return signIn();

    mutate(`/api/folgen/`, async () => {
      await fetch(`/api/folgen/${folge_id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });
      setToasted(true);
      console.log('rating saved', newRating);
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
