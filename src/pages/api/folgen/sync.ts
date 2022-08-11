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

    const ACTION_KEY = req.headers.authorization.split(' ')[1];

    try {
      if (ACTION_KEY === APP_KEY) {
        await dbConnect();

        const result = await syncFolgen();

        return res.status(201).json(result);
      } else {
        return res.status(401).end('Invalid App Key provided');
      }
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
