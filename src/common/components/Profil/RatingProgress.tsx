import React from 'react';
import styled from 'styled-components';

import { RatingWithFolge } from '@/types';

type RatingProgressProps = {
  ratings: RatingWithFolge[];
  numberOfFolgen: number;
};

export default function RatingProgress({
  ratings,
  numberOfFolgen,
}: RatingProgressProps) {
  const ratetPercent =
    ((ratings.length / numberOfFolgen) * 100).toFixed(0) + '%';

  return (
    <PorgressContainer>
      <progress value={ratings.length} max={numberOfFolgen}>
        70 %
      </progress>
      <span>{ratings.length.toString()}</span>
      <span>{ratetPercent.toString()}</span>
      <span>{numberOfFolgen}</span>
    </PorgressContainer>
  );
}

const PorgressContainer = styled.div`
  display: grid;
  grid-template-columns: auto 1fr auto;

  progress {
    width: 100%;
    height: 60px;
    grid-column: 1/4;
  }

  span:nth-of-type(2) {
    text-align: center;
  }
`;
