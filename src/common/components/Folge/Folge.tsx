import Image from 'next/image';
import { FaDeezer, FaSpotify } from 'react-icons/fa';

import { DATE_FORMAT } from '@/constants/formats';
import dayjs from '@/lib/dayjs';
import { FolgeWithId } from '@/models/folge';

import CommunityRating from '../CommunityRating';
import ListButton from '../ListButton';
import Rating from '../Rating';
import Button from '../shared/Button';
import { Background, RatingContainer } from './StyledFolge';

const Folge = ({ folge }: { folge: FolgeWithId }) => {
  const {
    images,
    name,
    release_date,
    _id,
    number_of_ratings,
    rating,
    number,
    spotify_id,
    deezer_id,
  } = folge;
  const isBigCover = Number(number) >= 125;

  return (
    <>
      <div className="p-8 mb-24 md:grid md:grid-cols-2 md:gap-10 lg:gap-x-16">
        <div className="block h-auto w-full">
          <Image
            className="h-auto w-full object-cover shadow-2xl"
            src={images[0].url}
            alt={`${name} Cover`}
            width={512}
            height={512}
            placeholder="blur"
            blurDataURL={images[2].url}
            priority
          />
        </div>

        <div>
          <h2 className="text-2xl">Die drei ???</h2>
          <h1 className="mb-0 leading-tight">{name}</h1>
          <div className="text-lg mt-2 text-neutral-200">
            <div>
              Veröffentlicht am {dayjs(release_date).format(DATE_FORMAT)}
            </div>
            <div>{dayjs(release_date).fromNow()}</div>
          </div>

          <RatingContainer>
            <CommunityRating
              numerOfRatings={number_of_ratings}
              rating={rating}
            />
          </RatingContainer>

          <Rating folge_id={_id} folge_name={name} />

          <div className="mt-6 flex items-center gap-4">
            <Button
              as="a"
              rel="noopener noreferrer"
              href={`spotify:album:${spotify_id}`}
              size="small"
            >
              <FaSpotify size="1.4em" /> Auf Spotify anhören
            </Button>

            {deezer_id && (
              <Button
                as="a"
                rel="noopener noreferrer"
                href={`deezer://album/${deezer_id}`}
                size="small"
              >
                <FaDeezer size="1.4em" /> Auf Deezer anhören
              </Button>
            )}

            <ListButton folgeId={_id} folgeName={name} iconSize={28} />
          </div>
        </div>

        <Background
          style={{ backgroundImage: `url(${images[0].url})` }}
          bigCover={isBigCover}
        />
      </div>

      {folge.inhalt && (
        <div className="text-lg text-neutral-200 rounded-lg mb-16 p-8 bg-neutral-900 bg-opacity-40">
          <h3 className="text-2xl font-medium mb-4">Zusammenfassung</h3>
          <p className="text-justify">{folge.inhalt}</p>
        </div>
      )}
    </>
  );
};

export default Folge;
