import mongoose from 'mongoose';

export interface User {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  list: mongoose.Types.ObjectId[];
}

export interface UserWithId extends User {
  _id: string;
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

export const User =
  (mongoose.models && mongoose.models.User) ||
  mongoose.model('User', userSchema);
