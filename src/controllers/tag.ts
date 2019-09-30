import { Request, Response, NextFunction } from 'express';

import Article from '../models/Article';

export const getTags = async (req: Request, res: Response, next: NextFunction) => {
  const tags = await Article.distinct('tagList');
  
  res.json({
    data: tags,
  });
};

