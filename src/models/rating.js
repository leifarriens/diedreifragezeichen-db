const mongoose = require('mongoose');

// rating Schema
const ratingSchema = mongoose.Schema(
  {
    user: String,
    folge: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Folge',
      required: true,
    },
    value: {
      type: Number,
      min: 1,
      max: 10,
    },
  },
  {
    timestamps: true,
    collection: 'ratings',
  }
);

module.exports =
  (mongoose.models && mongoose.models.Rating) ||
  mongoose.model('Rating', ratingSchema);
