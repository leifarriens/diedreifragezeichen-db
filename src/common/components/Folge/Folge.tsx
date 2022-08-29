import Image from 'next/future/image';

import dayjs from '@/lib/dayjs';
import type { Image as ImageType } from '@/types';

import Rating from '../Rating';
import Button from '../shared/Button';
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
  images: ImageType[];
  name: string;
  release_date: Date;
  _id: string;
  rating: number;
  number: string;
  spotify_id: string;
};

const Folge = ({
  images,
  name,
  release_date,
  _id,
  rating,
  number,
  spotify_id,
}: FolgeProps) => {
  const isBigCover = Number(number) >= 125;

  return (
    <Container>
      <Cover>
        <Image
          src={images[0].url}
          alt={`${name} Cover`}
          width={512}
          height={512}
          placeholder="blur"
          blurDataURL={images[2].url}
          priority
        />
      </Cover>
      <Content>
        <h2>Die drei ???</h2>
        <h1>{name}</h1>
        <ReleaseContainer>
          Veröffentlicht am {dayjs(release_date).format('DD.MM.YYYY')}
          <br />
          {dayjs(release_date).fromNow()}
        </ReleaseContainer>

        <RatingContainer>{rating ? rating : '???'}/10</RatingContainer>

        <Rating folge_id={_id} folge_name={name} />

        <Buttons>
          <Button
            as="a"
            rel="noopener noreferrer"
            href={`spotify:album:${spotify_id}`}
          >
            Auf Spotify Anhören
          </Button>
        </Buttons>
      </Content>

      <Background url={images[0].url} bigCover={isBigCover} />
    </Container>
  );
};

export default Folge;
