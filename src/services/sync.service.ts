import { ObjectId } from 'mongodb';
import type { AnyBulkWriteOperation } from 'mongoose';

import { Folge as FolgeModel } from '@/models/folge';
import type { SpotifyFullAlbum } from '@/types/album';
import { convertFolge } from '@/utils/convertFolge';

import ignorelist from '../../config/ignorelist.json';
import { getAllWeblinks, getFolgenDetails } from './details.service';
import * as DeezerApi from './streaming/deezer';
import * as SpotifyApi from './streaming/spotify';

/**
 * The `syncFolgen` service adds all folgen from the spotify api
 * that are not in the ddfdb.
 */
export async function syncFolgen() {
  const allAlbums = await SpotifyApi.getAllAlbums();
  const dbFolgen = await FolgeModel.find({}).select('spotify_id');

  const notInDbAlbums = allAlbums.filter((album) => {
    const isInDb = dbFolgen.find((folge) => folge.spotify_id === album.id);

    if (
      // eslint-disable-next-line @typescript-eslint/prefer-nullish-coalescing
      isInDb ||
      ignorelist.includes(album.id) ||
      album.name.match(/liest|Kopfhörer/g)
    ) {
      return false;
    }
    return true;
  });

  const addToDb = notInDbAlbums.map((album) => convertFolge(album));

  await FolgeModel.deleteMany({ spotify_id: { $in: ignorelist } });

  const result = await FolgeModel.insertMany(addToDb);

  return result;
}

export async function syncAllFolgenUpcs() {
  const folgen = await FolgeModel.find({}).select('spotify_id upc');

  const folgenWithMissingUpcs = folgen.filter((folge) => !folge.upc);

  console.info(`Found ${folgenWithMissingUpcs.length} folgen without upc`);

  const bearerToken = await SpotifyApi.getBearerToken();

  const fullAlbums: SpotifyFullAlbum[] = [];

  for (const folge of folgenWithMissingUpcs) {
    const fullAlbum = await SpotifyApi.getAlbum(folge.spotify_id, bearerToken);
    fullAlbums.push(fullAlbum);
  }

  const writes = folgenWithMissingUpcs.reduce<AnyBulkWriteOperation[]>(
    (curr, folge) => {
      const fullAlbum = fullAlbums.find(
        (album) => album.id === folge.spotify_id,
      );

      if (fullAlbum?.external_ids?.upc) {
        curr.push({
          updateOne: {
            filter: { _id: new ObjectId(folge._id) },
            update: {
              upc: fullAlbum.external_ids.upc,
            },
          },
        });
      }

      return curr;
    },
    [],
  );

  const result = await FolgeModel.bulkWrite(writes);

  console.info(`Wrote ${writes.length} updates`);

  return { result, writes };
}

/**
 * The `syncDezzer` service updates all folgen without a `deezer_id`
 * with the found `deezerAlbum.id` from the deezer api.
 */
export async function syncDeezer() {
  const deezerAlbums = await DeezerApi.getAllAlbums();

  const folgen = await FolgeModel.find({});

  const writes = folgen
    .filter((folge) => !folge.deezer_id)
    .reduce<AnyBulkWriteOperation[]>((curr, folge) => {
      const deezerAlbum = deezerAlbums.find((album) =>
        album.title
          .replaceAll(' ', '')
          .match(new RegExp(folge.name.replaceAll(' ', ''), 'i')),
      );

      if (deezerAlbum) {
        curr.push({
          updateOne: {
            filter: { _id: new ObjectId(folge._id) },
            update: { deezer_id: deezerAlbum.id },
          },
        });
      }

      return curr;
    }, []);

  const result = await FolgeModel.bulkWrite(writes);

  return { result, writes };
}

/**
 * The `syncWeblinks` service updates all folgen without a `weblink`
 * with the found `link` from the `getAllWeblinks` service.
 */
export async function syncWeblinks() {
  const weblinks = await getAllWeblinks();

  const folgen = await FolgeModel.find({
    weblink: { $exists: true, $ne: '' },
    isHidden: { $ne: true },
  });

  const writes = folgen.reduce<AnyBulkWriteOperation[]>((curr, folge) => {
    const exp = folge.name.replace('und', '').replace('???', '').trim();
    const weblink = weblinks.find(({ title }) =>
      new RegExp(exp, 'i').test(title),
    );

    if (weblink) {
      curr.push({
        updateOne: {
          filter: { _id: new ObjectId(folge._id) },
          update: { weblink: weblink.url },
        },
      });
    }

    return curr;
  }, []);

  const result = await FolgeModel.bulkWrite(writes);

  return { result, writes };
}

/**
 * The `syncFolgenDetails` service updates a folge by id with the found `inhalt` &
 * `sprecher` from the `getFolgenDetails` service.
 */
export async function syncFolgenDetails(folgeId: string) {
  const folge = await FolgeModel.findById(folgeId);

  if (!folge || !folge.weblink) {
    return null;
  }

  const details = await getFolgenDetails(folge.weblink);

  if (!folge.inhalt) {
    folge.inhalt = details.inhalt;
  }

  if (!folge.sprecher) {
    folge.sprecher = details.sprecher;
  }

  await folge.save();

  return folge;
}

/**
 * The `syncDetails` service updates all non-hidden folgen with a `weblink` and
 * without `inhalt` or `sprecher` from the `getFolgenDetails` service.
 */
export async function syncDetails() {
  let folgen = await FolgeModel.find({
    $or: [{ isHidden: false }, { isHidden: { $ne: false } }],
  });

  folgen = folgen.filter(
    (folge) => folge.weblink && (!folge.inhalt || !folge.sprecher),
  );

  const weblinks = folgen
    .map((folge) => folge.weblink)
    .filter((url): url is string => !!url);

  const details = await Promise.all(
    weblinks.map((url) => getFolgenDetails(url)),
  );

  const writes = folgen.reduce<AnyBulkWriteOperation[]>((curr, folge) => {
    const exp = folge.name.replace('und', '').replace('???', '').trim();
    const detail = details.find(({ title }) =>
      new RegExp(exp, 'i').test(title),
    );

    if (detail) {
      curr.push({
        updateOne: {
          filter: { _id: new ObjectId(folge._id) },
          update: {
            ...(!folge.inhalt && { inhalt: detail.inhalt }),
            ...(!folge.sprecher && { sprecher: detail.sprecher }),
          },
        },
      });
    }

    return curr;
  }, []);

  const result = await FolgeModel.bulkWrite(writes);

  return { result, writes, details };
}
