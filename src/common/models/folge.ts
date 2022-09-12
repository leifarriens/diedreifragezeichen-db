import mongoose from 'mongoose';

export interface Folge extends mongoose.Document {
  images: { url: string; height: number; width: number }[];
  name: string;
  number: string;
  type: string;
  community_rating: number;
  number_of_community_ratings: number;
  community_popularity: number;
  user_rating?: number;
  release_date: Date;
  spotify_id: string;
  created_at: Date;
  updated_at: Date;
}

export interface FolgeWithId extends Folge {
  _id: mongoose.Types.ObjectId | string;
}

const folgeSchema = new mongoose.Schema<Folge>(
  {
    images: Array,
    name: String,
    number: String,
    type: String,
    community_rating: { type: Number, default: 0 },
    number_of_community_ratings: { type: Number, default: 0 },
    community_popularity: { type: Number, default: 0 },
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

export const Folge =
  (mongoose.models && mongoose.models.Folge) ||
  mongoose.model('Folge', folgeSchema);
