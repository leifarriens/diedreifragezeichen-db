import Image from 'next/future/image';

import Wrapper from '@/layout/Wrapper';
import dayjs from '@/lib/dayjs';
import { Folge as FolgeType } from '@/models/folge';

import CommunityRating from '../CommunityRating';
import ListButton from '../ListButton';
import Rating from '../Rating';
import Button from '../shared/Button';
import {
  Background,
  Buttons,
  Container,
  Content,
  Cover,
  Inhalt,
  RatingContainer,
  ReleaseContainer,
} from './StyledFolge';

const Folge = ({ folge }: { folge: FolgeType }) => {
  const {
    images,
    name,
    release_date,
    _id,
    number_of_ratings,
    rating,
    number,
    spotify_id,
  } = folge;
  const isBigCover = Number(number) >= 125;

  return (
    <>
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

          <RatingContainer>
            <CommunityRating
              numerOfRatings={number_of_ratings}
              rating={rating}
            />
          </RatingContainer>

          <Rating folge_id={_id} folge_name={name} />

          <Buttons>
            <Button
              as="a"
              rel="noopener noreferrer"
              href={`spotify:album:${spotify_id}`}
            >
              Auf Spotify Anhören
            </Button>

            <ListButton folgeId={_id} folgeName={name} iconSize={28} />
          </Buttons>
        </Content>

        <Background
          style={{ backgroundImage: `url(${images[0].url})` }}
          bigCover={isBigCover}
        />
      </Container>

      {folge.inhalt && (
        <Inhalt>
          <h3>Zusammenfassung</h3>
          <p>{folge.inhalt}</p>
        </Inhalt>
      )}
    </>
  );
};

export default Folge;
