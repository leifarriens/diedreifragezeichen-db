/* eslint-disable no-unused-vars */
const mongoose = require('mongoose');
const Rating = require('./rating');

// Folge Schema
const folgeSchema = mongoose.Schema(
  {
    images: Array,
    ratings: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Rating' }],
    // rating: Number,
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

// FIXME: original document apparently can't be accessed in middleware
// folgeSchema.pre('findOneAndUpdate', function (next) {
//   const data = this.getUpdate();

//   console.log(data);

//   data.rating = 10;

//   this.update({}, data).exec();
//   next();
// });

module.exports =
  (mongoose.models && mongoose.models.Folge) ||
  mongoose.model('Folge', folgeSchema);
