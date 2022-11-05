import type { NextApiRequest, NextApiResponse } from 'next';

import dbConnect from '@/db/connect';
import { getServerSession } from '@/lib/getServerSession';
import { User } from '@/models/user';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  const session = await getServerSession(req, res);

  if (!session) {
    return res.status(401).send('Unauthorized');
  }

  await dbConnect();

  if (req.method === 'DELETE') {
    const userId = session.user.id;

    await User.updateOne(
      { _id: userId },
      {
        $pull: { list: req.query.folgeId },
      },
    );

    return res.status(204).end();
  }

  return res.status(405).end('Method not allowed');
}
