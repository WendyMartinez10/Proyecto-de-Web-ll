import pool from '../config/db.js';

export const findById = async (id) => {
    const [rows] = await pool.query('SELECT * FROM prestamos WHERE id = ?', [id]);
    return rows[0];
};

export const createPrestamo = async (usuario_id, encargado_id, equipos) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const numero_prestamo = `PR-${Date.now()}`;
        const [headerResult] = await connection.query(
            'INSERT INTO prestamos (numero_prestamo, usuario_id, encargado_id) VALUES (?, ?, ?)',
            [numero_prestamo, usuario_id, encargado_id]
        );
        const prestamo_id = headerResult.insertId;

        for (const equipo_id of equipos) {
            await connection.query(
                "INSERT INTO prestamo_detalle (prestamo_id, equipo_id, estado_devolucion) VALUES (?, ?, 'pendiente')",
                [prestamo_id, equipo_id]
            );
            await connection.query(
                "UPDATE equipos SET estado = 'prestado' WHERE id = ?",
                [equipo_id]
            );
        }

        await connection.commit();
        return prestamo_id;
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const devolverIndividual = async (prestamo_id_esperado, detalle_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [detalle] = await connection.query('SELECT prestamo_id, equipo_id, estado_devolucion FROM prestamo_detalle WHERE id = ? FOR UPDATE', [detalle_id]);
        if (!detalle.length) throw new Error('Detalle no encontrado');
        // Verifica que el detalle pertenezca al préstamo solicitado.
        if (String(detalle[0].prestamo_id) !== String(prestamo_id_esperado)) {
            throw new Error('El detalle indicado no pertenece al préstamo especificado (no encontrado)');
        }
        if (detalle[0].estado_devolucion === 'devuelto') throw new Error('Ya fue devuelto');

        const prestamo_id = detalle[0].prestamo_id;
        const equipo_id = detalle[0].equipo_id;

        await connection.query(
            "UPDATE prestamo_detalle SET estado_devolucion = 'devuelto', fecha_devolucion = NOW() WHERE id = ?",
            [detalle_id]
        );

        await connection.query(
            "UPDATE equipos SET estado = 'disponible' WHERE id = ?",
            [equipo_id]
        );

        const [pendientes] = await connection.query(
            "SELECT id FROM prestamo_detalle WHERE prestamo_id = ? AND estado_devolucion = 'pendiente'",
            [prestamo_id]
        );

        if (pendientes.length === 0) {
            await connection.query(
                "UPDATE prestamos SET estado = 'finalizado' WHERE id = ?",
                [prestamo_id]
            );
        }

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const devolverCompleto = async (prestamo_id) => {
    const connection = await pool.getConnection();
    try {
        await connection.beginTransaction();

        const [detalles] = await connection.query(
            "SELECT id, equipo_id FROM prestamo_detalle WHERE prestamo_id = ? AND estado_devolucion = 'pendiente' FOR UPDATE",
            [prestamo_id]
        );

        // Evita confirmar una devolución sin equipos pendientes.
        if (detalles.length === 0) {
            const error = new Error('SIN_PENDIENTES');
            error.sinPendientes = true;
            throw error;
        }

        for (const det of detalles) {
            await connection.query(
                "UPDATE prestamo_detalle SET estado_devolucion = 'devuelto', fecha_devolucion = NOW() WHERE id = ?",
                [det.id]
            );
            await connection.query(
                "UPDATE equipos SET estado = 'disponible' WHERE id = ?",
                [det.equipo_id]
            );
        }

        await connection.query(
            "UPDATE prestamos SET estado = 'finalizado' WHERE id = ?",
            [prestamo_id]
        );

        await connection.commit();
    } catch (error) {
        await connection.rollback();
        throw error;
    } finally {
        connection.release();
    }
};

export const getHistorial = async (filtros) => {
    let query = `
        SELECT DISTINCT p.id, p.numero_prestamo, u.nombre_completo as usuario, e.nombre_completo as encargado, 
               p.fecha, p.estado 
        FROM prestamos p
        JOIN usuarios u ON p.usuario_id = u.id
        JOIN usuarios e ON p.encargado_id = e.id
    `;
    const params = [];
    const condiciones = [];

    if (filtros.equipo) {
        query += ' JOIN prestamo_detalle pd ON pd.prestamo_id = p.id ';
        condiciones.push('pd.equipo_id = ?');
        params.push(filtros.equipo);
    }

    query += ' WHERE 1=1';

    if (filtros.usuario) {
        condiciones.push('p.usuario_id = ?');
        params.push(filtros.usuario);
    }
    if (filtros.fecha) {
        condiciones.push('DATE(p.fecha) = ?');
        params.push(filtros.fecha);
    }
    if (filtros.estado) {
        condiciones.push('p.estado = ?');
        params.push(filtros.estado);
    }

    if (condiciones.length > 0) {
        query += ' AND ' + condiciones.join(' AND ');
    }

    query += ' ORDER BY p.fecha DESC';

    const [rows] = await pool.query(query, params);
    return rows;
};

export const getDetalles = async (prestamo_id) => {
    const [rows] = await pool.query(`
        SELECT pd.id, e.codigo, e.descripcion, pd.estado_devolucion, pd.fecha_devolucion
        FROM prestamo_detalle pd
        JOIN equipos e ON pd.equipo_id = e.id
        WHERE pd.prestamo_id = ?
    `, [prestamo_id]);
    return rows;
};
