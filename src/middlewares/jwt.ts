import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/Error';
import { verifyJWT } from '../utils/jwt';

export const AuthOptional = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try {
    const user = await verifyJWT(authorization + '');
    req.user = user;
  } catch (err) {
    console.log(err);
  } finally {
    next();
  }
};

export const AuthRequired = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  if(!authorization) {
    res.status(401);
    res.send(new ErrorResponse('Unauthorized', 401));

    return;
  }

  try {
    const user = await verifyJWT(authorization + '');
    req.user = user;
    next();
  } catch (err) {
    res.status(401);
    res.send(new ErrorResponse(err.message, 401));
  }
}

export default AuthRequired;