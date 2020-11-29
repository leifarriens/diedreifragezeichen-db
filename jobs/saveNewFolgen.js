const mongoose = require('mongoose');
const chalk = require('chalk');
const Folge = require('../models/folge');
require('dotenv').config();

const jsonFolgen = require('../allefolgen.json');

const { addFolge } = require('../services/folge');

const dbPath = `mongodb+srv://app:${process.env.MONGO_PASSWORD}@diedreifragezeichen-db-7k2z1.mongodb.net/diedreifragezeichen-db?retryWrites=true&w=majority`;
mongoose.connect(dbPath, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

db.once('open', saveNewFolgenToDb);

db.on('error', function(err) {
  console.log(err);
});

async function saveNewFolgenToDb() {
  // get all folgen saved in db
  const dbFolgen = await Folge.find({});

  console.log(`${dbFolgen.length} Folgen Loaded from DB`);

  // loop folgen from spotify api
  jsonFolgen.forEach(async (folge) => {
    // find folge in db
    const inDb = dbFolgen.find(x => x.spotify_id === folge.id);

    if (!inDb) {
      // folge is not in db and has to be added
      try {
        const { name, images, id, release_date } = folge;
        console.log(`${chalk.yellow(name)} is not in DB`);
        const addedFolge = await addFolge(name, images, id, release_date);
        console.log(`${chalk.green(addedFolge.name)} has been added to DB...`);
      } catch (e) {
        console.log(e);
      }
    } else {
      // folge is already in db
      // console.log(`${chalk.green(folge.name)} is already in DB...`);
    }
  });

  return true;
}