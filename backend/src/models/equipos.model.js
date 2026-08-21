import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM equipos');
    return rows;
};

export const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE id = ?', [id]);
    return rows[0];
};

export const getByCodigo = async (codigo) => {
    const [rows] = await pool.query('SELECT * FROM equipos WHERE codigo = ?', [codigo]);
    return rows[0];
};

// Comprueba si el equipo tiene una devolución pendiente.
export const tienePrestamoActivo = async (equipo_id) => {
    const [rows] = await pool.query(
        `SELECT pd.id
         FROM prestamo_detalle pd
         INNER JOIN prestamos p ON p.id = pd.prestamo_id
         WHERE pd.equipo_id = ?
           AND pd.estado_devolucion = 'pendiente'
           AND p.estado <> 'finalizado'
         LIMIT 1`,
        [equipo_id]
    );
    return rows.length > 0;
};

export const create = async (data) => {
    const { codigo, descripcion, imagen } = data;
    const [result] = await pool.query(
        'INSERT INTO equipos (codigo, descripcion, imagen) VALUES (?, ?, ?)',
        [codigo, descripcion, imagen]
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { descripcion, imagen, estado } = data;
    let query = 'UPDATE equipos SET descripcion = ?, estado = ?';
    const params = [descripcion, estado];

    if (imagen) {
        query += ', imagen = ?';
        params.push(imagen);
    }
    
    query += ' WHERE id = ?';
    params.push(id);

    await pool.query(query, params);
};

export const changeState = async (id, estado) => {
    await pool.query('UPDATE equipos SET estado = ? WHERE id = ?', [estado, id]);
};

export const remove = async (id) => {
    const [prestamos] = await pool.query('SELECT id FROM prestamo_detalle WHERE equipo_id = ? LIMIT 1', [id]);
    if (prestamos.length > 0) {
        throw new Error('No se puede eliminar porque el equipo tiene historial de préstamos (activos o finalizados)');
    }
    const [result] = await pool.query('DELETE FROM equipos WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
