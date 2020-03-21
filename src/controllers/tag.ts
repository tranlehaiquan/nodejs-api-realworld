import { Request, Response } from 'express';

import ArticleModel from '../models/Article';

export default async (req: Request, res: Response): Promise<void> => {
  const tags = await ArticleModel.distinct('tagList');

  res.json({
    data: tags,
  });
};
