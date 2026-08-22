/**
 * El reporte de marcas ya viene consolidado (una fila por usuario/fecha)
 * desde `models/marcas.model.js` (getReporte), con exactamente las
 * columnas que consumen el frontend y los exportadores (JSON/XML/PDF).
 * Este DTO se mantiene como punto único de control del contrato de
 * salida, por si en el futuro se necesita renombrar u ocultar columnas.
 */
export const toReporteMarca = (row) => ({
    usuario_id: row.usuario_id,
    usuario: row.usuario,
    fecha: row.fecha,
    hora_entrada: row.hora_entrada,
    hora_salida: row.hora_salida,
    dispositivo_entrada: row.dispositivo_entrada,
    dispositivo_salida: row.dispositivo_salida,
    ip_entrada: row.ip_entrada,
    ip_salida: row.ip_salida
});

export const toReporteMarcas = (rows) => rows.map(toReporteMarca);
