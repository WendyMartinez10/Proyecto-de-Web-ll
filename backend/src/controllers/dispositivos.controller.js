import crypto from 'crypto';
import * as dispService from '../models/dispositivos.model.js';
import { successResponse, errorResponse } from '../utils/response.js';

export const getDispositivos = async (req, res, next) => {
    try {
        const userId = req.session.usuario.id;
        const dispositivos = await dispService.findByUsuarioId(userId);
        return successResponse(res, dispositivos);
    } catch (error) {
        next(error);
    }
};

export const registerDispositivo = async (req, res, next) => {
    try {
        const userId = req.session.usuario.id;
        const { nombre, descripcion } = req.body;

        if (!nombre) return errorResponse(res, 'El nombre es requerido');
        if (nombre.length > 100) {
            return errorResponse(res, 'El nombre no puede superar los 100 caracteres');
        }
        if (descripcion && descripcion.length > 255) {
            return errorResponse(res, 'La descripción no puede superar los 255 caracteres');
        }

        let identificador = req.cookies?.device_id;
        
        if (!identificador) {
            identificador = crypto.randomUUID();
            res.cookie('device_id', identificador, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true'
            });
        } else {
            const exists = await dispService.findByIdentificador(identificador);
            if (exists) {
                return errorResponse(res, 'Este dispositivo ya está registrado', 409);
            }
        }

        await dispService.create({ identificador, nombre, descripcion, usuario_id: userId });
        
        return successResponse(res, { message: 'Dispositivo registrado exitosamente', identificador }, 201);
    } catch (error) {
        next(error);
    }
};

export const cambiarEstado = async (req, res, next) => {
    try {
        const userId = req.session.usuario.id;
        const { id } = req.params;
        const { estado } = req.body;
        
        if (!['activo', 'inactivo'].includes(estado)) {
            return errorResponse(res, 'Estado no válido');
        }

        const result = await dispService.updateEstado(id, estado, userId);
        if (!result.affectedRows) {
            return errorResponse(res, 'Dispositivo no encontrado', 404);
        }

        return successResponse(res, { message: `Dispositivo marcado como ${estado}` });
    } catch (error) {
        next(error);
    }
};
