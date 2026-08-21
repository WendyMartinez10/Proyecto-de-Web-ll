/**
 * Maneja errores no controlados y evita exponer detalles internos.
 */
export const errorMiddleware = (err, req, res, next) => {
    console.error(err?.stack || err?.message || err);

    if (err?.type === 'entity.too.large') {
        return res.status(413).json({ success: false, error: 'El cuerpo de la petición es demasiado grande' });
    }

    if (err?.code === 'LIMIT_FILE_SIZE') {
        return res.status(413).json({ success: false, error: 'El archivo supera el tamaño máximo permitido' });
    }

    return res.status(err?.statusCode || 500).json({
        success: false,
        error: err?.statusCode ? (err.message || 'Error en la solicitud') : 'Error interno del servidor'
    });
};
