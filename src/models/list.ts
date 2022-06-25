import mongoose from 'mongoose';

interface List {
  user: mongoose.Types.ObjectId;
  folgen: mongoose.Types.ObjectId[];
}

const listSchema = new mongoose.Schema<List>(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    folgen: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folge',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'lists',
  }
);

export default (mongoose.models && mongoose.models.List) ||
  mongoose.model('List', listSchema);
