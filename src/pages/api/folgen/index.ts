import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getFolgen } from '@/services/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    await dbConnect();
    const folgen = await getFolgen();

    return res.json(folgen);
  }

  return res.status(405).end('Method not allowed');
}
