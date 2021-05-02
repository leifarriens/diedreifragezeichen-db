import dbConnect from '../db';
import Grid from '../components/Grid';
import { getFolgen } from '../services';
import { parseMongo } from '../utils';
// import Header from '../components'

function Home(props) {
  return (
    <>
      <Grid folgen={props.folgen} />
    </>
  );
}

export async function getStaticProps(context) {
  await dbConnect();

  const data = await getFolgen();

  const folgen = parseMongo(data);

  return {
    props: { folgen },
    revalidate: 1,
  };
}

export default Home;
