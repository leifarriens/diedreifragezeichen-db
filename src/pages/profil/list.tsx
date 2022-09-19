import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import { Grid } from '@/components/Grid';
import Links from '@/components/Profil/Links';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import type { Folge } from '@/models/folge';
import { UserWithId } from '@/models/user';
import { getUserWithList } from '@/services/index';
import { parseMongo } from '@/utils/index';

interface UserWithlist extends UserWithId {
  list: Folge[];
}

type MerklistePageProps = {
  user: UserWithlist;
};

function Merkliste({ user }: MerklistePageProps) {
  return (
    <Wrapper maxWidth="1280px">
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

  const userData = await getUserWithList(session.user.id);

  const user = parseMongo(userData);

  return {
    props: {
      user,
    },
  };
};

export default Merkliste;
