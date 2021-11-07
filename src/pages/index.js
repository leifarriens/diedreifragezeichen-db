import Link from 'next/link';
import { useSession } from 'next-auth/client';
import styled from 'styled-components';

import Grid from '../components/Grid';
import Header from '../components/Header';
import dbConnect from '../db';
import { getAllFolgenWithRating } from '../services';
import { applyFolgenRating, parseMongo } from '../utils';

function Home({ folgen }) {
  const [session] = useSession();

  return (
    <>
      <Header />
      <div className="wrapper stretch">
        <Grid folgen={folgen} />
      </div>

      {!session && (
        <HomeFooter className="wrapper">
          <Link href={'/signin'}>
            <a className="button red">Jetzt Bewerten!</a>
          </Link>
        </HomeFooter>
      )}
    </>
  );
}

const HomeFooter = styled.footer`
  text-align: center;
  margin-top: 124px;
`;

export async function getStaticProps() {
  await dbConnect();

  const data = await getAllFolgenWithRating();

  const folgen = parseMongo(data);

  folgen.map(applyFolgenRating);

  return {
    props: { folgen },
    revalidate: 1,
  };
}

export default Home;
