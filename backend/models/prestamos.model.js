import pool from '../config/db.js';

export const findById = async (id) => {
    const [rows] = await pool.query(
        'SELECT * FROM prestamos WHERE id = ?',
        [id]
    );

    return rows[0];
};

export const createPrestamo = async (usuario_id, encargado_id, equipos) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const numero_prestamo = `PR-${Date.now()}`;

        const [headerResult] = await connection.query(
            `INSERT INTO prestamos
                (numero_prestamo, usuario_id, encargado_id)
             VALUES (?, ?, ?)`,
            [numero_prestamo, usuario_id, encargado_id]
        );

        const prestamo_id = headerResult.insertId;

        for (const equipo_id of equipos) {
            // Bloquea el equipo durante la transacción.
            // Esto evita que dos préstamos simultáneos puedan tomar
            // el mismo equipo.
            const [equiposRows] = await connection.query(
                `SELECT id, codigo, estado
                 FROM equipos
                 WHERE id = ?
                 FOR UPDATE`,
                [equipo_id]
            );

            if (equiposRows.length === 0) {
                const error = new Error(`El equipo con ID ${equipo_id} no existe`);
                error.code = 'EQUIPO_NO_ENCONTRADO';
                throw error;
            }

            const equipo = equiposRows[0];

            if (equipo.estado !== 'disponible') {
                const error = new Error(
                    `El equipo ${equipo.codigo} no está disponible`
                );
                error.code = 'EQUIPO_NO_DISPONIBLE';
                throw error;
            }

            await connection.query(
                `INSERT INTO prestamo_detalle
                    (prestamo_id, equipo_id, estado_devolucion)
                 VALUES (?, ?, 'pendiente')`,
                [prestamo_id, equipo_id]
            );

            // El equipo se cambia a prestado dentro de la misma
            // transacción que creó el detalle.
            await connection.query(
                `UPDATE equipos
                 SET estado = 'prestado'
                 WHERE id = ?
                   AND estado = 'disponible'`,
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

export const devolverIndividual = async (
    prestamo_id_esperado,
    detalle_id
) => {
    const connection = await pool.getConnection();

    try {
        await connection.beginTransaction();

        const [detalle] = await connection.query(
            `SELECT prestamo_id, equipo_id, estado_devolucion
             FROM prestamo_detalle
             WHERE id = ?
             FOR UPDATE`,
            [detalle_id]
        );

        if (!detalle.length) {
            throw new Error('Detalle no encontrado');
        }

        if (
            String(detalle[0].prestamo_id) !==
            String(prestamo_id_esperado)
        ) {
            throw new Error(
                'El detalle indicado no pertenece al préstamo especificado'
            );
        }

        if (detalle[0].estado_devolucion === 'devuelto') {
            throw new Error('Ya fue devuelto');
        }

        const prestamo_id = detalle[0].prestamo_id;
        const equipo_id = detalle[0].equipo_id;

        await connection.query(
            `UPDATE prestamo_detalle
             SET estado_devolucion = 'devuelto',
                 fecha_devolucion = NOW()
             WHERE id = ?`,
            [detalle_id]
        );

        await connection.query(
            `UPDATE equipos
             SET estado = 'disponible'
             WHERE id = ?`,
            [equipo_id]
        );

        const [pendientes] = await connection.query(
            `SELECT id
             FROM prestamo_detalle
             WHERE prestamo_id = ?
               AND estado_devolucion = 'pendiente'`,
            [prestamo_id]
        );

        if (pendientes.length === 0) {
            await connection.query(
                `UPDATE prestamos
                 SET estado = 'finalizado'
                 WHERE id = ?`,
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
            `SELECT id, equipo_id
             FROM prestamo_detalle
             WHERE prestamo_id = ?
               AND estado_devolucion = 'pendiente'
             FOR UPDATE`,
            [prestamo_id]
        );

        if (detalles.length === 0) {
            const error = new Error('SIN_PENDIENTES');
            error.sinPendientes = true;
            throw error;
        }

        for (const detalle of detalles) {
            await connection.query(
                `UPDATE prestamo_detalle
                 SET estado_devolucion = 'devuelto',
                     fecha_devolucion = NOW()
                 WHERE id = ?`,
                [detalle.id]
            );

            await connection.query(
                `UPDATE equipos
                 SET estado = 'disponible'
                 WHERE id = ?`,
                [detalle.equipo_id]
            );
        }

        await connection.query(
            `UPDATE prestamos
             SET estado = 'finalizado'
             WHERE id = ?`,
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

export const getHistorial = async (filtros = {}) => {
    let query = `
        SELECT DISTINCT
            p.id,
            p.numero_prestamo,
            u.nombre_completo AS usuario,
            encargado.nombre_completo AS encargado,
            p.fecha,
            p.estado
        FROM prestamos p
        INNER JOIN usuarios u
            ON p.usuario_id = u.id
        INNER JOIN usuarios encargado
            ON p.encargado_id = encargado.id
    `;

    const params = [];
    const condiciones = [];

    if (filtros.equipo) {
        query += `
            INNER JOIN prestamo_detalle pd
                ON pd.prestamo_id = p.id
        `;

        condiciones.push('pd.equipo_id = ?');
        params.push(filtros.equipo);
    }

    condiciones.push('1 = 1');

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

    query += `
        WHERE ${condiciones.join(' AND ')}
        ORDER BY p.fecha DESC
    `;

    const [rows] = await pool.query(query, params);

    return rows;
};

export const getDetalles = async (prestamo_id) => {
    const [rows] = await pool.query(
        `
        SELECT
            pd.id,
            e.codigo,
            e.descripcion,
            pd.estado_devolucion,
            pd.fecha_devolucion
        FROM prestamo_detalle pd
        INNER JOIN equipos e
            ON pd.equipo_id = e.id
        WHERE pd.prestamo_id = ?
        ORDER BY pd.id ASC
        `,
        [prestamo_id]
    );

    return rows;
};