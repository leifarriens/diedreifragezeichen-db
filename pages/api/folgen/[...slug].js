import dbConnect from '../../../db';
import Folge from '../../../models/folge';
import { getSession } from 'next-auth/client';
import User from '../../../models/user';
import Rating from '../../../models/rating';


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

      const rating = {
        user: email,
        rating: data.rating
      }

      console.log(rating);

      res.status(201).end();
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};
