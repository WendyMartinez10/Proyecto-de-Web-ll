import * as equipoService from '../models/equipos.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAll = async (req, res, next) => {
    try {
        const equipos = await equipoService.getAll();
        return successResponse(res, equipos);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const { codigo, descripcion } = req.body;
        const exists = await equipoService.getByCodigo(codigo);
        if (exists) {
            return errorResponse(res, 'El código del equipo ya existe', 409);
        }

        const imagen = req.file ? req.file.filename : null;
        
        const id = await equipoService.create({ codigo, descripcion, imagen });
        return successResponse(res, { message: 'Equipo registrado', id }, 201);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { descripcion, estado } = req.body;
        
        const exists = await equipoService.getById(id);
        if (!exists) return errorResponse(res, 'Equipo no encontrado', 404);

        // El estado prestado solo cambia mediante préstamos o devoluciones.
        if (exists.estado === 'prestado' && estado !== 'prestado') {
            return errorResponse(
                res,
                'No se puede cambiar el estado de un equipo prestado manualmente. Registre la devolución del préstamo primero.',
                409
            );
        }
        if (estado === 'prestado' && exists.estado !== 'prestado') {
            return errorResponse(
                res,
                'El estado "prestado" solo puede asignarse al registrar un préstamo, no manualmente.',
                409
            );
        }

        // Un equipo prestado no puede modificarse mientras tenga una devolución pendiente.
        if (exists.estado === 'prestado') {
            const tienePrestamoActivo = await equipoService.tienePrestamoActivo(id);
            if (tienePrestamoActivo) {
                return errorResponse(
                    res,
                    'No se puede modificar un equipo con un préstamo activo. Registre la devolución primero.',
                    409
                );
            }
        }

        const imagen = req.file ? req.file.filename : exists.imagen;
        await equipoService.update(id, { descripcion, estado, imagen });
        return successResponse(res, { message: 'Equipo actualizado' });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const eliminado = await equipoService.remove(id);
        if (!eliminado) {
            return errorResponse(res, 'Equipo no encontrado', 404);
        }
        return successResponse(res, { message: 'Equipo eliminado' });
    } catch (error) {
        if (error.message.includes('historial')) {
            return errorResponse(res, error.message, 409);
        }
        next(error);
    }
};
