export const toDispositivoPublico = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        identificador: row.identificador,
        nombre: row.nombre,
        descripcion: row.descripcion,
        estado: row.estado,
        fecha_registro: row.fecha_registro,
        usuario_id: row.usuario_id
    };
};

export const toDispositivosPublico = (rows) => rows.map(toDispositivoPublico);
