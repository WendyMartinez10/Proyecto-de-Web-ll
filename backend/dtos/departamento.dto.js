export const toDepartamentoPublico = (row) => {
    if (!row) return null;
    return {
        id: row.id,
        nombre: row.nombre,
        descripcion: row.descripcion,
        encargado: row.encargado
    };
};

export const toDepartamentosPublico = (rows) => rows.map(toDepartamentoPublico);
