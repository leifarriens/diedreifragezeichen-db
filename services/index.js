import Folge from '../models/folge';

export async function getFolgen() {
  try {
    const folgen = await Folge.find({});
    return JSON.parse(JSON.stringify(folgen))
  } catch (e) {
    throw e;
  }
}

export async function getFolgeById(id) {
  try {
    const folge = await Folge.findById(id);
    return JSON.parse(JSON.stringify(folge))
  } catch (e) {
    throw e;
  }
}
