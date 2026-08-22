import * as prestamosService from '../services/prestamos.service.js';
import { successResponse } from '../common/response.js';

export const registrar = async (req, res, next) => {
    try {
        const { usuario_id, equipos } = req.body;
        const id = await prestamosService.registrar({
            usuarioId: usuario_id,
            encargadoId: req.session.usuario.id,
            equipos
        });
        return successResponse(res, { message: 'Préstamo registrado exitosamente', id }, 201);
    } catch (error) {
        next(error);
    }
};

export const devolverCompleto = async (req, res, next) => {
    try {
        const { id } = req.params;
        await prestamosService.devolverCompleto(id);
        return successResponse(res, { message: 'Préstamo devuelto por completo' });
    } catch (error) {
        next(error);
    }
};

export const devolverIndividual = async (req, res, next) => {
    try {
        const { id, detalleId } = req.params;
        await prestamosService.devolverIndividual(id, detalleId);
        return successResponse(res, { message: 'Equipo devuelto exitosamente' });
    } catch (error) {
        next(error);
    }
};

export const getHistorial = async (req, res, next) => {
    try {
        const prestamos = await prestamosService.obtenerHistorial(req.query);
        return successResponse(res, prestamos);
    } catch (error) {
        next(error);
    }
};

export const getDetalle = async (req, res, next) => {
    try {
        const { id } = req.params;
        const detalles = await prestamosService.obtenerDetalle(id);
        return successResponse(res, detalles);
    } catch (error) {
        next(error);
    }
};
