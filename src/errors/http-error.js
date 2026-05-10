export class HttpError extends Error {
  status;

  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export class ValidationError extends HttpError {
  constructor(message) {
    super(400, message);
  }
}
