import dbConnect from '../../../db';
import Folge from '../../../models/folge';
import { getSession } from 'next-auth/client';
import Rating from '../../../models/rating';
import mongoose from 'mongoose';
import { calcFolgenRating } from '../../../utils';

export default async function handler(req, res) {
  const { method, query } = req;

  await dbConnect();

  const [id, action] = query.slug;

  if (action === 'rating') {
    switch (method) {
      case 'GET':
        return handleGetRating(req, res);
      case 'POST':
        return handlePostRating(req, res);
      default:
        res.setHeader('Allow', ['GET', 'POST']);
        res.status(405).end(`Method ${method} Not Allowed`);
    }
  }

  res.status(404).end();
}

const handleGetRating = async (req, res) => {
  await dbConnect();

  const [id] = req.query.slug;

  const folge = await Folge.findById(id).populate('ratings');
  const rating = calcFolgenRating(folge.ratings);

  res.json({
    rating,
    numberof: folge.ratings.length,
  });
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

  const updatedFolge = await Folge.findOneAndUpdate(
    { _id: id },
    {
      $addToSet: { ratings: mongoose.Types.ObjectId(rating._id) },
    },
    { new: true }
  );

  console.log(updatedFolge);

  res.status(201).end();
};
