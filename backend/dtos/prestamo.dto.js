// Fila del historial de préstamos (encabezado).
export const toPrestamoResumen = (row) => ({
    id: row.id,
    numero_prestamo: row.numero_prestamo,
    usuario: row.usuario,
    encargado: row.encargado,
    fecha: row.fecha,
    estado: row.estado
});

export const toPrestamosResumen = (rows) => rows.map(toPrestamoResumen);

// Fila de detalle de un préstamo (un equipo del préstamo).
export const toPrestamoDetalle = (row) => ({
    id: row.id,
    codigo: row.codigo,
    descripcion: row.descripcion,
    estado_devolucion: row.estado_devolucion,
    fecha_devolucion: row.fecha_devolucion
});

export const toPrestamoDetalles = (rows) => rows.map(toPrestamoDetalle);
