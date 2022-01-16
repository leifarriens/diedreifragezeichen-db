import mongoose from 'mongoose';
import { getSession } from 'next-auth/react';

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

  req.session = session;

  console.log(req.session);

  await dbConnect();

  // eslint-disable-next-line no-unused-vars
  const [_, action] = query.slug;

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

  const data = req.body;

  if (!data.rating) {
    return res.status(400).end();
  }

  const email = req.session.user.email;

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
  const [id] = req.query.slug;

  const email = req.session.user.email;

  const data = await Rating.findOne({ folge: id, user: email });

  if (!data) return res.status(404).end();

  const userRating = parseMongo(data);

  res.send(userRating);
};
