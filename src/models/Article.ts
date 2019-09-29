import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';

import { IUser } from './User';
import { IComment } from './Comment';

export interface IArticle extends Document {
  slug: string,
  title: string,
  description: string,
  body: string,
  favoritesCount: number,
  comments: IComment['_id'],
  tagList: string[],
  author: IUser['_id'],
};

const ArticleShema = new Schema({
  slug: {
    type: String,
    trim: true,
    lowercase: true,
    // unique: true,
    // index: true,
  },
  title: {
    type: String,
    trim: true,
    required: true,
    // unique: true,
    // index: true,
  },
  description: {
    type: String,
    trim: true,
    required: true,
  },
  body: {
    type: String,
    trim: true,
    required: true,
  },
  favoritesCount: {
    type: Number,
    default: 0,
  },
  comments: [{
    type: Schema.Types.ObjectId,
    ref: 'Comment',
  }],
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
  },
  tagList: {
    type: Array,
    default: [],
  },
}, {
  toObject: {transform: (doc: IArticle) => ({
    id: doc._id,
    slug: doc.slug,
    title: doc.title,
    description: doc.description,
    body: doc.body,
    favoritesCount: doc.favoritesCount,
    author: doc.author,
    tagList: doc.tagList,
  })},
  timestamps: true });

ArticleShema.index({ slug: 1 }, { unique: true });

ArticleShema.pre('save', function(this: IArticle, next) {
  if(!this.isNew) {
    next();
    return;
  }
  const regex = /\s/gi;
  const salt = crypto.randomBytes(16).toString('hex');
  const slug = this.title.trim().toLocaleLowerCase().replace(regex, '_') + `_${salt}`;
  this.slug = slug;
  next();
});

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<IArticle>('Article', ArticleShema);
