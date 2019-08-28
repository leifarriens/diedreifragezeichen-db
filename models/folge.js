const mongoose = require('mongoose');

// Folge Schema
const folgeSchema = mongoose.Schema({
  title: String,
  number: String,
  ratings: Array,
  rating: Number,
  inhalt: String
});

const Folge = module.exports = mongoose.model('Folge', folgeSchema)