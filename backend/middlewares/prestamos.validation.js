import { check } from 'express-validator';
import { idParamValidator } from './commonValidators.js';

export const registrarValidator = [
    check('usuario_id')
        .notEmpty().withMessage('El usuario es requerido')
        .isInt({ min: 1 }).withMessage('El usuario debe ser un identificador válido'),
    check('equipos')
        .isArray({ min: 1 }).withMessage('Debe incluir al menos un equipo')
        .custom((equipos) => equipos.every((eq) => Number.isInteger(eq) && eq > 0))
        .withMessage('Todos los equipos deben ser identificadores numéricos válidos')
];

export const historialValidator = [
    check('usuario').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('El usuario debe ser un identificador válido'),
    check('equipo').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('El equipo debe ser un identificador válido'),
    check('fecha').optional({ checkFalsy: true }).isDate().withMessage('La fecha no es válida'),
    check('estado').optional({ checkFalsy: true }).isIn(['activo', 'finalizado']).withMessage('Estado no válido')
];

export const prestamoIdValidator = [
    ...idParamValidator('id')
];

export const detalleIdValidator = [
    ...idParamValidator('id'),
    ...idParamValidator('detalleId')
];
