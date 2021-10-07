/**
 * 1. Auth Spotify and get Bearer access token
 * 2. Get all albums from Spotify Artist
 * 3. Get all folgen db entries
 * 4. Loop all Spotify albums and check if they are in db
 */

const mongoose = require('mongoose');
const chalk = require('chalk');
const { getBearerToken, getAllAlbums } = require('./spotifyAPI');
const blacklist = require('./blacklist.json');
const Folge = require('../models/folge');

const dbPath = process.env.MONGO_URI;
mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('open', runJob);

export default async function runJob() {
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
        addToDb.push(formatFolge(folge));
        stats.notInDb.push(folge);
      }
    }
  });

  try {
    const added = await Folge.insertMany(addToDb);
    stats.successfullyAdded = added.map((f) => f.name);
  } catch (error) {
    console.log(error);
  }

  setTimeout(() => {
    db.close(() => {
      console.log('DB Connection closed.');
      printResults(stats);
      return;
    });
  }, 500);
}

function printResults(stats) {
  console.log(`${chalk.blue(stats.inDb.length)} Folgen are already in DB...`);
  console.log(`${chalk.yellow(stats.notInDb.length)} Folgen are not in DB...`);
  console.log(
    `${chalk.green(
      stats.successfullyAdded.length
    )} Folgen have been added DB...`
  );
  console.log(
    `${chalk.blackBright(
      stats.blacklisted.length
    )} Folgen are skipped due to blacklist...`
  );
  console.log(
    `Skipped: ${stats.blacklisted.map((entry) => entry.name).join(', ')}`
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
    folge.isSpecial = false;
    folge.type = 'regular';
    folge.number = name.split('/')[0];
    folge.name = name.split('/')[1];
  } else if (name.includes(':')) {
    folge.isSpecial = false;
    folge.type = 'regular';
    folge.number = name.split(':')[0];
    folge.name = name.split(':')[1];
  } else {
    folge.isSpecial = true;
    folge.type = 'special';
    folge.number = '';
    folge.name = name;
  }

  return folge;
}
