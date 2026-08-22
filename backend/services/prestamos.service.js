import * as prestamosModel from '../models/prestamos.model.js';
import * as equiposModel from '../models/equipos.model.js';
import * as usuariosModel from '../models/usuarios.model.js';
import { AppError } from '../common/AppError.js';
import { toPrestamosResumen, toPrestamoDetalles } from '../dtos/prestamo.dto.js';

export const registrar = async ({ usuarioId, encargadoId, equipos }) => {
    if (!equipos || !Array.isArray(equipos) || equipos.length === 0) {
        throw new AppError('Debe incluir al menos un equipo', 400);
    }

    const usuarioExists = await usuariosModel.findUserById(usuarioId);
    if (!usuarioExists) {
        throw new AppError('El usuario no existe', 404);
    }

    const uniqueEquipos = new Set(equipos);
    if (uniqueEquipos.size !== equipos.length) {
        throw new AppError('Un mismo equipo no puede aparecer dos veces en el préstamo', 400);
    }

    for (const eqId of equipos) {
        const eq = await equiposModel.getById(eqId);
        if (!eq) throw new AppError(`El equipo con ID ${eqId} no existe`, 404);
        if (eq.estado !== 'disponible') throw new AppError(`El equipo ${eq.codigo} no está disponible`, 409);
    }

    return prestamosModel.createPrestamo(usuarioId, encargadoId, equipos);
};

export const devolverCompleto = async (id) => {
    const prestamo = await prestamosModel.findById(id);
    if (!prestamo) throw new AppError('Préstamo no encontrado', 404);
    if (prestamo.estado === 'finalizado') {
        throw new AppError('El préstamo ya fue devuelto por completo anteriormente', 409);
    }

    try {
        await prestamosModel.devolverCompleto(id);
    } catch (error) {
        if (error.sinPendientes) {
            throw new AppError('El préstamo no tiene equipos pendientes de devolución', 409);
        }
        throw error;
    }
};

export const devolverIndividual = async (id, detalleId) => {
    try {
        await prestamosModel.devolverIndividual(id, detalleId);
    } catch (error) {
        if (error.message.includes('encontrado')) throw new AppError(error.message, 404);
        if (error.message.includes('devuelto')) throw new AppError(error.message, 409);
        throw error;
    }
};

export const obtenerHistorial = async (filtros) => {
    const rows = await prestamosModel.getHistorial(filtros);
    return toPrestamosResumen(rows);
};

export const obtenerDetalle = async (id) => {
    const prestamo = await prestamosModel.findById(id);
    if (!prestamo) throw new AppError('Préstamo no encontrado', 404);

    const rows = await prestamosModel.getDetalles(id);
    return toPrestamoDetalles(rows);
};
