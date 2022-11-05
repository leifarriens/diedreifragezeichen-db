import { Rating } from '../common/models/rating';
import { getFolge } from './folge.service';

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

  const ratingResult = await Rating.findOneAndUpdate(
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

  const rating = ratingsSum / folgenRatings.length;

  folge.rating = parseFloat(rating.toFixed(1));
  folge.number_of_ratings = folgenRatings.length;
  folge.popularity = ratingsSum;

  await folge.save();

  return ratingResult;
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
