import styled from 'styled-components';

import { colors } from '@/constants/theme';
import type { RatingWithFolge } from '@/types';

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
    <div className="my-8  rounded-xl bg-black p-10 shadow-xl">
      {numberOfRatings >= 2 && (
        <p className="col-span-3 mb-4">
          Du hast bereits {numberOfRatings.toString()} Folgen bewertet
        </p>
      )}
      <ProgressBar
        className="col-span-3 mb-1 h-6 w-full appearance-none"
        value={numberOfRatings}
        max={numberOfFolgen}
      />
      <div className="grid grid-cols-[auto_1fr_auto] justify-items-center font-bold">
        <span>{numberOfRatings.toString()}</span>
        <span>{ratetPercent.toString()}</span>
        <span>{numberOfFolgen}</span>
      </div>
    </div>
  );
}

const ProgressBar = styled.progress`
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
`;
