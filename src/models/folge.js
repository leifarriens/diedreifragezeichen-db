/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Rating = require('./rating');

// Folge Schema
// TODO: remove ratings from folge schema and use "one-to-many" relation
const folgeSchema = mongoose.Schema(
  {
    images: Array,
    // ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    // rating: { type: Number, default: null }, // TODO: store Rating
    // number_of_ratings: { type: Number, default: 0 },
    name: String,
    number: String,
    type: String,
    release_date: Date,
    spotify_id: String,
  },
  {
    collection: 'folgen',
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
  }
);

// Add all folgen rating _id to doc
// folgeSchema.virtual('ratings', {
//   ref: 'Rating',
//   foreignField: 'folge',
//   localField: '_id',
// });

// TODO: "toObject" needed ?
// folgeSchema.set('toObject', {
//   virtuals: true,
//   versionKey: false,
// });

folgeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
  // TODO: add transform with delete "_id"
});

module.exports =
  (mongoose.models && mongoose.models.Folge) ||
  mongoose.model('Folge', folgeSchema);
