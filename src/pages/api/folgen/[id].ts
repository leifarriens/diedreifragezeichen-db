import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getFolge } from '@/services/index';
import { parseQueryParam } from '@/utils/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const id = parseQueryParam(req.query.id);

    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).end('Not Found');
    }

    await dbConnect();

    const folge = await getFolge(id);

    if (!folge) return res.status(404).end('Not Found');

    return res.json(folge);
  }

  return res.status(405).end('Method not allowed');
}
