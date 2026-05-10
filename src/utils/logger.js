import winston from "winston";
import config from "../config/index.js";

const logger = winston.createLogger({
  level: config.NODE_ENV === "production" ? "info" : "debug",
  format: winston.format.combine(
    winston.format.colorize(),
    winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
    winston.format.printf(({ timestamp, level, message }) => `${timestamp} [${level}]: ${message}`)
  ),
  transports: [new winston.transports.Console()],
});

logger.stream = {
  write: (message) => {
    logger.info(message.trim());
  },
};

logger.http = (message) => logger.info(message);

export default logger;
