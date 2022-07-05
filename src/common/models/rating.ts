import mongoose from 'mongoose';
// import Folge from './folge';
interface Rating {
  user: mongoose.Types.ObjectId;
  folge: mongoose.Types.ObjectId;
  value: number;
  comment: string;
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
    timestamps: true,
    collection: 'ratings',
  },
);

export default (mongoose.models && mongoose.models.Rating) ||
  mongoose.model('Rating', ratingSchema);
