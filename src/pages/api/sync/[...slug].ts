import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { syncDeezer, syncFolgen, syncInhalte } from '@/services/syncFolgen';

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

    const slug = req.query.slug?.[0];

    try {
      await dbConnect();

      if (slug === 'folgen') {
        const result = await syncFolgen();
        return res.status(200).json(result);
      }

      if (slug === 'inhalte') {
        const result = await syncInhalte();
        return res.status(200).json(result);
      }

      if (slug === 'deezer') {
        const result = await syncDeezer();
        return res.status(200).json(result);
      }

      return res.status(404).end();
    } catch (err) {
      console.error(err);
      return res.status(500).end();
    }
  }

  res.status(405).send('Method Not Allowed');
}
