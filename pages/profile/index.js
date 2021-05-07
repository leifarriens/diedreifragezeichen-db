// import dbConnect from '../../db';
// import Rating from '../../models/rating';
// import Folge from '../../models/folge';
import { signIn, signOut, useSession, getSession } from 'next-auth/client';
import { parseMongo } from '../../utils';
import {
  GridContainer,
  FolgenContainer,
} from '../../components/Grid/StyledGrid';
import GridFolge from '../../components/Grid/GridFolge';

function Profile({ ratings, folgen }) {
  const [session, loading] = useSession();

  if (loading) return null;

  if (!loading && !session) return signIn();

  const { name, email } = session.user;

  return (
    <div className="wrapper">
      <div>{name}</div>
      <div>{email}</div>
      <button onClick={() => signOut()}>Logout</button>
      {/* <h3>Deine Bwertungen</h3>
      <GridContainer>
        <FolgenContainer>
          {folgen.map((folge) => (
            <GridFolge key={folge._id} folge={folge} coverOnly={true} />
          ))}
        </FolgenContainer>
      </GridContainer> */}
    </div>
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

  // await dbConnect();

  // const data = await Rating.find({ user: session.user.email });

  // const ratedFolgen = data.map((r) => r.folge);

  // const rawFolgen = await Folge.find({
  //   _id: {
  //     $in: ratedFolgen,
  //   },
  // });

  // const ratings = parseMongo(data);
  // const folgen = parseMongo(rawFolgen);

  return {
    props: {
      // ratings,
      // folgen,
    },
  };
}

export default Profile;
