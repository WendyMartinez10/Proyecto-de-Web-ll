import pool from '../config/db.js';

export const getLastMarcaByDate = async (usuario_id, fecha) => {
    const [rows] = await pool.query(
        'SELECT tipo FROM marcas WHERE usuario_id = ? AND fecha = ? ORDER BY hora DESC LIMIT 1',
        [usuario_id, fecha]
    );
    return rows[0];
};

export const createMarca = async (data) => {
    const { usuario_id, fecha, hora, tipo, ip, dispositivo_id } = data;
    const [result] = await pool.query(
        'INSERT INTO marcas (usuario_id, fecha, hora, tipo, ip, dispositivo_id) VALUES (?, ?, ?, ?, ?, ?)',
        [usuario_id, fecha, hora, tipo, ip, dispositivo_id]
    );
    return result.insertId;
};

export const getConfigIpRange = async () => {
    const [rows] = await pool.query("SELECT valor FROM configuracion WHERE clave = 'rango_ip_permitido'");
    return rows[0]?.valor || '0.0.0.0/0';
};

export const getReporte = async (filtros) => {
    // Se consolida una fila por usuario/fecha con la hora de entrada y de
    // salida, tal como lo pide la guía (usuario, fecha, hora de entrada,
    // hora de salida, dispositivo, IP).
    let query = `
        SELECT
            u.id as usuario_id,
            u.nombre_completo as usuario,
            m.fecha,
            MAX(CASE WHEN m.tipo = 'entrada' THEN m.hora END) as hora_entrada,
            MAX(CASE WHEN m.tipo = 'salida' THEN m.hora END) as hora_salida,
            MAX(CASE WHEN m.tipo = 'entrada' THEN d.nombre END) as dispositivo_entrada,
            MAX(CASE WHEN m.tipo = 'salida' THEN d.nombre END) as dispositivo_salida,
            MAX(CASE WHEN m.tipo = 'entrada' THEN m.ip END) as ip_entrada,
            MAX(CASE WHEN m.tipo = 'salida' THEN m.ip END) as ip_salida
        FROM marcas m
        JOIN usuarios u ON m.usuario_id = u.id
        LEFT JOIN dispositivos d ON m.dispositivo_id = d.id
        WHERE 1=1
    `;
    const params = [];

    if (filtros.usuario) {
        query += ' AND m.usuario_id = ?';
        params.push(filtros.usuario);
    }
    if (filtros.anio) {
        query += ' AND YEAR(m.fecha) = ?';
        params.push(filtros.anio);
    }
    if (filtros.mes) {
        query += ' AND MONTH(m.fecha) = ?';
        params.push(filtros.mes);
    }
    if (filtros.dia) {
        query += ' AND DAY(m.fecha) = ?';
        params.push(filtros.dia);
    }
    if (filtros.departamento) {
        query += ' AND u.departamento_id = ?';
        params.push(filtros.departamento);
    }

    query += ' GROUP BY u.id, u.nombre_completo, m.fecha ORDER BY m.fecha DESC, u.nombre_completo ASC';

    const [rows] = await pool.query(query, params);
    return rows;
};
