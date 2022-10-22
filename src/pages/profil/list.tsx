import { GetServerSidePropsContext } from 'next';
import { getSession } from 'next-auth/react';

import { Grid } from '@/components/Grid';
import ProfilLayout from '@/components/Profil/Layout';
import Seo from '@/components/Seo/Seo';
import dbConnect from '@/db/connect';
import type { Folge } from '@/models/folge';
import { UserWithId } from '@/models/user';
import { getUserWithList } from '@/services/index';
import { parseMongo } from '@/utils/index';

type UserWithList = {
  list: Folge[];
} & Omit<UserWithId, 'list'>;

type MerklistePageProps = {
  user: UserWithList;
};

function Merkliste({ user }: MerklistePageProps) {
  return (
    <>
      <Seo title="Merkliste" canonicalpath="/profil/list" />

      <ProfilLayout>
        {user.list.length > 0 ? (
          <Grid folgen={user.list.reverse()} />
        ) : (
          <p>Du hast noch keine Folgen auf der Merkliste.</p>
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

  const userData = await getUserWithList(session.user.id);

  const user = parseMongo(userData);

  return {
    props: {
      user,
    },
  };
};

export default Merkliste;
