import app from "./src/app.js";
import config from "./src/config/index.js";
import logger from "./src/utils/logger.js";

const PORT = config.PORT;

app.listen(PORT, () => {
  logger.info(`Servidor iniciado en el puerto ${PORT}`);
});
