import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { FolgeWithId } from '@/models/folge';
import { Rating } from '@/models/rating';
import { parseAllQueryParams } from '@/utils/index';

type QueryParams = {
  limit: number;
  offset: number;
  userId: string;
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
      userId,
    } = parseAllQueryParams<QueryParams>(req.query);

    const filter = { user: userId, body: { $exists: true } };

    const total = await Rating.count(filter);

    const reviews = await Rating.find(filter)
      .sort('-updated_at')
      .limit(limit)
      .skip(offset)
      .populate<{
        folge: FolgeWithId;
      }>({
        path: 'folge',
        options: { select: 'name images' },
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
