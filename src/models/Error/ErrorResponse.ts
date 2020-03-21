export default class ErrorResponse extends Error {
  public statusCode: number;

  public error: string;

  constructor(statusCode: number, message: string) {
    // easy to trace stack error
    super(message);

    this.statusCode = statusCode;
    this.error = message;
  }
}
