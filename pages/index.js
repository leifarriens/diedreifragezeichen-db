import Link from 'next/link';
import { useSession } from 'next-auth/client';
import styled from 'styled-components';

import Grid from '../components/Grid';
import Header from '../components/Header';
import dbConnect from '../db';
import { getAllFolgen } from '../services';
import { parseMongo } from '../utils';

const HomeFooter = styled.footer`
  text-align: center;
  margin-top: 124px;
`;

function Home(props) {
  const [session] = useSession();

  return (
    <>
      <Header />
      <Grid folgen={props.folgen} />
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

export async function getStaticProps() {
  await dbConnect();

  const data = await getAllFolgen();

  const folgen = parseMongo(data);

  return {
    props: { folgen },
    revalidate: 1,
  };
}

export default Home;
