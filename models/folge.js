const mongoose = require('mongoose');

// Folge Schema
const folgeSchema = mongoose.Schema({
  title: String,
  number: Number,
  ratings: Array
});

const Folge = module.exports = mongoose.model('Folge', folgeSchema)