# Referencia de la API — Sistema de Marcas y Préstamo de Equipos

Base URL: `http://localhost:4000/api`

Todas las respuestas usan el formato consistente:
- Éxito: `{ "success": true, "data": ... }`
- Error: `{ "success": false, "error": "..." }`

La sesión se identifica con la cookie `sesion_usuario` (HttpOnly). El
cliente debe enviar `credentials: 'include'` en cada `fetch()`.

## Autenticación (`/auth`)

| Método | Ruta | Auth | Body |
|---|---|---|---|
| POST | `/auth/registro` | No | `nombre_completo, fecha_nacimiento, correo, departamento_id, nombre_usuario, password, confirmar_password` |
| POST | `/auth/login` | No | `identificador, password` |
| POST | `/auth/logout` | Sí | — |
| GET | `/auth/perfil` | Sí | — |
| PUT | `/auth/perfil` | Sí | `nombre_completo, fecha_nacimiento, departamento_id` |
| PUT | `/auth/password` | Sí | `password_actual, nueva_password, confirmar_password` |
| POST | `/auth/recuperar` | No | `identificador` |
| POST | `/auth/restablecer` | No | `token, nueva_password, confirmar_password` |

## Departamentos (`/departamentos`)

| Método | Ruta | Auth | Body |
|---|---|---|---|
| GET | `/departamentos` | No | — |
| POST | `/departamentos` | Admin | `nombre, descripcion, encargado` |
| PUT | `/departamentos/:id` | Admin | `nombre, descripcion, encargado` |
| DELETE | `/departamentos/:id` | Admin | — |

## Dispositivos (`/dispositivos`)

| Método | Ruta | Auth | Body |
|---|---|---|---|
| GET | `/dispositivos` | Sí | — |
| POST | `/dispositivos` | Sí | `nombre, descripcion` |
| PUT | `/dispositivos/:id/estado` | Sí | `estado: "activo"|"inactivo"` |

## Marcas (`/marcas`)

| Método | Ruta | Auth | Query |
|---|---|---|---|
| POST | `/marcas` | Sí | — (usa cookie `device_id`) |
| GET | `/marcas` | Admin | `usuario, mes, anio, dia, departamento` |
| GET | `/marcas/exportar` | Admin | `formato=json|xml|pdf` + filtros anteriores |

## Equipos (`/equipos`)

| Método | Ruta | Auth | Body |
|---|---|---|---|
| GET | `/equipos` | Sí | — |
| POST | `/equipos` | Admin | form-data: `codigo, descripcion, imagen` |
| PUT | `/equipos/:id` | Admin | form-data: `descripcion, estado, imagen?` |
| DELETE | `/equipos/:id` | Admin | — |

## Préstamos (`/prestamos`) — todo Admin

| Método | Ruta | Body/Query |
|---|---|---|
| POST | `/prestamos` | `usuario_id, equipos: [id, ...]` |
| GET | `/prestamos` | `usuario, fecha, estado, equipo` |
| GET | `/prestamos/:id` | — |
| PUT | `/prestamos/:id/devolver` | — |
| PUT | `/prestamos/:id/detalle/:detalleId/devolver` | — |

## Configuración (`/configuracion`) — Admin

| Método | Ruta | Body |
|---|---|---|
| GET | `/configuracion` | — |
| PUT | `/configuracion` | `nombre_institucion, rango_ip_permitido, tiempo_max_sesion_min, tamano_max_archivo_mb` |

## Salud

| Método | Ruta |
|---|---|
| GET | `/ping` |
| GET | `/health` |
