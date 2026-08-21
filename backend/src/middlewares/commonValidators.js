import { param, validationResult } from 'express-validator';
import { errorResponse } from '../utils/response.js';

/**
 * Middleware que revisa el resultado de los validadores de express-validator
 * (check/body/param) declarados en cada ruta. Si hay errores, responde con
 * 400 y el detalle de los campos inválidos; si no hay errores, continúa.
 * Debe colocarse SIEMPRE después de los validadores y antes del controlador.
 */
export const validateResult = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return errorResponse(res, errors.array().map(e => ({ campo: e.path, mensaje: e.msg })), 400);
    }
    return next();
};

/**
 * Valida que un parámetro de ruta (por defecto :id) sea un entero positivo.
 * Reutilizable en todos los módulos que reciben identificadores numéricos
 * en la URL (equipos, departamentos, dispositivos, préstamos, etc.).
 */
export const idParamValidator = (paramName = 'id') => [
    param(paramName)
        .isInt({ min: 1 }).withMessage(`El parámetro ${paramName} debe ser un número entero válido`)
];
