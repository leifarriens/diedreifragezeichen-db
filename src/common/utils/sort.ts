import type { Folge } from '@/models/folge';

import { RatingWithFolge } from '../types';

export const sortFolgen = (folgen: Folge[], sortBy = 'dateDesc') => {
  switch (sortBy) {
    case 'dateAsc':
      return sortFolgenByDateAsc(folgen);
    case 'dateDesc':
      return sortFolgenByDateDesc(folgen);
    case 'rating':
      return sortFolgenByRating(folgen);
    case 'popularity':
      return sortByPopularity(folgen);
    default:
      return sortFolgenByDateDesc(folgen);
  }
};

const sortFolgenByRating = (folgen: Folge[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return a.rating - b.rating;
  });

  return sorted.reverse();
};

const sortFolgenByDateAsc = (folgen: Folge[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted;
};

const sortFolgenByDateDesc = (folgen: Folge[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted.reverse();
};

const sortByPopularity = (folgen: Folge[]) => {
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
    return new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime();
  },
};
