import { query } from "express-validator";
import validateRequest from "../middlewares/validation.middleware.js";

export const paginateValidator = [
  query("page").optional().isInt({ min: 1 }).withMessage("page debe ser un entero positivo").toInt(),
  query("limit").optional().isInt({ min: 1, max: 100 }).withMessage("limit debe ser un entero entre 1 y 100").toInt(),
  validateRequest,
];
