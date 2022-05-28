import { FolgeType } from '../types';

export const sortFolgen = (folgen: FolgeType[], sortBy: string) => {
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

const sortFolgenByRating = (folgen: FolgeType[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return a.rating - b.rating;
  });

  return sorted.reverse();
};

const sortFolgenByDateAsc = (folgen: FolgeType[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted;
};

const sortFolgenByDateDesc = (folgen: FolgeType[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted.reverse();
};

const sortByPopularity = (folgen: FolgeType[]) => {
  const sorted = [...folgen].sort((a, b) => {
    return a.popularity - b.popularity;
  });

  return sorted.reverse();
};
