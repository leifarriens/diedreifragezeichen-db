import Link from 'next/link';
import { useSession } from 'next-auth/client';
import styled from 'styled-components';

import Grid from '../components/Grid';
import Header from '../components/Header';
import dbConnect from '../db';
import { getAllFolgenWithRating } from '../services';
import { parseMongo } from '../utils';

function Home({ folgen }) {
  const [session] = useSession();

  return (
    <>
      <Header />
      <Grid folgen={folgen} />

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

  // TODO: rating should be calculated on server side and array of rating should be removed
  // folgen.map((entry) => {
  //   entry['rating_value'] = calcFolgenRating(entry.ratings);
  //   delete entry.ratings;
  // });

  return {
    props: { folgen },
    revalidate: 1,
  };
}

export default Home;
