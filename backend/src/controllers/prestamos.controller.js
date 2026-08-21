import * as prestamoService from '../models/prestamos.model.js';
import * as equipoService from '../models/equipos.model.js';
import * as authService from '../models/usuarios.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const registrar = async (req, res, next) => {
    try {
        const encargado_id = req.session.usuario.id;
        const { usuario_id, equipos } = req.body;

        if (!equipos || !Array.isArray(equipos) || equipos.length === 0) {
            return errorResponse(res, 'Debe incluir al menos un equipo');
        }

        const usuarioExists = await authService.findUserById(usuario_id);
        if (!usuarioExists) {
            return errorResponse(res, 'El usuario no existe', 404);
        }

        const uniqueEquipos = new Set(equipos);
        if (uniqueEquipos.size !== equipos.length) {
            return errorResponse(res, 'Un mismo equipo no puede aparecer dos veces en el préstamo', 400);
        }

        for (const eq_id of equipos) {
            const eq = await equipoService.getById(eq_id);
            if (!eq) return errorResponse(res, `El equipo con ID ${eq_id} no existe`, 404);
            if (eq.estado !== 'disponible') return errorResponse(res, `El equipo ${eq.codigo} no está disponible`, 409);
        }

        const id = await prestamoService.createPrestamo(usuario_id, encargado_id, equipos);
        return successResponse(res, { message: 'Préstamo registrado exitosamente', id }, 201);
    } catch (error) {
        next(error);
    }
};

export const devolverCompleto = async (req, res, next) => {
    try {
        const { id } = req.params;

        const prestamo = await prestamoService.findById(id);
        if (!prestamo) {
            return errorResponse(res, 'Préstamo no encontrado', 404);
        }
        if (prestamo.estado === 'finalizado') {
            return errorResponse(res, 'El préstamo ya fue devuelto por completo anteriormente', 409);
        }

        await prestamoService.devolverCompleto(id);
        return successResponse(res, { message: 'Préstamo devuelto por completo' });
    } catch (error) {
        if (error.sinPendientes) {
            return errorResponse(res, 'El préstamo no tiene equipos pendientes de devolución', 409);
        }
        next(error);
    }
};

export const devolverIndividual = async (req, res, next) => {
    try {
        const { id, detalleId } = req.params;
        await prestamoService.devolverIndividual(id, detalleId);
        return successResponse(res, { message: 'Equipo devuelto exitosamente' });
    } catch (error) {
        if (error.message.includes('encontrado')) {
            return errorResponse(res, error.message, 404);
        }
        if (error.message.includes('devuelto')) {
            return errorResponse(res, error.message, 409);
        }
        next(error);
    }
};

export const getHistorial = async (req, res, next) => {
    try {
        const prestamos = await prestamoService.getHistorial(req.query);
        return successResponse(res, prestamos);
    } catch (error) {
        next(error);
    }
};

export const getDetalle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const prestamo = await prestamoService.findById(id);
        if (!prestamo) {
            return errorResponse(res, 'Préstamo no encontrado', 404);
        }

        const detalles = await prestamoService.getDetalles(id);
        return successResponse(res, detalles);
    } catch (error) {
        next(error);
    }
};
