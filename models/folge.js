const mongoose = require('mongoose');

// Folge Schema
const folgeSchema = mongoose.Schema(
  {
    images: Array,
    // ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    name: String,
    number: String,
    type: String,
    release_date: Date,
    spotify_id: String,
  },
  {
    collection: 'folgen',
  }
);

module.exports = mongoose.models && (mongoose.models.Folge || mongoose.model('Folge', folgeSchema))
