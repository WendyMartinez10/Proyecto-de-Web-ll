import * as equiposModel from '../models/equipos.model.js';
import { AppError } from '../common/AppError.js';
import { toEquiposPublico } from '../dtos/equipo.dto.js';

export const listar = async () => {
    const rows = await equiposModel.getAll();
    return toEquiposPublico(rows);
};

export const crear = async ({ codigo, descripcion, imagen }) => {
    const exists = await equiposModel.getByCodigo(codigo);
    if (exists) throw new AppError('El código del equipo ya existe', 409);
    return equiposModel.create({ codigo, descripcion, imagen });
};

export const actualizar = async (id, { descripcion, estado, imagenNueva }) => {
    const exists = await equiposModel.getById(id);
    if (!exists) throw new AppError('Equipo no encontrado', 404);

    // El estado "prestado" solo cambia mediante préstamos o devoluciones.
    if (exists.estado === 'prestado' && estado !== 'prestado') {
        throw new AppError(
            'No se puede cambiar el estado de un equipo prestado manualmente. Registre la devolución del préstamo primero.',
            409
        );
    }
    if (estado === 'prestado' && exists.estado !== 'prestado') {
        throw new AppError(
            'El estado "prestado" solo puede asignarse al registrar un préstamo, no manualmente.',
            409
        );
    }

    // Un equipo prestado no puede modificarse mientras tenga una devolución pendiente.
    if (exists.estado === 'prestado') {
        const tienePrestamoActivo = await equiposModel.tienePrestamoActivo(id);
        if (tienePrestamoActivo) {
            throw new AppError(
                'No se puede modificar un equipo con un préstamo activo. Registre la devolución primero.',
                409
            );
        }
    }

    const imagen = imagenNueva || exists.imagen;
    await equiposModel.update(id, { descripcion, estado, imagen });
};

export const eliminar = async (id) => {
    try {
        const eliminado = await equiposModel.remove(id);
        if (!eliminado) throw new AppError('Equipo no encontrado', 404);
    } catch (error) {
        if (error instanceof AppError) throw error;
        if (error.message.includes('historial')) throw new AppError(error.message, 409);
        throw error;
    }
};
