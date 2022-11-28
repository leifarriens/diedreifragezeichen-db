/* eslint-disable react/prop-types */ /* props from -> InferGetStaticPropsType */
import { InferGetStaticPropsType, NextPage } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';

import { Seo } from '@/components/Seo';
import Button from '@/components/shared/Button';
import { colors } from '@/constants/theme';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { Grid } from '@/modules/Grid';
import { parseMongo } from '@/utils/index';

import { getFolgen } from '../services/folge.service';

const HomePage: NextPage<InferGetStaticPropsType<typeof getStaticProps>> = (
  props,
) => {
  const { data: session } = useSession();

  return (
    <>
      <Seo title="Archiv" canonicalpath="/" />

      <Wrapper>
        <Grid folgen={props.folgen} coverOnly={false} withFilters withUi />

        {!session && (
          <HomeFooter>
            <Link href={'/signin'} passHref legacyBehavior>
              <Button as="a" color={colors.red}>
                Jetzt Bewerten!
              </Button>
            </Link>
          </HomeFooter>
        )}
      </Wrapper>
    </>
  );
};

const HomeFooter = styled.footer`
  text-align: center;
  margin-top: 124px;
`;

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
