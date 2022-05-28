import { getSession, signIn, useSession } from 'next-auth/react';
import styled from 'styled-components';

import GridFolge from '../../components/Grid/GridFolge';
import { FolgenContainer } from '../../components/Grid/StyledGrid';
import Header from '../../components/Header';
import dbConnect from '../../db';
import Folge from '../../models/folge';
import rating from '../../models/rating';
import Rating from '../../models/rating';
import { applyFolgenRating, parseMongo } from '../../utils';

function Profile({ folgenWithRating, ratings }) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) return null;

  if (!session) return signIn();

  const { name } = session.user;
  console.log(ratings);
  return (
    <Styles>
      <Header />
      <div className="wrapper">
        <h2>Hallo, {name}</h2>
        <h3>Deine Bewertungen</h3>
        <FolgenContainer>
          {/* {ratings.map((entry) => (
            <GridFolge
              key={entry._id}
              folge={entry.folge}
              rating={entry.value}
            />
          ))} */}
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

export async function getServerSideProps({ req, res }) {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: '/api/auth/signin',
    });

    return res.end();
  }

  await dbConnect();
  const data = await Rating.find({ id: session.user.id }).populate('folge');
  console.log(data);
  // const folgenWithRating = data.map(rating => {
  //   return {...rating.folge, userRating = }
  // })
  // const ratedFolgen = data.map((r) => r.folge);
  // console.log(ratedFolgen);
  // const ratedFolgen = data.map((r) => r.folge);

  // const folgen = await Folge.fin
  // const rawFolgen = await Folge.find({
  //   _id: {
  //     $in: ratedFolgen,
  //   },
  // });
  // // .populate('ratings');

  // const ratings = parseMongo(data);
  // console.log(ratings);
  // const folgen = parseMongo(rawFolgen);

  // let folgenWithRating = folgen.map((f) => {
  //   f.userRating = ratings.find((r) => r.folge === f._id).value;
  //   return f;
  // });

  // folgenWithRating = folgenWithRating.map(applyFolgenRating);

  return {
    props: {
      // ratings,
      folgenWithRating: [],
    },
  };
}

export default Profile;
