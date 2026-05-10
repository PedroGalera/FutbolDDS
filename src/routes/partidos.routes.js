import { Router } from "express";
import partidosService from "../services/partidos.service.js";
import { paginateValidator } from "../validators/pagination.validator.js";
import {
  createPartidoValidator,
  updatePartidoValidator,
} from "../validators/partidos.validator.js";

const router = Router();

router.get("/", paginateValidator, async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const partidos = await partidosService.getPartidos({ page, limit });
    res.json(partidos);
  } catch (error) {
    next(error);
  }
});

router.post("/", createPartidoValidator, async (req, res, next) => {
  try {
    const partido = await partidosService.insertarPartido(req.body);
    res.status(201).json(partido);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", updatePartidoValidator, async (req, res, next) => {
  try {
    const partido = await partidosService.editarPartido({
      id: Number(req.params.id),
      ...req.body,
    });
    res.json(partido);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const resultado = await partidosService.eliminarPartido(Number(req.params.id));
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

export default router;
