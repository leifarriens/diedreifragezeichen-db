import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getServerSession } from '@/lib/getServerSession';
import { User } from '@/models/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'GET') {
    const userId = session.user.id;

    const user = await User.findById(userId);

    return res.json(user?.list);
  }

  if (req.method === 'POST') {
    const userId = session.user.id;

    await User.updateOne(
      { _id: userId },
      {
        $addToSet: { list: req.body.folge },
      },
    );

    return res.status(201).end();
  }

  return res.status(405).end('Method not allowed');
}
