export const toEquipoPublico = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        codigo: row.codigo,
        descripcion: row.descripcion,
        imagen: row.imagen,
        estado: row.estado
    };
};

export const toEquiposPublico = (rows) => rows.map(toEquipoPublico);
