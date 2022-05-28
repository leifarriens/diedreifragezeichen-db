const mongoose = require('mongoose');

// rating Schema
const ratingSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    comment: { type: String },
  },
  {
    timestamps: true,
    collection: 'ratings',
  }
);

// ratingSchema.set('toJSON', {
//   versionKey: false,
//   // transform: function (doc, ret) {
//   //   delete ret._id;
//   // },
// });

module.exports =
  (mongoose.models && mongoose.models.Rating) ||
  mongoose.model('Rating', ratingSchema);
