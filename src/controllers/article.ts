import { Request, Response, NextFunction } from 'express';
import { body, validationResult } from 'express-validator';

import { ErrorResponse } from '../models/Error';
import Article from '../models/Article';
import User from '../models/User';

const validations = {
  title: body('title')
  .not().isEmpty().withMessage('Vui lòng điền title bài viết')
    .isLength({ min: 10 }).withMessage('Tên ít nhất 10 ký tự')
    .trim().escape(),
  description: body('description')
  .not().isEmpty().withMessage('Vui lòng điền mô tả bài viết')
    .isLength({ min: 20 }).withMessage('Mô tả ít nhất 20 ký tự')
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
  const { tag = '', author, limit = 20, offset = 0 } = req.query;
  let query: {
    tagList?: string,
    author?: string,
  } = {};

  if(tag) query.tagList = tag.includes(',') ? { $in: tag.split(',')} : tag;
  if(author) {
    const authorObject = await User.findOne({ username: author });
    query.author = authorObject.id;
  }
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
};

/**
 * /articles/:slug
 */
export const getArticle = async (req: Request, res: Response) => {
  const { slug } = req.params;
  
  if(!slug) {
    res.status(404);
    res.json(new ErrorResponse('Can\'t find the article', 404));
    return;
  }

  const article = await Article.findOne({ slug });
  if(!article) {
    res.status(404);
    res.json(new ErrorResponse('Can\'t find the article', 404));
    return;
  } 

  res.json({
    data: article.toObject(),
  });
};

export const updateArticle = async (req: Request, res: Response) => {
  
};
