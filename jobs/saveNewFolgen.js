const mongoose = require('mongoose');
const chalk = require('chalk');
const Folge = require('../models/folge');

const jsonFolgen = require('../allefolgen2.json');

const dbPath = 'mongodb+srv://app:GFdAaT1auwjr4bp8@diedreifragezeichen-db-7k2z1.mongodb.net/diedreifragezeichen-db?retryWrites=true&w=majority';
mongoose.connect(dbPath, {useNewUrlParser: true});
const db = mongoose.connection;

db.once('open', async function() {
  console.log(`Connected to ${db.host}`);

  jsonFolgen.forEach(verifyFolge);
});

db.on('error', function(err) {
  console.log(err);
});

async function verifyFolge(folge) {
  try {
    const dbEntry = await Folge.findOne({ spotify_id: folge.id });
    if (!dbEntry) {
      console.log(`${chalk.red(folge.name)} is not in DB...`);
      saveNewFolge(folge);
    } else {
      // console.log(`${chalk.green(folge.name)} is in DB...`);
    }
  } catch (error) {
    console.log(error);
  }
}

async function saveNewFolge(jsonFolge) {
  const { name, images, id, release_date } = jsonFolge;

  const folge = new Folge ({
    images,
    ratings: [],
    release_date,
    spotify_id: id
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

  console.log(folge);

  folge.save()
  .then(() => console.log('saved'))
  .catch(error => console.log(error));
}