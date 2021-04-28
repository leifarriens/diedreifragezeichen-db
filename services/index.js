import Folge from '../models/folge';

export async function getFolgen() {
  return await Folge.find({}).sort('release_date')
}

export async function getFolgeById(id) {
  return await Folge.findById(id) // .populate('ratings');
}
