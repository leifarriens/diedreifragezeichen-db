import React, { useState } from 'react';
import styled from 'styled-components';
import ReactStars from 'react-rating-stars-component';
// import ReactStars from '../../react-stars/dist/react-stars';
import { useSession, signIn } from 'next-auth/client';
import { roundRatingToPointFive } from '../utils';
import { mutate } from 'swr';

const RateIcon = styled.i`
  display: block;
  width: 24px;
  height: 48px;
  background-image: url(${(props) => props.icon});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Rating = ({ folge_id, defaultRating }) => {
  const roundedRating = roundRatingToPointFive(defaultRating);
  const [session] = useSession();
  const [hoverRating, setHoverRating] = useState(defaultRating);

  // const [currentRating, setCurrentRating] = useState(defaultRating);

  const _handleRateClick = (newRating) => {
    if (!session) return signIn();

    mutate(`/api/folgen/`, async () => {
      const response = await fetch(`/api/folgen/${folge_id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });

      console.log(response);
      setHoverRating(newRating);
    });
  };

  const settings = {
    style: { display: 'inline-flex' },
    count: 10,
    value: roundedRating,
    isHalf: true,
    emptyIcon: <RateIcon icon={'/white.png'} />,
    halfIcon: <RateIcon icon={'/half.png'} />,
    filledIcon: <RateIcon icon={'/blue.png'} />,
    onChange: (newRating) => _handleRateClick(newRating),
    onMouseOver: (value) => setHoverRating(value),
    onMouseLeave: () => setHoverRating(defaultRating),
  };

  return (
    <div>
      <div
        style={{ fontSize: '46px', marginTop: '24px', marginBottom: '12px' }}
      >
        {defaultRating ? defaultRating : ' - '}/10
        <span></span>
      </div>
      <div style={{ display: 'flex' }}>
        <ReactStars {...settings} />
        <span
          style={{ fontSize: '36px', marginLeft: '8px', lineHeight: '.75' }}
        >
          {hoverRating}
        </span>
      </div>
    </div>
  );
};

export default Rating;
