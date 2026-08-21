# Backend - Sistema de Marcas y Préstamo de Equipos

## Estructura

- `src/routes`: define los endpoints de la API.
- `src/controllers`: recibe solicitudes y coordina la lógica.
- `src/models`: contiene el acceso a datos y consultas SQL.
- `src/middlewares`: autenticación, validaciones, permisos, carga de archivos y errores.
- `src/config`: conexión a MySQL y configuración de sesiones.
- `src/utils`: utilidades para respuestas, correo y exportaciones.

Los nombres principales siguen la organización solicitada: `usuarios`, `marcas`, `equipos` y `prestamos`.
Los módulos auxiliares `departamentos`, `dispositivos` y `configuracion` se conservan porque son necesarios para el funcionamiento completo del sistema.

## Correcciones aplicadas (revisión)

Al revisar el proyecto se encontraron y corrigieron 2 errores que impedían que el servidor arrancara:

1. **`validateResult` no existía.** Todas las rutas lo usaban como middleware después de los validadores de `express-validator`, pero nunca se había definido ni importado. Se agregó su definición en `src/middlewares/commonValidators.js` (envuelve `validationResult` de express-validator y responde 400 con el detalle de campos inválidos) y se importó en los 7 archivos de rutas que lo usan.
2. **Rutas de import rotas** en 4 archivos de validaciones (`prestamos.validation.js`, `dispositivos.validation.js`, `equipos.validation.js`, `departamentos.validation.js`): importaban `../middlewares/commonValidators.js` estando ya dentro de `src/middlewares/validaciones/`, lo que apuntaba a una carpeta inexistente (`middlewares/middlewares/`). Se corrigió a `../commonValidators.js`.

Con estos cambios el servidor arranca correctamente (`npm run dev`) y todos los módulos cargan sin error.
