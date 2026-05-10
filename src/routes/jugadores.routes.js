import { Router } from "express";
import jugadoresService from "../services/jugadores.service.js"; 
import { paginateValidator } from "../validators/pagination.validator.js";
import {
  createJugadorValidator,
  updateJugadorValidator,
  jugadoresFilterValidator,
} from "../validators/jugadores.validator.js";
const router = Router();

router.get(
  "/",
  jugadoresFilterValidator,
  paginateValidator,
  async (req, res, next) => {
    try {
      const { page, limit, ...filters } = req.query;
      const jugadores = await jugadoresService.getJugadores(filters, {
        page,
        limit,
      });
      res.json(jugadores);
    } catch (error) {
      next(error);
    }
  }
);

router.post("/", createJugadorValidator, async (req, res, next) => {
  try {
    const jugador = await jugadoresService.insertarJugador(req.body);
    res.status(201).json(jugador);
  } catch (error) {
    next(error);
  }
});

router.put("/:id", updateJugadorValidator, async (req, res, next) => {
  try {
    const jugador = await jugadoresService.editarJugador({
      id: Number(req.params.id),
      ...req.body,
    });
    res.json(jugador);
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req, res, next) => {
  try {
    const resultado = await jugadoresService.borrarJugador(Number(req.params.id));
    res.json(resultado);
  } catch (error) {
    next(error);
  }
});

export default router;
