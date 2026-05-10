import { body } from "express-validator";
import validateRequest from "../middlewares/validation.middleware.js";

export const createEquipoValidator = [
  body("nombre").isString().trim().notEmpty().withMessage("El nombre es requerido"),
  body("estadio").isString().trim().notEmpty().withMessage("El estadio es requerido"),
  body("fundacion").isISO8601().withMessage("La fundacion debe ser una fecha válida"),
  validateRequest,
];

export const updateEquipoValidator = [
  body("nombre").optional().isString().trim().notEmpty().withMessage("El nombre debe ser un texto válido"),
  body("estadio").optional().isString().trim().notEmpty().withMessage("El estadio debe ser un texto válido"),
  body("fundacion").optional().isISO8601().withMessage("La fundacion debe ser una fecha válida"),
  validateRequest,
];
