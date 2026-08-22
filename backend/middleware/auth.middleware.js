import { errorResponse } from '../common/response.js';

export const isAuth = (req, res, next) => {
    if (req.session && req.session.usuario) {
        return next();
    }
    return errorResponse(res, 'No autorizado', 401);
};
