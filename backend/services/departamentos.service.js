import * as departamentosModel from '../models/departamentos.model.js';
import { AppError } from '../common/AppError.js';
import { toDepartamentosPublico } from '../dtos/departamento.dto.js';

export const listar = async () => {
    const rows = await departamentosModel.getAll();
    return toDepartamentosPublico(rows);
};

export const crear = async (data) => {
    const existente = await departamentosModel.getByNombre(data.nombre);
    if (existente) throw new AppError('Ya existe un departamento con ese nombre', 409);
    return departamentosModel.create(data);
};

export const actualizar = async (id, data) => {
    const exists = await departamentosModel.getById(id);
    if (!exists) throw new AppError('Departamento no encontrado', 404);

    const existente = await departamentosModel.getByNombre(data.nombre, id);
    if (existente) throw new AppError('Ya existe otro departamento con ese nombre', 409);

    await departamentosModel.update(id, data);
};

export const eliminar = async (id) => {
    try {
        const eliminado = await departamentosModel.remove(id);
        if (!eliminado) throw new AppError('Departamento no encontrado', 404);
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.message.includes('asociados')) throw new AppError(error.message, 409);
        throw error;
    }
};
