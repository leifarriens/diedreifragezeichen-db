import { getSession, signIn, signOut, useSession } from 'next-auth/client';

import Grid from '../../components/Grid';
import Header from '../../components/Header';
import dbConnect from '../../db';
import Folge from '../../models/folge';
import Rating from '../../models/rating';
import { applyFolgenRating, parseMongo } from '../../utils';

function Profile({ folgenWithRating }) {
  const [session, loading] = useSession();

  if (loading) return null;

  if (!session) return signIn();

  const { name, email } = session.user;

  return (
    <>
      <Header />
      <div className="wrapper">
        <div>{name}</div>
        <div>{email}</div>
        <h3 style={{ margin: '36px 0' }}>Deine Bewertungen</h3>
        <Grid folgen={folgenWithRating} />
      </div>
    </>
  );
}

export async function getServerSideProps(context) {
  const { req, res } = context;
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: '/api/auth/signin',
    });

    return res.end();
  }

  await dbConnect();

  const data = await Rating.find({ user: session.user.email });

  const ratedFolgen = data.map((r) => r.folge);

  const rawFolgen = await Folge.find({
    _id: {
      $in: ratedFolgen,
    },
  }).populate('ratings');

  const ratings = parseMongo(data);
  const folgen = parseMongo(rawFolgen);

  let folgenWithRating = folgen.map((f) => {
    f.userRating = ratings.find((r) => r.folge === f._id).value;
    return f;
  });

  folgenWithRating = folgenWithRating.map(applyFolgenRating);

  return {
    props: {
      folgenWithRating,
    },
  };
}

export default Profile;
