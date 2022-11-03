import { Types } from 'mongoose';
import { GetServerSidePropsContext } from 'next';
import { ParsedUrlQuery } from 'querystring';

import Seo from '@/components/Seo/Seo';
import Avatar from '@/components/shared/Avatar';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { UserWithId } from '@/models/user';
import { UserReviews } from '@/modules/Reviews';
import { getPublicUser } from '@/services/index';
import { parseMongo } from '@/utils/index';

type UserPageProps = {
  user: UserWithId;
};

function UserPage({ user }: UserPageProps) {
  return (
    <>
      <Seo title={user.name} canonical={`/user/${user._id}`} />

      <Wrapper maxWidth="1280px">
        <h1>{user.name}</h1>
        <Avatar image={user.image} name={user.name} />

        <UserReviews userId={user._id} />
      </Wrapper>
    </>
  );
}

interface Params extends ParsedUrlQuery {
  userId: string;
}

export const getServerSideProps = async ({
  params,
}: GetServerSidePropsContext) => {
  const { userId } = params as Params;

  if (!Types.ObjectId.isValid(userId)) {
    return {
      notFound: true,
    };
  }

  await dbConnect();

  const user = await getPublicUser(userId);

  return {
    props: {
      user: parseMongo(user),
    },
  };
};

export default UserPage;
