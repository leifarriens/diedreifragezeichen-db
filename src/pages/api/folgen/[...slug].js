import mongoose from 'mongoose';
import { getSession } from 'next-auth/client';

import dbConnect from '../../../db';
import Folge from '../../../models/folge';
import Rating from '../../../models/rating';
import { getFolgeWithRating } from '../../../services/index';
import { applyFolgenRating, parseMongo } from '../../../utils';

export default async function handler(req, res) {
  const session = await getSession({ req });
  const { method, query } = req;

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  // eslint-disable-next-line no-unused-vars
  const [id, action] = query.slug;

  if (!action) {
    switch (method) {
      case 'GET':
        return getFolge(req, res);
      default:
        res.setHeader('Allow', ['GET']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }

  if (action === 'rating') {
    switch (method) {
      case 'GET':
        return getUserRating(req, res);
      case 'POST':
        return handlePostRating(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }

  res.status(404).end();
}

const getFolge = async (req, res) => {
  const [id] = req.query.slug;

  const data = await getFolgeWithRating(id);

  let folge = parseMongo(data);

  folge = applyFolgenRating(folge);

  res.send(folge);
};

const handlePostRating = async (req, res) => {
  const [id] = req.query.slug;

  const session = await getSession({ req });

  // if (!session) {
  //   return res.status(401).end();
  // }

  const data = JSON.parse(req.body);

  const email = session.user.email;

  const rating = await Rating.findOneAndUpdate(
    {
      user: email,
      folge: id,
    },
    {
      user: email,
      folge: mongoose.Types.ObjectId(id),
      value: data.rating,
    },
    { upsert: true, new: true }
  );

  await Folge.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { ratings: mongoose.Types.ObjectId(rating._id) },
    },
    { new: true }
  );

  res.status(201).end();
};

const getUserRating = async (req, res) => {
  await dbConnect();

  const [id] = req.query.slug;

  const session = await getSession({ req });

  // if (!session) {
  //   return res.status(401).end();
  // }

  const email = session.user.email;

  const data = await Rating.findOne({ folge: id, user: email });

  if (!data) return res.status(404).end();

  const userRating = parseMongo(data);

  res.send(userRating);
};
