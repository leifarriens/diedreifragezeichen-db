import { getSession, signIn, useSession } from 'next-auth/react';
import styled from 'styled-components';

import GridFolge from '../../components/Grid/GridFolge';
import { FolgenContainer } from '../../components/Grid/StyledGrid';
import Header from '../../components/Header';
import dbConnect from '../../db';
import Folge from '../../models/folge';
import Rating from '../../models/rating';
import { applyFolgenRating, parseMongo } from '../../utils';

function Profile({ folgenWithRating }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) return null;

  if (!session) return signIn();

  const { name } = session.user;

  return (
    <Styles>
      <Header />
      <div className="wrapper">
        <h2>Hallo, {name}</h2>
        <h3>Deine Bewertungen</h3>
        <FolgenContainer>
          {folgenWithRating.map((entry) => (
            <GridFolge key={entry._id} folge={entry} />
          ))}
        </FolgenContainer>
      </div>
    </Styles>
  );
}

const Styles = styled.div`
  h3 {
    margin: 36px 0;
  }
`;

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
