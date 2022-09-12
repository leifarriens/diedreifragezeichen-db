import mongoose from 'mongoose';

import type { Folge as FolgeType } from '../common/models/folge';
import { Folge } from '../common/models/folge';

const folgeAggregation = ({
  queryFields,
}: {
  queryFields: { [key: string]: string | number };
}) => [
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

  return Folge.aggregate<FolgeType>([...folgeAggregation({ queryFields })]);
}

export async function getFolgeById(
  id: string,
  options: { fields?: string[] } = {},
) {
  const { fields = [] } = options;

  const queryFields = getQueryFields(fields);

  const [folge] = await Folge.aggregate<FolgeType>([
    { $match: { _id: new mongoose.Types.ObjectId(id) } },
    ...folgeAggregation({ queryFields }),
  ]);

  return folge;
}

// Helpers

function getQueryFields(fields: string[] = []) {
  return fields.reduce(
    (curr, acc) => {
      // eslint-disable-next-line @typescript-eslint/ban-ts-comment
      // @ts-expect-error
      delete curr.ratings;
      return { ...curr, ...{ [acc]: 1 } };
    },
    { ratings: 0 },
  );
}
