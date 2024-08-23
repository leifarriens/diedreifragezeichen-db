import type { NextApiRequest, NextApiResponse } from 'next';

import { dbConnect } from '@/db/connect';
import {
  syncDeezer,
  syncDetails,
  syncFolgen,
  syncFolgenDetails,
  syncWeblinks,
} from '@/services/sync.service';

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
        return res
          .setHeader('Location', 'http://localhost:3000/api/sync/details')
          .status(301)
          .send('');
      }

      if (slug === 'weblinks') {
        const result = await syncWeblinks();
        return res.status(200).json(result);
      }

      if (slug === 'details') {
        if (req.query.slug?.[1]) {
          const result = await syncFolgenDetails(req.query.slug[1]);
          if (!result) return res.send(404);

          return res.status(200).json(result);
        }

        const result = await syncDetails();
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
