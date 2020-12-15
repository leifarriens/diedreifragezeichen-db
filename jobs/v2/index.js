/**
 * 1. Auth Spotify and get Bearer access token
 * 2. Get all albums from Spotify Artist
 * 3. Get all folgen db entries
 * 4. Loop all Spotify albums and check if they are in db
*/

const mongoose = require('mongoose');
const chalk = require('chalk');
const { getBearerToken, getAllAlbums } = require('./spotifyAPI');
const { getAllDbFolgen, addNewFolge } = require('./dbServices');

const { addFolge } = require('../../services/folge.js');

const dbPath = process.env.MONGO_URI;
mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.on('open', runJob);

async function runJob () {
  const bearerToken = await getBearerToken();
  const allAlbums = await getAllAlbums(bearerToken);
  const dbFolgen = await getAllDbFolgen();

  const inDb = [];
  const notInDb = [];
  const successfullyAdded = [];

  allAlbums.forEach(async (folge) => {
    const isInDb = dbFolgen.find(x => x.spotify_id === folge.id);

    if (isInDb) {
      inDb.push(folge);
      // folge is not in DB and has to be added
    } else {
      // folge is in db
      notInDb.push(folge);
      console.log(folge);
      try {
        const { name, images, id, release_date } = folge;
        const addedFolge = await addFolge(name, images, id, release_date);
        successfullyAdded.push(addedFolge);
      } catch (error) {
        console.log(error);
      }
    }
  });

  setTimeout(() => {
    console.log(`${chalk.blue(inDb.length)} Folgen are already in DB...`);
    console.log(`${chalk.yellow(notInDb.length)} Folgen are not in DB...`);
    console.log(`${chalk.green(successfullyAdded.length)} Folgen have been added DB...`);

    db.close(() => {
      console.log('DB Connection closed.');
      return;
    });
  }, 500);
}
