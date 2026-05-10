import { Router } from "express";
import entrenadoresService from "../services/entrenadores.service.js";
import {
  createEntrenadorValidator,
  updateEntrenadorValidator,
} from "../validators/entrenadores.validator.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const entrenadores = await entrenadoresService.getEntrenadores(req.query);
    res.json(entrenadores);
  } catch (error) {
    next(error);
  }
});

router.post("/", createEntrenadorValidator, async (req, res, next) => {
  try {
    const entrenador = await entrenadoresService.insertarEntrenador(req.body);
    res.status(201).json(entrenador);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", updateEntrenadorValidator, async (req, res, next) => {
  try {
    const entrenador = await entrenadoresService.editarEntrenador({
      id: Number(req.params.id),
      ...req.body,
    });
    res.json(entrenador);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const resultado = await entrenadoresService.borrarEntrenador(Number(req.params.id));
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

export default router;
