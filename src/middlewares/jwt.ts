import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/Error';
import { verifyJWT } from '../utils/jwt';

export const authenticate = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if(!authorization) {
    res.status(401);
    res.send(new ErrorResponse('Unauthorized', 401));

    return;
  }

  try {
    const user = await verifyJWT(authorization + '');
    console.log(user);
    req.user = user;
    next();
  } catch (err) {
    console.log(err);
    res.status(401);
    res.send(new ErrorResponse('Invalid token', 401));
  }
};