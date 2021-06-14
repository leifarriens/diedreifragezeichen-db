import { useEffect, useState } from 'react';
import { Container, Cover, Content, Buttons, Background } from './StyledFolge';
import useSWR from 'swr';
import { calcFolgenRating } from '../../utils';
import Rating from '../Rating';
import dayjs from 'dayjs';
import PropTypes from 'prop-types';
import RatingDisplay from '../RatingDisplay';

const fetcher = (...args) => fetch(...args).then((res) => res.json());

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

  const [userRating, setUserRating] = useState(null);

  const rating = calcFolgenRating(ratings);

  // TODO: unset userRating on _id change
  const { data, error } = useSWR(`/api/folgen/${_id}/rating`, fetcher, {
    errorRetryCount: 1,
  });

  useEffect(() => {
    if (data) {
      setUserRating(data.value);
    }
    if (error) setUserRating(null);
  }, [data, error]);

  const isBigCover = Number(number) >= 125 ? true : false;

  const _handleUserRated = (rating) => {
    setUserRating(rating)
  };

  return (
    <Container className="wrapper">
      <Cover>
        <img src={images[0].url} alt={`${name} Cover`} />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <div style={{ fontSize: '1.2rem', marginTop: '6px', color: '#ddd' }}>
          <p>Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}</p>
        </div>

        <div
          style={{
            fontSize: '2.4rem',
            marginTop: '16px',
            marginBottom: '12px',
          }}
        >
          <span style={{ fontFamily: 'Cambria' }}>
            <RatingDisplay ratings={ratings}/>
          </span>
        </div>
        {userRating && (
          <Rating
            folge_id={_id}
            rating={rating}
            userRating={userRating}
            onRated={_handleUserRated}
          />
        )}

        {(error && !userRating) && (
          <Rating
            folge_id={_id}
            rating={rating}
            userRating={0}
            onRated={_handleUserRated}
          />
        )}

        <Buttons>
          <a
            className="button"
            rel="noopener noreferrer"
            href={`spotify:album:${spotify_id}`}
          >
            Auf Spotify Anhören
          </a>
          {/* <a href="" className="button blue">Review</a> */}
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
