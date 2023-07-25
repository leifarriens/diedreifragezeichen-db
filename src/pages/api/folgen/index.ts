import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { dbConnect } from '@/db/connect';
import { Apikey } from '@/models/apikey';
import { Folge } from '@/models/folge';

const queryParamsSchema = z.object({
  offset: z.coerce.number().min(0).default(0),
  limit: z.coerce.number().min(1).max(20).default(20),
  sort: z
    .enum(['release_date', '-release_date', 'rating', '-rating'])
    .default('-release_date'),
  apikey: z.string().uuid('Malformed apikey'),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const result = queryParamsSchema.safeParse(req.query);

    if (!result.success) {
      const isUnauthorized = !!result.error.errors.find(({ path }) =>
        path.includes('apikey'),
      );

      return res.status(isUnauthorized ? 401 : 400).json({
        errors: Object.fromEntries(
          result.error.issues.map(({ path, message }) => [
            path.join('.'),
            message,
          ]),
        ),
      });
    }

    const { apikey, offset, limit, sort } = result.data;

    await dbConnect();

    if (!(await Apikey.findOne({ token: apikey }))) {
      return res.status(403).json({
        errors: { apikey: 'Invalid apikey' },
      });
    }

    const filter = { isHidden: { $ne: true } };
    const total = await Folge.countDocuments(filter);

    const folgen = await Folge.find(filter)
      .sort(sort)
      .skip(offset)
      .limit(limit);

    return res.json({
      items: folgen,
      limit,
      offset,
      total,
    });
  }

  return res.status(405).end('Method not allowed');
}
