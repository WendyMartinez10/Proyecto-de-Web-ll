import { check } from 'express-validator';

// Límite razonable para no aceptar fechas absurdas (mayor a 120 años) y
// para no permitir fechas de nacimiento futuras.
const FECHA_NACIMIENTO_MIN = new Date();
FECHA_NACIMIENTO_MIN.setFullYear(FECHA_NACIMIENTO_MIN.getFullYear() - 120);

const validarFechaNacimiento = (value) => {
    const fecha = new Date(value);
    const hoy = new Date();
    if (fecha > hoy) {
        throw new Error('La fecha de nacimiento no puede ser una fecha futura');
    }
    if (fecha < FECHA_NACIMIENTO_MIN) {
        throw new Error('La fecha de nacimiento no es válida');
    }
    return true;
};

export const registerValidator = [
    check('nombre_completo')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 150 }).withMessage('El nombre no puede superar los 150 caracteres'),
    check('fecha_nacimiento')
        .isDate().withMessage('Fecha inválida')
        .bail()
        .custom(validarFechaNacimiento),
    check('correo')
        .isEmail().withMessage('Correo inválido')
        .isLength({ max: 150 }).withMessage('El correo no puede superar los 150 caracteres')
        .normalizeEmail(),
    check('departamento_id')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El departamento seleccionado no es válido'),
    check('nombre_usuario')
        .notEmpty().withMessage('El usuario es requerido')
        .isLength({ min: 4, max: 50 }).withMessage('El usuario debe tener entre 4 y 50 caracteres')
        .matches(/^[A-Za-z0-9_.-]+$/).withMessage('El usuario solo puede contener letras, números, puntos, guiones y guiones bajos'),
    check('password')
        .isLength({ min: 8, max: 72 }).withMessage('La contraseña debe tener entre 8 y 72 caracteres')
        .matches(/[A-Z]/).withMessage('La contraseña debe incluir al menos una letra mayúscula')
        .matches(/[0-9]/).withMessage('La contraseña debe incluir al menos un número'),
    check('confirmar_password').custom((value, { req }) => {
        if (value !== req.body.password) {
            throw new Error('La contraseña y su confirmación no coinciden');
        }
        return true;
    })
];

export const loginValidator = [
    check('identificador').notEmpty().withMessage('Usuario o correo requerido'),
    check('password').notEmpty().withMessage('Contraseña requerida')
];

export const profileValidator = [
    check('nombre_completo')
        .notEmpty().withMessage('El nombre es requerido')
        .isLength({ max: 150 }).withMessage('El nombre no puede superar los 150 caracteres'),
    check('fecha_nacimiento')
        .isDate().withMessage('Fecha inválida')
        .bail()
        .custom(validarFechaNacimiento),
    check('departamento_id')
        .optional({ checkFalsy: true })
        .isInt({ min: 1 }).withMessage('El departamento seleccionado no es válido')
];

export const passwordValidator = [
    check('password_actual').notEmpty().withMessage('Contraseña actual requerida'),
    check('nueva_password')
        .isLength({ min: 8, max: 72 }).withMessage('La nueva contraseña debe tener entre 8 y 72 caracteres')
        .matches(/[A-Z]/).withMessage('Debe incluir al menos una letra mayúscula')
        .matches(/[0-9]/).withMessage('Debe incluir al menos un número'),
    check('confirmar_password').custom((value, { req }) => {
        if (value !== req.body.nueva_password) {
            throw new Error('La confirmación no coincide con la nueva contraseña');
        }
        return true;
    })
];

export const recoverValidator = [
    check('identificador').notEmpty().withMessage('Requerido')
];

export const resetValidator = [
    check('token').notEmpty().withMessage('Token requerido'),
    check('nueva_password')
        .isLength({ min: 8, max: 72 }).withMessage('La nueva contraseña debe tener entre 8 y 72 caracteres')
        .matches(/[A-Z]/).withMessage('Debe incluir al menos una letra mayúscula')
        .matches(/[0-9]/).withMessage('Debe incluir al menos un número'),
    check('confirmar_password').custom((value, { req }) => {
        if (value !== req.body.nueva_password) {
            throw new Error('La confirmación no coincide con la nueva contraseña');
        }
        return true;
    })
];
