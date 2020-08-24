const mongoose = require('mongoose');

// Folge Schema
const folgeSchema = mongoose.Schema({
  name: String,
  release_date: String,
  images: Array
}, {
  collection: 'folgen'
});

const Folge = module.exports = mongoose.model('Folge', folgeSchema)