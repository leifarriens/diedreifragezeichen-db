import { calcFolgenRating } from './';

export const sortFolgen = (folgen, sortBy) => {
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

const sortFolgenByRating = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return calcFolgenRating(a.ratings) - calcFolgenRating(b.ratings);
  });

  return sorted.reverse();
};

const sortFolgenByDateAsc = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted;
};

const sortFolgenByDateDesc = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted.reverse();
};

const sortByPopularity = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return a.ratings.length - b.ratings.length;
  });

  return sorted.reverse();
};
