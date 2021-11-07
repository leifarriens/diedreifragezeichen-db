import Folge from '../models/folge';
// eslint-disable-next-line no-unused-vars
import Rating from '../models/rating';

export async function getAllFolgenIds() {
  return await Folge.find({}).select('_id');
}

export async function getAllFolgenWithRating() {
  return await Folge.find({}).populate({
    path: 'ratings',
    select: { value: 1 },
  });
}

export async function getFolgeWithRating(id) {
  return await Folge.findById(id).populate({
    path: 'ratings',
    select: { value: 1 },
  });
}
