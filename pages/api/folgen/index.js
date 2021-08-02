import dbConnect from '../../../db';
import Folge from '../../../models/folge';
import { filterByQuery } from '../../../utils';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const folgen = await Folge.find({}).sort('release_date');

    if (req.query.q) {
      const filtered = filterByQuery(folgen, req.query.q)
      return res.json(filtered);
    }

    return res.json(folgen);
  }
}
