import * as dispositivosService from '../services/dispositivos.service.js';
import { successResponse } from '../common/response.js';

export const getDispositivos = async (req, res, next) => {
    try {
        const dispositivos = await dispositivosService.listarPorUsuario(req.session.usuario.id);
        return successResponse(res, dispositivos);
    } catch (error) {
        next(error);
    }
};

export const registerDispositivo = async (req, res, next) => {
    try {
        const { nombre, descripcion } = req.body;
        const identificadorExistente = req.cookies?.device_id;

        const { identificador, esNuevo } = await dispositivosService.registrar({
            usuarioId: req.session.usuario.id,
            nombre,
            descripcion,
            identificadorExistente
        });

        // Solo se envía la cookie cuando se generó un identificador nuevo;
        // si el navegador ya traía una, se reutiliza sin reescribirla.
        if (esNuevo) {
            res.cookie('device_id', identificador, {
                maxAge: 365 * 24 * 60 * 60 * 1000,
                httpOnly: true,
                sameSite: 'lax',
                secure: process.env.NODE_ENV === 'production' || process.env.COOKIE_SECURE === 'true'
            });
        }

        return successResponse(res, { message: 'Dispositivo registrado exitosamente', identificador }, 201);
    } catch (error) {
        next(error);
    }
};

export const cambiarEstado = async (req, res, next) => {
    try {
        const { id } = req.params;
        const { estado } = req.body;

        await dispositivosService.cambiarEstado({ id, estado, usuarioId: req.session.usuario.id });

        return successResponse(res, { message: `Dispositivo marcado como ${estado}` });
    } catch (error) {
        next(error);
    }
};
