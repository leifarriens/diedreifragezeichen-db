import mongoose from 'mongoose';

interface User {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  list: mongoose.Types.ObjectId[];
}

const userSchema = new mongoose.Schema<User>(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
    list: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Folge',
      },
    ],
  },
  {
    timestamps: true,
    collection: 'users',
  },
);

export default (mongoose.models && mongoose.models.User) ||
  mongoose.model('User', userSchema);
