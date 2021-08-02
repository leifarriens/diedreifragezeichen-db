import { signIn, useSession } from 'next-auth/client';
import { mutate } from 'swr';

import RatingInput from './RatingInput';

const Rating = ({ folge_id, userRating }) => {
  const [session] = useSession();

  const handleNewRating = (newRating) => {
    if (!session) return signIn();

    mutate(`/api/folgen/`, async () => {
      await fetch(`/api/folgen/${folge_id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });

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
    </>
  );
};

export default Rating;
