import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getFolgen } from '@/services/index';
import { filterByQuery } from '@/utils/filter';

/**
 * Get all folgen
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    let fields = Array.isArray(req.query.fields)
      ? req.query.fields[0]
      : req.query.fields || '';

    await dbConnect();

    const q = Array.isArray(req.query.q) ? req.query.q[0] : req.query.q || '';

    fields = fields.match(/[^,]+/g) || [];
    const folgen = await getFolgen({ fields });

    if (req.query.q) {
      const filtered = filterByQuery(folgen, q);
      return res.json(filtered);
    }

    return res.json(folgen);
  }

  return res.status(405).end('Method not allowed');
}
