import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { postFolgenRating } from '@/services/rating.service';
import { parseQueryParam } from '@/utils/index';

// TODO: GET endpoint should return all ratings with future reviews
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  const folgeId = parseQueryParam(req.query.id);

  if (!mongoose.Types.ObjectId.isValid(folgeId)) {
    return res.status(404).send('Not Found');
  }

  await dbConnect();

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  if (req.method === 'POST') {
    const data = req.body;

    if (!data.rating || typeof data.rating !== 'number') {
      return res.status(400).end();
    }

    const rating = await postFolgenRating({
      folgeId,
      userId: session.user.id,
      userRating: data.rating,
    });

    return res.status(201).json(rating);
  }

  return res.status(405).end('Method not allowed');
}
