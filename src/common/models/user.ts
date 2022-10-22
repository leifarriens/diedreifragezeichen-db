import mongoose from 'mongoose';

export interface User {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
  role: 'User' | 'Admin';
  list: string[];
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
    role: { type: String, default: 'User' },
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

const getModel = () => mongoose.model('User', userSchema);

export const User = (mongoose.models.User || getModel()) as ReturnType<
  typeof getModel
>;
