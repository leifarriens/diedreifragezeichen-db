import type { Folge, FolgeWithId } from '@/models/folge';
import { Folge as FolgeModel } from '@/models/folge';
import { SpotifyFolge } from '@/types';
import convertFolge from '@/utils/convertFolge';

import blacklist from '../../config/blacklist.json';
import * as DeezerApi from './deezer';
import { getAllInhalte } from './inhalt.services';
import { getAllAlbums, getBearerToken } from './spotify';

export default async function syncFolgen() {
  try {
    const bearerToken = await getBearerToken();
    const allAlbums = await getAllAlbums(bearerToken);
    const dbFolgen = await FolgeModel.find({});

    if (!allAlbums) {
      throw Error('Invalid item response from spotify');
    }

    const stats: {
      inDb: SpotifyFolge[];
      notInDb: SpotifyFolge[];
      successfullyAdded: string[];
      blacklisted: SpotifyFolge[];
    } = {
      inDb: [],
      notInDb: [],
      successfullyAdded: [],
      blacklisted: [],
    };

    const addToDb: Folge[] = [];

    allAlbums.forEach((folge) => {
      const isInDb = dbFolgen.find(
        (album) => album.spotify_id === folge.id || album.name === folge.name,
      );
      if (isInDb) {
        stats.inDb.push(folge);
      } else {
        if (
          blacklist.includes(folge.id) ||
          folge.name.match(/liest|Kopfhörer/g)
        ) {
          stats.blacklisted.push(folge);
        } else {
          addToDb.push(convertFolge(folge));
          stats.notInDb.push(folge);
        }
      }
    });

    const added = await FolgeModel.insertMany(addToDb);
    stats.successfullyAdded = added.map((f) => f.name);

    await FolgeModel.deleteMany({ spotify_id: { $in: blacklist } });

    await writeExtraMetaData(added);

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

  for (let i = 0; i < folgen.length; i++) {
    const folge = folgen[i];

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

    await FolgeModel.updateOne(
      { _id: folge._id },
      {
        $set: {
          ...(entry && { inhalt: entry.body }),
          ...(deezerAlbum && { deezer_id: deezerAlbum.id }),
        },
      },
    );
  }
}
