import { Container, Cover, Content, Buttons, Background } from './StyledFolge';
import { calcFolgenRating } from '../../utils';
import Rating from '../Rating';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';

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
        <img src={images[0].url} alt="Folgen Cover" />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <div style={{ fontSize: '20px', marginTop: '6px', color: '#ddd' }}>
          Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}
        </div>
        <Rating folge_id={_id} defaultRating={rating} />
        <Buttons>
          <a
            className="button"
            // target="_blank"
            rel="noopener noreferrer"
            href={`spotify:album:${spotify_id}`}
          >
            Auf Spotify Anhören
          </a>
        </Buttons>
      </Content>

      <Background url={images[0].url} bigCover={isBigCover} />
    </Container>
  );
};

Folge.propTypes = {
  folge: PropTypes.shape({
    name: PropTypes.string,
    images: PropTypes.arrayOf(PropTypes.object),
    release_date: PropTypes.string,
    url: PropTypes.string,
    _id: PropTypes.string,
    ratings: PropTypes.arrayOf(PropTypes.object),
    number: PropTypes.string,
    spotify_id: PropTypes.string,
  }),
};

export default Folge;
