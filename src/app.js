import express from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import swaggerJsdoc from "swagger-jsdoc";
import path from "path";
import { fileURLToPath } from "url";
import config from "./config/index.js";
import logger from "./utils/logger.js";
import httpLogger from "./middlewares/logger.middleware.js";
import errorHandler from "./middlewares/error.middleware.js";
import jugadoresRoutes from "./routes/jugadores.routes.js";
import equiposRoutes from "./routes/equipos.routes.js";
import entrenadoresRoutes from "./routes/entrenadores.routes.js";
import partidosRoutes from "./routes/partidos.routes.js";
import estadisticasRoutes from "./routes/estadisticas.routes.js";
import swaggerOptions from "./docs/swagger.js";
import "./db/database.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const swaggerSpec = swaggerJsdoc(swaggerOptions);

app.use(cors());
app.use(express.json());
app.use(httpLogger);

// Serve static files from public folder
app.use(express.static(path.join(__dirname, "../public")));

// API Routes
app.use("/api/jugadores", jugadoresRoutes);
app.use("/api/equipos", equiposRoutes);
app.use("/api/entrenadores", entrenadoresRoutes);
app.use("/api/partidos", partidosRoutes);
app.use("/api/estadisticas", estadisticasRoutes);
app.use("/api/docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Root route - Serve frontend
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "../public/index.html"));
});

// API Health Check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", message: "API activa", env: config.NODE_ENV });
});

// 404 handler for API routes
app.use("/api/*", (req, res, next) => {
  res.status(404).json({ status: "error", message: "Ruta API no encontrada" });
});

app.use(errorHandler);

export default app;
