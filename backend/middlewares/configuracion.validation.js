import { check, body } from 'express-validator';

// Claves permitidas en la tabla configuracion.
const CLAVES_PERMITIDAS = [
    'nombre_institucion',
    'rango_ip_permitido',
    'tiempo_max_sesion_min',
    'tamano_max_archivo_mb'
];

/**
 * Valida una dirección IPv4.
 */
const esIPv4Valida = (ip) => {
    const partes = ip.split('.');

    if (partes.length !== 4) {
        return false;
    }

    return partes.every((parte) => {
        if (!/^\d{1,3}$/.test(parte)) {
            return false;
        }

        const numero = Number(parte);

        return numero >= 0 && numero <= 255;
    });
};

/**
 * Valida una dirección IPv4 en formato CIDR.
 *
 * Ejemplos válidos:
 * 0.0.0.0/0
 * 192.168.1.0/24
 * 10.0.0.0/8
 * 172.16.0.0/16
 */
const esCIDRValido = (valor) => {
    if (typeof valor !== 'string') {
        return false;
    }

    const partes = valor.split('/');

    if (partes.length !== 2) {
        return false;
    }

    const [ip, prefijo] = partes;

    if (!esIPv4Valida(ip)) {
        return false;
    }

    if (!/^\d{1,2}$/.test(prefijo)) {
        return false;
    }

    const numeroPrefijo = Number(prefijo);

    return numeroPrefijo >= 0 && numeroPrefijo <= 32;
};

export const updateConfigValidator = [
    body().custom((valorBody) => {
        const claves = Object.keys(valorBody || {});

        if (claves.length === 0) {
            throw new Error(
                'Debe enviar al menos un valor de configuración a actualizar'
            );
        }

        const claveInvalida = claves.find(
            (clave) =>
                !CLAVES_PERMITIDAS.includes(clave)
        );

        if (claveInvalida) {
            throw new Error(
                `La clave de configuración "${claveInvalida}" no es válida`
            );
        }

        return true;
    }),

    check('nombre_institucion')
        .optional()
        .notEmpty()
        .withMessage(
            'El nombre de la institución no puede estar vacío'
        )
        .isLength({ max: 150 })
        .withMessage(
            'El nombre de la institución no puede superar los 150 caracteres'
        ),

    check('rango_ip_permitido')
        .optional()
        .notEmpty()
        .withMessage(
            'El rango de IP no puede estar vacío'
        )
        .custom((valor) => {
            if (!esCIDRValido(valor)) {
                throw new Error(
                    'El rango de IP debe ser una IPv4 válida en formato CIDR, por ejemplo 192.168.1.0/24'
                );
            }

            return true;
        }),

    check('tiempo_max_sesion_min')
        .optional()
        .isInt({ min: 5, max: 1440 })
        .withMessage(
            'El tiempo máximo de sesión debe ser un número entre 5 y 1440 minutos'
        ),

    check('tamano_max_archivo_mb')
        .optional()
        .isInt({ min: 1, max: 20 })
        .withMessage(
            'El tamaño máximo de archivo debe ser un número entre 1 y 20 MB'
        )
];