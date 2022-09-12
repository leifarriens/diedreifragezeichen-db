import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { User } from '@/models/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'DELETE') {
    const userId = session.user.id;

    const user = await User.findOneAndUpdate(
      { _id: userId },
      {
        $pull: { list: req.query.folgeId },
      },
      { new: true },
    );

    return res.json(user);
  }

  return res.status(405).end('Method not allowed');
}
