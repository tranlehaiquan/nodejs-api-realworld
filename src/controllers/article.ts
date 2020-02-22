import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';
import mongoose from 'mongoose';

import { ErrorResponse } from '../models/Error';
import Article from '../models/Article';
import FavoriteArticle from '../models/Favorite';
import User from '../models/User';
import Comment from '../models/Comment';

const validations = {
  title: body('title')
  .not().isEmpty().withMessage('Vui lòng điền title bài viết')
    .isLength({ min: 10 }).withMessage('Tên ít nhất 10 ký tự')
    .isLength({ max: 60 }).withMessage('Tên nhiều nhất 60 ký tự')
    .trim().escape(),
  description: body('description')
  .not().isEmpty().withMessage('Vui lòng điền mô tả bài viết')
    .isLength({ min: 20 }).withMessage('Mô tả ít nhất 20 ký tự')
    .isLength({ max: 100 }).withMessage('Mô tả nhiều nhất 100 ký tự')
    .trim().escape(),
  body: body('body')
  .not().isEmpty().withMessage('Vui lòng điền nội dung bài viết')
    .isLength({ min: 50 }).withMessage('Nội dung bài ít nhất 50 ký tự')
    .trim(),
  middleWare: async (req: Request, res: Response, next: NextFunction) => {  
    const error = validationResult(req);

    if(!error.isEmpty()) {
      next({
        name: 'validationError',
        errors: error,
      });
      return;
    }

    next();
  },
};

export const createArticleValidation = [
  validations.title,
  validations.description,
  validations.body,
  validations.middleWare,
];

export const createArticle = async (req: Request, res: Response) => {
  const { title, description, body, tagList } = req.body;
  const authorId = req.user.id;

  const article = new Article({
    title,
    description,
    body,
    tagList,
    author: authorId,
  });

  await article.save();

  res.json({
    data: article.toObject()
  });
};

/**
 * /articles/
 * Get articles
 */
export const getArticles = async (req: Request, res: Response) => {
  const { tag = '', author, limit = 20, offset = 0, favoriteBy = '' } = req.query;
  let query: {
    tagList?: string,
    author?: string,
  } = {};
  if(tag) query.tagList = tag.includes(',') ? { $in: tag.split(',')} : tag;
  if(author) {
    const authorObject = await User.findOne({ username: author });
    query.author = authorObject.id;
  }

  if(!favoriteBy) {
    const articles = Article.find({ ...query })
      .skip(offset)
      .limit(+limit)
      .sort({createdAt: 'desc'})
      .populate('author')
      .exec();
    const articlesCount = Article.count(query).exec();
  
    const result = await Promise.all([articles, articlesCount]);
    res.json({
      data: {
        articles: result[0].map((article) => ({
          ...article.toObject()
        })),
        articlesCount: result[1],
      }
    });
  }

  // if query have favorite by, get list of article
  // by query collection favoriteArticles
  const userFavorite = await User.findOne({ username: favoriteBy });
  
  // if user not found
  if(!userFavorite) {
    res.json({
      data: {
        articles: [],
        articlesCount: 0,
      }
    });
    return;
  }

  const articles = FavoriteArticle.find({ user: userFavorite.id })
    .skip(offset)
    .limit(+limit)
    .sort({createdAt: 'desc'})  
    .populate({
      path: 'article',
      populate: {
        path: 'author',
      }
    })
    .exec();
  const articlesCount = FavoriteArticle.count({ user: userFavorite.id }).exec();
  const result = await Promise.all([articles, articlesCount]);

  res.json({
    data: {
      articles: result[0].map((article) => ({
        ...article.toObject()
      })),
      articlesCount: result[1],
    }
  });
};

/**
 * /articles/:slug
 */
export const getArticle = async (req: Request, res: Response) => {
  const { article, user } = req;
  const numberOfFavorite = await FavoriteArticle.count({ article: article.id });
  let favorited = false;
  if(user) {
    const result = await FavoriteArticle.findOne({ article: article.id, user: user.id });
    if(result) favorited = true;
  }

  res.json({
    data: article.toObject(),
    favoritesCount: numberOfFavorite,
    favorited,
  });
};

export const updateArticleValidation = [
  validations.title,
  validations.description,
  validations.body, 
  validations.middleWare,
];

export const updateArticle = async (req: Request, res: Response, next: NextFunction) => {
  const { title, description, body, tagList } = req.body;
  const article = req.article;

  if(article.author !== req.user.id) {
    next(new ErrorResponse(404, 'You don\'t have permission to update article'));
    return;
  }

  if(title) article.title = title;
  if(description) article.description = description;
  if(body) article.body = body;
  if(tagList) article.tagList = tagList;

  await article.save();

  res.json({
    data: article,
  });
};

export const favoriteArticle = async (req: Request, res: Response, next: NextFunction) => {
  const { article, user } = req;

  const favoriteArticle = await FavoriteArticle.findOne({ user: user.id, article: article.id });
  if(!favoriteArticle) {
    const userFavorite = new FavoriteArticle({ user: user.id, article: article.id });
    await userFavorite.save();
  }
  res.send({
    data: true,
  });
}

export const unFavoriteArticle = async (req: Request, res: Response, next: NextFunction) => {
  const { article, user } = req;

  await FavoriteArticle.deleteOne({ user: mongoose.Types.ObjectId(user.id), article: article.id });
  res.send({
    data: true,
  });
}

export const slugTrigger = async (req: Request, res: Response, next: NextFunction, slug:string) => {
  const article = await Article.findOne({ slug });
  if(!article) {
    res.status(404);
    res.json(new ErrorResponse(404, 'Can\'t find the article'));
    return;
  } else {
    req.article = article;
    next();
  }
}

export const addComment = async (req: Request, res: Response, next: NextFunction) => {
  const { article, user } = req;
  const { body } = req.body;
  const newComment = new Comment({
    comment: body,
    article_id: article.id,
    username: user.username,
  });

  try {
    await newComment.save();

    res.json({
      data: newComment.toObject(), 
    });
  } catch(err) {
    console.error(err);
    res.json({
      data: false, 
    });
  }
};

export const getCommentsByOfArticle = async (req: Request, res: Response, next: NextFunction) => {
  const { article } = req;
  const { limit = 20, offset = 0 } = req.query;
  const comments = Comment
    .find({ article_id: article.id })
    .skip(offset)
    .limit(+limit)
    .sort({createdAt: 'desc'});
  const commentCount = Comment.count({ article_id: article.id }).exec();

  const result = await Promise.all([ comments, commentCount ])

  res.json({
    data: {
      comments: result[0].map((comment) => comment.toObject()),
      commentsCount: result[1],
    },
  });
};

export const deleteComment = async (req: Request, res: Response, next: NextFunction) => {
  const { id } = req.params;

  await Comment.deleteOne({ _id: id });
  res.json({
    data: true,
  });
};