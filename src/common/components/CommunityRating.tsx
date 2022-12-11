type ComminityRatingProps = {
  numerOfRatings: number;
  rating: number;
};

function CommunityRating({ numerOfRatings, rating }: ComminityRatingProps) {
  return (
    <div>
      {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
      <span style={{ fontSize: '1.35em', fontWeight: 500 }}>
        {numerOfRatings >= 1 ? rating : '???'}
      </span>
      /10
    </div>
  );
}

export default CommunityRating;
