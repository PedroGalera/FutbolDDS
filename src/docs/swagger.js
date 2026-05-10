const swaggerDefinition = {
  openapi: "3.0.0",
  info: {
    title: "API de Gestión de Fútbol",
    version: "1.0.0",
    description: "API REST profesional para gestión de equipos, jugadores, entrenadores y partidos.",
  },
  servers: [
    {
      url: "http://localhost:3001",
      description: "Servidor local",
    },
  ],
};

const options = {
  swaggerDefinition,
  apis: ["./src/routes/*.js"],
};

export default options;
