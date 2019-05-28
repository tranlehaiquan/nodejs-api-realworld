import mongoose, { Schema, Document } from 'mongoose';

export interface User extends Document {
  email: string,
  username: string,
  bio: string,
  image?: string,
};

const UserSchema = new Schema({
  email: {
    type: String,
    trim: true,
    required: true,
    lowercase: true,
  },
  username: {
    type: String,
    required: true,
    trim: true,
  },
  bio: String,
  image: String,
  hash: String,
  salt: String,
});

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<User>('User', UserSchema);
