import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import Rating from '@/models/rating';
import { getAltFolgen } from '@/services/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });
  const { method, query } = req;
  const [id, action] = query.slug;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).send('Not Found');
  }

  await dbConnect();

  // eslint-disable-next-line no-unused-vars

  // GET & POST /api/folgen/:id/rating
  if (action === 'rating') {
    if (!session) {
      return res.status(401).send('Unauthorized');
    }

    req.session = session;

    switch (method) {
      case 'GET':
        return handleGetUserRating(req, res);
      case 'POST':
        return handlePostRating(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }

  // GET /api/folgen/:id/alts
  if (action === 'alts') {
    switch (method) {
      case 'GET':
        return handleGetAltFolgen(req, res);
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }

  res.status(404).end();
}

const handleGetAltFolgen = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const { slug } = req.query;
  let { fields = '' } = req.query;
  const [id] = slug;

  fields = fields.match(/[^,]+/g) || [];

  const folgen = await getAltFolgen(id, { fields });

  return res.json(folgen);
};

const handlePostRating = async (req: NextApiRequest, res: NextApiResponse) => {
  const [id] = req.query.slug;

  const data = req.body;

  if (!data.rating || typeof data.rating !== 'number') {
    return res.status(400).end();
  }

  const userId = new mongoose.Types.ObjectId(req.session.user.id);
  const folgeId = new mongoose.Types.ObjectId(id);

  const rating = await Rating.findOneAndUpdate(
    {
      user: userId,
      folge: folgeId,
    },
    {
      user: userId,
      folge: folgeId,
      value: data.rating,
    },
    { upsert: true, new: true },
  );

  return res.status(201).json(rating);
};

const handleGetUserRating = async (
  req: NextApiRequest,
  res: NextApiResponse,
) => {
  const [id] = req.query.slug;

  const userId = req.session.user.id;

  const data = await Rating.findOne({ folge: id, user: userId });

  if (!data) return res.status(404).end();

  return res.json(data);
};
