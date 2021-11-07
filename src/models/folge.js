/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Rating = require('./rating');

// Folge Schema
const folgeSchema = mongoose.Schema(
  {
    images: Array,
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    name: String,
    number: String,
    type: String,
    isSpecial: Boolean,
    release_date: Date,
    spotify_id: String,
  },
  {
    collection: 'folgen',
    timestamps: true,
  }
);

module.exports =
  (mongoose.models && mongoose.models.Folge) ||
  mongoose.model('Folge', folgeSchema);
