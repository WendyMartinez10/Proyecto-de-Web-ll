import { check } from 'express-validator';
import { idParamValidator } from './commonValidators.js';

export const departamentoValidator = [
    check('nombre')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 100 }).withMessage('El nombre no puede superar los 100 caracteres'),
    check('descripcion')
        .optional({ checkFalsy: true })
        .isLength({ max: 255 }).withMessage('La descripción no puede superar los 255 caracteres'),
    check('encargado')
        .optional({ checkFalsy: true })
        .isLength({ max: 100 }).withMessage('El nombre del encargado no puede superar los 100 caracteres')
];

export const departamentoIdValidator = [
    ...idParamValidator('id')
];
 