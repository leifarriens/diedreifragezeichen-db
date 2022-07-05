import Folge from '@/models/folge';
import { SpotifyFolge } from '@/types';
import convertFolge from '@/utils/convertFolge';

import blacklist from '../../jobs/blacklist.json';
import { getAllAlbums, getBearerToken } from './spotify';

export default async function syncFolgen() {
  try {
    const bearerToken = await getBearerToken();
    const allAlbums = await getAllAlbums(bearerToken);
    const dbFolgen = await Folge.find({});

    const stats: {
      inDb: any[];
      notInDb: any[];
      successfullyAdded: any[];
      blacklisted: any[];
    } = {
      inDb: [],
      notInDb: [],
      successfullyAdded: [],
      blacklisted: [],
    };

    const addToDb: SpotifyFolge[] = [];

    allAlbums.forEach((folge: SpotifyFolge) => {
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

    const added = await Folge.insertMany(addToDb);
    stats.successfullyAdded = added.map((f) => f.name);

    return {
      inDb: {
        amount: stats.inDb.length,
        names: stats.inDb.map((entry) => entry.name),
      },
      notInDb: {
        amount: stats.notInDb.length,
        names: stats.notInDb.map((entry) => entry.name),
      },
      added: {
        amount: stats.successfullyAdded.length,
        names: stats.successfullyAdded,
      },
      blacklist: {
        amount: stats.blacklisted.length,
        names: stats.blacklisted.map((entry) => entry.name),
      },
    };
  } catch (error) {
    throw new Error(error);
  }
}
