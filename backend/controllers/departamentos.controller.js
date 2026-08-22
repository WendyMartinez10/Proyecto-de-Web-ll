import * as departamentosService from '../services/departamentos.service.js';
import { successResponse } from '../common/response.js';

export const getAll = async (req, res, next) => {
    try {
        const departamentos = await departamentosService.listar();
        return successResponse(res, departamentos);
    } catch (error) {
        next(error);
    }
};

export const create = async (req, res, next) => {
    try {
        const id = await departamentosService.crear(req.body);
        return successResponse(res, { message: 'Departamento creado', id }, 201);
    } catch (error) {
        next(error);
    }
};

export const update = async (req, res, next) => {
    try {
        const { id } = req.params;
        await departamentosService.actualizar(id, req.body);
        return successResponse(res, { message: 'Departamento actualizado' });
    } catch (error) {
        next(error);
    }
};

export const remove = async (req, res, next) => {
    try {
        const { id } = req.params;
        await departamentosService.eliminar(id);
        return successResponse(res, { message: 'Departamento eliminado' });
    } catch (error) {
        next(error);
    }
};
