import sequelize from "../db/database.js";

const parseResultado = (resultado) => {
  const [golesLocal, golesVisitante] = resultado.split("-").map((value) => Number(value.trim()));
  return { golesLocal, golesVisitante };
};

const getTablaPosiciones = async () => {
  const [equipos, partidos] = await Promise.all([
    sequelize.models.Equipo.findAll({ raw: true }),
    sequelize.models.Partido.findAll({ raw: true }),
  ]);

  const tabla = equipos.map((equipo) => ({
    equipoId: equipo.Id,
    nombre: equipo.Nombre,
    puntos: 0,
    pj: 0,
    pg: 0,
    pe: 0,
    pp: 0,
    gf: 0,
    gc: 0,
    dif: 0,
  }));

  const acumulado = new Map(tabla.map((fila) => [fila.equipoId, fila]));

  partidos.forEach((partido) => {
    const local = acumulado.get(partido.EquipoLocalId);
    const visitante = acumulado.get(partido.EquipoVisitanteId);
    if (!local || !visitante) return;

    const { golesLocal, golesVisitante } = parseResultado(partido.Resultado);
    local.pj += 1;
    visitante.pj += 1;
    local.gf += golesLocal;
    local.gc += golesVisitante;
    visitante.gf += golesVisitante;
    visitante.gc += golesLocal;

    if (golesLocal > golesVisitante) {
      local.pg += 1;
      visitante.pp += 1;
      local.puntos += 3;
    } else if (golesLocal < golesVisitante) {
      visitante.pg += 1;
      local.pp += 1;
      visitante.puntos += 3;
    } else {
      local.pe += 1;
      visitante.pe += 1;
      local.puntos += 1;
      visitante.puntos += 1;
    }
  });

  return [...acumulado.values()]
    .map((fila) => ({
      ...fila,
      dif: fila.gf - fila.gc,
    }))
    .sort((a, b) => {
      if (b.puntos !== a.puntos) return b.puntos - a.puntos;
      if (b.dif !== a.dif) return b.dif - a.dif;
      return b.gf - a.gf;
    });
};

const estadisticasService = {
  getTablaPosiciones,
};

export default estadisticasService;
