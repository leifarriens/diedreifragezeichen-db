import dbConnect from '../../../db';
import syncFolgen from '../../../services/syncFolgen';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    if (!req.headers.authorization) {
      return res.status(401).end('No App Key provided');
    }

    const { APP_KEY } = process.env;

    const ACTION_KEY = req.headers.authorization.split(' ')[1];

    try {
      if (ACTION_KEY === APP_KEY) {
        await dbConnect();

        const result = await syncFolgen();
        console.log(result);
        return res.status(201).json(result);
      } else {
        return res.status(401).end();
      }
    } catch (err) {
      console.error(err);
      res.status(500).end();
    }
  } else {
    res.status(405).send('Method Not Allowed');
  }
}
