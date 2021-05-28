import { useEffect, useState } from 'react';
import styled from 'styled-components';
import ReactStars from 'react-rating-stars-component';
import { useSession, signIn } from 'next-auth/client';
import { roundRatingToPointFive } from '../utils';
import useSWR, { mutate } from 'swr';

const RateIcon = styled.i`
  display: block;
  width: 24px;
  height: 48px;
  background-image: url(${(props) => props.icon});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Rating = ({ folge_id, userRating, onRated }) => {
  const [session] = useSession();
  const [hoverRating, setHoverRating] = useState(null);

  const _handleRateClick = (newRating) => {
    if (!session) return signIn();

    mutate(`/api/folgen/`, async () => {
      await fetch(`/api/folgen/${folge_id}/rating`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });

      onRated(newRating);
    });
  };

  const settings = {
    style: { display: 'inline-flex' },
    count: 10,
    value: userRating || 0,
    isHalf: true,
    emptyIcon: <RateIcon icon={'/white_small.png'} />,
    halfIcon: <RateIcon icon={'/half_small.png'} />,
    filledIcon: <RateIcon icon={'/blue_small.png'} />,
    onChange: (newRating) => _handleRateClick(newRating),
    onMouseOver: (value) => setHoverRating(value),
    onMouseLeave: () => setHoverRating(null),
  };

  return (
    <div>
      <div style={{ fontSize: '18px', marginBottom: '6px' }}>Deine Wertung:</div>
      <div style={{ display: 'flex' }}>
        <ReactStars {...settings} />
        <span
          style={{ fontSize: '36px', marginLeft: '12px', lineHeight: '0.75' }}
        >
          {hoverRating ? hoverRating : userRating}
        </span>
      </div>
    </div>
  );
};

export default Rating;
