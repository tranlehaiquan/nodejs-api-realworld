import mongoose, { Schema, Document } from 'mongoose';
import { IUser } from './User';
import { IArticle } from './Article';

export interface IComment extends Document {
  comment: string,
  username: IUser['username'],
  article_id: IArticle['_id'],
  createdAt: Date,
  updatedAt: Date,
};

const CommentSchema = new Schema({
  comment: {
    type: String,
    required: 'Vui lòng điền nội dung comment',
    trim: true,
  },
  username: {
    type: String,
    required: true,
  },
  article_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
}, { 
  timestamps: true,
  toObject: { transform: function(doc: IComment) {
    return {
      id: doc._id,
      username: doc.username,
      comment: doc.comment,
      article_id: doc.article_id,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }},
});

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<IComment>('Comment', CommentSchema);
