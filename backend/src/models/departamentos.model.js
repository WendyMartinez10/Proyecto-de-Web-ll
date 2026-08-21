import pool from '../config/db.js';

export const getAll = async () => {
    const [rows] = await pool.query('SELECT * FROM departamentos');
    return rows;
};

export const getById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM departamentos WHERE id = ?', [id]);
    return rows[0];
};

// Busca un departamento por nombre, excluyendo un ID cuando se edita.
export const getByNombre = async (nombre, excluirId = null) => {
    let query = 'SELECT id FROM departamentos WHERE LOWER(nombre) = LOWER(?)';
    const params = [nombre];
    if (excluirId !== null) {
        query += ' AND id <> ?';
        params.push(excluirId);
    }
    query += ' LIMIT 1';
    const [rows] = await pool.query(query, params);
    return rows[0];
};

export const create = async (data) => {
    const { nombre, descripcion, encargado } = data;
    const [result] = await pool.query(
        'INSERT INTO departamentos (nombre, descripcion, encargado) VALUES (?, ?, ?)',
        [nombre, descripcion, encargado]
    );
    return result.insertId;
};

export const update = async (id, data) => {
    const { nombre, descripcion, encargado } = data;
    await pool.query(
        'UPDATE departamentos SET nombre = ?, descripcion = ?, encargado = ? WHERE id = ?',
        [nombre, descripcion, encargado, id]
    );
};

export const remove = async (id) => {
    const [users] = await pool.query('SELECT id FROM usuarios WHERE departamento_id = ? LIMIT 1', [id]);
    if (users.length > 0) {
        throw new Error('No se puede eliminar porque hay usuarios asociados a este departamento');
    }
    const [result] = await pool.query('DELETE FROM departamentos WHERE id = ?', [id]);
    return result.affectedRows > 0;
};
