import dbConnect from '../../../db';
import Folge from '../../../models/folge';

export default async function handler(req, res) {
  await dbConnect();

  if (req.method === 'GET') {
    const folgen = await Folge.find({}).sort('release_date');
    return res.json(folgen);
  }
};
