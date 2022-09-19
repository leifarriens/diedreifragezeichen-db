import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';
import styled from 'styled-components';

import { FolgenContainer, GridFolge } from '@/components/Grid';
import Links from '@/components/Profil/Links';
import RatingProgress from '@/components/Profil/RatingProgress';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { Folge } from '@/models/folge';
import Rating from '@/models/rating';
import { RatingWithFolge } from '@/types';
import { parseMongo } from '@/utils/index';

type ProfilePageProps = {
  ratings: RatingWithFolge[];
  numberOfFolgen: number;
};

function Profile({ ratings, numberOfFolgen }: ProfilePageProps) {
  return (
    <Styles>
      <Wrapper maxWidth="1280px">
        <h1>Profil</h1>

        <Links />

        <RatingProgress ratings={ratings} numberOfFolgen={numberOfFolgen} />

        {ratings && ratings.length > 0 ? (
          <FolgenContainer>
            {ratings.map(({ _id, value, folge }) => {
              return <GridFolge key={_id} folge={folge} userRating={value} />;
            })}
          </FolgenContainer>
        ) : (
          <p>Du hast noch keine Folgen bewertet.</p>
        )}
      </Wrapper>
    </Styles>
  );
}

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

  const ratingsData = await Rating.find({ user: session.user.id })
    .populate('folge')
    .sort('-updated_at');
  const ratings = parseMongo(ratingsData);

  const numberOfFolgen = await Folge.countDocuments();

  return {
    props: {
      ratings,
      numberOfFolgen,
    },
  };
};

export default Profile;
