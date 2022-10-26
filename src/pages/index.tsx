import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';

import { Grid } from '@/components/Grid';
import Seo from '@/components/Seo/Seo';
import Button from '@/components/shared/Button';
import { colors } from '@/constants/theme';
import { useGlobalState } from '@/context/GlobalContext';
import dbConnect from '@/db/connect';
import { useBackgroundSortTheme } from '@/hooks';
import Wrapper from '@/layout/Wrapper';
import { parseMongo } from '@/utils/index';

import { getFolgen } from '../services';

function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session } = useSession();
  const { sortBy } = useGlobalState();

  useBackgroundSortTheme(sortBy);

  return (
    <>
      <Seo title="Archiv" />
      <Wrapper>
        <Grid folgen={props.folgen} coverOnly={false} withFilters withUi />

        {!session && (
          <HomeFooter>
            <Link href={'/signin'} passHref>
              <Button as="a" color={colors.red}>
                Jetzt Bewerten!
              </Button>
            </Link>
          </HomeFooter>
        )}
      </Wrapper>
    </>
  );
}

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

export default Home;
