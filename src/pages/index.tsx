import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import styled from 'styled-components';

import Grid from '@/components/Grid';
import Button from '@/components/shared/Button';
import { colors } from '@/constants/theme';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { FolgeType } from '@/types';
import { parseMongo } from '@/utils/index';

import { getFolgen } from '../services';

function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session } = useSession();

  return (
    <Wrapper>
      <Grid folgen={props.folgen} coverOnly={false} />

      {!session && (
        <HomeFooter>
          <Link href={'/signin'}>
            <Button as="a" color={colors.red}>
              Jetzt Bewerten!
            </Button>
          </Link>
        </HomeFooter>
      )}
    </Wrapper>
  );
}

const HomeFooter = styled.footer`
  text-align: center;
  margin-top: 124px;
`;

export const getStaticProps = async () => {
  await dbConnect();

  const folgen: FolgeType[] = parseMongo(
    await getFolgen({
      fields: [
        'name',
        'number',
        'type',
        'images',
        'release_date',
        'rating',
        'popularity',
      ],
    }),
  );

  const size = Buffer.byteLength(JSON.stringify(folgen));
  console.log('Size', (size / 1024).toFixed(0), 'kB');

  return {
    props: { folgen },
    revalidate: 60,
  };
};

export default Home;
