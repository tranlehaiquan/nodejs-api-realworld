import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IArticle } from './Article';

export interface IFavoriteArticle extends Document {
  user: IUser['_id'],
  article: IArticle['_id'],
};

const FavoriteArticleShcema = new Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
}, { timestamps: true });

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<IFavoriteArticle>('FavoriteArticle', FavoriteArticleShcema);
