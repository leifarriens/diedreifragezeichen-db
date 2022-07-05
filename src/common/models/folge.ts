import mongoose from 'mongoose';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
// import Rating from './rating';

interface Folge {
  images: { url: string; height: number; width: number }[];
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
  },
);

folgeSchema.set('toJSON', {
  virtuals: true,
  versionKey: false,
});

export default (mongoose.models && mongoose.models.Folge) ||
  mongoose.model('Folge', folgeSchema);
