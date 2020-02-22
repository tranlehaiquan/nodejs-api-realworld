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

export class ErrorValidation extends Error {
  public errors: object;
  public statusCode: number;

  constructor(errors: object, statusCode: number = 400, ...paras: any) {
    super(paras);
    
    this.statusCode = statusCode;
    this.errors = errors;
  }
}