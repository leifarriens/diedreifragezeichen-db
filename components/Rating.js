import { signIn, useSession } from 'next-auth/client';
import { useState } from 'react';
// import ReactStars from 'react-rating-stars-component';
import styled from 'styled-components';
import { mutate } from 'swr';

import RatingInput from './RatingInput';

// const RateIcon = styled.i`
//   display: block;
//   width: 24px;
//   height: 48px;
//   background-image: url(${(props) => props.icon});
//   background-position: center;
//   background-size: contain;
//   background-repeat: no-repeat;
// `;

const Rating = ({ folge_id, userRating, onRated }) => {
  const [session] = useSession();
  // const [hoverRating, setHoverRating] = useState(null);

  const handleNewRating = (newRating) => {
    if (!session) return signIn();

    mutate(`/api/folgen/`, async () => {
      await fetch(`/api/folgen/${folge_id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });

      console.log('rating saved', newRating);
      // onRated(newRating);
    });
  };

  const hoverRatingString = userRating === 0 ? null : userRating;

  // const settings = {
  //   style: { display: 'inline-flex' },
  //   count: 10,
  //   isHalf: true,
  //   emptyIcon: <RateIcon icon={'/white_small.png'} />,
  //   halfIcon: <RateIcon icon={'/half_small.png'} />,
  //   filledIcon: <RateIcon icon={'/blue_small.png'} />,
  //   onChange: (newRating) => _handleRateClick(newRating),
  //   onMouseOver: (value) => setHoverRating(value),
  //   onMouseLeave: () => setHoverRating(null),
  // };

  return (
    <div>
      <div style={{ fontSize: '18px', marginBottom: '6px' }}>
        {userRating ? 'Deine Wertung:' : 'Bewerten:'}
      </div>

      <RatingInput defaultValue={userRating} onRate={(newRating) => handleNewRating(newRating)}/>

      {/* <div style={{ display: 'flex' }}>
        <ReactStars {...settings} value={userRating} />
        <span
          style={{ fontSize: '32px', marginLeft: '12px', lineHeight: '0.75' }}
        >
          {hoverRating ? hoverRating : hoverRatingString}
        </span>
      </div> */}
    </div>
  );
};

export default Rating;
