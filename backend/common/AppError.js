/**
 * Error de aplicación con código de estado HTTP asociado.
 *
 * Los servicios lanzan este error (en vez de un Error genérico) para
 * indicar situaciones de negocio esperadas (409, 404, 403, etc.). El
 * middleware de errores (middleware/error.middleware.js) y los
 * controladores lo reconocen mediante `error.statusCode` para responder
 * con el código correcto sin exponer detalles internos del servidor.
 *
 * Uso típico en un servicio:
 *   if (yaExiste) throw new AppError('El código ya existe', 409);
 */
export class AppError extends Error {
    constructor(message, statusCode = 400) {
        super(message);
        this.name = 'AppError';
        this.statusCode = statusCode;
        this.isOperational = true;
    }
}
