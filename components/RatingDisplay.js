import React from 'react';
import { calcFolgenRating } from '../utils';

function RatingDisplay({ ratings }) {
  const rating = calcFolgenRating(ratings);
  const min = process.env.minRatingsToDisplay;

  return (
    <span>
      {rating && ratings.length >= min ? rating : ' - '}/10
    </span>
  );
}

export default RatingDisplay;
