import styled from 'styled-components';

type ComminityRatingProps = {
  numerOfRatings: number;
  rating: number;
};

function CommunityRating({ numerOfRatings, rating }: ComminityRatingProps) {
  return (
    <Rating>
      <span>{numerOfRatings >= 1 ? rating : '???'}</span>
      /10
    </Rating>
  );
}

const Rating = styled.span`
  span {
    font-size: 1.35em;
    font-weight: 500;
  }
`;

export default CommunityRating;
