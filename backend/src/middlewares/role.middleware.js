import { errorResponse } from '../utils/response.js';

export const hasRole = (roles) => {
    return (req, res, next) => {
        if (!req.session || !req.session.usuario) {
            return errorResponse(res, 'No autorizado', 401);
        }
        if (roles.includes(req.session.usuario.rol)) {
            return next();
        }
        return errorResponse(res, 'Acceso denegado', 403);
    };
};
