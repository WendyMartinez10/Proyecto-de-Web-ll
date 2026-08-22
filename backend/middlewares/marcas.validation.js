import { check } from 'express-validator';

export const reporteValidator = [
    check('usuario').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('El usuario debe ser un identificador válido'),
    check('departamento').optional({ checkFalsy: true }).isInt({ min: 1 }).withMessage('El departamento debe ser un identificador válido'),
    check('anio').optional({ checkFalsy: true }).isInt({ min: 2000, max: 2100 }).withMessage('El año no es válido'),
    check('mes').optional({ checkFalsy: true }).isInt({ min: 1, max: 12 }).withMessage('El mes debe estar entre 1 y 12'),
    check('dia').optional({ checkFalsy: true }).isInt({ min: 1, max: 31 }).withMessage('El día debe estar entre 1 y 31')
];

export const exportarValidator = [
    ...reporteValidator,
    check('formato')
        .notEmpty().withMessage('El formato es requerido')
        .isIn(['json', 'xml', 'pdf']).withMessage('Formato no soportado. Use json, xml o pdf')
];
