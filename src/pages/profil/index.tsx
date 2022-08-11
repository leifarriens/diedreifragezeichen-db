import { GetServerSidePropsContext } from 'next';
import { getSession, signIn, useSession } from 'next-auth/react';
import styled from 'styled-components';

import GridFolge from '@/components/Grid/GridFolge';
import RatingProgress from '@/components/Profil/RatingProgress';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import Folge from '@/models/folge';
import Rating from '@/models/rating';
import { RatingWithFolge } from '@/types';
import { parseMongo } from '@/utils/index';

type ProfilePageProps = {
  ratings: RatingWithFolge[];
  numberOfFolgen: number;
};

function Profile({ ratings, numberOfFolgen }: ProfilePageProps) {
  const { data: session, status } = useSession();
  const loading = status === 'loading';

  if (loading) return null;

  if (!session) return signIn();

  return (
    <Styles>
      <Wrapper maxWidth="860px">
        {ratings.length >= 2 && (
          <p>Du hast bereits {ratings.length.toString()} Folgen bewertet!</p>
        )}

        <RatingProgress ratings={ratings} numberOfFolgen={numberOfFolgen} />

        <h3>Deine Bewertungen</h3>

        {ratings && ratings.length > 0 ? (
          <List>
            {ratings.map(({ _id, value, folge }) => {
              return <GridFolge key={_id} folge={folge} userRating={value} />;
            })}
          </List>
        ) : (
          <p>Du hast noch keine Folgen bewertet.</p>
        )}
      </Wrapper>
    </Styles>
  );
}

const List = styled.div`
  display: grid;
  gap: 1em;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
`;

const Styles = styled.div`
  h3 {
    margin: 36px 0;
  }
`;

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });

  if (!session) {
    res.writeHead(302, {
      Location: '/api/auth/signin',
    });

    return res.end();
  }

  await dbConnect();

  const data = await Rating.find({ user: session.user.id })
    .populate('folge')
    .sort('-updatedAt');
  const ratings: RatingWithFolge[] = parseMongo(data);

  const numberOfFolgen = await Folge.countDocuments({
    type: 'regular',
  });

  return {
    props: {
      ratings,
      numberOfFolgen,
    },
  };
};

export default Profile;
