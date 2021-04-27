import connectDB from '../../../middleware/mongodb';
import Folge from '../../../models/folge';

const handler = async (req, res) => {
  const { method, query } = req;

  const [id, action] = query.slug;

  console.log(id, action);
  switch (method) {
    case 'POST':
      const data = JSON.parse(req.body);
      const updated = await Folge.findByIdAndUpdate(id, {
        $push: { ratings: data.rating },
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
