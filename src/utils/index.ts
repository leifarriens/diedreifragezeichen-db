import { FolgeType } from 'src/types';

import dayjs from './dayjs';
import { sortFolgen } from './sort';

const parseMongo = (mongoResponse: any) => {
  return JSON.parse(JSON.stringify(mongoResponse));
};

const filterSpecial = (folgen: FolgeType[], showSpecials: boolean) => {
  return !showSpecials
    ? folgen.filter((folge) => folge.type !== 'special')
    : folgen;
};

const filterByQuery = (folgen: FolgeType[], searchQuery: string) => {
  const filterFolge = (folge: FolgeType) => {
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
  showSpecials: boolean;
  searchQuery: string;
  sortBy: string;
};

const applyFilter = (
  folgen: FolgeType[],
  { showSpecials, searchQuery, sortBy }: FilterOptions
) => {
  let filtered = [];

  filtered = filterSpecial(folgen, showSpecials);
  filtered = filterByQuery(filtered, searchQuery);
  filtered = sortFolgen(filtered, sortBy);

  return filtered;
};

export { applyFilter, filterByQuery, filterSpecial, parseMongo, sortFolgen };
