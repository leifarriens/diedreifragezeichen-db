import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import { Grid } from '@/components/Grid';
import Links from '@/components/Profil/Links';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import UserModel from '@/models/user';
import { FolgeType, User } from '@/types';
import { parseMongo } from '@/utils/index';

interface UserWithMerklist extends User {
  list: FolgeType[];
}

type MerklistePageProps = {
  user: UserWithMerklist;
};

function Merkliste({ user }: MerklistePageProps) {
  return (
    <Wrapper maxWidth="1080px">
      <h1>Profil</h1>

      <Links />

      <Grid folgen={user.list.reverse()} />
    </Wrapper>
  );
}

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

  const userData = await UserModel.findById(session.user.id).populate('list');

  const user: UserWithMerklist = parseMongo(userData);

  return {
    props: {
      user,
    },
  };
};

export default Merkliste;
