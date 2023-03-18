import type { GetServerSidePropsContext } from 'next/types';
import React from 'react';
import { InView } from 'react-intersection-observer';

import ProfilLayout from '@/components/Profil/Layout';
import RatingProgress from '@/components/Profil/RatingProgress';
import { Seo } from '@/components/Seo/Seo';
import { Loader } from '@/components/shared/Loader';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import { FolgenContainer, GridFolge } from '@/modules/Grid';
import { trpc } from '@/utils/trpc';

const ProfilePage = () => {
  const limit = 20;

  const { data, fetchNextPage, isFetching } =
    trpc.user.ratedFolgen.useInfiniteQuery(
      { limit },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.offset + limit < lastPage.total) {
            return lastPage.offset + limit;
          }
          return undefined;
        },
      },
    );

  return (
    <>
      <Seo title="Bewertungen" canonicalpath="/profil" />

      <ProfilLayout>
        <RatingProgress />

        <FolgenContainer>
          {data?.pages.map((groupe, i) => (
            <React.Fragment key={i}>
              {groupe.items.map((r) => {
                return (
                  <GridFolge key={r._id} folge={r.folge} userRating={r.value} />
                );
              })}
            </React.Fragment>
          ))}
        </FolgenContainer>

        {isFetching && <Loader />}

        <InView onChange={(inView) => inView && fetchNextPage()} />
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

export default ProfilePage;
