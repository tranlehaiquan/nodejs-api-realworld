import { User as UserModel } from '../../src/models/User';
import { Article } from '../../src/models/Article';
declare global {
  namespace Express {
    export interface Request {
      user?: UserModel;
      article?: Article;
      profile?: UserModel;
    }
  }
}
