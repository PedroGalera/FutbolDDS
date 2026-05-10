import { validationResult } from "express-validator";
import { ValidationError } from "../errors/http-error.js";

export default function validateRequest(req, res, next) {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const message = errors
      .array()
      .map((error) => `${error.param}: ${error.msg}`)
      .join("; ");

    return next(new ValidationError(message));
  }

  next();
}
