import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';

import { dbConnect } from '@/db/connect';
import { Apikey } from '@/models/apikey';
import { getFolge } from '@/services/folge.service';

const queryParamsSchema = z.object({
  id: z.string(),
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

    const { apikey, id } = result.data;

    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).end('Not Found');
    }

    await dbConnect();

    if (!(await Apikey.findOne({ token: apikey }))) {
      return res.status(403).json({
        errors: { apikey: 'Invalid apikey' },
      });
    }

    const folge = await getFolge(id);

    if (!folge) return res.status(404).end('Not Found');

    return res.json(folge);
  }

  return res.status(405).end('Method not allowed');
}
