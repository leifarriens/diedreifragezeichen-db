import type {
  GetServerSidePropsContext,
  InferGetServerSidePropsType,
} from 'next';
import React from 'react';
import { InView } from 'react-intersection-observer';
import { trpc } from 'utils/trpc';

import ProfilLayout from '@/components/Profil/Layout';
import RatingProgress from '@/components/Profil/RatingProgress';
import { Seo } from '@/components/Seo/Seo';
import { Loader } from '@/components/shared/Loader';
import dbConnect from '@/db/connect';
import { getServerSession } from '@/lib/getServerSession';
import { Folge } from '@/models/folge';
import { FolgenContainer, GridFolge } from '@/modules/Grid';

function Profile({
  numberOfFolgen,
}: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const limit = 20;

  const { data, fetchNextPage, isFetching } =
    trpc.user.infiniteRatings.useInfiniteQuery(
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
        {data && (
          <RatingProgress
            numberOfRatings={data.pages[0].total}
            numberOfFolgen={numberOfFolgen}
          />
        )}

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
}

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getServerSession(req, res);

  if (!session) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }

  await dbConnect();

  const numberOfFolgen = await Folge.count();

  return {
    props: {
      numberOfFolgen,
    },
  };
};

export default Profile;
