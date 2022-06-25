import Axios from 'axios';
import { signIn, useSession } from 'next-auth/react';

import dayjs from '@/utils/dayjs';

import type { Image } from '../../types';
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

type FolgeProps = {
  folge: {
    images: Image[];
    name: string;
    release_date: Date;
    _id: string;
    rating: number;
    number: string;
    spotify_id: string;
  };
};

const Folge = ({
  folge: { images, name, release_date, _id, rating, number, spotify_id },
}: FolgeProps) => {
  const { data: session } = useSession();
  const isBigCover = Number(number) >= 125;

  const handleAddToList = async () => {
    if (!session) return signIn();
    console.log(session);
    try {
      const { data } = await Axios({
        method: 'POST',
        url: `/api/user/list`,
        data: { folgeId: _id },
      });
      console.log(data);
    } catch (error) {
      if (Axios.isAxiosError(error) && error.response) {
        console.log(error.response?.data);
      }
    }

    return;
  };

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
          <br />
          {dayjs(release_date).fromNow()}
        </ReleaseContainer>

        <RatingContainer>{rating ? rating : ' ??? '}/10</RatingContainer>

        <Rating folge_id={_id} folge_name={name} />

        <Buttons>
          <button className="button" onClick={handleAddToList}>
            Auf die Merkliste
          </button>
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

export default Folge;
