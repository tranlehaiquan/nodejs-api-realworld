import {
  Router
} from 'express';
import {
  createArticle,
  createArticleValidation,
  getArticle,
  getArticles,
  updateArticleValidation,
  updateArticle,
  slugTrigger,
  favoriteArticle,
  unFavoriteArticle,
} from '../../controllers/article';
import {
  AuthRequired,
  AuthOptional,
} from '../../middlewares/jwt';

const route = Router();

// api/articles/

// create article
route.post('/', AuthRequired, createArticleValidation, createArticle);
// get article
route.get('/',AuthOptional , getArticles);

route.param('slug', slugTrigger);

// get specific article by slug
route.get('/:slug', AuthOptional, getArticle);

// update specific article by slug
route.put('/:slug', AuthRequired, updateArticleValidation, updateArticle);

// favorite article
route.post('/:slug/favorite', AuthRequired, favoriteArticle);

// unfavorite article
route.post('/:slug/unfavorite', AuthRequired, unFavoriteArticle);

export default route;