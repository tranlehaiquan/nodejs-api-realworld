import { Request, Response, NextFunction } from 'express';
import { ErrorResponse } from '../models/Error';
import { verifyJWT } from '../utils/jwt';

/**
 * Verify JWT
 * @param req 
 * @param res 
 * @param next 
 */
export const AuthOptional = async (req: Request, res: Response, next: NextFunction) => {
  const { authorization } = req.headers;

  try {
    const user = await verifyJWT(authorization);
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
    next(new ErrorResponse(401, 'Please login to access'));
    return;
  }

  try {
    const user = await verifyJWT(authorization);
    req.user = user;
    next();
  } catch (err) {
    next(err);
  }
}

export default AuthRequired;