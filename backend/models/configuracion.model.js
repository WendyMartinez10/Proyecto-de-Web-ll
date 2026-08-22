import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM configuracion');
    const config = {};
    rows.forEach(row => {
        config[row.clave] = row.valor;
    });
    return config;
};

/**
 * Lee un único valor de configuración desde la base de datos.
 * Devuelve `valorPorDefecto` si la clave no existe todavía en la tabla.
 */
const getValor = async (clave, valorPorDefecto) => {
    const [rows] = await pool.query('SELECT valor FROM configuracion WHERE clave = ?', [clave]);
    return rows[0]?.valor ?? valorPorDefecto;
};

/**
 * Tiempo máximo de sesión configurado por el administrador, en minutos.
 * Se usa para calcular dinámicamente el maxAge de la cookie de sesión
 * en cada request (ver app.js), en lugar de depender de un valor fijo
 * leído una sola vez de SESSION_MAX_AGE_MS al arrancar el servidor.
 */
export const getTiempoMaxSesionMin = async () => {
    const valor = await getValor('tiempo_max_sesion_min', '60');
    const minutos = parseInt(valor, 10);
    return Number.isFinite(minutos) && minutos > 0 ? minutos : 60;
};

/**
 * Tamaño máximo de archivo permitido para subir imágenes de equipos, en MB.
 * Se usa para calcular dinámicamente el límite de multer en cada subida
 * (ver upload.middleware.js), en lugar de depender únicamente de la
 * variable de entorno MAX_FILE_SIZE_MB (fija desde el arranque).
 */
export const getTamanoMaxArchivoMb = async () => {
    const valor = await getValor('tamano_max_archivo_mb', process.env.MAX_FILE_SIZE_MB_FALLBACK || '5');
    const mb = parseInt(valor, 10);
    return Number.isFinite(mb) && mb > 0 ? mb : 5;
};

export const update = async (configData) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        for (const [clave, valor] of Object.entries(configData)) {
            await connection.query(
                'UPDATE configuracion SET valor = ? WHERE clave = ?',
                [String(valor), clave]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};
