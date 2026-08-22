import crypto from 'crypto';
import * as dispositivosModel from '../models/dispositivos.model.js';
import { AppError } from '../common/AppError.js';
import { toDispositivosPublico } from '../dtos/dispositivo.dto.js';

export const listarPorUsuario = async (usuarioId) => {
    const rows = await dispositivosModel.findByUsuarioId(usuarioId);
    return toDispositivosPublico(rows);
};

/**
 * Registra el dispositivo actual. Si el navegador ya tiene una cookie
 * `device_id` (identificadorExistente), reutiliza ese identificador; de lo
 * contrario genera uno nuevo con crypto.randomUUID(). El controlador es
 * quien decide si debe enviar la cookie `device_id` (esNuevo = true).
 */
export const registrar = async ({ usuarioId, nombre, descripcion, identificadorExistente }) => {
    let identificador = identificadorExistente;
    let esNuevo = false;

    if (!identificador) {
        identificador = crypto.randomUUID();
        esNuevo = true;
    } else {
        const exists = await dispositivosModel.findByIdentificador(identificador);
        if (exists) {
            throw new AppError('Este dispositivo ya está registrado', 409);
        }
    }

    await dispositivosModel.create({ identificador, nombre, descripcion, usuario_id: usuarioId });

    return { identificador, esNuevo };
};

export const cambiarEstado = async ({ id, estado, usuarioId }) => {
    const result = await dispositivosModel.updateEstado(id, estado, usuarioId);
    if (!result.affectedRows) {
        throw new AppError('Dispositivo no encontrado', 404);
    }
};
