import { check } from 'express-validator';
import { idParamValidator } from '../commonValidators.js';

export const registerDispositivoValidator = [
    check('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),
    check('descripcion')
        .optional({ checkFalsy: true })
        .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres')
];

export const cambiarEstadoValidator = [
    ...idParamValidator('id'),
    check('estado')
        .notEmpty().withMessage('El estado es requerido')
        .isIn(['activo', 'inactivo']).withMessage('Estado no válido')
];
