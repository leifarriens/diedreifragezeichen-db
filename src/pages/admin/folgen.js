import dayjs from 'dayjs';
import styled from 'styled-components';

import dbConnect from '../../db';
import { getFolgen } from '../../services';
import { parseMongo } from '../../utils';

const StyledList = styled.div`
  display: grid;
  grid-template-columns: 250px 1fr auto;
  margin-bottom: 24px;
  column-gap: 24px;

  .buttons {
    display: flex;
    flex-direction: column;
    gap: 12px;
  }
`;

function Home(props) {
  return (
    <>
      <div className="wrapper">
        {props.folgen.map(
          ({
            _id,
            name,
            images,
            number,
            release_date,
            type,
            rating,
            popularity,
            spotify_id,
            number_of_ratings,
          }) => {
            return (
              <StyledList key={_id}>
                <img src={images[1].url} />
                <div>
                  <div>{_id}</div>

                  <div>{name}</div>
                  <div>{number}</div>
                  <div>{dayjs(release_date).format('DD.MM.YYYY')}</div>
                  <div>{type}</div>
                  <div>Rating: {rating}</div>
                  <div>Number of Ratings: {number_of_ratings}</div>
                  <div>Popularity: {popularity}</div>
                  <div>Spotify Id: {spotify_id}</div>
                  <div>Spotify Link: {spotify_id}</div>
                </div>
                <div className="buttons">
                  <button className="button">Edit</button>
                  <button className="button red">Delete</button>
                </div>
              </StyledList>
            );
          }
        )}
      </div>
    </>
  );
}

export async function getStaticProps() {
  await dbConnect();

  const folgen = parseMongo(await getFolgen());

  const size = Buffer.byteLength(JSON.stringify(folgen));
  console.log('Size', parseInt(size / 1024), 'kB');

  return {
    props: { folgen },
    revalidate: 10,
  };
}

export default Home;
