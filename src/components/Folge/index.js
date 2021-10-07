import Axios from 'axios';
import dayjs from 'dayjs';
import { useSession } from 'next-auth/client';
import PropTypes from 'prop-types';
import { useEffect, useState } from 'react';

import Rating from '../Rating';
import RatingDisplay from '../RatingDisplay';
import { Background, Buttons, Container, Content, Cover } from './StyledFolge';

const Folge = ({
  folge: { images, name, release_date, _id, ratings, number, spotify_id },
}) => {
  const [session] = useSession();

  const [userRating, setUserRating] = useState(0);

  // FIXME: Is this save to reset userRating display on route change?
  useEffect(() => {
    setUserRating(0);

    if (session) {
      fetchUserRating();
    }
  }, [_id]);

  const fetchUserRating = async () => {
    try {
      const {
        data: { value },
      } = await Axios(`/api/folgen/${_id}/rating`);
      setUserRating(value);
    } catch (error) {
      setUserRating(0);
    }
  };

  const isBigCover = Number(number) >= 125 ? true : false;

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
            <RatingDisplay ratings={ratings} />
          </span>
        </div>

        <Rating folge_id={_id} userRating={userRating} folge_name={name} />

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
