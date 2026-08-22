import pool from '../config/db.js';

export const findByUsuarioId = async (usuario_id) => {
    const [rows] = await pool.query('SELECT * FROM dispositivos WHERE usuario_id = ?', [usuario_id]);
    return rows;
};

export const findByIdentificador = async (identificador) => {
    const [rows] = await pool.query('SELECT * FROM dispositivos WHERE identificador = ?', [identificador]);
    return rows[0];
};

export const create = async (data) => {
    const { identificador, nombre, descripcion, usuario_id } = data;
    const [result] = await pool.query(
        'INSERT INTO dispositivos (identificador, nombre, descripcion, usuario_id) VALUES (?, ?, ?, ?)',
        [identificador, nombre, descripcion, usuario_id]
    );
    return result.insertId;
};

export const updateEstado = async (id, estado, usuario_id) => {
    const [result] = await pool.query(
        'UPDATE dispositivos SET estado = ? WHERE id = ? AND usuario_id = ?',
        [estado, id, usuario_id]
    );
    // Permite detectar si el dispositivo existe y pertenece al usuario.
    return result;
};
