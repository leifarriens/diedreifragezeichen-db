import mongoose from 'mongoose';
// import Folge from './folge';
export interface Rating {
  user: mongoose.Types.ObjectId;
  folge: mongoose.Types.ObjectId;
  value: number;
  comment: string;
}

export interface RatingWithId extends Rating {
  _id: string;
}

const ratingSchema = new mongoose.Schema<Rating>(
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
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'ratings',
  },
);

export default (mongoose.models && mongoose.models.Rating) ||
  mongoose.model('Rating', ratingSchema);
