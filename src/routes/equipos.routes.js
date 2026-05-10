import { Router } from "express";
import equiposService from "../services/equipos.service.js";
import {
  createEquipoValidator,
  updateEquipoValidator,
} from "../validators/equipos.validator.js";

const router = Router();

router.get("/", async (req, res, next) => {
  try {
    const equipos = await equiposService.getEquipos(req.query);
    res.json(equipos);
  } catch (error) {
    next(error);
  }
});

router.post("/", createEquipoValidator, async (req, res, next) => {
  try {
    const equipo = await equiposService.insertarEquipo(req.body);
    res.status(201).json(equipo);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", updateEquipoValidator, async (req, res, next) => {
  try {
    const equipo = await equiposService.editarEquipo({
      id: Number(req.params.id),
      ...req.body,
    });
    res.json(equipo);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const resultado = await equiposService.borrarEquipo(Number(req.params.id));
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

export default router;
