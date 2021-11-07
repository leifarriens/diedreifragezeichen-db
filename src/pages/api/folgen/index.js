import { getSession } from 'next-auth/react';

import dbConnect from '../../../db';
import Folge from '../../../models/folge';
import { filterByQuery } from '../../../utils';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'GET') {
    const folgen = await Folge.find({}).sort('release_date');

    if (req.query.q) {
      const filtered = filterByQuery(folgen, req.query.q);
      return res.json(filtered);
    }

    return res.json(folgen);
  }
}
