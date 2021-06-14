import dbConnect from '../db';
import Folge from '../models/folge';
import { getBearerToken, getAllAlbums } from '../jobs/spotifyAPI';
import chalk from 'chalk';

export default async function () {
  await dbConnect();

  const bearerToken = await getBearerToken();
  const allAlbums = await getAllAlbums(bearerToken);
  const dbFolgen = await Folge.find({});

  const stats = {
    inDb: [],
    notInDb: [],
    successfullyAdded: [],
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
      addToDb.push(formatFolge(folge));
      stats.notInDb.push(folge);
    }
  });

  try {
    const added = await Folge.insertMany(addToDb);
    stats.successfullyAdded = added.map((f) => f.name);
  } catch (error) {
    console.log(error);
  }

  printResults(stats);
}

function printResults(stats) {
  console.log(`${chalk.blue(stats.inDb.length)} Folgen are already in DB...`);
  console.log(`${chalk.yellow(stats.notInDb.length)} Folgen are not in DB...`);
  console.log(
    `${chalk.green(
      stats.successfullyAdded.length
    )} Folgen have been added DB...`
  );
  console.log(`Added: ${stats.successfullyAdded.join(', ')}`);
}

function formatFolge({ name, images, id, release_date }) {
  const folge = new Folge({
    images,
    release_date,
    spotify_id: id,
  });

  if (name.includes('/')) {
    folge.type = 'regular';
    folge.number = name.split('/')[0];
    folge.name = name.split('/')[1];
  } else {
    folge.type = 'special';
    folge.number = '';
    folge.name = name;
  }

  return folge;
}
