import { HttpError } from "./http-error.js";

export class ResourceNotFound extends HttpError {
  constructor(message) {
    super(404, message);
  }
}
