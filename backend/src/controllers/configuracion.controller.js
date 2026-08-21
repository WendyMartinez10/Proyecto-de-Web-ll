import * as configService from '../models/configuracion.model.js';
import { successResponse } from '../utils/response.js';

export const getConfig = async (req, res, next) => {
    try {
        const config = await configService.getAll();
        return successResponse(res, config);
    } catch (error) {
        next(error);
    }
};

export const updateConfig = async (req, res, next) => {
    try {
        await configService.update(req.body);
        return successResponse(res, { message: 'Configuración actualizada' });
    } catch (error) {
        next(error);
    }
};
