import styled from 'styled-components';

import { colors } from '@/constants/theme';
import { RatingWithFolge } from '@/types';

type RatingProgressProps = {
  numberOfRatings: number;
  ratings?: RatingWithFolge[];
  numberOfFolgen: number;
};

export default function RatingProgress({
  numberOfRatings,
  numberOfFolgen,
}: RatingProgressProps) {
  const ratetPercent =
    ((numberOfRatings / numberOfFolgen) * 100).toFixed(0) + '%';

  return (
    <ProgressContainer>
      {numberOfRatings >= 2 && (
        <p>Du hast bereits {numberOfRatings.toString()} Folgen bewertet</p>
      )}
      <progress value={numberOfRatings} max={numberOfFolgen} />
      <span>{numberOfRatings.toString()}</span>
      <span>{ratetPercent.toString()}</span>
      <span>{numberOfFolgen}</span>
    </ProgressContainer>
  );
}

const ProgressContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;
  margin-bottom: 2em;
  padding: 2em;
  border: 1px solid #38444d;
  border-radius: 12px;

  p {
    grid-column: 1/4;
    margin-bottom: 1em;
  }

  progress {
    appearance: none;
    width: 100%;
    height: 26px;
    grid-column: 1/4;

    &[value] {
      -webkit-appearance: none;
      appearance: none;
    }

    &[value]::-webkit-progress-bar {
      background-color: ${colors.white};
      border-radius: 4px;
      box-shadow: 0 2px 5px rgba(0, 0, 0, 0.2) inset;
    }

    &[value]::-webkit-progress-value {
      background-color: ${colors.lightblue};
      border-radius: 4px;
    }
  }

  span:nth-of-type(2) {
    text-align: center;
  }
`;
