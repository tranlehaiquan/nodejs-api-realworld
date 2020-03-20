import mongoose, { Schema, Document } from 'mongoose';
import crypto from 'crypto';
import { toSlug } from '../utils/string';

import { User } from './User';
import { Comment } from './Comment';

export interface Article extends Document {
  slug: string;
  title: string;
  description: string;
  body: string;
  favoritesCount: number;
  comments: Comment['_id'];
  tagList: string[];
  author: User['_id'];
}

type ExportArticle = {
  id: number;
  slug: string;
  title: string;
  description: string;
  body: string;
  favoritesCount: number;
  tagList: string[];
  author: User['_id'];
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
    comments: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
      },
    ],
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
        id: doc._id,
        slug: doc.slug,
        title: doc.title,
        description: doc.description,
        body: doc.body,
        favoritesCount: doc.favoritesCount,
        author: doc.author,
        tagList: doc.tagList,
      }),
    },
    timestamps: true,
  },
);

ArticleShema.index({ slug: 1 }, { unique: true });

ArticleShema.pre('save', function(this: Article, next) {
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
