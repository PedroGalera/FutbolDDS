import logger from "../utils/logger.js";

export default function errorHandler(err, req, res, next) {
  const status = err.status || 500;
  const message = err.message || "Error interno del servidor";

  if (status >= 500) {
    logger.error(err.stack || err.message);
  } else {
    logger.warn(message);
  }

  res.status(status).json({
    status: "error",
    message,
  });
}
