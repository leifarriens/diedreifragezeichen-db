import { Folge } from '../common/models/folge';
import Rating from '../common/models/rating';
import { User } from '../common/models/user';

type FolgenOptions = {
  fields?: string[];
  limit?: number;
  specials?: boolean;
};

export async function getFolgen(options: FolgenOptions = {}) {
  const { fields = [], limit = 300, specials = true } = options;

  const type = !specials ? 'regular' : null;
  const select = fields.join(' ');

  const folgen = await Folge.find({
    ...(type && { type }),
  })
    .select(select)
    .limit(limit);

  return folgen;
}

export async function getFolge(folgeId: string, options: FolgenOptions = {}) {
  const { fields = [] } = options;

  const select = fields.join(' ');

  const folge = await Folge.findById(folgeId).select(select);

  return folge;
}

export async function getAllFolgenIds() {
  return Folge.find({}).select('_id');
}

export async function postFolgenRating({
  folgeId,
  userId,
  userRating,
}: {
  folgeId: string;
  userId: string;
  userRating: number;
}) {
  const folge = await getFolge(folgeId);

  if (!folge) {
    throw Error('Folge not found');
  }

  const rating = await Rating.findOneAndUpdate(
    {
      user: userId,
      folge: folgeId,
    },
    {
      user: userId,
      folge: folgeId,
      value: userRating,
    },
    { upsert: true, new: true },
  );

  const folgenRatings = await Rating.find({ folge: folgeId });

  const ratingsSum = folgenRatings.reduce((curr, acc) => {
    return curr + acc.value;
  }, 0) as number;

  const community_rating = ratingsSum / folgenRatings.length;

  folge.community_rating = parseFloat(community_rating.toFixed(1));
  folge.number_of_community_ratings = folgenRatings.length;
  folge.community_popularity = ratingsSum;

  await folge.save();

  return rating;
}

export async function getUserRatings(
  userId: string,
  options: { fields: string[] },
) {
  const { fields = [] } = options;

  return Rating.find({ user: userId }).select(fields);
}

export async function getUserFolgenRating({
  folgeId,
  userId,
}: {
  folgeId: string;
  userId: string;
}) {
  return Rating.findOne({ folge: folgeId, user: userId });
}

export async function getAltFolgen(id: string, options: FolgenOptions = {}) {
  const { fields = [], specials = false, limit = 20 } = options;

  fields.push('release_date');

  const type = !specials ? 'regular' : null;
  const current = await Folge.findById(id).select(fields);

  if (!current) {
    throw Error('Folge not found');
  }

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

export async function getUserWithList(userId: string) {
  return User.findById(userId).populate<{ list: Folge[] }>({
    path: 'list',
    options: { sort: ['updated_at'] },
  });
}
