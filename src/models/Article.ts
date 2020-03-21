import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import { toSlug } from '../utils/string';

import { User } from './User';

export interface Article extends Document {
  slug: string;
  title: string;
  description: string;
  body: string;
  favoritesCount: number;
  tagList: string[];
  author: User['id'];
  createdAt: Date;
  updatedAt: Date;
}

type ExportArticle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  favoritesCount: number;
  tagList: string[];
  author: User['id'];
  createdAt: Date;
  updatedAt: Date;
};

const ArticleShema = new Schema(
  {
    slug: {
      type: String,
      trim: true,
      lowercase: true,
    },
    title: {
      type: String,
      trim: true,
      required: true,
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
    author: {
      type: Schema.Types.ObjectId,
      ref: 'User',
    },
    tagList: {
      type: Array,
      default: [],
    },
  },
  {
    toObject: {
      transform: (doc: Article): ExportArticle => ({
        id: doc.id,
        slug: doc.slug,
        title: doc.title,
        description: doc.description,
        body: doc.body,
        favoritesCount: doc.favoritesCount,
        author: doc.author,
        tagList: doc.tagList,
        createdAt: doc.createdAt,
        updatedAt: doc.updatedAt,
      }),
    },
    timestamps: true,
  },
);

ArticleShema.index({ slug: 1 }, { unique: true });

ArticleShema.pre('save', function preSave(this: Article, next) {
  if (!this.isNew) {
    next();
    return;
  }
  const salt = crypto.randomBytes(16).toString('hex');
  const slug = `${toSlug(this.title)}-${salt}`;
  this.slug = slug;
  next();
});

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<Article>('Article', ArticleShema);
