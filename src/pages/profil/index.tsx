import type { GetServerSidePropsContext } from 'next/types';
import React, { useState } from 'react';
import { InView } from 'react-intersection-observer';

import { Seo } from '@/components/Seo';
import { Loader, Select } from '@/components/shared';
import type { RatingsSortOptions } from '@/constants/enums';
import { ratingsSortOptions, RatingsSortOptionsNames } from '@/constants/enums';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import { FolgenContainer, GridFolge } from '@/modules/Grid';
import { ProfilLayout, RatingProgress } from '@/modules/Profil';
import { trpc } from '@/utils/trpc';

const ProfilePage = () => {
  const [sort, setSort] = useState<RatingsSortOptions>('updated_at');
  const { data, fetchNextPage, isFetching } =
    trpc.user.ratedFolgen.useInfiniteQuery(
      { limit: 20, sort },
      {
        getNextPageParam: (lastPage) => {
          if (lastPage.offset + lastPage.limit < lastPage.total) {
            return lastPage.offset + lastPage.limit;
          }
          return undefined;
        },
      },
    );

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!e.target.value) return;

    const value = e.target.value as RatingsSortOptions;

    setSort(value);
  }

  return (
    <>
      <Seo title="Bewertungen" canonicalpath="/profil" />

      <ProfilLayout>
        <RatingProgress />

        <div className="mb-8">
          <Select value={sort} onChange={handleSortChange} className="!w-auto">
            {ratingsSortOptions.map((value) => (
              <option key={value} value={value}>
                {RatingsSortOptionsNames[value]}
              </option>
            ))}
          </Select>
        </div>

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
