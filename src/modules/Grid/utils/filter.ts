import dayjs from '@/lib/dayjs';
import type { PublicFolge } from '@/utils/maskFolgeForPublic';

import type { YearRange } from '../types';
import type { SortOptionsEnum } from '../types';
import { sortFolgen } from './sort';

export const filterSpecial = (folgen: PublicFolge[], showSpecials = true) => {
  return !showSpecials
    ? folgen.filter((folge) => folge.type !== 'special')
    : folgen;
};

export const filterYearRange = (
  folgen: PublicFolge[],
  yearRange: YearRange | undefined,
) => {
  if (!yearRange) return folgen;
  return folgen.filter((folge) => {
    const release = dayjs(folge.release_date);
    return (
      release.isSameOrAfter(yearRange.min, 'year') &&
      release.isSameOrBefore(yearRange.max, 'year')
    );
  });
};

export const filterByQuery = (folgen: PublicFolge[], searchQuery: string) => {
  const filterFolge = (folge: PublicFolge) => {
    if (
      folge.name.concat(folge.number ?? '').match(new RegExp(searchQuery, 'i'))
    ) {
      return true;
    }

    // TODO: also filter for exact date with day and month
    if (dayjs(folge.release_date).year().toString() == searchQuery) {
      return true;
    }

    return false;
  };
  return folgen.filter(filterFolge);
};

export const filterUnrated = (
  folgen: PublicFolge[],
  showOnlyUnrated = false,
) => {
  return showOnlyUnrated
    ? folgen.filter((folge) => !folge.user_rating)
    : folgen;
};

interface FilterOptions {
  showSpecials?: boolean;
  searchQuery: string;
  sortBy?: SortOptionsEnum;
  yearRange?: YearRange;
  showOnlyUnrated?: boolean;
}

export const applyFilter = (
  folgen: PublicFolge[],
  {
    showSpecials,
    searchQuery,
    sortBy,
    yearRange,
    showOnlyUnrated,
  }: FilterOptions,
) => {
  const filteredBySpecials = filterSpecial(folgen, showSpecials);
  const filteredByRating = filterUnrated(filteredBySpecials, showOnlyUnrated);
  const filteredByYear = filterYearRange(filteredByRating, yearRange);
  const filteredByQuery = filterByQuery(filteredByYear, searchQuery);

  return sortFolgen(filteredByQuery, sortBy);
};
