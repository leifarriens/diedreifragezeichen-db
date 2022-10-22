import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { getUserFolgenRating, postFolgenRating } from '@/services/index';
import { parseQueryParam } from '@/utils/index';

// TODO: should move to /api/user/ratings/:folgeId
// This endpoint should return all ratings with future review
export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  const id = parseQueryParam(req.query.id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('Not Found');
  }

  await dbConnect();

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  if (req.method === 'GET') {
    const userId = session.user.id;

    const rating = await getUserFolgenRating({ folgeId: id, userId });

    if (!rating) return res.status(404).send('Not found');

    return res.json(rating);
  }

  if (req.method === 'POST') {
    const data = req.body;

    if (!data.rating || typeof data.rating !== 'number') {
      return res.status(400).end();
    }

    const rating = await postFolgenRating({
      folgeId: id,
      userId: session.user.id,
      userRating: data.rating,
    });

    return res.status(201).json(rating);
  }

  return res.status(405).end('Method not allowed');
}
