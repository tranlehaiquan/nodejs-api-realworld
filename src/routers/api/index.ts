import { Router, Request, Response } from 'express';
import user from './user';
import { authenticate } from '../../middlewares/jwt';

const route = Router();

route.use('/user', user);

route.get('/test', authenticate, (req: Request, res: Response) => {
  console.log(req.user);

  res.json(req.user);
});

export default route;