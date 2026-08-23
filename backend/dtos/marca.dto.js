/**
 * El reporte de marcas ya viene consolidado (una fila por usuario/fecha)
 * desde `models/marcas.model.js` (getReporte), con exactamente las
 * columnas que consumen el frontend y los exportadores (JSON/XML/PDF).
 * Este DTO se mantiene como punto único de control del contrato de
 * salida, por si en el futuro se necesita renombrar u ocultar columnas.
 */
/**
 * El reporte de marcas viene consolidado por turno (una fila por cada
 * entrada + su salida correspondiente) desde `models/marcas.model.js`
 * (getReporte). Se incluye `turno` porque, al haber posiblemente varios
 * turnos el mismo día para un mismo usuario, el frontend lo necesita para
 * poder identificar cada fila de forma única (por ejemplo como key de
 * React) sin que un turno nuevo pise visualmente al anterior.
 */
export const toReporteMarca = (row) => ({
    usuario_id: row.usuario_id,
    usuario: row.usuario,
    fecha: row.fecha,
    turno: row.turno,
    hora_entrada: row.hora_entrada,
    hora_salida: row.hora_salida,
    dispositivo_entrada: row.dispositivo_entrada,
    dispositivo_salida: row.dispositivo_salida,
    ip_entrada: row.ip_entrada,
    ip_salida: row.ip_salida
});

export const toReporteMarcas = (rows) => rows.map(toReporteMarca);