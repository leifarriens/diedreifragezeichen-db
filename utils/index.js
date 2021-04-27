export const calcFolgenRating = (ratings) => {
  if (ratings.length === 0) return 0;
  return Math.round((ratings.reduce((a, b) => Number(a) + Number(b), 0) / ratings.length) * 10) / 10;
};

export const roundRatingToPointFive = (rating) => {
  return Math.round(rating * 2) / 2;
};

export const sortFolgenByRating = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return calcFolgenRating(a.ratings) - calcFolgenRating(b.ratings);
  });

  return sorted.reverse();
};

export const sortFolgenByDateAsc = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted;
};

export const sortFolgenByDateDesc = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return (
      new Date(a.release_date).getTime() - new Date(b.release_date).getTime()
    );
  });

  return sorted.reverse();
};

export const parseMongo = (mongoResponse) => {
  return JSON.parse(JSON.stringify(mongoResponse));
};
