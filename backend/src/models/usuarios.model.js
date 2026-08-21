import pool from '../config/db.js';

export const findUserByEmailOrUsername = async (identifier) => {
    const [rows] = await pool.query(
        `SELECT u.*, r.nombre as rol 
         FROM usuarios u 
         JOIN roles r ON u.rol_id = r.id 
         WHERE u.correo = ? OR u.nombre_usuario = ?`,
        [identifier, identifier]
    );
    return rows[0];
};

export const findUserById = async (id) => {
    const [rows] = await pool.query(
        `SELECT u.id, u.nombre_completo, u.fecha_nacimiento, u.correo, u.nombre_usuario, u.departamento_id, r.nombre as rol 
         FROM usuarios u 
         JOIN roles r ON u.rol_id = r.id 
         WHERE u.id = ?`,
        [id]
    );
    return rows[0];
};

export const createUser = async (userData) => {
    const { nombre_completo, fecha_nacimiento, correo, departamento_id, nombre_usuario, password_hash } = userData;
    const [result] = await pool.query(
        `INSERT INTO usuarios (nombre_completo, fecha_nacimiento, correo, departamento_id, nombre_usuario, password_hash) 
         VALUES (?, ?, ?, ?, ?, ?)`,
        [nombre_completo, fecha_nacimiento, correo, departamento_id, nombre_usuario, password_hash]
    );
    return result.insertId;
};

export const updateUserProfile = async (id, data) => {
    const { nombre_completo, fecha_nacimiento, departamento_id } = data;
    await pool.query(
        `UPDATE usuarios 
         SET nombre_completo = ?, fecha_nacimiento = ?, departamento_id = ? 
         WHERE id = ?`,
        [nombre_completo, fecha_nacimiento, departamento_id, id]
    );
};

export const updatePassword = async (id, password_hash) => {
    await pool.query(
        `UPDATE usuarios SET password_hash = ? WHERE id = ?`,
        [password_hash, id]
    );
};

export const createRecoveryToken = async (usuario_id, token, expira_en) => {
    await pool.query(
        `INSERT INTO tokens_recuperacion (usuario_id, token, expira_en) VALUES (?, ?, ?)`,
        [usuario_id, token, expira_en]
    );
};

export const findToken = async (token) => {
    const [rows] = await pool.query(
        `SELECT * FROM tokens_recuperacion WHERE token = ? AND usado = FALSE AND expira_en > NOW()`,
        [token]
    );
    return rows[0];
};

export const markTokenAsUsed = async (id) => {
    await pool.query(`UPDATE tokens_recuperacion SET usado = TRUE WHERE id = ?`, [id]);
};
