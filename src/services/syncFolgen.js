import blacklist from '../../jobs/blacklist.json';
import Folge from '../models/folge';
import convertFolge from '../utils/convertFolge';
import { getAllAlbums, getBearerToken } from './spotify';

export default async function syncFolgen() {
  try {
    const bearerToken = await getBearerToken();
    const allAlbums = await getAllAlbums(bearerToken);
    const dbFolgen = await Folge.find({});

    const stats = {
      inDb: [],
      notInDb: [],
      successfullyAdded: [],
      blacklisted: [],
    };

    let addToDb = [];

    allAlbums.forEach((folge) => {
      const isInDb = dbFolgen.find(
        (album) => album.spotify_id === folge.id || album.name === folge.name
      );
      if (isInDb) {
        stats.inDb.push(folge);
        // folge is in DB
      } else {
        // folge is not in db
        if (blacklist.includes(folge.id)) {
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
        names: stats.successfullyAdded.map((entry) => entry.name),
      },
      blacklist: {
        amount: stats.blacklisted.length,
        names: stats.blacklisted.map((entry) => entry.name),
      },
    };
  } catch (error) {
    console.log(error);
    throw new Error(error);
  }
}
