import dbConnect from '../../../db';
import { getFolgen } from '../../../services';
import { filterByQuery } from '../../../utils';

/**
 * Get all folgen
 */

export default async function handler(req, res) {
  if (req.method === 'GET') {
    let { fields = '' } = req.query;

    await dbConnect();

    fields = fields.match(/[^,]+/g) || [];
    const folgen = await getFolgen({ fields });

    if (req.query.q) {
      const filtered = filterByQuery(folgen, req.query.q);
      return res.json(filtered);
    }

    return res.json(folgen);
  }

  return res.status(405).end('Method not allowed');
}
