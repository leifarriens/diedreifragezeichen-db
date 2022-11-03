import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import ProfilLayout from '@/components/Profil/Layout';
import Seo from '@/components/Seo/Seo';
import dbConnect from '@/db/connect';
import { User, UserWithId } from '@/models/user';
import { UserReviews } from '@/modules/Reviews';
import { RatingWithFolge } from '@/types';
import { parseMongo } from '@/utils/index';

type ReviewsPageProps = {
  user: UserWithId;
  reviews: RatingWithFolge[];
};

function ReviewsPage({ user }: ReviewsPageProps) {
  return (
    <>
      <Seo title="Reviews" canonicalpath="/profil/reviews" />

      <ProfilLayout>
        <UserReviews userId={user._id} />
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

  const user = await User.findById(session.user.id);

  return {
    props: {
      user: parseMongo(user),
    },
  };
};

export default ReviewsPage;
