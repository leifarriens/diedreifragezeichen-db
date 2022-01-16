import dayjs from 'dayjs';
import PropTypes from 'prop-types';

import Rating from '../Rating';
import {
  Background,
  Buttons,
  Container,
  Content,
  Cover,
  RatingContainer,
  ReleaseContainer,
} from './StyledFolge';

const Folge = ({
  folge: {
    images,
    name,
    numberOfRatings,
    release_date,
    _id,
    rating,
    number,
    spotify_id,
  },
}) => {
  const isBigCover = Number(number) >= 125;

  return (
    <Container className="wrapper">
      <Cover>
        <img src={images[0].url} alt={`${name} Cover`} />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <ReleaseContainer>
          Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}
        </ReleaseContainer>

        <RatingContainer>{rating ? rating : ' ??? '}/10</RatingContainer>

        <Rating folge_id={_id} folge_name={name} />

        <Buttons>
          <a
            className="button"
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
