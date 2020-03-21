import { Router } from 'express';
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
  getCommentsByOfArticle,
  addComment,
  deleteComment,
} from '../../controllers/article';
import { AuthRequired, AuthOptional } from '../../middlewares/jwt';

const route = Router();

// api/articles/

// create article
route.post('/', AuthRequired, createArticleValidation, createArticle);
// get article
route.get('/', AuthOptional, getArticles);

route.param('slug', slugTrigger);

// get specific article by slug
route.get('/:slug', AuthOptional, getArticle);

// update specific article by slug
route.put('/:slug', AuthRequired, updateArticleValidation, updateArticle);

// favorite article
route.post('/:slug/favorite', AuthRequired, favoriteArticle);

// unfavorite article
route.delete('/:slug/favorite', AuthRequired, unFavoriteArticle);
route.get('/:slug/comments', AuthOptional, getCommentsByOfArticle);
route.post('/:slug/comments', AuthRequired, addComment);
route.delete('/comments/:id', AuthRequired, deleteComment);

export default route;
