import React from 'react';
import styled from 'styled-components';
import ReactStars from 'react-rating-stars-component';
import { useSession, signIn } from 'next-auth/client';
import { roundRatingToPointFive } from '../utils';
import { mutate } from 'swr';

const RateIcon = styled.i`
  display: block;
  width: 22px;
  height: 42px;
  background-image: url(${(props) => props.icon});
  background-position: center;
  background-size: contain;
  background-repeat: no-repeat;
`;

const Rating = ({ folge_id, defaultRating }) => {
  const roundedRating = roundRatingToPointFive(defaultRating);
  const [session] = useSession();

  const _handleRateClick = (newRating) => {
    if (!session) return signIn();

    mutate(`/api/folgen/`, async (respo) => {
      const updatedRating = await fetch(`/api/folgen/${folge_id}/rate`, {
        method: 'POST',
        body: JSON.stringify({ rating: newRating }),
      });

      console.log(updatedRating);
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
  };

  return <ReactStars {...settings} />;
};

export default Rating;
