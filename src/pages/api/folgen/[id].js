import { Types } from 'mongoose';

import dbConnect from '../../../db';
import { getFolgeById } from '../../../services';
import { parseMongo } from '../../../utils';

/**
 * Get folge by id
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let { id, fields = '' } = req.query;

    fields = fields.match(/[^,]+/g) || [];

    if (Types.ObjectId.isValid(id)) {
      await dbConnect();

      const folge = parseMongo(await getFolgeById(id, { fields }));

      return res.send(folge);
    }

    return res.status(404).end('Not Found');
  }

  return res.status(405).end('Method not allowed');
}
