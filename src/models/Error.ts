import { Result } from 'express-validator';

export class ErrorResponse extends Error {
  public statusCode: number;
  public error: string;

  constructor(statusCode: number, message: string) {
    // easy to trace stack error
    super(message);

    this.statusCode = statusCode;
    this.error = message;
  }
};

/**
 * This ErrosValidationResponse class use to
 * return errors for express validator
 */
export class ErrorsValidationResponse extends Error {
  public errors: { [key: string]: string; };
  public statusCode: number;

  constructor(errors: Result | Object, statusCode: number = 400, ...params: any) {
    super(...params);
    
    if(errors instanceof Result) {
      this.errors = ErrorsValidationResponse.convertResultToErrorsObject(errors);
    } else {
      Object.entries(errors).forEach(([ key, value ]) => {
        this.errors[key] = value; 
      });
    }

    this.statusCode = statusCode;
  }

  public static convertResultToErrorsObject(errors: Result): { [key: string]: string; } {
    const errorsObject : { [key: string]: string; } = {};
    errors.array().forEach(({ msg, param } : { msg: string, param: string }) => errorsObject[param] = msg);

    return errorsObject;
  }
}