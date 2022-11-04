import type { NextApiRequest, NextApiResponse } from 'next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { User } from '@/models/user';
import { deleteUser } from '@/services/user.service';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getSession({ req });

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'GET') {
    const userId = session.user.id;

    const user = await User.findById(userId);

    return res.json(user);
  }

  if (req.method === 'DELETE') {
    await deleteUser(session.user.id);
    return res.status(204).end();
  }

  return res.status(405).end('Method not allowed');
}
