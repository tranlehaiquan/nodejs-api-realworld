import { Request, Response } from 'express';

import Article from '../models/Article';

export const getTags = async (req: Request, res: Response): Promise<void> => {
  const tags = await Article.distinct('tagList');

  res.json({
    data: tags,
  });
};
