import { Request, Response, NextFunction } from 'express';
import { body as validatorBody, validationResult } from 'express-validator';
import mongoose from 'mongoose';

import ErrorsValidationResponse from '../models/Error/ErrorsValidationResponse';
import ErrorResponse from '../models/Error/ErrorResponse';
import ArticleModel, { ArticleRequestQuery } from '../models/Article';
import FavoriteArticleModel from '../models/Favorite';
import UserModel from '../models/User';
import CommentModel from '../models/Comment';

const validations = {
  title: validatorBody('title')
    .not()
    .isEmpty()
    .withMessage('Vui lòng điền title bài viết')
    .isLength({ min: 10 })
    .withMessage('Tiêu đề ít nhất 10 ký tự')
    .isLength({ max: 60 })
    .withMessage('Tiêu đề nhiều nhất 60 ký tự')
    .trim()
    .escape(),
  description: validatorBody('description')
    .not()
    .isEmpty()
    .withMessage('Vui lòng điền mô tả bài viết')
    .isLength({ min: 20 })
    .withMessage('Mô tả ít nhất 20 ký tự')
    .isLength({ max: 100 })
    .withMessage('Mô tả nhiều nhất 100 ký tự')
    .trim()
    .escape(),
  body: validatorBody('body')
    .not()
    .isEmpty()
    .withMessage('Vui lòng điền nội dung bài viết')
    .isLength({ min: 50 })
    .withMessage('Nội dung bài ít nhất 50 ký tự')
    .trim(),
  middleWare: async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    const errors = validationResult(req);

    if (!errors.isEmpty()) {
      next(new ErrorsValidationResponse(errors));
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

export const createArticle = async (req: Request, res: Response): Promise<void> => {
  const { title, description, body, tagList } = req.body;
  const authorId = req.user.id;

  const article = new ArticleModel({
    title,
    description,
    body,
    tagList,
    author: authorId,
  });

  await article.save();

  res.json({
    data: article.toObject(),
  });
};

/**
 * /articles/
 * Get articles
 */
export const getArticles = async (req: Request, res: Response): Promise<void> => {
  const { tag = '', author = '', limit = 20, offset = 0, favoriteBy = '' } = req.query;
  const query: ArticleRequestQuery = {};
  if (tag) query.tagList = tag.includes(',') ? { $in: tag.split(',') } : tag;
  if (author) {
    const authorObject = await UserModel.findOne({ username: author });
    if (!authorObject) {
      res.json({
        data: {
          articles: [],
          articlesCount: 0,
          limit,
        },
      });
      return;
    }
    query.author = authorObject.id;
  }

  if (!favoriteBy) {
    const articles = ArticleModel.find(query)
      .skip(+offset)
      .limit(+limit)
      .sort({ createdAt: 'desc' })
      .populate('author')
      .exec();
    const articlesCount = ArticleModel.count(query).exec();

    const result = await Promise.all([articles, articlesCount]);
    res.json({
      data: {
        articles: result[0].map(article => ({
          ...article.toObject(),
        })),
        articlesCount: result[1],
        limit,
      },
    });
    return;
  }

  // if query have favorite by, get list of article
  // by query collection favoriteArticles
  const userFavorite = await UserModel.findOne({ username: favoriteBy });

  // if user not found
  if (!userFavorite) {
    res.json({
      data: {
        articles: [],
        articlesCount: 0,
        limit,
      },
    });
    return;
  }

  const articles = FavoriteArticleModel.find({ user: userFavorite.id })
    .skip(offset)
    .limit(+limit)
    .sort({ createdAt: 'desc' })
    .populate({
      path: 'article',
      populate: {
        path: 'author',
      },
    })
    .exec();
  const articlesCount = FavoriteArticleModel.count({ user: userFavorite.id }).exec();
  const result = await Promise.all([articles, articlesCount]);

  res.json({
    data: {
      articles: result[0].map(article => ({
        ...article.toObject(),
      })),
      articlesCount: result[1],
      limit,
    },
  });
};

export const getArticleFromFollowers = async (req: Request, res: Response): Promise<void> => {
  const { tag = '', limit = 20, offset = 0 } = req.query;
  const { user } = req;
  if (!user.listFollow.length) {
    res.json({
      data: {
        articles: [],
        articlesCount: 0,
      },
    });
    return;
  }

  const query: ArticleRequestQuery = {};
  if (tag) query.tagList = tag.includes(',') ? { $in: tag.split(',') } : tag;

  // list all follower id
  const followersId = user.listFollow.map(author => author.id);
  const articles = await ArticleModel.find({ author: { $in: followersId }, ...query })
    .skip(+offset)
    .limit(+limit)
    .sort({ createdAt: 'desc' })
    .populate('author')
    .exec();
  const articlesCount = ArticleModel.count({ ...query, author: { $in: followersId } }).exec();
  const result = await Promise.all([articles, articlesCount]);

  res.json({
    data: {
      articles: result[0].map(article => ({
        ...article.toObject(),
      })),
      articlesCount: result[1],
    },
  });
};

/**
 * /articles/:slug
 */
export const getArticle = async (req: Request, res: Response): Promise<void> => {
  const { article, user } = req;
  const numberOfFavorite = await FavoriteArticleModel.count({ article: article.id });
  let favorited = false;
  if (user) {
    const result = await FavoriteArticleModel.findOne({ article: article.id, user: user.id });
    if (result) favorited = true;
  }

  res.json({
    data: {
      article: article.toObject(),
      favoritesCount: numberOfFavorite,
      favorited,
    },
  });
};

export const updateArticleValidation = [
  validations.title,
  validations.description,
  validations.body,
  validations.middleWare,
];

export const updateArticle = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { title, description, body, tagList } = req.body;
  const { article } = req;

  if (article.author !== req.user.id) {
    next(new ErrorResponse(404, "You don't have permission to update article"));
    return;
  }

  if (title) article.title = title;
  if (description) article.description = description;
  if (body) article.body = body;
  if (tagList) article.tagList = tagList;

  await article.save();

  res.json({
    data: article,
  });
};

export const favoriteArticle = async (req: Request, res: Response): Promise<void> => {
  const { article, user } = req;

  const favoriteArticleResult = await FavoriteArticleModel.findOne({ user: user.id, article: article.id });
  if (!favoriteArticleResult) {
    const userFavorite = new FavoriteArticleModel({ user: user.id, article: article.id });
    await userFavorite.save();
  }
  res.send({
    data: true,
  });
};

export const unFavoriteArticle = async (req: Request, res: Response): Promise<void> => {
  const { article, user } = req;

  await FavoriteArticleModel.deleteOne({ user: mongoose.Types.ObjectId(user.id), article: article.id });
  res.send({
    data: true,
  });
};

export const slugTrigger = async (req: Request, res: Response, next: NextFunction, slug: string): Promise<void> => {
  const article = await ArticleModel.findOne({ slug }).populate('author');
  if (!article) {
    next(new ErrorResponse(404, "Can't find the article"));
  } else {
    req.article = article;
    next();
  }
};

export const addComment = async (req: Request, res: Response): Promise<void> => {
  const { article, user } = req;
  const { body } = req.body;
  const newComment = new CommentModel({
    comment: body,
    articleId: article.id,
    username: user.username,
  });

  try {
    await newComment.save();

    res.json({
      data: newComment.toObject(),
    });
  } catch (err) {
    console.error(err); /* eslint-disable-line no-console */
    res.json({
      data: false,
    });
  }
};

export const getCommentsByOfArticle = async (req: Request, res: Response): Promise<void> => {
  const { article } = req;
  const { limit = 20, offset = 0 } = req.query;
  const comments = CommentModel.find({ articleId: article.id })
    .skip(offset)
    .limit(+limit)
    .sort({ createdAt: 'desc' });
  const commentCount = CommentModel.count({ articleId: article.id }).exec();

  const result = await Promise.all([comments, commentCount]);

  res.json({
    data: {
      comments: result[0].map(comment => comment.toObject()),
      commentsCount: result[1],
    },
  });
};

export const deleteComment = async (req: Request, res: Response): Promise<void> => {
  const { id } = req.params;

  await CommentModel.deleteOne({ _id: id });
  res.json({
    data: true,
  });
};
