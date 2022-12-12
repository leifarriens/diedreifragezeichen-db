type ComminityRatingProps = {
  numerOfRatings: number;
  rating: number;
  className?: string;
};

function CommunityRating({
  numerOfRatings,
  rating,
  className,
}: ComminityRatingProps) {
  return (
    <div className={className}>
      {/* eslint-disable-next-line no-inline-styles/no-inline-styles */}
      <span style={{ fontSize: '1.35em', fontWeight: 500 }}>
        {numerOfRatings >= 1 ? rating : '???'}
      </span>
      /10
    </div>
  );
}

export default CommunityRating;
