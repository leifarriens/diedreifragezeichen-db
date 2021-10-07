import dbConnect from '../../../db';
import syncFolgen from '../../../services/syncFolgen';

export default async function handler(req, res) {
  await dbConnect();

  const { APP_KEY } = process.env;
  const ACTION_KEY = req.headers.authorization.split(' ')[1];

  try {
    if (ACTION_KEY === APP_KEY) {
      // Process the POST request
      const result = await syncFolgen();
      console.log(result);
      return res.status(201).json(result);
    } else {
      return res.status(401).end();
    }
  } catch (err) {
    res.status(500).end();
  }
}
