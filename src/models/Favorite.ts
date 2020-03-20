import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';
import { Article } from './Article';

export interface FavoriteArticle extends Document {
  user: User['_id'];
  article: Article['_id'];
}

const FavoriteArticleShcema = new Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  },
  { timestamps: true },
);

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<FavoriteArticle>('FavoriteArticle', FavoriteArticleShcema);
