import dbConnect from '../db';
import Grid from '../components/Grid';
import { getAllFolgen } from '../services';
import { parseMongo } from '../utils';
import Link from 'next/link';
import styled from 'styled-components';
import { useSession } from 'next-auth/client';
import Header from '../components/Header';

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
