import { Loader } from '@/common/components/shared/Loader';
import ProfilLayout from '@/components/Profil/Layout';
import { Seo } from '@/components/Seo/Seo';
import { Grid } from '@/modules/Grid';
import { trpc } from '@/utils/trpc';

const MerklistPage = () => {
  const { data, isLoading } = trpc.user.listWithFolgen.useQuery();

  return (
    <>
      <Seo title="Merkliste" canonicalpath="/profil/list" />

      <ProfilLayout>
        {data && <Grid folgen={data} />}

        {data?.length === 0 && (
          <p className="text-center">Noch keine Folgen auf der Merkliste</p>
        )}

        {isLoading && <Loader />}
      </ProfilLayout>
    </>
  );
};

export default MerklistPage;
