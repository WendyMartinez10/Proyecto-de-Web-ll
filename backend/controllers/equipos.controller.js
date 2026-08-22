import * as equiposService from '../services/equipos.service.js';
import { successResponse } from '../common/response.js';

export const getAll = async (req, res, next) => {
    try {
        const equipos = await equiposService.listar();
        return successResponse(res, equipos);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const { codigo, descripcion } = req.body;
        const imagen = req.file ? req.file.filename : null;

        const id = await equiposService.crear({ codigo, descripcion, imagen });
        return successResponse(res, { message: 'Equipo registrado', id }, 201);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { descripcion, estado } = req.body;
        const imagenNueva = req.file ? req.file.filename : null;

        await equiposService.actualizar(id, { descripcion, estado, imagenNueva });
        return successResponse(res, { message: 'Equipo actualizado' });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await equiposService.eliminar(id);
        return successResponse(res, { message: 'Equipo eliminado' });
    } catch (error) {
        next(error);
    }
};
