import mongoose from 'mongoose';
import { getSession } from 'next-auth/react';

import dbConnect from '../../../db';
import { Folge } from '../../../models';
import { getUserRatings } from '../../../services/';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'GET') {
    const userId = session.user.id;

    const ratings = await getUserRatings(userId, {
      fields: ['folge', 'value'],
    });

    // const userId = session.user.id;
    // console.log(userId);
    // const folgen = await Folge.aggregate([
    //   {
    //     $lookup: {
    //       from: 'ratings',
    //       let: { userId: userId },
    //       pipeline: [
    //         // { $addFields: { userId: { $toObjectId: '$user' } } },
    //         { $match: { $and: [
    //           {user: mongoose.Types.ObjectId(userId)},
    //           {folge: mongoose.Types.ObjectId(userId)},
    //         ] } },
    //         // { $match: { $expr: { $eq: ['$userId', '$$userId'] } } },
    //       ],
    //       as: 'output',
    //     },
    //   },
    // ]);

    return res.json(ratings);
  }

  return res.status(405).end('Method not allowed');
}
