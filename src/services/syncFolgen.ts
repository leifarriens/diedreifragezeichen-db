import type { FolgeWithId } from '@/models/folge';
import { Folge as FolgeModel } from '@/models/folge';
import { SpotifyAlbum } from '@/types';
import convertFolge from '@/utils/convertFolge';

import blacklist from '../../config/blacklist.json';
import * as DeezerApi from './deezer';
import { getAllInhalte } from './inhalt.services';
import * as SpotifyApi from './spotify';

type SyncStats = {
  inDb: SpotifyAlbum[];
  notInDb: SpotifyAlbum[];
  successfullyAdded: string[];
  blacklisted: SpotifyAlbum[];
};

export default async function syncFolgen() {
  const stats: SyncStats = {
    inDb: [],
    notInDb: [],
    successfullyAdded: [],
    blacklisted: [],
  };

  try {
    const allAlbums = await SpotifyApi.getAllAlbums();
    const dbFolgen = await FolgeModel.find({});

    if (!allAlbums) {
      throw Error('Invalid item response from spotify');
    }

    const notInDbAlbums = allAlbums.filter((album) => {
      const isInDb = dbFolgen.find((folge) => folge.spotify_id === album.id);

      if (isInDb) {
        stats.inDb.push(album);
        return false;
      }

      if (
        blacklist.includes(album.id) ||
        album.name.match(/liest|Kopfhörer/g)
      ) {
        stats.blacklisted.push(album);
        return false;
      }

      stats.notInDb.push(album);
      return true;
    });

    const addToDb = notInDbAlbums.map((album) => convertFolge(album));

    const added = await FolgeModel.insertMany(addToDb);
    stats.successfullyAdded = added.map((f) => f.name);

    // DISCUSS:
    /**
     * 1. Should be obsolete cause blacklisted folgen are never added to DB
     * 2. Enables possibility to add folgen to blacklist and remove them in next sync
     * 3. Is a bad pattern cause ratings persits even when folge is deleted
     */
    await FolgeModel.deleteMany({ spotify_id: { $in: blacklist } });

    if (added.length > 0) {
      await writeExtraMetaData(added);
    }

    return {
      notInDb: {
        amount: stats.notInDb.length,
        names: stats.notInDb.map((entry) => entry.name),
      },
      added: {
        amount: stats.successfullyAdded.length,
        names: stats.successfullyAdded,
      },
      inDb: {
        amount: stats.inDb.length,
        names: stats.inDb.map((entry) => entry.name),
      },
      blacklist: {
        amount: stats.blacklisted.length,
        names: stats.blacklisted.map((entry) => entry.name),
      },
    };
  } catch (error) {
    console.log(error);
    throw Error('Folgen sync error');
  }
}

async function writeExtraMetaData(folgen: FolgeWithId[]) {
  const inhalte = await getAllInhalte();
  const deezerAlbums = await DeezerApi.getAllAlbums();

  const writes = folgen.map((folge) => {
    // Inhalt
    const inhtaltExp = folge.name.replace('und', '').replace('???', '').trim();
    const entry = inhalte.find(({ name }) =>
      new RegExp(inhtaltExp, 'i').test(name),
    );

    // DeezerId
    const deezerAlbum = deezerAlbums.find((album) =>
      album.title
        .replaceAll(' ', '')
        .match(new RegExp(folge.name.replaceAll(' ', ''), 'i')),
    );

    return {
      updateOne: {
        filter: { _id: folge._id },
        update: {
          ...(entry && { inhalt: entry.body }),
          ...(deezerAlbum && { deezer_id: deezerAlbum.id }),
        },
      },
    };
  });

  return FolgeModel.bulkWrite(writes);
}
