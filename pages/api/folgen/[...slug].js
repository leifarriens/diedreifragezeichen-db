import connectDB from '../../../middleware/mongodb';
import Folge from '../../../models/folge';
import { getSession } from 'next-auth/client';
import User from '../../../models/user';

const handler = async (req, res) => {
  const { method, query } = req;

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

      const updatedFolge = await Folge.findByIdAndUpdate(id, {
        $push: { ratings: data.rating }
      }, { new: true });

      console.log(updatedFolge);

      res.status(201).end()
      break;
    default:
      res.setHeader('Allow', ['POST']);
      res.status(405).end(`Method ${method} Not Allowed`);
  }
};

// helpers

async function updateRatingInUser(email, id, rating) {
  const user = await User.findOneAndUpdate({ email }, {}, { upsert: true, new: true });

  const index = user.ratings.findIndex(r => r.folge === id);

  if (index !== -1) {
    // rating exists in user ratings array
    user.ratings[index].rating = rating;
  } else {
    // push new rating
    user.ratings.push({
      folge: id,
      rating
    })
  }

  return await user.save();
}

async function updateRatingInFolge(id, user_id, rating) {
  const folge = await Folge.findById(id);

  const index = folge.newRatings.findIndex(r => r.user === user_id.toString());

  if (index !== -1) {
    // user has rated this folge -> update rating
    console.log('has rated', index);
    folge.newRatings[index].rating = rating;
  } else {
    // push new rating
    folge.newRatings.push({
      user: user_id.toString(),
      rating
    })
  }

  return await folge.save();
}

export default connectDB(handler);
