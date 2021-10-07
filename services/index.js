/* eslint-disable no-unused-vars */
import { calcFolgenRating } from 'utils';

import Folge from '../models/folge';
import Rating from '../models/rating';

// FIXME: ratings should not be populated due to user email security issue
// export async function getAllFolgen() {
//   return await Folge.find({}).sort('release_date');
// }

export async function getAllFolgenIds() {
  return await Folge.find({}).select('_id');
}

// export async function getAllFolgenNames() {
//   return await Folge.find({}).select('name');
// }

// export async function getAllFolgenSortedWithRating() {
//   return await Folge.find({}).sort('release_date').populate('ratings');
// }

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
