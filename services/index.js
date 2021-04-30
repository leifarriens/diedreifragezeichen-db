import Folge from '../models/folge';
import Rating from '../models/rating';

export async function getFolgen() {
  return await Folge.find({}).sort('release_date').populate('ratings')
}

export async function getFolgeById(id) {
  return await Folge.findById(id) // .populate('ratings');
}
