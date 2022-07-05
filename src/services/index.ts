import mongoose from 'mongoose';

import Folge from '../common/models/folge';
import Rating from '../common/models/rating';

const folgeAggregation: any = ({ queryFields }: { queryFields: unknown[] }) => [
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

type GetFolgenOptions = {
  fields?: string[];
  specials?: boolean;
  limit?: number;
};

export async function getFolgen(options: GetFolgenOptions = {}) {
  const { fields = [] } = options;

  const queryFields = getQueryFields(fields);

  return Folge.aggregate([...folgeAggregation({ queryFields })]);
}

export async function getFolgeById(id: string, options: GetFolgenOptions = {}) {
  const { fields = [] } = options;

  const queryFields = getQueryFields(fields);

  const [folge] = await Folge.aggregate([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ...folgeAggregation({ queryFields }),
  ]);

  return folge;
}

export async function getAltFolgen(id: string, options: GetFolgenOptions = {}) {
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

  return [...previous.reverse(), current, ...next];
}

export async function getAllFolgenIds() {
  return await Folge.find({}).select('_id');
}

export async function getUserRatings(
  userId: string,
  options: { fields: string[] },
) {
  const { fields = [] } = options;
  console.log(fields);
  return Rating.find({ user: userId }).select(fields);
}

// Helpers

function getQueryFields(fields: string[] = []) {
  return fields.reduce(
    (curr, acc) => {
      // FIXME: type error
      delete curr.ratings;
      return { ...curr, ...{ [acc]: 1 } };
    },
    { ratings: 0 },
  );
}
