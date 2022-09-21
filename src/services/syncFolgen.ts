import Axios from 'axios';
import cheerio from 'cheerio';

import type { Folge } from '@/models/folge';
import { Folge as FolgeModel } from '@/models/folge';
import { SpotifyFolge } from '@/types';
import convertFolge from '@/utils/convertFolge';

import blacklist from '../../config/blacklist.json';
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

    const withInhalt = await Promise.all(addToDb.map(scrapeInhalt));

    const added = await FolgeModel.insertMany(withInhalt);
    stats.successfullyAdded = added.map((f) => f.name);

    await FolgeModel.deleteMany({ spotify_id: { $in: blacklist } });

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
    console.log(error);
    throw Error('Folgen sync error');
  }
}

async function scrapeInhalt(folge: Folge) {
  const normalizedName = folge.name
    .toLowerCase()
    // .replaceAll('und', '')
    .trim()
    .replaceAll(' ', '-')
    .replaceAll('ä', 'a')
    .replaceAll('ü', 'u')
    .replaceAll('ö', 'o')
    .replaceAll('ß', 'ss');

  try {
    const { data } = await Axios(
      `https://dreifragezeichen.de/produktwelt/details/${normalizedName}`,
    );

    const html = cheerio.load(data);
    const inhalt = html('#info-inhalt').find('p').text().trim();
    console.log(normalizedName, 'success');
    folge.inhalt = inhalt;
    return folge;
  } catch (error) {
    console.log(normalizedName, 'unable to scrape');
    // console.log(error);
    // console.log(`Unable to get Inhalt for ${normalizedName}`);
    return folge;
  }
}
