import Link from 'next/link';
import { useSession } from 'next-auth/client';
import styled from 'styled-components';

import Grid from '../components/Grid';
import GridFolge from '../components/Grid/GridFolge';
import { FolgenContainer, GridContainer } from '../components/Grid/StyledGrid';
import Header from '../components/Header';
import dbConnect from '../db';
import { getAllFolgen } from '../services';
import { parseMongo, splitArrayByProp } from '../utils';

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

      {/* <ChronikView folgen={props.folgen} /> */}
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

const ChronikView = ({ folgen }) => {
  const folgenSplitByReleaseDate = splitArrayByProp(
    folgen,
    'release_date',
    (val) => new Date(val).getFullYear()
  );

  return (
    <div>
      {Object.keys(folgenSplitByReleaseDate).map((key) => (
        <GridContainer key={key}>
          <h3 style={{ marginTop: '4rem' }}>{key}</h3>
          <FolgenContainer>
            {folgenSplitByReleaseDate[key].map((entry, index) => (
              <GridFolge key={index} folge={entry} coverOnly={true} />
            ))}
          </FolgenContainer>
        </GridContainer>
      ))}
    </div>
  );
};

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
