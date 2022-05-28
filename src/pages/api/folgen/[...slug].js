import mongoose from 'mongoose';
import { getSession } from 'next-auth/react';

import dbConnect from '../../../db';
import { Rating } from '../../../models';
import { getAltFolgen } from '../../../services';
import { parseMongo } from '../../../utils';

export default async function handler(req, res) {
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
      // case 'DELETE':
      // return handleDeleteRating(req, res);
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

const handleGetAltFolgen = async (req, res) => {
  let { slug, fields = '' } = req.query;
  const [id] = slug;

  fields = fields.match(/[^,]+/g) || [];

  const folgen = parseMongo(await getAltFolgen(id, { fields }));

  res.send(folgen);
};

const handlePostRating = async (req, res) => {
  const [id] = req.query.slug;

  const data = req.body;

  if (!data.rating || typeof data.rating !== 'number') {
    return res.status(400).end();
  }

  const userId = mongoose.Types.ObjectId(req.session.user.id);
  const folgeId = mongoose.Types.ObjectId(id);

  await Rating.findOneAndUpdate(
    {
      user: userId,
      folge: folgeId,
    },
    {
      user: userId,
      folge: folgeId,
      value: data.rating,
    },
    { upsert: true, new: true }
  );

  res.status(201).end();
};

// const handleDeleteRating = async (req, res) => {
//   const [id] = req.query.slug;

//   await Rating.findOneAndDelete(id);

//   res.status(204).send('No Content');
// };

const handleGetUserRating = async (req, res) => {
  const [id] = req.query.slug;

  const userId = req.session.user.id;

  const data = await Rating.findOne({ folge: id, user: userId });

  if (!data) return res.status(404).end();

  const userRating = parseMongo(data);

  res.send(userRating);
};
