import { check } from 'express-validator';
import { idParamValidator } from '../commonValidators.js';

export const equipoValidator = [
    check('codigo')
        .notEmpty().withMessage('El código es requerido')
        .isLength({ max: 50 }).withMessage('El código no puede superar los 50 caracteres')
        .matches(/^[A-Za-z0-9\-_]+$/).withMessage('El código solo puede contener letras, números, guiones y guiones bajos'),
    check('descripcion')
        .notEmpty().withMessage('La descripción es requerida')
        .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres')
];

export const updateEquipoValidator = [
    ...idParamValidator('id'),
    check('descripcion')
        .notEmpty().withMessage('La descripción es requerida')
        .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres'),
    check('estado').isIn(['disponible', 'prestado', 'mantenimiento', 'inactivo']).withMessage('Estado inválido')
];

export const removeEquipoValidator = [
    ...idParamValidator('id')
];
