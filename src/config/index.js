import dotenv from "dotenv";

dotenv.config();

const config = {
  PORT: process.env.PORT || 3001,
  SQLITE_STORAGE: process.env.SQLITE_STORAGE || "./futbol.db",
  NODE_ENV: process.env.NODE_ENV || "development",
};

export default config;
