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
    // Cada fila representa un "turno": una entrada y, si existe, su salida
    // correspondiente. Un mismo día puede tener varios turnos (ej. entrada
    // de la mañana + salida a almorzar + entrada de la tarde + salida final),
    // ya que la guía solo prohíbe dos entradas seguidas sin salida, no
    // limita a un único ciclo por día.
    let query = `
        WITH marcas_turno AS (
            SELECT
                m.id,
                m.usuario_id,
                m.fecha,
                m.hora,
                m.tipo,
                m.ip,
                m.dispositivo_id,
                SUM(CASE WHEN m.tipo = 'entrada' THEN 1 ELSE 0 END)
                    OVER (PARTITION BY m.usuario_id, m.fecha ORDER BY m.hora, m.id) AS turno
            FROM marcas m
        )
        SELECT
            u.id as usuario_id,
            u.nombre_completo as usuario,
            mt.fecha,
            mt.turno,
            MAX(CASE WHEN mt.tipo = 'entrada' THEN mt.hora END) as hora_entrada,
            MAX(CASE WHEN mt.tipo = 'salida' THEN mt.hora END) as hora_salida,
            MAX(CASE WHEN mt.tipo = 'entrada' THEN d.nombre END) as dispositivo_entrada,
            MAX(CASE WHEN mt.tipo = 'salida' THEN d.nombre END) as dispositivo_salida,
            MAX(CASE WHEN mt.tipo = 'entrada' THEN mt.ip END) as ip_entrada,
            MAX(CASE WHEN mt.tipo = 'salida' THEN mt.ip END) as ip_salida
        FROM marcas_turno mt
        JOIN usuarios u ON mt.usuario_id = u.id
        LEFT JOIN dispositivos d ON mt.dispositivo_id = d.id
        WHERE 1=1
    `;
    const params = [];

    if (filtros.usuario) {
        query += ' AND mt.usuario_id = ?';
        params.push(filtros.usuario);
    }
    if (filtros.anio) {
        query += ' AND YEAR(mt.fecha) = ?';
        params.push(filtros.anio);
    }
    if (filtros.mes) {
        query += ' AND MONTH(mt.fecha) = ?';
        params.push(filtros.mes);
    }
    if (filtros.dia) {
        query += ' AND DAY(mt.fecha) = ?';
        params.push(filtros.dia);
    }
    if (filtros.departamento) {
        query += ' AND u.departamento_id = ?';
        params.push(filtros.departamento);
    }

    query += ' GROUP BY u.id, u.nombre_completo, mt.fecha, mt.turno ORDER BY mt.fecha DESC, mt.turno ASC, u.nombre_completo ASC';

    const [rows] = await pool.query(query, params);
    return rows;
};

export const registrarMarcaTransaccional = async (data) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const {
            usuario_id,
            fecha,
            hora,
            ip,
            dispositivo_id
        } = data;

        // Bloquea temporalmente el registro del usuario para evitar
        // que dos solicitudes simultáneas calculen el mismo tipo de marca.
        await connection.query(
            `SELECT id
             FROM usuarios
             WHERE id = ?
             FOR UPDATE`,
            [usuario_id]
        );

        const [rows] = await connection.query(
            `SELECT tipo
             FROM marcas
             WHERE usuario_id = ?
               AND fecha = ?
             ORDER BY hora DESC, id DESC
             LIMIT 1
             FOR UPDATE`,
            [usuario_id, fecha]
        );

        let tipo = 'entrada';

        if (rows.length > 0 && rows[0].tipo === 'entrada') {
            tipo = 'salida';
        }

        const [result] = await connection.query(
            `INSERT INTO marcas
                (usuario_id, fecha, hora, tipo, ip, dispositivo_id)
             VALUES (?, ?, ?, ?, ?, ?)`,
            [
                usuario_id,
                fecha,
                hora,
                tipo,
                ip,
                dispositivo_id
            ]
        );

        await connection.commit();

        return {
            id: result.insertId,
            tipo
        };
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};