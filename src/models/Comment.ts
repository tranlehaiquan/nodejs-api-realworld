import mongoose, { Schema, Document } from 'mongoose';
import { User } from './User';
import { Article } from './Article';

export interface Comment extends Document {
  comment: string;
  username: User['username'];
  articleId: Article['_id'];
  createdAt: Date;
  updatedAt: Date;
}

type ExportComment = {
  id: number;
  comment: string;
  username: User['username'];
  articleId: Article['_id'];
  createdAt: Date;
  updatedAt: Date;
};

const CommentSchema = new Schema(
  {
    comment: {
      type: String,
      required: 'Vui lòng điền nội dung comment',
      trim: true,
    },
    username: {
      type: String,
      required: true,
    },
    articleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Article' },
  },
  {
    timestamps: true,
    toObject: {
      transform(doc: Comment): ExportComment {
        return {
          id: doc._id,
          username: doc.username,
          comment: doc.comment,
          articleId: doc.articleId,
          createdAt: doc.createdAt,
          updatedAt: doc.updatedAt,
        };
      },
    },
  },
);

/**
 * Use <User> to know to that return an User
 */
export default mongoose.model<Comment>('Comment', CommentSchema);
