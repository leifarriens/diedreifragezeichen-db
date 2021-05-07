/* eslint-disable no-unused-vars */
import Folge from '../models/folge';
import Rating from '../models/rating';

export async function getAllFolgen() {
  return await Folge.find({}).sort('release_date').populate('ratings');
}

export async function getAllFolgenIndexes() {
  return await Folge.find({}).select('_id');
}

export async function getAllFolgenSortedWithRating() {
  return await Folge.find({}).sort('release_date').populate('ratings');
}
