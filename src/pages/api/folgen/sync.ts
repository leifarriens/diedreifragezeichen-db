import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import syncFolgen from '@/services/syncFolgen';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    if (!req.headers.authorization) {
      return res.status(401).end('No App Key provided');
    }

    const { APP_KEY } = process.env;

    const token = req.headers.authorization.split(' ')[1];

    if (token !== APP_KEY) {
      return res.status(401).end('Invalid App Key provided');
    }

    try {
      await dbConnect();

      const result = await syncFolgen();

      return res.status(201).json(result);
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }

  res.status(405).send('Method Not Allowed');
}
