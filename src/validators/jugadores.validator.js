import { body, query } from "express-validator";
import validateRequest from "../middlewares/validation.middleware.js";

export const createJugadorValidator = [
  body("nombre").isString().trim().notEmpty().withMessage("El nombre es requerido"),
  body("fechaNacimiento").isISO8601().withMessage("fechaNacimiento debe ser una fecha válida"),
  body("nacionalidad").isString().trim().notEmpty().withMessage("La nacionalidad es requerida"),
  body("equipoId").isInt({ min: 1 }).withMessage("El equipoId debe ser un número entero válido"),
  validateRequest,
];

export const updateJugadorValidator = [
  body("nombre").optional().isString().trim().notEmpty().withMessage("El nombre debe ser un texto válido"),
  body("fechaNacimiento").optional().isISO8601().withMessage("fechaNacimiento debe ser una fecha válida"),
  body("nacionalidad").optional().isString().trim().notEmpty().withMessage("La nacionalidad debe ser un texto válido"),
  body("equipoId").optional().isInt({ min: 1 }).withMessage("El equipoId debe ser un número entero válido"),
  validateRequest,
];

export const jugadoresFilterValidator = [
  query("nombre").optional().isString().trim(),
  query("nacionalidad").optional().isString().trim(),
  query("equipoId").optional().isInt({ min: 1 }).toInt(),
  query("minEdad").optional().isInt({ min: 0 }).toInt(),
  query("maxEdad").optional().isInt({ min: 0 }).toInt(),
  validateRequest,
];
