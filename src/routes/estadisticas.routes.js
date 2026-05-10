import { Router } from "express";
import estadisticasService from "../services/estadisticas.service.js";

const router = Router();

router.get("/posiciones", async (req, res, next) => {
  try {
    const tabla = await estadisticasService.getTablaPosiciones();
    res.json(tabla);
  } catch (error) {
    next(error);
  }
});

export default router;
