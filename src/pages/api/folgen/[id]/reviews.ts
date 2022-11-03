import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { Rating } from '@/models/rating';
import { UserWithId } from '@/models/user';
import { parseAllQueryParams } from '@/utils/index';

type QueryParams = {
  id: string;
  limit?: number;
  offset?: number;
};

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  await dbConnect();

  if (req.method === 'GET') {
    const {
      limit = 20,
      offset = 0,
      id,
    } = parseAllQueryParams<QueryParams>(req.query);

    const filter = { folge: id, body: { $exists: true } };

    const total = await Rating.count(filter);

    const reviews = await Rating.find(filter)
      .sort('-updated_at')
      .limit(limit)
      .skip(offset)
      .populate<{
        folge: UserWithId;
      }>({
        path: 'user',
        options: { select: 'name image' },
      });

    return res.json({
      items: reviews,
      limit,
      offset,
      total,
    });
  }

  return res.status(405).end('Method not allowed');
}
