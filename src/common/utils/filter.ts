import dayjs from '@/lib/dayjs';
import type { Folge } from '@/models/folge';

import { sortFolgen } from './sort';

export const filterSpecial = (folgen: Folge[], showSpecials = true) => {
  return !showSpecials
    ? folgen.filter((folge) => folge.type !== 'special')
    : folgen;
};

export const filterByQuery = (folgen: Folge[], searchQuery: string) => {
  const filterFolge = (folge: Folge) => {
    const name = folge.number + folge.name;

    if (name.match(new RegExp(searchQuery, 'i'))) {
      return true;
    }

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
  sortBy?: string;
};

export const applyFilter = (
  folgen: Folge[],
  { showSpecials, searchQuery, sortBy }: FilterOptions,
) => {
  let filtered: Folge[] = [];

  filtered = filterSpecial(folgen, showSpecials);
  filtered = filterByQuery(filtered, searchQuery);
  filtered = sortFolgen(filtered, sortBy);

  return filtered;
};
