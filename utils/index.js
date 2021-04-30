export const calcFolgenRating = (ratings = []) => {
  if (ratings.length === 0) return null;
  if (ratings.length === 1) return ratings[0].value;

  return Math.round(ratings.map(r => r.value).reduce((acc, curr) =>  acc + curr, 0) / ratings.length * 10) / 10;
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

export const sortByPopularity = (folgen) => {
  const sorted = [...folgen].sort((a, b) => {
    return a.ratings.length - b.ratings.length;
  });

  console.log(sorted);

  return sorted.reverse();
}

export const parseMongo = (mongoResponse) => {
  return JSON.parse(JSON.stringify(mongoResponse));
};
