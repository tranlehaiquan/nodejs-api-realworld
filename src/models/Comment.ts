import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IArticle } from './Article';

export interface IComment extends Document {
  body: string,
  author: IUser['_id'],
  article: IArticle['_id'],
};

const CommentSchema = new Schema({
  body: {
    type: String,
    required: 'Vui lòng điền nội dung comment',
    trim: true,
  },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  article: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
}, { timestamps: true });

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<IComment>('Comment', CommentSchema);
