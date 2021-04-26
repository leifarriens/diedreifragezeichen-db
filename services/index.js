import Folge from '../models/folge';

export async function getFolgen() {
  return await Folge.find({});
}

export async function getFolgeById(id) {
  return await Folge.findById(id);
}
