import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { Folge } from '@/models/folge';
import { parseQueryParam } from '@/utils/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    await dbConnect();

    const offsetParam = parseQueryParam(req.query.offset);
    const limitParam = parseQueryParam(req.query.limit);

    const offset = parseInt(offsetParam) > 0 ? Number(offsetParam) : 0;
    const limit =
      parseInt(limitParam) > 0 && parseInt(limitParam) <= 20
        ? Number(limitParam)
        : 20;

    const total = await Folge.count();

    const folgen = await Folge.find({}).skip(offset).limit(limit);

    return res.json({
      items: folgen,
      limit,
      offset,
      total,
    });
  }

  return res.status(405).end('Method not allowed');
}
