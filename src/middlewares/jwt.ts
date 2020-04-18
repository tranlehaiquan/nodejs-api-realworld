import { Request, Response, NextFunction } from 'express';
import ErrorResponse from '../models/Error/ErrorResponse';
import UserModel from '../models/User';
import { verifyJWT } from '../utils/jwt';

/**
 * Verify JWT
 * @param req
 * @param res
 * @param next
 */
export const AuthOptional = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers;

  if(!authorization) {
    next();
    return;
  };

  try {
    const user = await verifyJWT(authorization.split(' ')[1]);
    const userDocument = await UserModel.findById(user.id);
    if (!userDocument) {
      next(new ErrorResponse(404, "Your account is invalid"));
      return;
    }
    req.user = userDocument;
    next();
  } catch (err) {
    if (!(err instanceof ErrorResponse)) {
      console.log(err); /* eslint-disable-line no-console */
    } else {
      next(err);
    }
  }
};

export const AuthRequired = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const { authorization } = req.headers;

  if (!authorization) {
    next(new ErrorResponse(401, 'This route need token to be access'));
    return;
  }

  if (!authorization.startsWith('Bearer')) {
    next(new ErrorResponse(401, 'Invaild access token'));
    return;
  }

  try {
    const user = await verifyJWT(authorization.split(' ')[1]);
    const userDocument = await UserModel.findById(user.id);
    if (!userDocument) {
      next(new ErrorResponse(404, "Your account is invalid"));
      return;
    }
    req.user = userDocument;
    next();
  } catch (err) {
    next(err);
  }
};

export default AuthRequired;
