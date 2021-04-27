const mongoose = require('mongoose');

// rating Schema
const ratingSchema = mongoose.Schema({
  user: String,
  value: Number,
  comment: String,
});

const Rating = (module.exports = mongoose.model('User', ratingSchema));
