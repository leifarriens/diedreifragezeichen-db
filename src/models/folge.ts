import mongoose from 'mongoose';

// @ts-ignore
import Rating from './rating';

interface Folge {
  images: any[];
  name: string;
  number: string;
  type: string;
  release_date: DateConstructor;
  spotify_id: string;
}

const folgeSchema = new mongoose.Schema<Folge>(
  {
    images: Array,
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

export default (mongoose.models && mongoose.models.Folge) ||
  mongoose.model('Folge', folgeSchema);
