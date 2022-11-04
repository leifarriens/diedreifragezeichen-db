import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getAltFolgen } from '@/services/folge.service';
import { parseQueryParam } from '@/utils/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const id = parseQueryParam(req.query.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('Not Found');
  }

  await dbConnect();

  if (req.method === 'GET') {
    const fieldsQuery = parseQueryParam(req.query.fields);

    const fields = fieldsQuery.match(/[^,]+/g) || [];

    const folgen = await getAltFolgen(id, { fields });

    return res.json(folgen);
  }

  return res.status(405).end('Method not allowed');
}
