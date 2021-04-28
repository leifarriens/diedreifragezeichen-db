const mongoose = require('mongoose');

// rating Schema
const ratingSchema = mongoose.Schema({
  user: String,
  value: Number
});

// ratingSchema.post('save', async function() {
//   const updatedFolge = await Folge.findByIdAndUpdate(this.folge, {
//     $addToSet: {
//       newRatings: this._id
//     }
//   }, { new: true });

//   console.log(updatedFolge);
// });

// ratingSchema.post('findOneAndUpdate', async function() {
//   const docToUpdate = await Rating.findOne(this.getQuery());

//   const rating_id = mongoose.Types.ObjectId(docToUpdate._id);

//   console.log(rating_id);
//   const updatedFolge = await Folge.findByIdAndUpdate(docToUpdate.folge, {
//     $addToSet: {
//       newRatings: rating_id
//     }
//   }, { new: true });

//   console.log(updatedFolge.name, updatedFolge.newRatings);
// });

module.exports = mongoose.models && (mongoose.models.Rating || mongoose.model('Rating', ratingSchema))
