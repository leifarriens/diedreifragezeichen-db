import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import { FolgenContainer, GridFolge } from '@/components/Grid';
import ProfilLayout from '@/components/Profil/Layout';
import RatingProgress from '@/components/Profil/RatingProgress';
import Seo from '@/components/Seo/Seo';
import dbConnect from '@/db/connect';
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
    <>
      <Seo title="Bewertungen" canonicalpath="/profil" />
      <ProfilLayout>
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
      </ProfilLayout>
    </>
  );
}

export const getServerSideProps = async ({
  req,
}: GetServerSidePropsContext) => {
  const session = await getSession({ req });

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
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
