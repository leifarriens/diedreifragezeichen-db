import dbConnect from '../db';
import Grid from '../components/Grid';
import { getAllFolgen } from '../services';
import { parseMongo } from '../utils';

function Home(props) {
  return <Grid folgen={props.folgen} />;
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
