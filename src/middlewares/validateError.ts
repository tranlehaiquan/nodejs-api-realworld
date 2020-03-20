import { Request, Response, NextFunction } from 'express';
import { ErrorsValidationResponse, ErrorResponse } from '../models/Error';

/**
 * This middleware just use to catch error ErrorsValidationResponse
 * @param error
 * @param req
 * @param res
 * @param next
 */
export const middlewareExpressValidation = (
  errors: ErrorsValidationResponse | any,
  req: Request,
  res: Response,
  next: NextFunction,
): void => {
  if (errors instanceof ErrorsValidationResponse) {
    // do what ever this error need
    const { statusCode } = errors;

    res.status(statusCode).json(errors);
    return;
  }

  next(errors);
};

/**
 * This middleware just use to catch error ErrorsValidationResponse
 * @param error
 * @param req
 * @param res
 * @param next
 */
export const middlewareHandlerError = (
  error: ErrorResponse | any,
  req: Request,
  res: Response,
  /* eslint-disable */
  next: NextFunction, 
  /* eslint-enable */
): void => {
  // this is base handler error
  // every error don't have specific handler
  // will go to this
  const { statusCode } = error;

  res.status(statusCode).json(error);
};
