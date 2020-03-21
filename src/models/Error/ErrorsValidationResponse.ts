import { Result } from 'express-validator';

type ErrorsObject = { [key: string]: string };
/**
 * This ErrosValidationResponse class use to
 * return errors for express validator
 */
export default class ErrorsValidationResponse extends Error {
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
    errors.array().forEach(({ msg, param }: { msg: string; param: string }) => {
      errorsObject[param] = msg;
    });

    return errorsObject;
  }
}
