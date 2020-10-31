// const mongoose = require('mongoose');
// const Folge = require('../models/folge');

// const jsonFolgen = require('../allefolgen.json');

// const dbPath = 'mongodb+srv://app:GFdAaT1auwjr4bp8@diedreifragezeichen-db-7k2z1.mongodb.net/diedreifragezeichen-db?retryWrites=true&w=majority';
// mongoose.connect(dbPath, {useNewUrlParser: true});
// const db = mongoose.connection;

// db.once('open', function() {
//   console.log(`Connected to ${db.host}`);

//   jsonFolgen.forEach(entry => {
//     const { name, release_date, images } = entry;

//     const folge = new Folge({ name, release_date, images });

//     folge.save()
//     .then(() => {
//       console.log('folge saved');
//     })
//     .catch(error => console.log(error))
//     console.log(folge);
//   });
// });
// db.on('error', function(err) {
//   console.log(err);
// });