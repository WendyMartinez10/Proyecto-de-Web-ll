# Backend - Sistema de Marcas y Préstamo de Equipos

Node.js + Express + MySQL. Backend reestructurado en capas (`routes` →
`controllers` → `services` → `models`), con `middleware`/`middlewares`,
`common`, `dtos` y `docs` como carpetas de apoyo.

## Instalación

```bash
npm install
cp .env.example .env   # completa SESSION_SECRET y credenciales de BD
```

Levantar la base de datos con Docker:

```bash
cd database
docker-compose up -d
```

Esto crea MySQL (con `init.sql`: tablas, relaciones y un usuario
administrador semilla `admin` / `Admin123`) y phpMyAdmin.

Arrancar el servidor:

```bash
npm run dev     # con nodemon, recarga automática
npm start       # producción
```

El servidor queda en `http://localhost:4000`. Prueba `GET /api/health`
para confirmar que la conexión a la base de datos está activa.

## Estructura del proyecto

```
backend/
├── .github/workflows/ci.yml   # CI: instala dependencias y revisa sintaxis
├── app.js                     # Configura Express (middlewares, rutas, manejo de errores)
├── index.js                   # Punto de entrada: carga .env e inicia el servidor
├── common/                    # Utilidades compartidas entre módulos
│   ├── response.js            #   successResponse / errorResponse (formato consistente)
│   ├── AppError.js            #   Error con código HTTP, usado por los services
│   ├── mailer.js               #   Envío de correos (recuperación de contraseña)
│   ├── exportPdf.js            #   Generación de reportes en PDF
│   └── exportXml.js            #   Generación de reportes en XML
├── config/
│   ├── db.js                   # Pool de conexiones MySQL (mysql2/promise)
│   └── session.js              # Configuración de express-session sobre MySQL
├── controllers/                # Reciben la petición HTTP y llaman a services/
├── services/                   # Lógica de negocio: reglas, validaciones cruzadas,
│                                # orquestación de varios modelos. No conocen req/res.
├── models/                     # Acceso a datos puro: solo SQL parametrizado
├── dtos/                       # Formatean las filas de BD al objeto que ve el cliente
│                                # (por ejemplo, nunca exponen password_hash)
├── middleware/                 # Middlewares "core": auth, roles, errores, subida de archivos
├── middlewares/                # Validaciones de entrada por módulo (express-validator)
├── routes/                     # Definición de endpoints, une middlewares + controllers
├── database/                   # docker-compose.yaml + init.sql
├── docs/API.md                 # Referencia completa de todos los endpoints
└── uploads/equipos/            # Imágenes de equipos subidas (no se versionan)
```

### Flujo de una petición

```
routes/*.routes.js
  → middlewares/*.validation.js (valida el body/params)
  → middleware/auth.middleware.js / role.middleware.js (sesión y rol)
  → controllers/*.controller.js (parsea req, llama al service, arma la respuesta)
  → services/*.service.js (reglas de negocio, lanza AppError si algo falla)
  → models/*.model.js (SQL parametrizado contra el pool de conexiones)
```

Los errores lanzados como `AppError(mensaje, codigoHttp)` en cualquier
service llegan al controlador vía `next(error)` y los responde
`middleware/error.middleware.js` con el código y formato correctos, sin
exponer detalles internos del servidor.

## Reestructuración realizada (antes vs. ahora)

El proyecto original tenía todo bajo `src/` (`src/app.js`,
`src/controllers`, `src/models`, `src/middlewares/validaciones`, etc.) y
los controladores llamaban directamente a los modelos, mezclando lógica
de negocio con el manejo de `req`/`res`.

Se reorganizó así:

- Se eliminó la carpeta `src/`; todo vive directamente en la raíz de `backend/`.
- Se separó `middleware/` (auth, roles, errores, subida de archivos) de
  `middlewares/` (validaciones de entrada por módulo, antes anidadas en
  `middlewares/validaciones/`, ahora un nivel más arriba).
- Se creó `services/`: toda la lógica de negocio que antes vivía en los
  controladores (verificar duplicados, reglas de estado de equipos,
  validaciones de préstamos, etc.) se movió aquí. Los controladores
  quedaron delgados: reciben la petición, llaman al service y formatean
  la respuesta.
- Se creó `dtos/`: cada módulo tiene una función que define explícitamente
  qué campos se exponen al cliente (protege, por ejemplo, contra una
  futura fuga accidental de `password_hash`).
- Se creó `common/` con las utilidades que antes estaban en `src/utils/`
  (`response.js`, `mailer.js`, `exportPdf.js`, `exportXml.js`), más una
  clase nueva `AppError` para propagar errores de negocio con su código
  HTTP de forma consistente.
- Se separó `app.js` (configuración de Express) de `index.js` (carga de
  variables de entorno y arranque del servidor), siguiendo la convención
  estándar de Node.js.
- Se agregó `docs/API.md` con la referencia de endpoints y
  `.github/workflows/ci.yml` con un chequeo básico de CI.

**Se verificó exhaustivamente que todo el comportamiento se mantiene
idéntico tras la reestructuración**: se instaló una base de datos MySQL
real, se cargó `init.sql`, se arrancó el servidor con `node index.js`, y
se probó de punta a punta con `curl` todo el flujo (registro, login,
casos de error 401/403/404/409, dispositivos, marcas de entrada/salida,
CRUD de departamentos y equipos con subida real de imagen, préstamos con
devolución individual y completa, configuración, y exportación de
reportes en JSON/XML/PDF). Todos los casos respondieron exactamente como
antes de la reestructuración.
