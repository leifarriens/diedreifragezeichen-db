import dbConnect from '../../../db';
import Folge from '../../../models/folge';
import { getSession } from 'next-auth/client';
import Rating from '../../../models/rating';
import mongoose from 'mongoose';

export default async function handler (req, res) {
  const { method, query } = req;

  await dbConnect()

  const [id, action] = query.slug;

  if (action === 'rate') {
    return handleRate(req, res);
  }

  res.status(404).end();
};

const handleRate = async (req, res) => {
  const { method, query } = req;
  const [id] = query.slug;

  const session = await getSession({ req });

  switch (method) {
    case 'POST':
      if (!session) {
        return res.status(401).end();
      }

      const data = JSON.parse(req.body);

      const email = session.user.email;

      const rating = await Rating.findOneAndUpdate({
        user: email,
        folge: id
      }, {
        user: email,
        folge: mongoose.Types.ObjectId(id),
        value: data.rating
      }, { upsert: true, new: true });

      console.log(rating);

      const updatedFolge = await Folge.findByIdAndUpdate(id, {
        $addToSet: { ratings: mongoose.Types.ObjectId(rating._id) }
      }, { new: true });

      console.log(updatedFolge);

      res.status(201).end();
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
