# ⚽ Gestión de Fútbol - Full Stack Dashboard

Una aplicación web profesional de **gestión de fútbol** con un backend robusto y un frontend moderno. Diseñada con arquitectura en capas, validaciones avanzadas, manejo de errores centralizado y una interfaz intuitiva para administrar equipos, jugadores, entrenadores y partidos.

## 🎯 Características Principales

✅ **CRUD Completo** - Crear, leer, actualizar y eliminar (jugadores, equipos, entrenadores, partidos)  
✅ **Paginación y Filtrado Avanzado** - Búsqueda por nombre, nacionalidad, rango de edad  
✅ **Tabla de Posiciones Dinámica** - Cálculo automático de puntos, victorias, derrotas  
✅ **Modales Elegantes** - Formularios interactivos con validación en tiempo real  
✅ **Notificaciones Toast** - Feedback visual instantáneo de acciones  
✅ **Dashboard Responsivo** - Diseño mobile-first con Tailwind CSS  
✅ **Documentación Swagger** - API auto-documentada e interactiva  
✅ **Seed Database** - Script de población automática con datos de ejemplo  

## 🛠️ Stack Tecnológico

### Backend
- **Node.js 18+** - Runtime de JavaScript server-side
- **Express.js 4.18** - Framework web minimalista y flexible
- **Sequelize 6.31** - ORM para modelado de datos
- **SQLite3 5.1** - Base de datos relacional embebida
- **express-validator 7.0** - Validación robusta de entrada
- **Winston 3.10** - Sistema de logging estructurado
- **Morgan 1.10** - Middleware de logs HTTP
- **dotenv 16.1** - Gestión de variables de entorno
- **swagger-jsdoc & swagger-ui-express** - Documentación API automática

### Frontend
- **HTML5** - Estructura semántica
- **Tailwind CSS 3.x** - Utilidades CSS responsive
- **Font Awesome 6.4** - Iconografía moderna
- **Vanilla JavaScript ES6+** - Lógica sin dependencias externas
- **Fetch API** - Comunicación con servidor

## 📋 Requisitos Previos

- Node.js v18.0.0 o superior
- npm v8.0.0 o superior
- Git (opcional, para clonar el repositorio)

## 🚀 Instalación y Ejecución

### 1. Clonar o descargar el repositorio
```bash
git clone <tu-repositorio>
cd backend_tarjeta
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crear archivo `.env` en la raíz del proyecto:
```env
PORT=3001
NODE_ENV=development
SQLITE_STORAGE=./futbol.db
```

### 4. Ejecutar seed de base de datos (opcional)
```bash
npm run seed
```
Este comando crea la base de datos con datos de ejemplo:
- 4 equipos (Manchester United, Bayern Munich, Real Madrid, PSG)
- 12 jugadores con sus asociaciones
- 4 entrenadores
- 4 partidos disputados

### 5. Iniciar servidor
```bash
npm start
```

El servidor estará disponible en: `http://localhost:3001`

## 📍 Acceso a la Aplicación

| Recurso | URL |
|---------|-----|
| **Dashboard Frontend** | `http://localhost:3001/` |
| **API Health Check** | `http://localhost:3001/api/health` |
| **Documentación Swagger** | `http://localhost:3001/api/docs` |

## 📂 Estructura del Proyecto

```
backend_tarjeta/
├── index.js                      # Punto de entrada de la aplicación
├── package.json                  # Dependencias y scripts
├── .env                          # Variables de entorno (no versionado)
├── futbol.db                     # Base de datos SQLite
├── src/
│   ├── app.js                    # Configuración de Express
│   ├── config/
│   │   └── index.js             # Variables de configuración
│   ├── db/
│   │   └── database.js          # Inicialización de Sequelize
│   ├── models/
│   │   ├── database.js          # Definiciones de modelos
│   │   ├── equipo.js
│   │   ├── jugador.js
│   │   ├── entrenador.js
│   │   └── partido.js
│   ├── routes/
│   │   ├── jugadores.routes.js
│   │   ├── equipos.routes.js
│   │   ├── entrenadores.routes.js
│   │   ├── partidos.routes.js
│   │   └── estadisticas.routes.js
│   ├── services/
│   │   ├── jugadores.service.js
│   │   ├── equipos.service.js
│   │   ├── entrenadores.service.js
│   │   ├── partidos.service.js
│   │   └── estadisticas.service.js
│   ├── validators/
│   │   ├── jugadores.validator.js
│   │   ├── equipos.validator.js
│   │   ├── entrenadores.validator.js
│   │   ├── partidos.validator.js
│   │   └── pagination.validator.js
│   ├── middlewares/
│   │   ├── error.middleware.js   # Manejo centralizado de errores
│   │   ├── logger.middleware.js  # Logging HTTP
│   │   └── validation.middleware.js
│   ├── errors/
│   │   ├── http-error.js        # Clase base de errores HTTP
│   │   └── resource-not-found-error.js
│   ├── utils/
│   │   └── logger.js            # Configuración de Winston
│   └── docs/
│       └── swagger.js            # Configuración de Swagger
├── scripts/
│   ├── seed.js                  # Poblar BD con datos de ejemplo
│   ├── tablas.sql               # Esquema de la BD
│   ├── datos.sql                # Datos iniciales
│   └── cine-extendido.sql       # Datos adicionales
└── public/                       # Archivos estáticos del frontend
    ├── index.html               # Página principal
    └── js/
        └── main.js              # Lógica JavaScript del cliente
```

## 🔌 Endpoints de la API

### Jugadores
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/jugadores` | Obtener jugadores con paginación y filtros |
| GET | `/api/jugadores/:id` | Obtener jugador por ID |
| POST | `/api/jugadores` | Crear nuevo jugador |
| PUT | `/api/jugadores/:id` | Actualizar jugador |
| DELETE | `/api/jugadores/:id` | Eliminar jugador |

**Query params soportados en GET:**
- `page` - Número de página (default: 1)
- `limit` - Registros por página (default: 10, máx: 100)
- `nombre` - Filtrar por nombre (búsqueda parcial)
- `nacionalidad` - Filtrar por nacionalidad
- `equipoId` - Filtrar por equipo
- `minEdad` - Edad mínima
- `maxEdad` - Edad máxima

### Equipos
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/equipos` | Obtener todos los equipos |
| GET | `/api/equipos/:id` | Obtener equipo por ID |
| POST | `/api/equipos` | Crear nuevo equipo |
| PUT | `/api/equipos/:id` | Actualizar equipo |
| DELETE | `/api/equipos/:id` | Eliminar equipo |

### Estadísticas
| Método | Endpoint | Descripción |
|--------|----------|-------------|
| GET | `/api/estadisticas/posiciones` | Obtener tabla de posiciones |

## 💻 Ejemplos de Uso

### Crear un jugador
```bash
curl -X POST http://localhost:3001/api/jugadores \
  -H "Content-Type: application/json" \
  -d '{
    "nombre": "Lionel Messi",
    "fechaNacimiento": "1987-06-24",
    "nacionalidad": "Argentina",
    "equipoId": 3
  }'
```

### Buscar jugadores por nacionalidad con paginación
```bash
curl "http://localhost:3001/api/jugadores?nacionalidad=Brasil&page=1&limit=10"
```

### Obtener tabla de posiciones
```bash
curl "http://localhost:3001/api/estadisticas/posiciones"
```

## 🎨 Características del Frontend

### Dashboard
- **Cards de estadísticas** - Vista rápida de totales
- **Últimos registros** - Últimos jugadores y equipos
- **Responsive** - Se adapta a cualquier tamaño de pantalla

### Sección Jugadores
- **Tabla con paginación** - Navegación entre páginas
- **Búsqueda avanzada** - Filtro por nombre y nacionalidad
- **Acciones rápidas** - Editar y eliminar inline
- **Modal de creación** - Formulario elegante con validaciones

### Sección Equipos
- **Grid responsivo** - Visualización de cards
- **Información detallada** - Nombre, estadio, año de fundación
- **Gestión rápida** - Editar y eliminar desde las cards

### Tabla de Posiciones
- **Ranking automático** - Ordenado por puntos
- **Estadísticas completas** - PJ, PG, PE, PP, GF, GC, DIF
- **Color-coded** - Diferencial y puntos destacados
- **Top 3 resaltado** - Equipos en competencia

## 🔐 Validaciones Implementadas

### Jugadores
- ✓ Nombre: requerido, min 2 caracteres
- ✓ Fecha de nacimiento: formato ISO 8601, fecha válida
- ✓ Nacionalidad: requerida, min 2 caracteres
- ✓ EquipoId: requerido, debe existir en BD

### Equipos
- ✓ Nombre: requerido, min 2 caracteres
- ✓ Estadio: requerido, min 2 caracteres
- ✓ Fundación: año entre 1800 y año actual

## 📊 Schema de Base de Datos

### Tabla Equipos
```sql
CREATE TABLE Equipos (
  Id INTEGER PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  Estadio VARCHAR(100) NOT NULL,
  Fundacion DATE NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME
);
```

### Tabla Jugadores
```sql
CREATE TABLE Jugadores (
  Id INTEGER PRIMARY KEY,
  Nombre VARCHAR(100) NOT NULL,
  FechaNacimiento DATE NOT NULL,
  Nacionalidad VARCHAR(50) NOT NULL,
  EquipoId INTEGER NOT NULL,
  createdAt DATETIME,
  updatedAt DATETIME,
  FOREIGN KEY(EquipoId) REFERENCES Equipos(Id)
);
```

## 🛡️ Manejo de Errores

La aplicación implementa un sistema centralizado de manejo de errores:

- **400 Bad Request** - Validación de entrada fallida
- **404 Not Found** - Recurso no encontrado
- **500 Internal Server Error** - Error en el servidor
- **Toast Notifications** - Feedback visual en el frontend

Todos los errores se loguean con Winston para debugging.

## 📝 Logging

Sistema de logging estructurado con Winston:
- **Console Transport** - Salida colorizada en terminal
- **Timestamps** - Marca de tiempo en cada log
- **Niveles** - info, warn, error, debug
- **Morgan HTTP** - Logs de requests/responses

Ejemplo de log:
```
2026-05-10 17:49:59 [info]: Servidor iniciado en el puerto 3001
```

## 🔧 Scripts Disponibles

```bash
npm start          # Inicia el servidor en modo desarrollo
npm run seed       # Puebla la BD con datos de ejemplo
```

## 📦 Dependencias Principales

Ejecutar `npm list` para ver todas las dependencias instaladas.

**Producción:**
- cors, dotenv, express, express-validator
- morgan, sequelize, sqlite3
- swagger-jsdoc, swagger-ui-express, winston

**Desarrollo:** (Recomendado)
- nodemon - Reiniciar servidor automáticamente
```bash
npm install --save-dev nodemon
```

Actualizar script en package.json:
```json
"dev": "nodemon index.js"
```

## 🚀 Despliegue (Producción)

### Preparar para producción:
1. Cambiar `NODE_ENV=production` en `.env`
2. Usar un servidor reverse proxy (nginx, apache)
3. Configurar HTTPS con certificados SSL
4. Usar PM2 para gestión de procesos:
```bash
npm install -g pm2
pm2 start index.js --name "futbol-api"
```

## 🐛 Debugging

### Activar logs detallados:
```env
DEBUG=*
```

### Ver logs en tiempo real:
```bash
npm start 2>&1 | grep -i error
```

## 📚 Recursos Útiles

- [Express.js Docs](https://expressjs.com/)
- [Sequelize Docs](https://sequelize.org/)
- [Tailwind CSS Docs](https://tailwindcss.com/)
- [Swagger/OpenAPI](https://swagger.io/)

## 🤝 Contribuciones

Las contribuciones son bienvenidas. Para cambios significativos:
1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver archivo `LICENSE` para más detalles.

## 👨‍💻 Autor

Desarrollado como proyecto full-stack profesional.

---

**Versión:** 1.0.0  
**Última actualización:** Mayo 2026  
**Estado:** ✅ Producción Ready

### 🌟 Si este proyecto te fue útil, considera darle una estrella en GitHub!
