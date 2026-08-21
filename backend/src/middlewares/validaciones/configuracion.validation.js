import { check, body } from 'express-validator';

// Claves permitidas en la tabla `configuracion` (ver database/init.sql).
// Cualquier otra clave enviada en el body es rechazada para evitar que se
// intenten crear/actualizar valores arbitrarios.
const CLAVES_PERMITIDAS = ['nombre_institucion', 'rango_ip_permitido', 'tiempo_max_sesion_min', 'tamano_max_archivo_mb'];

// Formato básico de una dirección/rango IPv4 en notación CIDR, por ejemplo
// "0.0.0.0/0" o "192.168.1.0/24".
const CIDR_REGEX = /^(\d{1,3}\.){3}\d{1,3}\/\d{1,2}$/;

export const updateConfigValidator = [
    body().custom((valorBody) => {
        const claves = Object.keys(valorBody || {});
        if (claves.length === 0) {
            throw new Error('Debe enviar al menos un valor de configuración a actualizar');
        }
        const claveInvalida = claves.find((clave) => !CLAVES_PERMITIDAS.includes(clave));
        if (claveInvalida) {
            throw new Error(`La clave de configuración "${claveInvalida}" no es válida`);
        }
        return true;
    }),
    check('nombre_institucion')
        .optional()
        .notEmpty().withMessage('El nombre de la institución no puede estar vacío')
        .isLength({ max: 150 }).withMessage('El nombre de la institución no puede superar los 150 caracteres'),
    check('rango_ip_permitido')
        .optional()
        .notEmpty().withMessage('El rango de IP no puede estar vacío')
        .matches(CIDR_REGEX).withMessage('El rango de IP debe tener formato CIDR válido, ej: 192.168.1.0/24'),
    check('tiempo_max_sesion_min')
        .optional()
        .isInt({ min: 5, max: 1440 }).withMessage('El tiempo máximo de sesión debe ser un número entre 5 y 1440 minutos'),
    check('tamano_max_archivo_mb')
        .optional()
        .isInt({ min: 1, max: 20 }).withMessage('El tamaño máximo de archivo debe ser un número entre 1 y 20 MB')
];
