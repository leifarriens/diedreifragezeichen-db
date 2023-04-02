import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { dbConnect } from '@/db/connect';
import { Folge } from '@/models/folge';

const queryParamsSchema = z.object({
  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(20).default(20),
  sort: z
    .enum(['release_date', '-release_date', 'rating', '-rating'])
    .default('-release_date'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    await dbConnect();

    const result = queryParamsSchema.safeParse(req.query);

    if (!result.success) {
      return res.status(400).json({
        errors: Object.fromEntries(
          result.error.issues.map(({ path, message }) => [
            path.join('.'),
            message,
          ]),
        ),
      });
    }

    const offset = result.data.offset;
    const limit = result.data.limit;
    const sort = result.data.sort;

    const total = await Folge.count();

    const folgen = await Folge.find({}).sort(sort).skip(offset).limit(limit);

    return res.json({
      items: folgen,
      limit,
      offset,
      total,
    });
  }

  return res.status(405).end('Method not allowed');
}
