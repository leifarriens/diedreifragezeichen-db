import connectDB from '../../../middleware/mongodb';
import Folge from '../../../models/folge';
import { getSession } from 'next-auth/client';

const handler = async (req, res) => {
  const { method, query } = req;

  const session = await getSession({ req });

  const [id, action] = query.slug;

  switch (method) {
    case 'POST':
      if (!session) {
        return res.status(401).end();
      }

      const data = JSON.parse(req.body);
      const emailAsId = session.email;

      const updated = await Folge.findByIdAndUpdate(id, {
        $add: { ratings: data.rating },
      });

      // const folge = await Folge.findById(id);
      res.json(updated);
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

export default connectDB(handler);
