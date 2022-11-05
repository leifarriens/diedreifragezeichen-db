import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getServerSession } from '@/lib/getServerSession';
import { getUserFolgenRating, getUserRatings } from '@/services/rating.service';
import { parseQueryParam } from '@/utils/index';

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

    if (req.query.folgeId) {
      const folgeId = parseQueryParam(req.query.folgeId);

      const rating = await getUserFolgenRating({ folgeId, userId });

      if (!rating) return res.status(404).send('Not found');

      return res.json(rating);
    }

    const ratings = await getUserRatings(userId, {
      fields: ['folge', 'value'],
    });

    return res.json(ratings);
  }

  return res.status(405).end('Method not allowed');
}
