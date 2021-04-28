/**
 * 1. Auth Spotify and get Bearer access token
 * 2. Get all albums from Spotify Artist
 * 3. Get all folgen db entries
 * 4. Loop all Spotify albums and check if they are in db
 */

const mongoose = require('mongoose');
const chalk = require('chalk');
const { getBearerToken, getAllAlbums } = require('./spotifyAPI');
// const { getAllDbFolgen, addNewFolge } = require('./dbServices');

// const { loadAllFolgen, addFolge } = require('../../services/folge.js');
const { getAllDbFolgen, addNewFolge } = require('./dbServices');
const Folge = require('../../models/folge');

const dbPath = process.env.MONGO_URI;
mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('open', runJob);

async function runJob() {
  const bearerToken = await getBearerToken();
  const allAlbums = await getAllAlbums(bearerToken);
  const dbFolgen = await getAllDbFolgen();

  const stats = {
    inDb: [],
    notInDb: [],
    successfullyAdded: [],
  };

  let addToDb = [];

  allAlbums.forEach((folge) => {
    const isInDb = dbFolgen.find((x) => x.spotify_id === folge.id);

    if (isInDb) {
      stats.inDb.push(folge);
      // folge is in DB
    } else {
      // folge is not in db
      addToDb.push(formatFolge(folge))
      stats.notInDb.push(folge);
    }
  });

  try {
    const added = await Folge.insertMany(addToDb);
    stats.successfullyAdded = added;
    console.log(added);
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
}

function formatFolge({ name, images, id, release_date }) {
  const folge = {
    images,
    release_date,
    spotify_id: id,
  };

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
