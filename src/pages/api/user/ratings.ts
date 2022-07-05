import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { getUserRatings } from '@/services/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'GET') {
    const userId = session.user.id;

    const ratings = await getUserRatings(userId, {
      fields: ['folge', 'value'],
    });

    return res.json(ratings);
  }

  return res.status(405).end('Method not allowed');
}
