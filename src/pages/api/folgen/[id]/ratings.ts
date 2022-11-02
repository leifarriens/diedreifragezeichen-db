import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { postFolgenRating } from '@/services/index';
import { parseQueryParam } from '@/utils/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const folgeId = parseQueryParam(req.query.id);

  if (!mongoose.Types.ObjectId.isValid(folgeId)) {
    return res.status(404).send('Not Found');
  }

  if (req.method === 'POST') {
    const session = await getSession({ req });

    if (!session) {
      return res.status(401).send('Unauthorized');
    }

    const data = req.body;

    if (!data.value || typeof data.value !== 'number') {
      return res.status(400).end();
    }

    await dbConnect();

    const rating = await postFolgenRating({
      folgeId,
      userId: session.user.id,
      value: data.value,
      body: data.body,
    });

    return res.status(201).json(rating);
  }

  return res.status(405).end('Method not allowed');
}
