import { GetServerSidePropsContext } from 'next';

import ProfilLayout from '@/components/Profil/Layout';
import RatingProgress from '@/components/Profil/RatingProgress';
import Seo from '@/components/Seo/Seo';
import dbConnect from '@/db/connect';
import { getServerSession } from '@/lib/getServerSession';
import { Folge } from '@/models/folge';
import { Rating } from '@/models/rating';
import { FolgenContainer, GridFolge } from '@/modules/Grid';
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
              return (
                <GridFolge
                  key={_id.toString()}
                  folge={folge}
                  userRating={value}
                />
              );
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
  res,
}: GetServerSidePropsContext) => {
  const session = await getServerSession(req, res);

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
