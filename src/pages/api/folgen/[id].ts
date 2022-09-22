import { Types } from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next';
import { unstable_getServerSession } from 'next-auth/next';
import { getSession } from 'next-auth/react';

import dbConnect from '@/db/connect';
import { getFolge, updateFolge } from '@/services/index';
import { parseQueryParam } from '@/utils/index';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method === 'GET') {
    const id = parseQueryParam(req.query.id);

    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).end('Not Found');
    }

    await dbConnect();

    const folge = await getFolge(id);

    if (!folge) return res.status(404).end('Not Found');

    return res.json(folge);
  }

  if (req.method === 'PATCH') {
    const id = parseQueryParam(req.query.id);

    if (!Types.ObjectId.isValid(id)) {
      return res.status(404).end('Not Found');
    }

    const session = await getSession({ req });

    if (!session || session.user.role !== 'Admin') {
      return res.status(403).end('Forbidden');
    }

    await dbConnect();

    const folge = await updateFolge(id, req.body);

    if (!folge) return res.status(404).end('Not Found');

    return res.json(folge);
  }

  return res.status(405).end('Method not allowed');
}
