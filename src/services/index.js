import mongoose from 'mongoose';

import Folge from '../models/folge';
import Rating from '../models/rating';

import { FolgeType } from 'src/types';

const folgeAggregation = ({ queryFields }) => [
  {
    $lookup: {
      from: 'ratings',
      localField: '_id',
      foreignField: 'folge',
      as: 'ratings',
    },
  },
  {
    $addFields: {
      rating: {
        $avg: {
          $map: {
            input: '$ratings',
            as: 'r',
            in: '$$r.value',
          },
        },
      },
      number_of_ratings: {
        $size: '$ratings',
      },
      popularity: {
        $sum: {
          $map: {
            input: '$ratings',
            as: 'r',
            in: '$$r.value',
          },
        },
      },
    },
  },
  { $project: { ...queryFields } },
  { $unset: ['__v', 'ratings'] },
];

export async function getFolgen(options = {}) {
  const { fields = [] } = options;

  const queryFields = getQueryFields(fields);

  return Folge.aggregate([...folgeAggregation({ queryFields })]);
}

export async function getFolgeById(id, options = {}) {
  const { fields = [] } = options;

  const queryFields = getQueryFields(fields);

  const [folge] = await Folge.aggregate([
    { $match: { _id: mongoose.Types.ObjectId(id) } },
    ...folgeAggregation({ queryFields }),
  ]);

  return folge;
}

export async function getAltFolgen(id, options = {}) {
  const { fields = [], specials = false, limit = 16 } = options;

  fields.push('release_date');

  const type = !specials ? 'regular' : null;
  const current = await Folge.findById(id).select(fields);

  const previous = await Folge.find({
    release_date: { $lt: current.release_date },
    type,
  })
    .sort({ release_date: -1 })
    .limit(limit / 2)
    .select(fields);

  const next = await Folge.find({
    release_date: { $gt: current.release_date },
    type,
  })
    .sort({ release_date: 1 })
    .limit(limit / 2)
    .select(fields);

  // const folgen = await Folge.aggregate([
  //   // { $match: { _id: mongoose.Types.ObjectId(id) } },
  //   {
  //     $match: {
  //       release_date: {
  //         // $gte: new Date('$release_date').setFullYear(
  //         //   new Date('$release_date').getFullYear() - 1
  //         // ),
  //         $gte: new Date('2019-02-01T00:00:00.0Z'),
  //         $lt: new Date('2020-02-01T00:00:00.0Z'),
  //       },
  //     },
  //   },
  //   ...folgeAggregation({ queryFields }),
  //   // { $match: { rating: { $lt: 10 } } },
  //   // { $project: { name: 1 } },
  // ]);

  return [...previous.reverse(), current, ...next];
}

export async function getAllFolgenIds() {
  return await Folge.find({}).select('_id');
}

export async function getUserRatings(userId, options) {
  const { fields = [] } = options;
  console.log(fields);
  return Rating.find({ user: userId }).select(fields);
}

// Helpers

function getQueryFields(fields = []) {
  return fields.reduce(
    (curr, acc) => {
      delete curr.ratings;
      return { ...curr, ...{ [acc]: 1 } };
    },
    { ratings: 0 }
  );
}
