import mongoose from 'mongoose';

interface User {
  name: string;
  email: string;
  image: string;
  emailVerified: boolean;
}

const userSchema = new mongoose.Schema<User>(
  {
    name: String,
    email: String,
    image: String,
    emailVerified: Boolean,
  },
  {
    timestamps: true,
    collection: 'users',
  }
);

export default (mongoose.models && mongoose.models.Rating) ||
  mongoose.model('User', userSchema);
