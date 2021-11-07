import React from 'react';

function RatingDisplay({ numberOfRatings, rating }) {
  return (
    <>
      <span>{rating ? rating : ' ??? '}/10</span>
      {/* <div style={{ fontSize: '0.4em' }}>{numberOfRatings} Bewertungen</div> */}
    </>
  );
}

export default RatingDisplay;
