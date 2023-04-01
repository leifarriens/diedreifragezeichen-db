import type { AnyBulkWriteOperation } from 'mongodb';
import { ObjectId } from 'mongodb';

import { Folge as FolgeModel } from '@/models/folge';
import { convertFolge } from '@/utils/convertFolge';

import ignorelist from '../../config/ignorelist.json';
import { getAllInhalte } from './inhalt.service';
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

/**
 * The `syncInhalte` service updates all folgen without a `inhalt`
 * with the found `body` from the `getAllInhalte` service.
 */
export async function syncInhalte() {
  const inhalte = await getAllInhalte();

  const folgen = await FolgeModel.find({});

  const writes = folgen
    .filter((folge) => !folge.inhalt)
    .reduce<AnyBulkWriteOperation[]>((curr, folge) => {
      const inhtaltExp = folge.name
        .replace('und', '')
        .replace('???', '')
        .trim();
      const inhalt = inhalte.find(({ name }) =>
        new RegExp(inhtaltExp, 'i').test(name),
      );

      if (inhalt) {
        curr.push({
          updateOne: {
            filter: { _id: new ObjectId(folge._id) },
            update: { inhalt: inhalt.body },
          },
        });
      }

      return curr;
    }, []);

  const result = await FolgeModel.bulkWrite(writes);

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