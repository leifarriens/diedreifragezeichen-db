import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { User } from '@/models/user';
import { deleteUser } from '@/services/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  const userId = session.user.id;

  if (req.method === 'GET') {
    const user = await User.findById(userId);

    return res.json(user);
  }

  if (req.method === 'PATCH') {
    const user = await User.findByIdAndUpdate(userId, req.body);

    return res.json(user);
  }

  if (req.method === 'DELETE') {
    await deleteUser(userId);
    return res.status(204).send('No Content');
  }

  return res.status(405).end('Method not allowed');
}
