const mongoose = require('mongoose');

// Folge Schema
const folgeSchema = mongoose.Schema({
  images: Array,
  ratings: Array,
  name: String,
  number: String,
  type: String,
  release_date: String,
  spotify_id: String
}, {
  collection: 'folgen'
});

const Folge = module.exports = mongoose.model('Folge', folgeSchema)