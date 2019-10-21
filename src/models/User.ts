import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

export interface IUser extends Document {
  email: string,
  username: string,
  bio?: string,
  image?: string,
  setPassword: (password: string) => void,
  validatePassword: (password: string) => boolean,
  listFollow: {
    username: String,
    id: Document['_id']
  }[],
};

const UserSchema = new Schema({
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
    default: []
  },
}, {
  toObject: { transform: function(doc: IUser) {
    return {
      id: doc._id,
      email: doc.email,
      username: doc.username,
      bio: doc.bio,
      image: doc.image,
    };
  }},
  toJSON: { transform: function(doc: IUser) {
    return {
      id: doc._id,
      email: doc.email,
      username: doc.username,
      bio: doc.bio,
      image: doc.image,
    };
  }},
});

UserSchema.methods.setPassword = function(password: string) {
  this.salt = crypto.randomBytes(16).toString('hex');
  this.hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
}

UserSchema.methods.validatePassword = function(password: string): boolean {
  const hash = crypto.pbkdf2Sync(password, this.salt, 10000, 512, 'sha512').toString('hex');
  return hash === this.hash;
}

UserSchema.post('save', (error: any, doc: any, next: Function) => {
  const [name] = Object.keys(error.keyValue);

  if (error.name === 'MongoError' && error.code === 11000) {
    next(new Error(`${name} has been taken`));
  } else {
    next();
  }
});

UserSchema.pre('save', function(this: IUser, next) {
  if(!this.image) {
    const hashEmail = crypto.createHash('md5').update(this.email).digest('hex');
    this.image = `https://gravatar.com/avatar/${hashEmail}?s=200`;
  }
  next();
});

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<IUser>('User', UserSchema);
