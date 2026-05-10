import morgan from "morgan";
import logger from "../utils/logger.js";

const httpLogger = morgan("combined", {
  stream: {
    write: (message) => logger.http(message.trim()),
  },
});

export default httpLogger;
