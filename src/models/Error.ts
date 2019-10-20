export class ErrorResponse {
  message: string | Array<string> | object;
  code?: number;
  status?: number;

  constructor(message: string | Array<string> | object, code?: number) {
    this.code = code;
    this.message = message;
    if(Array.isArray(message) && message.length === 1) this.message = message[0];
  }
}
