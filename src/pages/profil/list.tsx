import type { GetServerSidePropsContext } from 'next/types';
import React from 'react';
import { InView } from 'react-intersection-observer';

import { Seo } from '@/components/Seo';
import { Loader } from '@/components/shared';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import { FolgenContainer, GridFolge } from '@/modules/Grid';
import { ProfilLayout } from '@/modules/Profil';
import { trpc } from '@/utils/trpc';

const MerklistPage = () => {
  const { data, isFetching, error, fetchNextPage } =
    trpc.user.listWithFolgen.useInfiniteQuery(
      { limit: 20 },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.offset + lastPage.limit < lastPage.total) {
            return lastPage.offset + lastPage.limit;
          }
          return undefined;
        },
      },
    );

  const isEmptyList =
    error?.data?.code === 'NOT_FOUND' || data?.pages[0].items.length === 0;

  return (
    <>
      <Seo title="Merkliste" canonicalpath="/profil/list" />

      <ProfilLayout>
        {isEmptyList && (
          <p className="text-center">Keine Folgen auf der Merkliste</p>
        )}

        <FolgenContainer>
          {data?.pages.map((groupe, i) => (
            <React.Fragment key={i}>
              {groupe.items.map((folge) => {
                return <GridFolge key={folge._id} folge={folge} />;
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

export default MerklistPage;
