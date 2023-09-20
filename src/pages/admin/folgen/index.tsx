import classNames from 'classnames';
import type { GetServerSidePropsContext, NextPage } from 'next';
import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { FaDeezer, FaRegEyeSlash, FaSpotify, FaSyncAlt } from 'react-icons/fa';
import { InView } from 'react-intersection-observer';

import { Button, Loader, Select, Switch } from '@/components/shared';
import type { AllFolgenSortOptions } from '@/constants/enums';
import { allFolgenSortOptions } from '@/constants/enums';
import { DATE_FORMAT } from '@/constants/formats';
import dayjs from '@/lib/dayjs';
import { getServerAuthSesion } from '@/lib/getServerAuthSesion';
import { useGridState } from '@/modules/Grid';
import { type RouterOutput, trpc } from '@/utils/trpc';

const AdminFolgen: NextPage = () => {
  const { searchQuery, showSpecials, setShowSpecials } = useGridState();
  const [sort, setSort] = useState<AllFolgenSortOptions>();
  const {
    data,
    refetch,
    isInitialLoading,
    isFetchingNextPage,
    fetchNextPage,
    hasNextPage,
  } = trpc.folge.all.useInfiniteQuery(
    { query: searchQuery, specials: showSpecials, sort },
    {
      getNextPageParam: (lastPage) => {
        if (lastPage.offset + lastPage.limit < lastPage.total) {
          return lastPage.offset + lastPage.limit;
        }
        return undefined;
      },
      trpc: { abortOnUnmount: true },
    },
  );

  function handleSortChange(e: React.ChangeEvent<HTMLSelectElement>) {
    if (!e.target.value) return;

    const value = e.target.value as AllFolgenSortOptions;

    setSort(value);
  }

  return (
    <div className="mx-auto w-full max-w-7xl px-8">
      <div className="mb-12 flex items-center justify-between">
        <div className="flex items-center gap-x-4">
          <Select value={sort} onChange={handleSortChange}>
            {allFolgenSortOptions.map((value) => (
              <option key={value} value={value}>
                {value}
              </option>
            ))}
          </Select>
          <Switch
            checked={showSpecials}
            onChange={setShowSpecials}
            label="Specials anzeigen"
          />
        </div>
        <SyncController onSyncSuccess={() => refetch()} />
      </div>

      {isInitialLoading && <Loader />}

      {data?.pages.map((groupe, i) => (
        <React.Fragment key={i}>
          {groupe.items.map((folge) => (
            <AdminFolge key={folge._id} folge={folge} />
          ))}
        </React.Fragment>
      ))}

      {isFetchingNextPage && <Loader />}

      {hasNextPage && (
        <InView onChange={(inView) => inView && fetchNextPage()} />
      )}
    </div>
  );
};

const SyncController = ({ onSyncSuccess }: { onSyncSuccess: () => void }) => {
  const folgenSync = trpc.sync.folgen.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success(`Folgen sync success. Added ${data.length} folgen to db`);
      onSyncSuccess();
    },
  });

  const deezerSync = trpc.sync.deezer.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success(
        `Deezer sync success. Wrote ${data.result.modifiedCount.toString()} updates`,
      );
      onSyncSuccess();
    },
  });

  const weblinkSync = trpc.sync.weblink.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success(
        `Weblink sync success. Wrote ${data.result.modifiedCount.toString()} updates`,
      );
      onSyncSuccess();
    },
  });

  const detailSync = trpc.sync.details.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    onSuccess(data) {
      toast.success(
        `Detail sync success. Wrote ${data.result.modifiedCount.toString()} updates`,
      );
      onSyncSuccess();
    },
  });

  const isSyncing =
    folgenSync.isLoading ||
    deezerSync.isLoading ||
    weblinkSync.isLoading ||
    detailSync.isLoading;

  return (
    <div className="flex gap-2">
      <Button
        size="small"
        onClick={() => folgenSync.mutate()}
        disabled={isSyncing}
      >
        <FaSyncAlt
          className={classNames({ 'animate-spin': folgenSync.isLoading })}
        />
        Sync Folgen
      </Button>
      <Button
        size="small"
        onClick={() => deezerSync.mutate()}
        disabled={isSyncing}
      >
        <FaSyncAlt
          className={classNames({ 'animate-spin': deezerSync.isLoading })}
        />
        Sync Deezer
      </Button>
      <Button
        size="small"
        onClick={() => weblinkSync.mutate()}
        disabled={isSyncing}
      >
        <FaSyncAlt
          className={classNames({ 'animate-spin': weblinkSync.isLoading })}
        />
        Sync Weblinks
      </Button>
      <Button
        size="small"
        onClick={() => detailSync.mutate()}
        disabled={isSyncing}
      >
        <FaSyncAlt
          className={classNames({ 'animate-spin': detailSync.isLoading })}
        />
        Sync Details
      </Button>
    </div>
  );
};

const AdminFolge = ({
  folge,
}: {
  folge: RouterOutput['folge']['all']['items'][number];
}) => {
  const propCheck = (value: unknown) => (value ? '🟢' : '🔴');

  const utils = trpc.useContext();

  const detailsSync = trpc.sync.folgeDetails.useMutation({
    onError(error) {
      toast.error(error.message);
    },
    async onSuccess() {
      toast.success(`Details sync success for ${folge.name}.`);
      await utils.folge.all.invalidate();
    },
  });

  return (
    <article
      key={folge._id}
      className={classNames('relative mb-8 grid grid-cols-[180px_1fr] gap-4', {
        'opacity-50 saturate-0': folge.isHidden,
      })}
    >
      <div className="absolute inset-0 -z-10 overflow-hidden rounded-xl">
        <div
          className="absolute inset-0 -z-10 bg-none bg-cover bg-no-repeat blur-3xl brightness-50"
          style={{ backgroundImage: `url(${folge.images[2].url})` }}
        />
      </div>

      <div>
        <div className="-translate-x-4 -translate-y-4">
          <img src={folge.images[1].url} alt={folge.name} loading="lazy" />
        </div>
        <div className="p-4 pt-0 text-sm text-neutral-200">
          <div>Rating: {folge.rating}</div>
          <div>Number of Ratings: {folge.number_of_ratings}</div>
          <div>Popularity: {folge.popularity}</div>
        </div>
      </div>

      <div className="flex flex-col py-4 pr-4">
        <div className="flex justify-between">
          <h3 className="mb-2 text-2xl font-semibold">
            {folge.number && `${folge.number}: `}
            {folge.name}
          </h3>
          <div className="flex items-center gap-2">
            {folge.isHidden && <FaRegEyeSlash size={24} />}
            {folge.weblink && (
              <Button
                size="small"
                ghost
                onClick={() =>
                  detailsSync.mutate({ folgeId: folge._id.toString() })
                }
                disabled={detailsSync.isLoading}
              >
                <FaSyncAlt
                  className={classNames({
                    'animate-spin': detailsSync.isLoading,
                  })}
                />
                Sync Details
              </Button>
            )}
          </div>
        </div>

        <div className="flex-1 text-sm">
          <div>
            Release Date: {dayjs(folge.release_date).format(DATE_FORMAT)}
          </div>
          <div>Updated At: {dayjs(folge.updated_at).format(DATE_FORMAT)}</div>
        </div>

        {folge.inhalt && (
          <div className="mt-4">
            <h4 className="mb-1 text-xl font-semibold">Inhalt</h4>
            <p className="text-sm text-neutral-300">{folge.inhalt}</p>
          </div>
        )}

        {folge.sprecher && (
          <div className="mt-4">
            <h4 className="mb-1 text-xl font-semibold">Sprecher</h4>
            <p className="text-sm text-neutral-300">{folge.sprecher}</p>
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
                <th className="border-b-2 border-r-2 border-slate-600 px-2">
                  Inhalt
                </th>
                <th className="border-b-2 border-r-2 border-slate-600 px-2">
                  Weblink
                </th>
                <th className="border-b-2 border-slate-600 px-2">Sprecher</th>
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
                <td className="border-r-2 border-slate-600">
                  {propCheck(folge.inhalt)}
                </td>
                <td className="border-r-2 border-slate-600">
                  {propCheck(folge.weblink)}
                </td>
                <td>{propCheck(folge.sprecher)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="mt-4">
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

            {folge.weblink && (
              <Button
                as="a"
                target="_blank"
                rel="noopener noreferrer"
                href={folge.weblink}
                size="small"
              >
                dreifragezeichen.de
              </Button>
            )}
          </div>
        </div>
      </div>
    </article>
  );
};

export const getServerSideProps = async ({
  req,
  res,
}: GetServerSidePropsContext) => {
  const session = await getServerAuthSesion(req, res);

  if (!session || session.user.role !== 'Admin') {
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }

  return {
    props: {},
  };
};

export default AdminFolgen;
