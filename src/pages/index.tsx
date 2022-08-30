import { InferGetStaticPropsType } from 'next';
import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import styled from 'styled-components';

import { Grid } from '@/components/Grid';
import Button from '@/components/shared/Button';
import { colors } from '@/constants/theme';
import { useGlobalState } from '@/context/GlobalContext';
import dbConnect from '@/db/connect';
import Wrapper from '@/layout/Wrapper';
import { FolgeType } from '@/types';
import { parseMongo, setBodyBgByStyle, unsetBodyBgStyle } from '@/utils/index';

import { getFolgen } from '../services';

function Home(props: InferGetStaticPropsType<typeof getStaticProps>) {
  const { data: session } = useSession();
  const { sortBy } = useGlobalState();

  useEffect(() => {
    const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);
    if (!isSafari) setBodyBgByStyle(sortBy);

    return () => {
      unsetBodyBgStyle();
    };
  }, [sortBy]);

  return (
    <Wrapper>
      <Grid folgen={props.folgen} coverOnly={false} withControls={true} />

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
  process.env.NODE_ENV === 'development' &&
    console.log('Size', (size / 1024).toFixed(0), 'kB');

  return {
    props: { folgen },
    revalidate: 60,
  };
};

export default Home;
