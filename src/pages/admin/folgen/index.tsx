import { GetServerSidePropsContext } from 'next';
import { useMemo } from 'react';
import { FaDeezer, FaSpotify } from 'react-icons/fa';

import Button from '@/components/shared/Button';
import { DATE_FORMAT } from '@/constants/formats';
import dbConnect from '@/db/connect';
import dayjs from '@/lib/dayjs';
import { getServerSession } from '@/lib/getServerSession';
import type { FolgeWithId } from '@/models/folge';
import { useGridState } from '@/modules/Grid';
import { applyFilter } from '@/modules/Grid/utils/filter';
import { getFolgen } from '@/services/folge.service';
import { parseMongo } from '@/utils/index';

export default function AdminFolgen({ folgen }: { folgen: FolgeWithId[] }) {
  const { searchQuery } = useGridState();

  const filteredFolgen = useMemo(
    () => applyFilter(folgen, { searchQuery }),
    [folgen, searchQuery],
  );

  const propCheck = (value: unknown) => (value ? '🟢' : '🔴');

  return (
    <div className="mx-auto w-full max-w-7xl px-8">
      {filteredFolgen.map((folge) => (
        <article
          key={folge._id}
          className="relative mb-8 grid grid-cols-[180px_1fr] gap-4"
        >
          <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
            <div
              className="absolute inset-0 -z-10 bg-none bg-cover bg-no-repeat blur-3xl brightness-50"
              style={{ backgroundImage: `url(${folge.images[2].url})` }}
            />
          </div>

          <div>
            <div className="-translate-x-4 -translate-y-4">
              <img src={folge.images[1].url} alt={folge.name} />
            </div>
            <div className="p-4 pt-0 text-sm">
              <div>Rating: {folge.rating}</div>
              <div>Number of Ratings: {folge.number_of_ratings}</div>
              <div>Popularity: {folge.popularity}</div>
            </div>
          </div>

          <div className="flex flex-col py-4 pr-4">
            <h3 className="mb-2 text-2xl font-semibold">
              {folge.number && `${folge.number}: `}
              {folge.name}
            </h3>

            <div className="flex-1 text-sm">
              <div>
                Release Date: {dayjs(folge.release_date).format(DATE_FORMAT)}
              </div>
              <div>
                Updated At: {dayjs(folge.updated_at).format(DATE_FORMAT)}
              </div>
            </div>

            {folge.inhalt && (
              <div className="mt-4">
                <h4 className="mb-1 text-xl font-semibold">Inhalt</h4>
                <p className="text-sm text-neutral-300">{folge.inhalt}</p>
              </div>
            )}

            <div className="mt-4">
              <table className="border-collapse">
                <thead>
                  <tr>
                    <th className="border-b-2 border-r-2 border-slate-600 px-2">
                      SpotifyId
                    </th>
                    <th className="border-b-2 border-r-2 border-slate-600 px-2">
                      DeezerId
                    </th>
                    <th className="border-b-2 border-slate-600 px-2">Inhalt</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="text-center">
                    <td className="border-r-2 border-slate-600">
                      {propCheck(folge.spotify_id)}
                    </td>
                    <td className="border-r-2 border-slate-600">
                      {propCheck(folge.deezer_id)}
                    </td>
                    <td>{propCheck(folge.inhalt)}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div className="mt-4">
              <h4 className="mb-1 text-xl font-semibold">Actions</h4>
              <div className="flex gap-2 text-sm">
                <Button
                  as="a"
                  href={`/folge/${folge._id}`}
                  target="_blank"
                  size="small"
                >
                  Öffnen
                </Button>

                <Button as="a" href={`/admin/folgen/${folge._id}`} size="small">
                  Bearbeiten
                </Button>

                <Button
                  as="a"
                  rel="noopener noreferrer"
                  href={`spotify:album:${folge.spotify_id}`}
                  size="small"
                >
                  <FaSpotify size="1.4em" /> Auf Spotify anhören
                </Button>

                {folge.deezer_id && (
                  <Button
                    as="a"
                    rel="noopener noreferrer"
                    href={`deezer://album/${folge.deezer_id}`}
                    size="small"
                  >
                    <FaDeezer size="1.4em" /> Auf Deezer anhören
                  </Button>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getServerSession(req, res);

  if (!session || session.user.role !== 'Admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  await dbConnect();

  const folgen = parseMongo(await getFolgen());

  return {
    props: { folgen },
  };
};
