import { Folge } from '@/models/folge';
import { Rating } from '@/models/rating';

export async function postFolgenRating({
  folgeId,
  userId,
  userRating,
}: {
  folgeId: string;
  userId: string;
  userRating: number;
}) {
  const folge = await Folge.findById(folgeId);

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
  ).lean();

  const folgenRatings = await Rating.find({ folge: folgeId }).select('value');

  const ratingsSum = folgenRatings.reduce((curr, acc) => curr + acc.value, 0);

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

  return Rating.find({ user: userId }).select(fields).lean();
}
