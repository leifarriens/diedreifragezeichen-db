import dayjs from '@/lib/dayjs';
import type { FolgeWithId } from '@/models/folge';

import type { YearRange } from '../types';
import { SortOptionsEnum } from '../types';
import { sortFolgen } from './sort';

export const filterSpecial = (folgen: FolgeWithId[], showSpecials = true) => {
  return !showSpecials
    ? folgen.filter((folge) => folge.type !== 'special')
    : folgen;
};

export const filterYearRange = (
  folgen: FolgeWithId[],
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

export const filterByQuery = (folgen: FolgeWithId[], searchQuery: string) => {
  const filterFolge = (folge: FolgeWithId) => {
    const name = folge.number + folge.name;

    if (name.match(new RegExp(searchQuery, 'i'))) {
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

type FilterOptions = {
  showSpecials?: boolean;
  searchQuery: string;
  sortBy?: SortOptionsEnum;
  yearRange?: YearRange;
};

export const applyFilter = (
  folgen: FolgeWithId[],
  { showSpecials, searchQuery, sortBy, yearRange }: FilterOptions,
) => {
  let filtered: FolgeWithId[] = [];

  filtered = filterSpecial(folgen, showSpecials);
  filtered = filterYearRange(filtered, yearRange);
  filtered = filterByQuery(filtered, searchQuery);
  filtered = sortFolgen(filtered, sortBy);

  return filtered;
};
