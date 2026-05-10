import { body } from "express-validator";
import validateRequest from "../middlewares/validation.middleware.js";

export const createEntrenadorValidator = [
  body("nombre").isString().trim().notEmpty().withMessage("El nombre es requerido"),
  body("fechaNacimiento").isISO8601().withMessage("fechaNacimiento debe ser una fecha válida"),
  body("nacionalidad").isString().trim().notEmpty().withMessage("La nacionalidad es requerida"),
  body("equipoId").isInt({ min: 1 }).withMessage("El equipoId debe ser un número entero válido"),
  validateRequest,
];

export const updateEntrenadorValidator = [
  body("nombre").optional().isString().trim().notEmpty().withMessage("El nombre debe ser un texto válido"),
  body("fechaNacimiento").optional().isISO8601().withMessage("fechaNacimiento debe ser una fecha válida"),
  body("nacionalidad").optional().isString().trim().notEmpty().withMessage("La nacionalidad debe ser un texto válido"),
  body("equipoId").optional().isInt({ min: 1 }).withMessage("El equipoId debe ser un número entero válido"),
  validateRequest,
];
