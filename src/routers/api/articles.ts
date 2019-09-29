import {
  Router
} from 'express';
import {
  createArticle,
  createArticleValidation,
  getArticle,
  getArticles,
} from '../../controllers/article';
import {
  authenticate
} from '../../middlewares/jwt';

const route = Router();

// api/user/
route.post('/', authenticate, createArticleValidation, createArticle);
route.get('/', getArticles);
route.get('/:slug', getArticle);

export default route;