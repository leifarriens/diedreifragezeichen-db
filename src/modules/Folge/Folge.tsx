import Image from 'next/image';
import { FaClone, FaDeezer, FaSpotify } from 'react-icons/fa';

import { ListButton } from '@/components/ListButton';
import { Button } from '@/components/shared';
import { DATE_FORMAT } from '@/constants/formats';
import { Background } from '@/layout';
import dayjs from '@/lib/dayjs';
import type { FolgeWithId } from '@/models/folge';

import { CommunityRating, UserRating } from './Rating';

export function Folge({ folge }: { folge: FolgeWithId }) {
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
    weblink,
    inhalt,
    sprecher,
  } = folge;
  const isBigCover = Number(number) >= 125;

  return (
    <>
      <div className="mb-24 p-8 md:grid md:grid-cols-2 md:gap-10 lg:gap-x-16">
        <Image
          className="mb-4 w-full object-cover shadow-2xl"
          src={images[0].url}
          alt={`${name} Cover`}
          width={512}
          height={512}
          placeholder="blur"
          blurDataURL={images[2].url}
          priority
        />

        <div>
          <h2 className="mb-2 font-serif text-2xl font-thin lg:text-3xl">
            Die drei ???
          </h2>
          <h1 className="font-serif text-4xl font-semibold lg:text-5xl">
            {name}
          </h1>
          <div className="mt-2 text-lg text-neutral-300">
            <div>
              Veröffentlicht am {dayjs(release_date).format(DATE_FORMAT)}
            </div>
            <div>{dayjs(release_date).fromNow()}</div>
          </div>

          <CommunityRating
            className="my-4 font-serif text-3xl"
            numerOfRatings={number_of_ratings}
            rating={rating}
          />

          <UserRating folge_id={_id} folge_name={name} />

          <div className="mt-6 space-y-4">
            <div className="flex items-center gap-4">
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

            <div className="flex items-start gap-4">
              {weblink && (
                <Button
                  as="a"
                  rel="noopener noreferrer"
                  target="_blank"
                  href={weblink}
                  size="small"
                >
                  <FaClone size="1.4em" /> dreifragezeichen.de
                </Button>
              )}
            </div>
          </div>
        </div>

        <Background
          style={{ backgroundImage: `url(${images[0].url})` }}
          bigCover={isBigCover}
        />
      </div>

      {inhalt && (
        <div className="mb-16 rounded-lg bg-black bg-opacity-30 p-8 text-lg text-neutral-200">
          <h3 className="mb-4 text-2xl font-medium">Zusammenfassung</h3>
          <p className="text-justify">{inhalt}</p>
        </div>
      )}

      {sprecher && (
        <div className="mb-16 rounded-lg bg-black bg-opacity-30 p-8 text-lg text-neutral-200">
          <h3 className="mb-4 text-2xl font-medium">Sprecher</h3>
          <p className="whitespace-pre-wrap text-justify">{sprecher}</p>
        </div>
      )}
    </>
  );
}
