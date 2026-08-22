import * as configuracionService from '../services/configuracion.service.js';
import { successResponse } from '../common/response.js';

export const getConfig = async (req, res, next) => {
    try {
        const config = await configuracionService.obtener();
        return successResponse(res, config);
    } catch (error) {
        next(error);
    }
};

export const updateConfig = async (req, res, next) => {
    try {
        await configuracionService.actualizar(req.body);
        return successResponse(res, { message: 'Configuración actualizada' });
    } catch (error) {
        next(error);
    }
};
