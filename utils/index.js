import dayjs from 'dayjs';

import { sortFolgen } from './sort';

const calcFolgenRating = (ratings = []) => {
  if (ratings.length === 0) return null;
  if (ratings.length === 1) return ratings[0].value;

  return (
    Math.round(
      (ratings.map((r) => r.value).reduce((acc, curr) => acc + curr, 0) /
        ratings.length) *
        10
    ) / 10
  );
};

const roundRatingToPointFive = (rating) => {
  return Math.round(rating * 2) / 2;
};

const parseMongo = (mongoResponse) => {
  return JSON.parse(JSON.stringify(mongoResponse));
};

const filterSpecial = (folgen, showSpecials) => {
  return !showSpecials
    ? folgen.filter((folge) => folge.type !== 'special')
    : folgen;
};

const filterByQuery = (folgen, searchQuery) => {
  const query = searchQuery.toLowerCase();
  const filterFolge = (folge) => {
    const name = folge.number + folge.name.toLowerCase();

    if (name.includes(query)) {
      return true;
    } else if (dayjs(folge.release_date).year() == query) {
      return true;
    } else {
      return false;
    }
  };
  return folgen.filter(filterFolge);
};

const applyFilter = (folgen, { showSpecials, searchQuery, sortBy }) => {
  let filtered = [];

  filtered = filterSpecial(folgen, showSpecials);
  filtered = sortFolgen(filtered, sortBy);
  filtered = filterByQuery(filtered, searchQuery);

  return filtered;
};

const splitArrayByProp = (array, prop, transformer) => {
  let obj = {};

  array.forEach((entry) => {
    const name = transformer(entry[prop]);
    console.log(name);
    if (!obj[name]) {
      obj[name] = [];
      obj[name].push(entry);
    } else {
      obj[name].push(entry);
    }
  });

  return obj;
};

export {
  applyFilter,
  calcFolgenRating,
  filterSpecial,
  parseMongo,
  roundRatingToPointFive,
  sortFolgen,
  splitArrayByProp,
};
