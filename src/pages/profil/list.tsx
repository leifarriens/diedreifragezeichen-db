import type { GetServerSidePropsContext } from 'next';

import ProfilLayout from '@/components/Profil/Layout';
import { Seo } from '@/components/Seo/Seo';
import dbConnect from '@/db/connect';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import type { FolgeWithId } from '@/models/folge';
import type { UserWithId } from '@/models/user';
import { Grid } from '@/modules/Grid';
import { getUserWithList } from '@/services/user.service';
import { parseMongo } from '@/utils/index';

type UserWithList = {
  list: FolgeWithId[];
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
  res,
}: GetServerSidePropsContext) => {
  const session = await getServerAuthSesion(req, res);

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
