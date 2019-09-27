import { IUser } from './User';

export interface Comment {
  id: number,
  createAt: Date,
  updateAt: Date,
  body: string,
  author: IUser,
};
