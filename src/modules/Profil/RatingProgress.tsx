import styled from 'styled-components';

import { colors } from '@/constants/theme';
import { trpc } from '@/utils/trpc';

export function RatingProgress() {
  const totalQuery = trpc.folge.total.useQuery(undefined, {
    staleTime: Infinity,
    cacheTime: Infinity,
  });
  const ratingsQuery = trpc.rating.userRatings.useQuery();

  const numberOfFolgen = totalQuery.data;
  const numberOfRatings = ratingsQuery.data?.length;

  if (!numberOfFolgen || numberOfRatings === undefined) return null;

  return (
    <div className="my-8 rounded-xl bg-black p-10 shadow-xl">
      <p className="col-span-3 mb-4">
        {numberOfRatings === 0 && 'Du hast noch keine Folgen bewertet'}
        {numberOfRatings === 1 && 'Du hast breits eine Folge bewertet'}
        {numberOfRatings > 1 &&
          `Du hast bereits ${numberOfRatings.toString()} Folgen bewertet`}
      </p>
      <ProgressBar
        className="col-span-3 mb-1 h-6 w-full appearance-none"
        value={numberOfFolgen ? numberOfRatings : 0}
        max={numberOfFolgen}
      />
      <div className="grid grid-cols-[auto_1fr_auto] justify-items-center font-bold">
        <span>{numberOfRatings.toString()}</span>
        <span>
          {numberOfFolgen
            ? (
                ((numberOfRatings / numberOfFolgen) * 100).toFixed(0) + '%'
              ).toString()
            : ''}
        </span>
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
