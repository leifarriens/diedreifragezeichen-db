import type { FolgeWithId } from '@/models/folge';
import { RatingWithFolge } from '@/types';

import { SortOptionsEnum } from '../types';

export const sortFolgen = (
  folgen: FolgeWithId[],
  sortBy = SortOptionsEnum.dateDesc,
) => {
  switch (sortBy) {
    case SortOptionsEnum.dateAsc:
      return sortFolgenByDateAsc(folgen);
    case SortOptionsEnum.dateDesc:
      return sortFolgenByDateDesc(folgen);
    case SortOptionsEnum.rating:
      return sortFolgenByRating(folgen);
    case SortOptionsEnum.popularity:
      return sortByPopularity(folgen);
    default:
      return sortFolgenByDateDesc(folgen);
  }
};

const sortFolgenByRating = (folgen: FolgeWithId[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return a.rating - b.rating;
  });

  return sorted.reverse();
};

const sortFolgenByDateAsc = (folgen: FolgeWithId[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted;
};

const sortFolgenByDateDesc = (folgen: FolgeWithId[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted.reverse();
};

const sortByPopularity = (folgen: FolgeWithId[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return a.popularity - b.popularity;
  });

  return sorted.reverse();
};

interface IDictionary {
  [id: string]: (a: RatingWithFolge, b: RatingWithFolge) => number;
}

export const folgenSort: IDictionary = {
  byUserRating: (a: RatingWithFolge, b: RatingWithFolge) => {
    return b.value - a.value;
  },
  byRatingDate: (a: RatingWithFolge, b: RatingWithFolge) => {
    return new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime();
  },
};
