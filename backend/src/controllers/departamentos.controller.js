import * as depService from '../models/departamentos.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getAll = async (req, res, next) => {
    try {
        const departamentos = await depService.getAll();
        return successResponse(res, departamentos);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const existente = await depService.getByNombre(req.body.nombre);
        if (existente) {
            return errorResponse(res, 'Ya existe un departamento con ese nombre', 409);
        }

        const id = await depService.create(req.body);
        return successResponse(res, { message: 'Departamento creado', id }, 201);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        const exists = await depService.getById(id);
        if (!exists) return errorResponse(res, 'Departamento no encontrado', 404);

        const existente = await depService.getByNombre(req.body.nombre, id);
        if (existente) {
            return errorResponse(res, 'Ya existe otro departamento con ese nombre', 409);
        }

        await depService.update(id, req.body);
        return successResponse(res, { message: 'Departamento actualizado' });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        const eliminado = await depService.remove(id);
        if (!eliminado) {
            return errorResponse(res, 'Departamento no encontrado', 404);
        }
        return successResponse(res, { message: 'Departamento eliminado' });
    } catch (error) {
        if (error.message.includes('asociados')) {
            return errorResponse(res, error.message, 409);
        }
        next(error);
    }
};
