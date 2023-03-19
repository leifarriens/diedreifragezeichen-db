import type { GetServerSidePropsContext } from 'next/types';

import { Seo } from '@/components/Seo';
import { Loader } from '@/components/shared';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import { Grid } from '@/modules/Grid';
import { ProfilLayout } from '@/modules/Profil';
import { trpc } from '@/utils/trpc';

const MerklistPage = () => {
  const { data, isLoading, error } = trpc.user.listWithFolgen.useQuery();

  const emptyList = error?.data?.code === 'NOT_FOUND' || data?.length === 0;

  return (
    <>
      <Seo title="Merkliste" canonicalpath="/profil/list" />

      <ProfilLayout>
        {isLoading && <Loader />}

        {emptyList && (
          <p className="text-center">Keine Folgen auf der Merkliste</p>
        )}

        {data && <Grid folgen={data} />}
      </ProfilLayout>
    </>
  );
};

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

  return {
    props: {},
  };
};

export default MerklistPage;
