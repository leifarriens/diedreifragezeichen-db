import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getFolgeById } from '@/services/index';
import { parseMongo } from '@/utils/index';

/**
 * Get folge by id
 */

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const id = Array.isArray(req.query.id) ? req.query.id[0] : req.query.id;
    let { fields = '' } = req.query;

    fields = fields.match(/[^,]+/g) || [];

    if (Types.ObjectId.isValid(id)) {
      await dbConnect();

      const folge = parseMongo(await getFolgeById(id, { fields }));

      return res.send(folge);
    }

    return res.status(404).end('Not Found');
  }

  return res.status(405).end('Method not allowed');
}
