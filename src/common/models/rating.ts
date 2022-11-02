import mongoose from 'mongoose';

export interface Rating {
  user: mongoose.Types.ObjectId;
  folge: mongoose.Types.ObjectId;
  value: number;
  body: string;
  created_at: Date;
  updated_at: Date;
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
      required: true,
    },
    body: { type: String },
  },
  {
    timestamps: {
      createdAt: 'created_at',
      updatedAt: 'updated_at',
    },
    collection: 'ratings',
  },
);

const getModel = () => mongoose.model('Rating', ratingSchema);

export const Rating = (mongoose.models.Rating || getModel()) as ReturnType<
  typeof getModel
>;
