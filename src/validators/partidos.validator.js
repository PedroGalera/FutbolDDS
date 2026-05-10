import { body } from "express-validator";
import validateRequest from "../middlewares/validation.middleware.js";

export const createPartidoValidator = [
  body("fecha").isISO8601().withMessage("fecha debe ser una fecha válida"),
  body("horaInicio").isString().trim().notEmpty().withMessage("horaInicio es requerido"),
  body("equipoLocalId").isInt({ min: 1 }).withMessage("equipoLocalId debe ser un número entero válido"),
  body("equipoVisitanteId").isInt({ min: 1 }).withMessage("equipoVisitanteId debe ser un número entero válido"),
  body("resultado").isString().trim().notEmpty().withMessage("resultado es requerido"),
  body("terminado").optional().isBoolean().withMessage("terminado debe ser booleano"),
  validateRequest,
];

export const updatePartidoValidator = [
  body("fecha").optional().isISO8601().withMessage("fecha debe ser una fecha válida"),
  body("horaInicio").optional().isString().trim().notEmpty().withMessage("horaInicio debe ser un texto válido"),
  body("equipoLocalId").optional().isInt({ min: 1 }).withMessage("equipoLocalId debe ser un número entero válido"),
  body("equipoVisitanteId").optional().isInt({ min: 1 }).withMessage("equipoVisitanteId debe ser un número entero válido"),
  body("resultado").optional().isString().trim().notEmpty().withMessage("resultado debe ser un texto válido"),
  body("terminado").optional().isBoolean().withMessage("terminado debe ser booleano"),
  validateRequest,
];
