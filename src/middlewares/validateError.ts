import { Request, Response, NextFunction } from 'express';
import { Result } from 'express-validator';
import { ErrorValidation, ErrorResponse } from '../models/Error';

interface IError {
  name: string,
  errors?: Result,
  statusCode: number,
};

/**
 * This middleware only handle validation error, statusCode is 400
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export const validateError = (error: IError , req: Request, res: Response, next: NextFunction) => {
  if(error.name === 'validationError') {
    const errorObject:any = {};
    error.errors.array().forEach(({ msg, param }) => errorObject[param] = msg);
    
    res.status(400).json(new ErrorValidation(errorObject));
  }

  next(error);
};

/**
 * Base handler error
 * @param error 
 * @param req 
 * @param res 
 * @param next 
 */
export const handlerError = (error: ErrorResponse, req: Request, res: Response, next: NextFunction) => {
  const { statusCode } = error;

  res.status(statusCode).json(error);
};