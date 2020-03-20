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
}

type ErrorsObject = { [key: string]: string };
/**
 * This ErrosValidationResponse class use to
 * return errors for express validator
 */
export class ErrorsValidationResponse extends Error {
  public errors: ErrorsObject;

  public statusCode: number;

  constructor(errors: Result | Record<string, any>, statusCode = 400, ...params: any) {
    super(...params);

    if (errors instanceof Result) {
      this.errors = ErrorsValidationResponse.convertResultToErrorsObject(errors);
    } else {
      Object.entries(errors).forEach(([key, value]) => {
        this.errors[key] = value;
      });
    }

    this.statusCode = statusCode;
  }

  public static convertResultToErrorsObject(errors: Result): ErrorsObject {
    const errorsObject: ErrorsObject = {};
    errors.array().forEach(({ msg, param }: { msg: string; param: string }) => (errorsObject[param] = msg));

    return errorsObject;
  }
}
