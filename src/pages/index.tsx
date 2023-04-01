/* eslint-disable react/prop-types */ /* props from -> InferGetStaticPropsType */
import type { InferGetStaticPropsType, NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

import { Seo } from '@/components/Seo';
import { Button } from '@/components/shared';
import { colors } from '@/constants/theme';
import { dbConnect } from '@/db/connect';
import { Wrapper } from '@/layout';
import { Grid } from '@/modules/Grid';
import { parseMongo } from '@/utils/index';

import { getFolgen } from '../services/folge.service';

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = ({
  folgen,
}) => {
  const { data: session } = useSession();

  return (
    <>
      <Seo title="Archiv" canonicalpath="/" />

      <Wrapper>
        <Grid folgen={folgen} showCoverOnly={false} isFiltered showUi />

        {!session && (
          <div className="mt-32 text-center">
            <Link href={'/signin'} passHref legacyBehavior>
              <Button as="a" color={colors.red}>
                Jetzt Bewerten!
              </Button>
            </Link>
          </div>
        )}
      </Wrapper>
    </>
  );
};

export const getStaticProps = async () => {
  await dbConnect();

  const folgen = parseMongo(
    await getFolgen({
      fields: [
        'name',
        'number',
        'type',
        'images',
        'rating',
        'number_of_ratings',
        'popularity',
        'release_date',
      ],
    }),
  );

  return {
    props: { folgen },
    revalidate: 60,
  };
};

export default HomePage;
