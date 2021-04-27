import connectDB from '../../../middleware/mongodb';
import Folge from '../../../models/folge';

const handler = async (req, res) => {
  console.log('API CALL');
  if (req.method === 'GET') {
    const folgen = await Folge.find({}).sort('release_date');
    return res.json(folgen);
  }
};

export default connectDB(handler);
