import connectDB from '../../../middleware/mongodb';
import { getSession } from 'next-auth/client';

const handler = async (req, res) => {
  const session = await getSession({ req });
  if (session) {
    console.log('Session', JSON.stringify(session, null, 2));
    res.status(200).send('hi');
  } else {
    res.status(401).send('No auth');
  }
};

export default connectDB(handler);
