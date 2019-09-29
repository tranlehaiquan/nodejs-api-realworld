import { Request, Response, NextFunction } from 'express';
import { Result } from 'express-validator';
import { ErrorResponse } from '../models/Error';

interface IError {
  name: string,
  errors?: Result,
  code: number,
};
/**
 * This middleware only handle validation error
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export const validateError = (error: IError , req: Request, res: Response, next: NextFunction) => {
  if(error.name === 'validationError') {
    const errorObject:any = {};
    error.errors.array().forEach(({ msg, param }) => errorObject[param] = msg);

    res.json(new ErrorResponse(errorObject, error.code));
  }

  next(error);
}