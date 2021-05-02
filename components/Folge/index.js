import Link from 'next/link';
import { useRouter } from 'next/router';
import { Container, Cover, Content, Buttons, Background } from './StyledFolge';
import { calcFolgenRating, sortFolgenByDateAsc } from '../../utils';
import Rating from '../Rating';
import dayjs from 'dayjs';

const Folge = ({ folge }) => {
  const {
    images,
    name,
    release_date,
    _id,
    ratings,
    number,
    spotify_id,
  } = folge;

  const rating = calcFolgenRating(ratings);

  const isBigCover = Number(number) >= 125 ? true : false;

  return (
    <Container className="wrapper">
      <Cover>
        <img src={images[0].url} />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1 style={{ fontSize: '46px' }}>{name}</h1>
        <div style={{ fontSize: '20px', marginTop: '6px', color: '#ddd' }}>
          Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}
        </div>
        <Rating folge_id={_id} defaultRating={rating} />
        <Buttons>
          <a
            className="button"
            target="_blank"
            rel="noreferrer"
            href={`spotify:album:${spotify_id}`}
          >
            Auf Spotify Anhören
          </a>
          <button className="button blue">Review</button>
          {/* <AddToList folge={folge}/> */}
        </Buttons>
      </Content>

      <Background url={images[0].url} bigCover={isBigCover} />
    </Container>
  );
};

export default Folge;
