import dbConnect from '../../../db';
import Folge from '../../../models/folge';
import { getSession } from 'next-auth/client';
import Rating from '../../../models/rating';
import mongoose from 'mongoose';
import { parseMongo } from '../../../utils';

export default async function handler(req, res) {
  const { method, query } = req;

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

  const data = await Folge.findById(id).populate('ratings');

  const folge = parseMongo(data);

  res.send(folge);
};

const handlePostRating = async (req, res) => {
  const [id] = req.query.slug;

  const session = await getSession({ req });

  if (!session) {
    return res.status(401).end();
  }

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

  if (!session) {
    return res.status(401).end();
  }

  const email = session.user.email;

  const data = await Rating.findOne({ folge: id, user: email });

  const userRating = parseMongo(data);

  res.send(userRating);
};
