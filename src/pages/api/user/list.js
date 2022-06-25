import { getSession } from 'next-auth/react';

import dbConnect from '../../../db';
import List from '../../../models/list';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'GET') {
    const userId = session.user.id;

    const list = await List.findOne({ user: userId }).populate('folgen');

    return res.json(list);
  }

  if (req.method === 'POST') {
    const userId = session.user.id;
    const data = req.body;

    const result = await List.findOneAndUpdate(
      { user: userId },
      { $addToSet: { folgen: data.folgeId } },
      { upsert: true, new: true }
    );

    return res.json(result);
  }

  return res.status(405).end('Method not allowed');
}
