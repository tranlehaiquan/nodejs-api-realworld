import mongoose, { Schema, Document } from 'mongoose';
import { MongoError } from 'mongodb';
import crypto from 'crypto';

export interface User extends Document {
  email: string;
  username: string;
  bio?: string;
  image?: string;
  setPassword: (password: string) => void;
  validatePassword: (password: string) => boolean;
  listFollow: {
    username: string;
    id: Document['id'];
  }[];
}

type UserExport = {
  id: number;
  email: string;
  username: string;
  bio?: string;
  image?: string;
};

const UserSchema = new Schema(
  {
    email: {
      type: String,
      trim: true,
      required: true,
      lowercase: true,
      index: true,
      unique: true,
    },
    username: {
      type: String,
      required: true,
      trim: true,
      index: true,
      unique: true,
    },
    bio: { type: String, default: '' },
    image: String,
    hash: String,
    salt: String,
    listFollow: {
      type: Array,
      default: [],
    },
  },
  {
    toObject: {
      transform(doc: User): UserExport {
        return {
          id: doc.id,
          email: doc.email,
          username: doc.username,
          bio: doc.bio,
          image: doc.image,
        };
      },
    },
    toJSON: {
      transform(doc: User): UserExport {
        return {
          id: doc.id,
          email: doc.email,
          username: doc.username,
          bio: doc.bio,
          image: doc.image,
        };
      },
    },
  },
);

UserSchema.methods.setPassword = function setPassword(password: string): void {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
};

UserSchema.methods.validatePassword = function validatePassword(password: string): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return hash === this.hash;
};

UserSchema.pre('save', function preSave(this: User, next) {
  if (!this.image) {
    const hashEmail = crypto
      .createHash('md5')
      .update(this.email)
      .digest('hex');
    this.image = `https://gravatar.com/avatar/${hashEmail}?s=200`;
  }
  next();
});

type ErrorPost = MongoError & {
  keyValue: {
    name: string;
  };
};

UserSchema.post('save', (error: ErrorPost, doc: any, next: Function) => {
  const [name] = Object.keys(error.keyValue);

  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(`${name} has been taken`));
  } else {
    next();
  }
});

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<User>('User', UserSchema);
