import type { GetServerSidePropsContext } from 'next';
import { trpc } from '@/utils/trpc';

import { Loader } from '@/common/components/shared/Loader';
import ProfilLayout from '@/components/Profil/Layout';
import { Seo } from '@/components/Seo/Seo';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import { Grid } from '@/modules/Grid';

const Merkliste = () => {
  const { data, isLoading } = trpc.user.listWithFolgen.useQuery();

  return (
    <>
      <Seo title="Merkliste" canonicalpath="/profil/list" />

      <ProfilLayout>
        {data && <Grid folgen={data} />}

        {isLoading && <Loader />}
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

  return { props: {} };
};

export default Merkliste;
